import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { api } from './api/client';
import { AppShell } from './components/layout';
import Dashboard from './pages/Dashboard';
import Builder from './pages/Builder';
import Runs from './pages/Runs';
import Integrations from './pages/Integrations';
import Settings from './pages/Settings';

// PUBLIC_INTERFACE
function App() {
  /** Workflow Connect frontend: dashboard, builder, logs, and integrations scaffolding. */
  const [theme, setTheme] = useState('light');
  const [route, setRoute] = useState('dashboard');

  const [connectionStatus, setConnectionStatus] = useState('checking'); // checking | online | offline
  const [connectionError, setConnectionError] = useState(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Backend connectivity check
  useEffect(() => {
    let cancelled = false;
    setConnectionStatus('checking');
    setConnectionError(null);

    api.health()
      .then(() => {
        if (cancelled) return;
        setConnectionStatus('online');
      })
      .catch((e) => {
        if (cancelled) return;
        setConnectionStatus('offline');
        setConnectionError(e?.message || 'Backend not reachable');
      });

    return () => { cancelled = true; };
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const content = useMemo(() => {
    switch (route) {
      case 'dashboard':
        return <Dashboard onCreateWorkflow={() => setRoute('builder')} />;
      case 'builder':
        return <Builder onNavigateRuns={() => setRoute('runs')} />;
      case 'runs':
        return <Runs />;
      case 'integrations':
        return <Integrations />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onCreateWorkflow={() => setRoute('builder')} />;
    }
  }, [route]);

  return (
    <div className="App">
      <AppShell
        current={route}
        onNavigate={setRoute}
        theme={theme}
        onToggleTheme={toggleTheme}
        connectionStatus={connectionStatus}
      >
        {connectionStatus === 'offline' ? (
          <div className="alert" role="status" aria-live="polite">
            <strong>Backend offline.</strong> {connectionError ? <span className="mono">({connectionError})</span> : null}
            <div className="muted">The UI is still usable in demo mode. Configure <span className="mono">REACT_APP_API_BASE_URL</span> to connect.</div>
          </div>
        ) : null}
        {content}
      </AppShell>
    </div>
  );
}

export default App;
