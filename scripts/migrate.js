#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'database');
const LOCK_KEY = 94721031;

function fail(message) {
  console.error(`\nERROR: ${message}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = { backup: false, dryRun: false, allowProduction: false };
  for (const arg of argv.slice(2)) {
    if (arg === '--backup') args.backup = true;
    else if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--allow-production') args.allowProduction = true;
    else fail(`Unknown argument: ${arg}`);
  }
  return args;
}

function requireUrl(args) {
  const key = args.backup ? 'BACKUP_DATABASE_URL' : 'DATABASE_URL';
  const url = process.env[key];
  if (!url) {
    fail(
      `${key} is not set. Copy .env.example to .env and fill in the connection string, ` +
        'or export it in this shell before running migrations.'
    );
  }
  return url;
}

function loadMigrations() {
  if (!fs.existsSync(MIGRATIONS_DIR)) fail(`Migrations directory not found: ${MIGRATIONS_DIR}`);

  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith('.sql'))
    .sort()
    .map((name) => {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, name), 'utf8').replace(/^\uFEFF/, '');
      return {
        name,
        sql,
        checksum: crypto.createHash('sha256').update(sql).digest('hex'),
        ownsTransaction: /(^|\n)\s*BEGIN\s*;/i.test(sql),
      };
    });
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.schema_migrations (
      name TEXT PRIMARY KEY,
      checksum TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function main() {
  const args = parseArgs(process.argv);
  const url = requireUrl(args);

  if (process.env.NODE_ENV === 'production' && !args.allowProduction) {
    fail('Refusing to migrate with NODE_ENV=production. Pass --allow-production only after an explicit approval.');
  }

  const migrations = loadMigrations();
  if (migrations.length === 0) fail('No .sql migrations found.');

  const client = new Client({
    connectionString: url,
    ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: true },
    application_name: 'creatorpilot-migrate',
    max: 1,
  });

  await client.connect();

  try {
    await ensureMigrationsTable(client);
    await client.query('SELECT pg_advisory_lock($1)', [LOCK_KEY]);

    const { rows } = await client.query('SELECT name, checksum FROM public.schema_migrations');
    const applied = new Map(rows.map((row) => [row.name, row.checksum]));

    let executed = 0;

    for (const migration of migrations) {
      const previousChecksum = applied.get(migration.name);

      if (previousChecksum) {
        if (previousChecksum !== migration.checksum) {
          console.warn(
            `WARN: ${migration.name} was modified after being applied (checksum drift). ` +
              'Create a new migration instead of editing it.'
          );
        }
        continue;
      }

      console.log(`${args.dryRun ? '[dry-run] would apply' : 'Applying'} ${migration.name} ...`);

      if (args.dryRun) continue;

      try {
        if (migration.ownsTransaction) {
          await client.query(migration.sql);
        } else {
          await client.query('BEGIN');
          try {
            await client.query(migration.sql);
            await client.query('COMMIT');
          } catch (error) {
            await client.query('ROLLBACK');
            throw error;
          }
        }

        await client.query(
          'INSERT INTO public.schema_migrations (name, checksum) VALUES ($1, $2)',
          [migration.name, migration.checksum]
        );
        executed += 1;
      } catch (error) {
        throw new Error(`${migration.name} failed: ${error.message}`);
      }
    }

    const tables = await client.query(`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    console.log(`\n${args.dryRun ? 'Dry run complete' : 'Migrations up to date'}. Applied this run: ${executed}`);
    console.log(`Schema: ${tables.rows.map((r) => r.tablename).join(', ')}`);
  } finally {
    try {
      await client.query('SELECT pg_advisory_unlock($1)', [LOCK_KEY]);
    } catch {}
    await client.end();
  }
}

main().catch((error) => fail(error.message));
