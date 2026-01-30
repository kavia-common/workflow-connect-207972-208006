import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, Button, Badge, Select } from '../components/ui';

const SAMPLE_LOGS = [
  { t: '00:00.000', level: 'info', msg: 'Run started' },
  { t: '00:00.212', level: 'info', msg: 'Trigger: webhook payload received' },
  { t: '00:00.560', level: 'info', msg: 'Action: Slack message prepared' },
  { t: '00:00.890', level: 'info', msg: 'Action: Slack message sent (200 OK)' },
  { t: '00:01.020', level: 'success', msg: 'Run completed' },
];

// PUBLIC_INTERFACE
export default function Runs() {
  /** Shows execution runs and logs (demo). */
  const [selectedRun, setSelectedRun] = useState('run_demo_1');
  const [streaming, setStreaming] = useState(false);
  const [logs, setLogs] = useState([]);

  const runs = useMemo(() => ([
    { id: 'run_demo_1', workflow: 'Gmail → Slack: New email alert', status: 'success' },
    { id: 'run_demo_2', workflow: 'Webhook → Sheets: Append row', status: 'error' },
  ]), []);

  const bottomRef = useRef(null);

  useEffect(() => {
    // load initial sample logs on run change
    setLogs([]);
    setStreaming(true);
  }, [selectedRun]);

  useEffect(() => {
    if (!streaming) return;

    let i = 0;
    const interval = window.setInterval(() => {
      setLogs(prev => {
        const next = prev.concat(SAMPLE_LOGS[i] ? [SAMPLE_LOGS[i]] : []);
        return next;
      });
      i += 1;
      if (i >= SAMPLE_LOGS.length) {
        window.clearInterval(interval);
        setStreaming(false);
      }
    }, 350);

    return () => window.clearInterval(interval);
  }, [streaming]);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [logs]);

  const activeRun = runs.find(r => r.id === selectedRun);

  return (
    <div className="grid grid--2">
      <Card title="Runs">
        <div className="stack">
          <Select label="Select run" value={selectedRun} onChange={(e) => setSelectedRun(e.target.value)}>
            {runs.map(r => <option key={r.id} value={r.id}>{r.workflow} ({r.status})</option>)}
          </Select>
          <div className="row row--between">
            <div>
              <div className="muted mono">Run ID</div>
              <div className="mono">{selectedRun}</div>
            </div>
            <Badge tone={activeRun?.status === 'success' ? 'success' : 'danger'}>
              {activeRun?.status || 'unknown'}
            </Badge>
          </div>
          <Button variant="secondary" onClick={() => window.alert('Re-run coming soon')}>Re-run</Button>
        </div>
      </Card>

      <Card
        title="Live status"
        right={<Badge tone={streaming ? 'neutral' : 'success'}>{streaming ? 'streaming' : 'idle'}</Badge>}
      >
        <p className="muted">
          In the full platform, this panel will stream real-time logs from the backend via WebSocket/SSE.
        </p>
        <div className="row">
          <Button onClick={() => { setLogs([]); setStreaming(true); }}>Replay logs</Button>
        </div>
      </Card>

      <Card title="Execution logs" className="grid__span2">
        <div className="logbox" role="log" aria-label="Execution logs">
          {logs.length === 0 ? <div className="muted">Waiting for logs...</div> : null}
          {logs.map((l, idx) => (
            <div key={`${l.t}-${idx}`} className={`logline logline--${l.level}`.trim()}>
              <span className="logline__time mono">{l.t}</span>
              <span className="logline__lvl">{l.level.toUpperCase()}</span>
              <span className="logline__msg">{l.msg}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </Card>
    </div>
  );
}
