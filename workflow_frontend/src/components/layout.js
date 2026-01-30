import React from 'react';
import { Button, Badge } from './ui';

// PUBLIC_INTERFACE
export function AppShell({ current, onNavigate, theme, onToggleTheme, children, connectionStatus }) {
  /** Main layout (sidebar + header + content). */
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="sidebar__brand">
          <div className="brand-mark" aria-hidden="true">WF</div>
          <div>
            <div className="brand-title">Workflow Connect</div>
            <div className="brand-subtitle">retro automation</div>
          </div>
        </div>

        <nav className="nav">
          <NavItem active={current === 'dashboard'} onClick={() => onNavigate('dashboard')}>Dashboard</NavItem>
          <NavItem active={current === 'builder'} onClick={() => onNavigate('builder')}>Builder</NavItem>
          <NavItem active={current === 'runs'} onClick={() => onNavigate('runs')}>Runs & Logs</NavItem>
          <NavItem active={current === 'integrations'} onClick={() => onNavigate('integrations')}>Integrations</NavItem>
          <NavItem active={current === 'settings'} onClick={() => onNavigate('settings')}>Settings</NavItem>
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__status">
            <span className="sidebar__status-label">Backend</span>
            <Badge tone={connectionStatus === 'online' ? 'success' : connectionStatus === 'checking' ? 'neutral' : 'danger'}>
              {connectionStatus}
            </Badge>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </Button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar__left">
            <span className="topbar__title">{titleFor(current)}</span>
          </div>
          <div className="topbar__right">
            <div className="user-chip" role="group" aria-label="User info">
              <span className="user-chip__avatar" aria-hidden="true">U</span>
              <span className="user-chip__name">Demo User</span>
            </div>
          </div>
        </header>

        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
}

function titleFor(current) {
  switch (current) {
    case 'dashboard': return 'Dashboard';
    case 'builder': return 'Workflow Builder';
    case 'runs': return 'Runs & Execution Logs';
    case 'integrations': return 'Integrations';
    case 'settings': return 'Settings';
    default: return 'Workflow Connect';
  }
}

function NavItem({ active, children, ...props }) {
  return (
    <button className={`nav__item ${active ? 'nav__item--active' : ''}`.trim()} {...props}>
      <span className="nav__item-text">{children}</span>
    </button>
  );
}
