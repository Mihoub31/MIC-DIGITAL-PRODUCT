'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { languages, useLang, useT } from '../i18n';
import { apiRequest, describeError } from '../lib/api';
import type { SessionUser, WorkspaceSummary } from '../lib/api';

type Tab = 'overview' | 'workspaces' | 'profile' | 'security' | 'language';

type WorkspaceMember = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  joined_at: string;
};

type WorkspaceDetail = {
  workspace: { id: string; name: string; slug: string; created_at?: string };
  role: string;
  members: WorkspaceMember[];
};

const LOCALES: Record<string, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  es: 'es-ES',
  ar: 'ar',
  zh: 'zh-CN',
};

const ROLE_KEYS = new Set(['owner', 'admin', 'manager', 'member', 'client']);

const RANKS: Record<string, number> = { owner: 5, admin: 4, manager: 3, member: 2, client: 1 };
const ASSIGNABLE_ROLES = ['admin', 'manager', 'member', 'client'];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function initials(fullName: string): string {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export default function DashboardShell({
  initialUser,
  workspaces,
}: {
  initialUser: SessionUser;
  workspaces: WorkspaceSummary[];
}) {
  const t = useT();
  const { lang, setLang } = useLang();
  const router = useRouter();

  const [user, setUser] = useState(initialUser);
  const [tab, setTab] = useState<Tab>('overview');
  const [signingOut, setSigningOut] = useState(false);

  const [fullName, setFullName] = useState(initialUser.fullName);
  const [profileError, setProfileError] = useState('');
  const [profileNotice, setProfileNotice] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordNotice, setPasswordNotice] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [languageError, setLanguageError] = useState('');
  const [languageNotice, setLanguageNotice] = useState('');
  const [savingLanguage, setSavingLanguage] = useState(false);

  const [workspaceList, setWorkspaceList] = useState<WorkspaceSummary[]>(workspaces);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(workspaces[0]?.id ?? '');
  const [workspaceDetail, setWorkspaceDetail] = useState<WorkspaceDetail | null>(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceError, setWorkspaceError] = useState('');
  const [workspaceNotice, setWorkspaceNotice] = useState('');
  const [workspaceVersion, setWorkspaceVersion] = useState(0);

  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [creatingWorkspace, setCreatingWorkspace] = useState(false);
  const [renameName, setRenameName] = useState('');
  const [savingWorkspace, setSavingWorkspace] = useState(false);
  const [deleteArmed, setDeleteArmed] = useState(false);
  const [deletingWorkspace, setDeletingWorkspace] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviting, setInviting] = useState(false);
  const [memberBusyId, setMemberBusyId] = useState('');

  const languageSynced = useRef(false);
  const tRef = useRef(t);

  useEffect(() => {
    tRef.current = t;
  });

  useEffect(() => {
    if (languageSynced.current) return;
    languageSynced.current = true;

    // The device choice is the most recent explicit action, so it wins over a
    // stale account value; the account is updated to match instead of reverting.
    let stored: string | null = null;
    try {
      stored = localStorage.getItem('lang');
    } catch {}

    const deviceLanguage = languages.some((item) => item.code === stored) ? stored : null;

    if (!deviceLanguage) {
      if (user.language) setLang(user.language);
      return;
    }

    setLang(deviceLanguage);
    if (deviceLanguage !== user.language) {
      apiRequest('/api/users/me', { method: 'PATCH', body: { language: deviceLanguage } }).catch(() => {});
    }
  }, [user.language, setLang]);

  useEffect(() => {
    if (tab !== 'workspaces' || !selectedWorkspaceId) return;

    let cancelled = false;
    setWorkspaceLoading(true);
    setWorkspaceError('');

    apiRequest<WorkspaceDetail>(`/api/workspaces/${selectedWorkspaceId}`)
      .then((data) => {
        if (cancelled) return;
        setWorkspaceDetail(data);
        setRenameName((previous) => (previous && data.workspace.name !== previous ? previous : data.workspace.name));
      })
      .catch((caught) => {
        if (cancelled) return;
        setWorkspaceError(describeError(caught, tRef.current));
      })
      .finally(() => {
        if (!cancelled) setWorkspaceLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab, selectedWorkspaceId, workspaceVersion]);

  const locale = LOCALES[lang] || 'fr-FR';

  function formatDate(value: string | null): string {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
  }

  function roleLabel(role: string): string {
    return ROLE_KEYS.has(role) ? t(`role_${role}`) : role;
  }

  function statusLabel(status: string): string {
    if (status === 'pending') return t('dash_status_pending');
    if (status === 'active') return t('dash_status_active');
    if (status === 'suspended') return t('dash_status_suspended');
    return status;
  }

  const activeWorkspace = workspaceList.find((item) => item.id === selectedWorkspaceId) || null;
  const myWorkspaceRole = workspaceDetail?.role || activeWorkspace?.role || '';
  const myRank = RANKS[myWorkspaceRole] || 0;
  const assignableRoles = ASSIGNABLE_ROLES.filter((role) => (RANKS[role] || 0) < myRank);
  const inviteRoleValue = assignableRoles.includes(inviteRole) ? inviteRole : assignableRoles[0] || 'member';
  const canInvite = myRank >= 3 && assignableRoles.length > 0;
  const canUpdateWorkspace = myRank >= 3;
  const canDeleteWorkspace = myRank >= 5;
  const canManageMembers = myRank >= 4;

  function refreshWorkspace() {
    setWorkspaceVersion((value) => value + 1);
  }

  function clearWorkspaceFeedback() {
    setWorkspaceError('');
    setWorkspaceNotice('');
  }

  function selectWorkspace(id: string) {
    setSelectedWorkspaceId(id);
    setWorkspaceDetail(null);
    setRenameName('');
    setDeleteArmed(false);
    setInviteEmail('');
    setMemberBusyId('');
    clearWorkspaceFeedback();
  }

  function openWorkspaces(id: string) {
    selectWorkspace(id);
    setTab('workspaces');
  }

  async function signOut() {
    setSigningOut(true);
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch {
      // A dead session must still land the visitor on a signed-out page.
    }
    router.push('/');
    router.refresh();
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileError('');
    setProfileNotice('');

    if (!fullName.trim()) {
      setProfileError(t('err_required'));
      return;
    }

    setSavingProfile(true);
    try {
      const data = await apiRequest<{ user: SessionUser }>('/api/users/me', {
        method: 'PATCH',
        body: { fullName: fullName.trim(), language: lang },
      });
      setUser(data.user);
      setFullName(data.user.fullName);
      setProfileNotice('dash_saved');
    } catch (caught) {
      setProfileError(describeError(caught, t));
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError('');
    setPasswordNotice('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t('err_required'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t('err_password_mismatch'));
      return;
    }
    if (newPassword.length < 10 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setPasswordError(t('auth_password_hint'));
      return;
    }

    setSavingPassword(true);
    try {
      await apiRequest('/api/users/me/password', {
        body: { currentPassword, newPassword },
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordNotice('dash_password_updated');
    } catch (caught) {
      setPasswordError(describeError(caught, t));
    } finally {
      setSavingPassword(false);
    }
  }

  async function chooseLanguage(code: string) {
    setLanguageError('');
    setLanguageNotice('');
    setSavingLanguage(true);
    try {
      await apiRequest('/api/users/me', { method: 'PATCH', body: { language: code } });
      setLang(code);
      setUser((previous) => ({ ...previous, language: code }));
      setLanguageNotice('dash_saved');
    } catch (caught) {
      setLanguageError(describeError(caught, t));
    } finally {
      setSavingLanguage(false);
    }
  }

  async function createWorkspace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearWorkspaceFeedback();

    const name = newWorkspaceName.trim();
    if (!name) {
      setWorkspaceError(t('err_required'));
      return;
    }

    setCreatingWorkspace(true);
    try {
      const data = await apiRequest<{ workspace: WorkspaceSummary }>('/api/workspaces', { body: { name } });
      selectWorkspace(data.workspace.id);
      setWorkspaceList((previous) => [...previous, data.workspace]);
      setNewWorkspaceName('');
      setWorkspaceNotice('ws_created');
    } catch (caught) {
      setWorkspaceError(describeError(caught, t));
    } finally {
      setCreatingWorkspace(false);
    }
  }

  async function renameWorkspace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedWorkspaceId || !workspaceDetail) return;
    clearWorkspaceFeedback();

    const name = renameName.trim();
    if (!name) {
      setWorkspaceError(t('err_required'));
      return;
    }
    if (name === workspaceDetail.workspace.name) return;

    setSavingWorkspace(true);
    try {
      const data = await apiRequest<{ workspace: { id: string; name: string } }>(
        `/api/workspaces/${selectedWorkspaceId}`,
        { method: 'PATCH', body: { name } }
      );
      setWorkspaceList((previous) =>
        previous.map((item) => (item.id === data.workspace.id ? { ...item, name: data.workspace.name } : item))
      );
      setWorkspaceDetail((previous) =>
        previous && previous.workspace.id === data.workspace.id
          ? { ...previous, workspace: { ...previous.workspace, name: data.workspace.name } }
          : previous
      );
      setRenameName(data.workspace.name);
      setWorkspaceNotice('ws_renamed');
    } catch (caught) {
      setWorkspaceError(describeError(caught, t));
    } finally {
      setSavingWorkspace(false);
    }
  }

  async function deleteWorkspace() {
    if (!selectedWorkspaceId) return;
    clearWorkspaceFeedback();
    setDeletingWorkspace(true);

    try {
      await apiRequest(`/api/workspaces/${selectedWorkspaceId}`, { method: 'DELETE' });
      const remaining = workspaceList.filter((item) => item.id !== selectedWorkspaceId);
      setWorkspaceList(remaining);
      setWorkspaceDetail(null);
      setDeleteArmed(false);
      setSelectedWorkspaceId(remaining[0]?.id ?? '');
      setRenameName('');
      setWorkspaceNotice('ws_deleted');
      setWorkspaceVersion((value) => value + 1);
    } catch (caught) {
      setWorkspaceError(describeError(caught, t));
    } finally {
      setDeletingWorkspace(false);
    }
  }

  async function inviteMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedWorkspaceId) return;
    clearWorkspaceFeedback();

    const email = inviteEmail.trim();
    if (!EMAIL_PATTERN.test(email)) {
      setWorkspaceError(t('err_invalid_email'));
      return;
    }

    setInviting(true);
    try {
      await apiRequest(`/api/workspaces/${selectedWorkspaceId}/members`, {
        body: { email, role: inviteRoleValue },
      });
      setInviteEmail('');
      setWorkspaceNotice('ws_invited');
      refreshWorkspace();
    } catch (caught) {
      setWorkspaceError(describeError(caught, t));
    } finally {
      setInviting(false);
    }
  }

  async function changeMemberRole(member: WorkspaceMember, role: string) {
    if (!selectedWorkspaceId || role === member.role) return;
    clearWorkspaceFeedback();
    setMemberBusyId(member.id);

    try {
      await apiRequest(`/api/workspaces/${selectedWorkspaceId}/members/${member.id}`, {
        method: 'PATCH',
        body: { role },
      });
      setWorkspaceDetail((previous) =>
        previous
          ? { ...previous, members: previous.members.map((item) => (item.id === member.id ? { ...item, role } : item)) }
          : previous
      );
      setWorkspaceNotice('ws_role_updated');
      refreshWorkspace();
    } catch (caught) {
      setWorkspaceError(describeError(caught, t));
    } finally {
      setMemberBusyId('');
    }
  }

  async function removeMember(member: WorkspaceMember) {
    if (!selectedWorkspaceId) return;
    clearWorkspaceFeedback();
    setMemberBusyId(member.id);

    try {
      await apiRequest(`/api/workspaces/${selectedWorkspaceId}/members/${member.id}`, { method: 'DELETE' });
      setWorkspaceDetail((previous) =>
        previous ? { ...previous, members: previous.members.filter((item) => item.id !== member.id) } : previous
      );
      setWorkspaceNotice('ws_removed');
      refreshWorkspace();
    } catch (caught) {
      setWorkspaceError(describeError(caught, t));
    } finally {
      setMemberBusyId('');
    }
  }

  const tabs: Array<{ id: Tab; key: string }> = [
    { id: 'overview', key: 'dash_nav_overview' },
    { id: 'workspaces', key: 'dash_nav_workspaces' },
    { id: 'profile', key: 'dash_nav_profile' },
    { id: 'security', key: 'dash_nav_security' },
    { id: 'language', key: 'dash_nav_language' },
  ];

  return (
    <main className="page-shell dash-page">
      <header className="site-header">
        <div className="container nav">
          <Link href="/" className="brand" aria-label="CreatorPilot home">
            <span className="brand-mark">C</span>
            <span>CreatorPilot</span>
          </Link>

          <div className="dash-account">
            <span className="dash-avatar" aria-hidden="true">{initials(user.fullName) || 'C'}</span>
            <span className="dash-account-meta">
              <strong>{user.fullName}</strong>
              <small dir="ltr">{user.email}</small>
            </span>
            <button className="btn btn-secondary dash-signout" type="button" onClick={signOut} disabled={signingOut}>
              {t('dash_signout')}
            </button>
          </div>
        </div>
      </header>

      <section className="section dash-section">
        <div className="container dash-layout">
          <nav className="dash-sidebar" aria-label={t('dash_nav_label')}>
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`dash-tab${tab === item.id ? ' is-active' : ''}`}
                aria-current={tab === item.id ? 'page' : undefined}
                onClick={() => setTab(item.id)}
              >
                {t(item.key)}
              </button>
            ))}
          </nav>

          <div className="dash-panel">
            {tab === 'overview' && (
              <section aria-labelledby="dash-overview-title">
                <h1 id="dash-overview-title" className="dash-title">
                  {t('dash_welcome')} {user.fullName}
                </h1>
                <p className="lead">{t('dash_language_hint')}</p>

                <dl className="dash-facts">
                  <div>
                    <dt>{t('dash_account')}</dt>
                    <dd dir="ltr">{user.email}</dd>
                  </div>
                  <div>
                    <dt>{t('dash_status')}</dt>
                    <dd>
                      <span className={`status-pill status-${user.status}`}>{statusLabel(user.status)}</span>
                    </dd>
                  </div>
                  <div>
                    <dt>{t('dash_member_since')}</dt>
                    <dd>{formatDate(user.createdAt)}</dd>
                  </div>
                  <div>
                    <dt>{t('dash_last_login')}</dt>
                    <dd>{formatDate(user.lastLoginAt)}</dd>
                  </div>
                </dl>

                <h2 className="dash-subtitle">{t('dash_workspaces')}</h2>
                {workspaceList.length === 0 ? (
                  <p className="dash-empty">{t('dash_no_workspace')}</p>
                ) : (
                  <ul className="dash-workspaces">
                    {workspaceList.map((workspace) => (
                      <li key={workspace.id} className="dash-workspace">
                        <span className="dash-workspace-name">{workspace.name}</span>
                        <span className="dash-workspace-actions">
                          <span className="role-pill">{roleLabel(workspace.role)}</span>
                          <button
                            type="button"
                            className="dash-workspace-manage"
                            onClick={() => openWorkspaces(workspace.id)}
                          >
                            {t('ws_manage')}
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {tab === 'workspaces' && (
              <section aria-labelledby="dash-workspaces-title">
                <h2 id="dash-workspaces-title" className="dash-subtitle">{t('ws_title')}</h2>
                <p className="lead">{t('ws_lead')}</p>

                {workspaceError && (
                  <p className="form-error" role="alert" aria-live="polite">{workspaceError}</p>
                )}
                {workspaceNotice && (
                  <p className="form-success" role="status" aria-live="polite">{t(workspaceNotice)}</p>
                )}

                <div className="ws-layout">
                  <aside className="ws-sidebar">
                    <h3 className="ws-heading">{t('ws_your')}</h3>
                    {workspaceList.length === 0 ? (
                      <p className="dash-empty">{t('dash_no_workspace')}</p>
                    ) : (
                      <ul className="ws-list">
                        {workspaceList.map((workspace) => (
                          <li key={workspace.id}>
                            <button
                              type="button"
                              className={`ws-list-item${workspace.id === selectedWorkspaceId ? ' is-active' : ''}`}
                              aria-pressed={workspace.id === selectedWorkspaceId}
                              onClick={() => selectWorkspace(workspace.id)}
                            >
                              <span className="ws-list-name">{workspace.name}</span>
                              <span className="role-pill">{roleLabel(workspace.role)}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    <form className="ws-create" onSubmit={createWorkspace} noValidate>
                      <label className="ws-label" htmlFor="ws-new">{t('ws_create_label')}</label>
                      <input
                        id="ws-new"
                        name="name"
                        type="text"
                        value={newWorkspaceName}
                        maxLength={80}
                        placeholder={t('ws_name_placeholder')}
                        onChange={(event) => setNewWorkspaceName(event.target.value)}
                      />
                      <button className="btn btn-primary" type="submit" disabled={creatingWorkspace}>
                        {creatingWorkspace ? t('api_loading') : t('ws_create_btn')}
                      </button>
                    </form>
                  </aside>

                  <div className="ws-detail">
                    {!selectedWorkspaceId ? (
                      <p className="dash-empty">{t('ws_select_hint')}</p>
                    ) : workspaceDetail ? (
                      <>
                        <div className="ws-detail-head">
                          <h3 className="ws-name">{workspaceDetail.workspace.name}</h3>
                          <span className="role-pill">{roleLabel(workspaceDetail.role)}</span>
                        </div>

                        {canUpdateWorkspace && (
                          <form className="ws-rename" onSubmit={renameWorkspace} noValidate>
                            <label className="ws-label" htmlFor="ws-rename">{t('ws_rename_label')}</label>
                            <div className="ws-inline">
                              <input
                                id="ws-rename"
                                name="name"
                                type="text"
                                value={renameName}
                                maxLength={80}
                                onChange={(event) => setRenameName(event.target.value)}
                              />
                              <button
                                className="btn btn-secondary"
                                type="submit"
                                disabled={
                                  savingWorkspace ||
                                  !renameName.trim() ||
                                  renameName.trim() === workspaceDetail.workspace.name
                                }
                              >
                                {savingWorkspace ? t('api_loading') : t('ws_rename_btn')}
                              </button>
                            </div>
                          </form>
                        )}

                        <h4 className="ws-heading">{t('ws_members_title')}</h4>
                        <div className="ws-table-wrap">
                          <table className="ws-table">
                            <thead>
                              <tr>
                                <th scope="col">{t('ws_member')}</th>
                                <th scope="col">{t('dash_role')}</th>
                                <th scope="col">{t('dash_status')}</th>
                                <th scope="col"><span className="ws-visually-hidden">{t('ws_actions')}</span></th>
                              </tr>
                            </thead>
                            <tbody>
                              {workspaceDetail.members.map((member) => {
                                const memberRank = RANKS[member.role] || 0;
                                const canEditRole =
                                  canManageMembers && member.role !== 'owner' && memberRank < myRank;
                                const canRemoveMember =
                                  canManageMembers &&
                                  member.role !== 'owner' &&
                                  member.id !== user.id &&
                                  memberRank < myRank;

                                return (
                                  <tr key={member.id}>
                                    <th scope="row" className="ws-member-cell">
                                      <span className="ws-member-name">{member.full_name}</span>
                                      <span className="ws-member-email" dir="ltr">{member.email}</span>
                                    </th>
                                    <td>
                                      {canEditRole ? (
                                        <select
                                          className="ws-role-select"
                                          value={member.role}
                                          disabled={memberBusyId === member.id}
                                          aria-label={`${t('dash_role')} — ${member.full_name}`}
                                          onChange={(event) => changeMemberRole(member, event.target.value)}
                                        >
                                          {assignableRoles.map((role) => (
                                            <option key={role} value={role}>{roleLabel(role)}</option>
                                          ))}
                                        </select>
                                      ) : (
                                        <span
                                          className="role-pill"
                                          title={member.role === 'owner' ? t('ws_owner_locked') : undefined}
                                        >
                                          {roleLabel(member.role)}
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      <span className={`status-pill status-${member.status}`}>{statusLabel(member.status)}</span>
                                    </td>
                                    <td className="ws-actions-cell">
                                      {canRemoveMember && (
                                        <button
                                          className="ws-danger"
                                          type="button"
                                          disabled={memberBusyId === member.id}
                                          onClick={() => removeMember(member)}
                                        >
                                          {t('ws_remove_btn')}
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {canInvite && (
                          <form className="ws-invite" onSubmit={inviteMember} noValidate>
                            <h4 className="ws-heading">{t('ws_invite_title')}</h4>
                            <div className="ws-inline">
                              <input
                                id="ws-invite-email"
                                name="email"
                                type="email"
                                dir="ltr"
                                value={inviteEmail}
                                maxLength={254}
                                placeholder={t('ws_invite_email')}
                                aria-label={t('ws_invite_email')}
                                onChange={(event) => setInviteEmail(event.target.value)}
                              />
                              <select
                                className="ws-role-select"
                                value={inviteRoleValue}
                                aria-label={t('dash_role')}
                                disabled={inviting}
                                onChange={(event) => setInviteRole(event.target.value)}
                              >
                                {assignableRoles.map((role) => (
                                  <option key={role} value={role}>{roleLabel(role)}</option>
                                ))}
                              </select>
                              <button className="btn btn-primary" type="submit" disabled={inviting}>
                                {inviting ? t('api_loading') : t('ws_invite_btn')}
                              </button>
                            </div>
                          </form>
                        )}

                        {canDeleteWorkspace && (
                          <div className="ws-danger-zone">
                            <p className="ws-danger-text">{t('ws_delete_warning')}</p>
                            <div className="ws-inline">
                              <button
                                className="btn btn-secondary ws-danger-btn"
                                type="button"
                                disabled={deletingWorkspace}
                                onClick={() => {
                                  if (deleteArmed) {
                                    deleteWorkspace();
                                  } else {
                                    setDeleteArmed(true);
                                  }
                                }}
                              >
                                {deletingWorkspace
                                  ? t('api_loading')
                                  : deleteArmed
                                    ? t('ws_delete_confirm')
                                    : t('ws_delete_btn')}
                              </button>
                              {deleteArmed && !deletingWorkspace && (
                                <button
                                  className="btn btn-secondary"
                                  type="button"
                                  onClick={() => setDeleteArmed(false)}
                                >
                                  {t('ws_delete_cancel')}
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="dash-empty">{workspaceLoading ? t('api_loading') : t('ws_select_hint')}</p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {tab === 'profile' && (
              <section aria-labelledby="dash-profile-title">
                <h2 id="dash-profile-title" className="dash-subtitle">{t('dash_profile_title')}</h2>
                <form className="auth-form dash-form" onSubmit={saveProfile} noValidate>
                  <div className="field">
                    <label htmlFor="profile-name">{t('auth_fullname')}</label>
                    <input
                      id="profile-name"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="profile-email">{t('auth_email')}</label>
                    <input id="profile-email" type="email" value={user.email} dir="ltr" readOnly />
                  </div>

                  {profileError && (
                    <p className="form-error" role="alert" aria-live="polite">{profileError}</p>
                  )}
                  {profileNotice && (
                    <p className="form-success" role="status" aria-live="polite">{t(profileNotice)}</p>
                  )}

                  <button className="btn btn-primary auth-submit" type="submit" disabled={savingProfile}>
                    {savingProfile ? t('api_loading') : t('dash_save')}
                  </button>
                </form>
              </section>
            )}

            {tab === 'security' && (
              <section aria-labelledby="dash-security-title">
                <h2 id="dash-security-title" className="dash-subtitle">{t('dash_security_title')}</h2>
                <form className="auth-form dash-form" onSubmit={savePassword} noValidate>
                  <div className="field">
                    <label htmlFor="security-current">{t('dash_current_password')}</label>
                    <input
                      id="security-current"
                      name="currentPassword"
                      type="password"
                      autoComplete="current-password"
                      dir="ltr"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="security-new">{t('auth_new_password')}</label>
                    <input
                      id="security-new"
                      name="newPassword"
                      type="password"
                      autoComplete="new-password"
                      dir="ltr"
                      aria-describedby="security-new-hint"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                    />
                    <small id="security-new-hint" className="field-hint">{t('auth_password_hint')}</small>
                  </div>

                  <div className="field">
                    <label htmlFor="security-confirm">{t('auth_confirm_password')}</label>
                    <input
                      id="security-confirm"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      dir="ltr"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                  </div>

                  {passwordError && (
                    <p className="form-error" role="alert" aria-live="polite">{passwordError}</p>
                  )}
                  {passwordNotice && (
                    <p className="form-success" role="status" aria-live="polite">{t(passwordNotice)}</p>
                  )}

                  <button className="btn btn-primary auth-submit" type="submit" disabled={savingPassword}>
                    {savingPassword ? t('api_loading') : t('dash_update_password')}
                  </button>
                </form>
              </section>
            )}

            {tab === 'language' && (
              <section aria-labelledby="dash-language-title">
                <h2 id="dash-language-title" className="dash-subtitle">{t('dash_language_title')}</h2>
                <p className="lead">{t('dash_language_hint')}</p>

                <ul className="dash-languages">
                  {languages.map((item) => (
                    <li key={item.code}>
                      <button
                        type="button"
                        className={`dash-language${lang === item.code ? ' is-active' : ''}`}
                        aria-pressed={lang === item.code}
                        disabled={savingLanguage}
                        onClick={() => chooseLanguage(item.code)}
                      >
                        <span>{item.label}</span>
                        <span className="dash-language-code">{item.code.toUpperCase()}</span>
                      </button>
                    </li>
                  ))}
                </ul>

                {languageError && (
                  <p className="form-error" role="alert" aria-live="polite">{languageError}</p>
                )}
                {languageNotice && (
                  <p className="form-success" role="status" aria-live="polite">{t(languageNotice)}</p>
                )}
              </section>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
