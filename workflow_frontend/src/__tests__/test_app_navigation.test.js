import React from 'react';
import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

function getSidebar() {
  return screen.getByLabelText(/primary navigation/i);
}

function getContentRoot() {
  // AppShell renders main content inside .content; we can still rely on page titles.
  return screen.getByRole('main');
}

describe('App core navigation + pages', () => {
  test('renders brand + default route (Dashboard)', async () => {
    // Avoid "act" warnings from App's health check useEffect by letting it settle.
    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText(/Workflow Connect/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();

    // Dashboard content signal
    expect(screen.getByText(/Quick actions/i)).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /recent workflows/i })).toBeInTheDocument();
  });

  test('sidebar navigation switches pages', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    const sidebar = getSidebar();

    await user.click(within(sidebar).getByRole('button', { name: /Builder/i }));
    expect(screen.getByText(/Workflow Builder/i)).toBeInTheDocument();
    expect(screen.getByText(/Canvas/i)).toBeInTheDocument();

    await user.click(within(sidebar).getByRole('button', { name: /Runs & Logs/i }));
    expect(screen.getByText(/Runs & Execution Logs/i)).toBeInTheDocument();
    expect(screen.getByRole('log', { name: /execution logs/i })).toBeInTheDocument();

    await user.click(within(sidebar).getByRole('button', { name: /Integrations/i }));
    expect(screen.getByText(/Integrations/i)).toBeInTheDocument();
    expect(screen.getByText(/Connectors will be configured here/i)).toBeInTheDocument();

    await user.click(within(sidebar).getByRole('button', { name: /Settings/i }));
    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/REACT_APP_API_BASE_URL/i)).toBeInTheDocument();

    await user.click(within(sidebar).getByRole('button', { name: /Dashboard/i }));
    expect(screen.getByText(/Quick actions/i)).toBeInTheDocument();
  });

  test('Dashboard "+ New workflow" navigates to Builder', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    await user.click(screen.getByRole('button', { name: /\+ New workflow/i }));
    expect(screen.getByText(/Workflow Builder/i)).toBeInTheDocument();
    expect(screen.getByText(/Inspector/i)).toBeInTheDocument();
  });

  test('Builder "Add" creates an additional node button on canvas', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    // Navigate to Builder
    const sidebar = getSidebar();
    await user.click(within(sidebar).getByRole('button', { name: /Builder/i }));
    expect(screen.getByText(/Workflow Builder/i)).toBeInTheDocument();

    // Canvas should have initial nodes
    const canvas = screen.getByRole('application', { name: /workflow canvas/i });
    const before = within(canvas).getAllByRole('button').length;

    await user.click(screen.getByRole('button', { name: /^Add$/i }));

    const after = within(canvas).getAllByRole('button').length;
    expect(after).toBe(before + 1);
  });

  test('Runs page streams sample logs over time (fake timers)', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    await act(async () => {
      render(<App />);
    });

    const sidebar = getSidebar();
    await user.click(within(sidebar).getByRole('button', { name: /Runs & Logs/i }));

    const logRegion = screen.getByRole('log', { name: /execution logs/i });

    // Initially shows waiting
    expect(within(logRegion).getByText(/Waiting for logs/i)).toBeInTheDocument();

    // Advance enough for multiple log ticks (interval=350ms)
    await act(async () => {
      jest.advanceTimersByTime(350 * 3);
    });

    expect(within(logRegion).getByText(/Run started/i)).toBeInTheDocument();

    // Advance to completion
    await act(async () => {
      jest.advanceTimersByTime(350 * 10);
    });

    expect(within(logRegion).getByText(/Run completed/i)).toBeInTheDocument();

    jest.useRealTimers();
  });
});
