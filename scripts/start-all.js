'use strict';

// Runs the Express API and the Next.js server in one container so the whole
// app fits a single free Render web service. Exits as soon as either process
// dies, which lets the platform restart the service instead of serving a
// half-broken app.

const { spawn } = require('node:child_process');
const path = require('node:path');

const apiPort = process.env.API_PORT || '3002';
const webPort = process.env.PORT || '3000';
const nextBin = require.resolve('next/dist/bin/next');

const children = [];
let shuttingDown = false;

function stop(code) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGTERM');
  }

  const forceExit = setTimeout(() => {
    for (const child of children) {
      if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
    }
    process.exit(code);
  }, 15000);
  forceExit.unref();

  Promise.all(
    children.map(
      (child) =>
        new Promise((resolve) => {
          if (child.exitCode !== null || child.signalCode !== null) return resolve();
          child.once('exit', resolve);
        })
    )
  ).then(() => process.exit(code));
}

function start(name, args, env) {
  const child = spawn(process.execPath, args, {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, ...env },
    stdio: 'inherit',
  });

  child.on('error', (error) => {
    console.error(`[supervisor] failed to start ${name}:`, error.message);
    stop(1);
  });

  child.on('exit', (code, signal) => {
    if (shuttingDown) return;
    console.error(`[supervisor] ${name} exited (code=${code}, signal=${signal}); stopping the service`);
    stop(code === 0 ? 1 : code || 1);
  });

  children.push(child);
}

console.log(`[supervisor] API on 127.0.0.1:${apiPort}, web on 0.0.0.0:${webPort}`);

start('api', [path.join(__dirname, '..', 'server.js')], { PORT: apiPort });
start('web', [nextBin, 'start', '-H', '0.0.0.0', '-p', webPort], {});

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));
