import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardShell from './DashboardShell';
import ServiceNotice from '../components/ServiceNotice';
import type { SessionUser, WorkspaceSummary } from '../lib/api';

export const dynamic = 'force-dynamic';

const API_URL = (process.env.API_URL || 'http://localhost:3002').replace(/\/+$/, '');

type MeResponse = { user: SessionUser; workspaces: WorkspaceSummary[] };

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');

  let status = 0;
  let data: MeResponse | null = null;

  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: cookieHeader ? { cookie: cookieHeader } : {},
      cache: 'no-store',
    });
    status = response.status;
    if (response.ok) data = (await response.json()) as MeResponse;
  } catch {
    status = 0;
  }

  if (status === 401 || status === 403) redirect('/login');

  if (!data) {
    return <ServiceNotice />;
  }

  return <DashboardShell initialUser={data.user} workspaces={data.workspaces} />;
}
