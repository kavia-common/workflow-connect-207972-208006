import React, { useMemo, useState } from 'react';
import { Card, Button, Input, Select, Badge } from '../components/ui';

const NODE_CATALOG = [
  { type: 'trigger_webhook', label: 'Trigger: Webhook' },
  { type: 'trigger_schedule', label: 'Trigger: Schedule' },
  { type: 'action_email', label: 'Action: Email' },
  { type: 'action_slack', label: 'Action: Slack' },
  { type: 'action_sheets', label: 'Action: Google Sheets' },
];

function makeId(prefix) {
  return `${prefix}_${Math.random().toString(16).slice(2, 10)}`;
}

// PUBLIC_INTERFACE
export default function Builder({ initialName = 'Untitled Workflow', onNavigateRuns }) {
  /** Simple in-browser builder MVP (not persisted). */
  const [workflowName, setWorkflowName] = useState(initialName);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [newNodeType, setNewNodeType] = useState(NODE_CATALOG[0].type);

  const [nodes, setNodes] = useState(() => ([
    { id: makeId('n'), type: 'trigger_webhook', x: 40, y: 60, config: { path: '/hook' } },
    { id: makeId('n'), type: 'action_slack', x: 320, y: 160, config: { channel: '#alerts' } },
  ]));

  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId) || null, [nodes, selectedNodeId]);

  const addNode = () => {
    const meta = NODE_CATALOG.find(n => n.type === newNodeType);
    const id = makeId('n');
    setNodes(prev => prev.concat({
      id,
      type: newNodeType,
      x: 120 + prev.length * 24,
      y: 100 + prev.length * 18,
      config: defaultConfigFor(newNodeType),
    }));
    setSelectedNodeId(id);
    window.setTimeout(() => {
      const el = document.getElementById(`node-${id}`);
      if (el) el.focus();
    }, 0);
    if (meta) void meta;
  };

  const deleteSelected = () => {
    if (!selectedNodeId) return;
    setNodes(prev => prev.filter(n => n.id !== selectedNodeId));
    setSelectedNodeId(null);
  };

  const moveSelected = (dx, dy) => {
    if (!selectedNodeId) return;
    setNodes(prev => prev.map(n => (n.id === selectedNodeId ? { ...n, x: n.x + dx, y: n.y + dy } : n)));
  };

  const updateSelectedConfig = (patch) => {
    if (!selectedNodeId) return;
    setNodes(prev => prev.map(n => (n.id === selectedNodeId ? { ...n, config: { ...n.config, ...patch } } : n)));
  };

  const runTest = () => {
    // Placeholder: later will call backend to execute workflow and stream logs.
    window.alert('Test run queued (demo). Open Runs & Logs to view sample output.');
    onNavigateRuns();
  };

  return (
    <div className="grid grid--2 builder">
      <Card
        title="Workflow"
        right={<Badge tone="neutral">local only</Badge>}
      >
        <div className="stack">
          <Input
            label="Name"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            placeholder="My automation"
          />
          <div className="row row--wrap">
            <Select label="Add node" value={newNodeType} onChange={(e) => setNewNodeType(e.target.value)}>
              {NODE_CATALOG.map(n => <option key={n.type} value={n.type}>{n.label}</option>)}
            </Select>
            <Button onClick={addNode}>Add</Button>
            <Button variant="secondary" onClick={runTest} disabled={nodes.length === 0}>Test run</Button>
          </div>
          <p className="muted">
            Tip: select a node, then use the arrow buttons to nudge it. This is a lightweight stand-in for a full drag/drop editor.
          </p>
        </div>
      </Card>

      <Card title="Inspector" right={selectedNode ? <Badge tone="success">selected</Badge> : <Badge tone="neutral">none</Badge>}>
        {!selectedNode ? (
          <p className="muted">Select a node on the canvas to edit its configuration.</p>
        ) : (
          <div className="stack">
            <div className="row row--between">
              <div>
                <div className="mono muted">ID: {selectedNode.id}</div>
                <div className="mono">Type: {selectedNode.type}</div>
              </div>
              <Button variant="danger" size="sm" onClick={deleteSelected}>Delete</Button>
            </div>

            <NodeConfigEditor node={selectedNode} onChange={updateSelectedConfig} />

            <div className="nudge">
              <div className="nudge__label muted">Nudge</div>
              <div className="nudge__controls">
                <Button size="sm" variant="secondary" onClick={() => moveSelected(0, -10)}>↑</Button>
                <Button size="sm" variant="secondary" onClick={() => moveSelected(-10, 0)}>←</Button>
                <Button size="sm" variant="secondary" onClick={() => moveSelected(10, 0)}>→</Button>
                <Button size="sm" variant="secondary" onClick={() => moveSelected(0, 10)}>↓</Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card title="Canvas" className="grid__span2">
        <div className="canvas" role="application" aria-label="Workflow canvas">
          {nodes.map(node => (
            <button
              key={node.id}
              id={`node-${node.id}`}
              className={`node ${node.id === selectedNodeId ? 'node--active' : ''}`.trim()}
              style={{ left: node.x, top: node.y }}
              onClick={() => setSelectedNodeId(node.id)}
            >
              <div className="node__title">{labelFor(node.type)}</div>
              <div className="node__meta mono">{Object.keys(node.config).slice(0, 1).map(k => `${k}: ${node.config[k]}`).join('')}</div>
            </button>
          ))}
          {nodes.length === 0 ? <div className="canvas__empty muted">Add a node to start building.</div> : null}
        </div>
      </Card>
    </div>
  );
}

function labelFor(type) {
  return (NODE_CATALOG.find(n => n.type === type)?.label) || type;
}

function defaultConfigFor(type) {
  switch (type) {
    case 'trigger_webhook': return { path: '/hook' };
    case 'trigger_schedule': return { cron: '0 9 * * 1-5' };
    case 'action_email': return { to: 'user@example.com' };
    case 'action_slack': return { channel: '#alerts' };
    case 'action_sheets': return { spreadsheetId: 'sheet-id' };
    default: return {};
  }
}

function NodeConfigEditor({ node, onChange }) {
  switch (node.type) {
    case 'trigger_webhook':
      return (
        <Input
          label="Webhook path"
          value={node.config.path || ''}
          onChange={(e) => onChange({ path: e.target.value })}
          placeholder="/hook"
        />
      );
    case 'trigger_schedule':
      return (
        <Input
          label="CRON"
          hint="Example: 0 9 * * 1-5"
          value={node.config.cron || ''}
          onChange={(e) => onChange({ cron: e.target.value })}
          placeholder="0 9 * * 1-5"
        />
      );
    case 'action_email':
      return (
        <Input
          label="To"
          value={node.config.to || ''}
          onChange={(e) => onChange({ to: e.target.value })}
          placeholder="user@example.com"
        />
      );
    case 'action_slack':
      return (
        <Input
          label="Channel"
          value={node.config.channel || ''}
          onChange={(e) => onChange({ channel: e.target.value })}
          placeholder="#alerts"
        />
      );
    case 'action_sheets':
      return (
        <Input
          label="Spreadsheet ID"
          value={node.config.spreadsheetId || ''}
          onChange={(e) => onChange({ spreadsheetId: e.target.value })}
          placeholder="sheet-id"
        />
      );
    default:
      return <p className="muted">No editor available for this node type.</p>;
  }
}
