import React from 'react';
import { Card, Button, Badge } from '../components/ui';

const integrations = [
  { id: 'slack', name: 'Slack', status: 'not connected' },
  { id: 'gmail', name: 'Email (SMTP/Gmail)', status: 'not connected' },
  { id: 'sheets', name: 'Google Sheets', status: 'not connected' },
];

// PUBLIC_INTERFACE
export default function Integrations() {
  /** Lists available integrations (demo). */
  return (
    <div className="grid grid--2">
      <Card title="Integrations" right={<Badge tone="neutral">demo</Badge>} className="grid__span2">
        <p className="muted">
          Connectors will be configured here. For MVP, these are placeholders until backend integration endpoints exist.
        </p>
      </Card>

      {integrations.map((i) => (
        <Card
          key={i.id}
          title={i.name}
          right={<Badge tone="neutral">{i.status}</Badge>}
        >
          <div className="stack">
            <p className="muted">Configure credentials and test connectivity.</p>
            <div className="row">
              <Button onClick={() => window.alert('Connect flow coming soon')}>Connect</Button>
              <Button variant="secondary" onClick={() => window.alert('Docs coming soon')}>Docs</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
