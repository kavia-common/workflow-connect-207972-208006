import React from 'react';
import { Card, Badge } from '../components/ui';
import { getApiBaseUrl } from '../api/client';

// PUBLIC_INTERFACE
export default function Settings() {
  /** Basic app settings/help. */
  const apiBase = getApiBaseUrl();

  return (
    <div className="grid grid--2">
      <Card title="Environment" right={<Badge tone="neutral">read-only</Badge>}>
        <div className="stack">
          <div>
            <div className="muted mono">REACT_APP_API_BASE_URL</div>
            <div className="mono">{apiBase}</div>
          </div>
          <p className="muted">
            Set <span className="mono">REACT_APP_API_BASE_URL</span> in the frontend environment to point at the FastAPI backend.
          </p>
        </div>
      </Card>

      <Card title="About">
        <p className="muted">
          Workflow Connect is a Zapier/n8n-style workflow automation platform. This UI includes a minimal builder, logs view,
          and dashboard scaffolding.
        </p>
      </Card>
    </div>
  );
}
