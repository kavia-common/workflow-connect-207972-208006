import React from 'react';
import { Card, Button, Badge } from '../components/ui';

const demoWorkflows = [
  { id: 'wf_1', name: 'Gmail → Slack: New email alert', status: 'active', lastRun: '2m ago' },
  { id: 'wf_2', name: 'Webhook → Google Sheets: Append row', status: 'paused', lastRun: 'yesterday' },
  { id: 'wf_3', name: 'Schedule → Slack: Standup reminder', status: 'active', lastRun: 'today' },
];

// PUBLIC_INTERFACE
export default function Dashboard({ onCreateWorkflow }) {
  /** Dashboard overview of workflows. */
  return (
    <div className="grid grid--2">
      <Card
        title="Quick actions"
        right={<Badge tone="neutral">MVP</Badge>}
      >
        <div className="stack">
          <p className="muted">
            Create a workflow, test a run, and inspect logs. Backend currently exposes only a health endpoint; UI is wired for future API expansion.
          </p>
          <div className="row">
            <Button onClick={onCreateWorkflow}>+ New workflow</Button>
            <Button variant="secondary" onClick={() => window.alert('Import coming soon')}>Import</Button>
          </div>
        </div>
      </Card>

      <Card title="Recent workflows" right={<span className="muted">{demoWorkflows.length} total</span>}>
        <div className="table" role="table" aria-label="Recent workflows">
          <div className="table__head" role="rowgroup">
            <div className="table__row table__row--head" role="row">
              <div className="table__cell" role="columnheader">Name</div>
              <div className="table__cell" role="columnheader">Status</div>
              <div className="table__cell" role="columnheader">Last run</div>
            </div>
          </div>
          <div className="table__body" role="rowgroup">
            {demoWorkflows.map(wf => (
              <div className="table__row" role="row" key={wf.id}>
                <div className="table__cell" role="cell">{wf.name}</div>
                <div className="table__cell" role="cell">
                  <Badge tone={wf.status === 'active' ? 'success' : 'neutral'}>{wf.status}</Badge>
                </div>
                <div className="table__cell muted" role="cell">{wf.lastRun}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Usage" className="grid__span2">
        <div className="metrics">
          <Metric label="Workflows" value="3" />
          <Metric label="Runs today" value="12" />
          <Metric label="Errors" value="1" tone="danger" />
          <Metric label="Integrations" value="3" />
        </div>
      </Card>
    </div>
  );
}

function Metric({ label, value, tone = 'neutral' }) {
  return (
    <div className="metric">
      <div className="metric__label muted">{label}</div>
      <div className="metric__value">
        <Badge tone={tone}>{value}</Badge>
      </div>
    </div>
  );
}
