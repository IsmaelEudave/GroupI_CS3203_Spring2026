// aiOverview.js — AI-powered project summary widget

const STORAGE_KEY = 'tasklu_openai_key';
const CACHE_KEY = 'tasklu_ai_summary_cache';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

const css = `
  .ai-container { font-family: 'DM Sans', sans-serif; color: #e8e4dc; }
  .ai-container * { box-sizing: border-box; }
  .ai-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
  .ai-heading { display: flex; align-items: center; gap: 10px; }
  .ai-heading-icon {
    width: 28px; height: 28px; border-radius: 6px;
    background: linear-gradient(135deg, #e8b84b 0%, #b05ae0 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; color: #0f0f11; font-weight: 700;
  }
  .ai-title { font-family: 'DM Serif Display', serif; font-size: 1.15rem; margin: 0; color: #e8e4dc; letter-spacing: -0.3px; }
  .ai-subtitle { font-family: 'DM Mono', monospace; font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: #555; margin-top: 2px; }
  .ai-actions { display: flex; gap: 8px; align-items: center; }
  .ai-meta { font-family: 'DM Mono', monospace; font-size: 0.65rem; color: #555; margin-right: 4px; }
  .ai-icon-btn {
    background: transparent; border: 0.5px solid #2a2a30; color: #888;
    width: 30px; height: 30px; border-radius: 6px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; transition: all 0.15s;
  }
  .ai-icon-btn:hover { border-color: #e8b84b; color: #e8b84b; }
  .ai-btn-primary {
    background: #e8b84b; color: #0f0f11; border: none;
    padding: 7px 14px; border-radius: 6px; font-family: 'DM Sans', sans-serif;
    font-weight: 600; font-size: 0.78rem; cursor: pointer;
    transition: opacity 0.15s; letter-spacing: 0.02em;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .ai-btn-primary:hover:not(:disabled) { opacity: 0.85; }
  .ai-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .ai-spinner {
    width: 11px; height: 11px; border: 1.5px solid #0f0f11;
    border-top-color: transparent; border-radius: 50%;
    animation: ai-spin 0.7s linear infinite;
  }
  @keyframes ai-spin { to { transform: rotate(360deg); } }

  .ai-content {
    background: #0f0f11; border: 0.5px solid #222226; border-radius: 8px;
    padding: 16px 18px; min-height: 90px; max-height: 220px; overflow-y: auto;
    font-size: 0.85rem; line-height: 1.55;
  }
  .ai-content::-webkit-scrollbar { width: 6px; }
  .ai-content::-webkit-scrollbar-thumb { background: #2a2a30; border-radius: 3px; }
  .ai-content h2, .ai-content h3, .ai-content h4 {
    font-family: 'DM Sans', sans-serif; color: #e8b84b;
    font-size: 0.82rem; font-weight: 600; margin: 12px 0 6px;
    letter-spacing: 0.02em;
  }
  .ai-content h2:first-child, .ai-content h3:first-child, .ai-content h4:first-child { margin-top: 0; }
  .ai-content p { margin: 0 0 8px; color: #c8c4bc; }
  .ai-content p:last-child { margin-bottom: 0; }
  .ai-content ul, .ai-content ol { margin: 0 0 8px; padding-left: 20px; color: #c8c4bc; }
  .ai-content li { margin-bottom: 3px; }
  .ai-content strong { color: #e8e4dc; font-weight: 600; }
  .ai-content em { color: #b05ae0; font-style: normal; }
  .ai-content code {
    background: #1e1e22; padding: 1px 5px; border-radius: 3px;
    font-family: 'DM Mono', monospace; font-size: 0.78rem; color: #e8b84b;
  }
  .ai-empty, .ai-loading, .ai-error {
    font-family: 'DM Mono', monospace; font-size: 0.75rem;
    text-align: center; padding: 20px 0;
  }
  .ai-empty { color: #555; }
  .ai-loading { color: #888; display: flex; align-items: center; justify-content: center; gap: 10px; }
  .ai-loading-dots {
    width: 14px; height: 14px; border: 2px solid #e8b84b;
    border-top-color: transparent; border-radius: 50%;
    animation: ai-spin 0.8s linear infinite;
  }
  .ai-error { color: #e05a5a; padding: 12px 14px; text-align: left; }
  .ai-error strong { color: #e05a5a; }

  /* Key modal */
  .ai-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.75);
    display: flex; align-items: center; justify-content: center;
    z-index: 10000; padding: 16px;
  }
  .ai-modal {
    background: #16161a; border: 1px solid #2a2a30; border-radius: 12px;
    padding: 28px; width: 100%; max-width: 460px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.6);
  }
  .ai-modal-title { font-family: 'DM Serif Display', serif; font-size: 1.3rem; margin: 0 0 6px; color: #e8e4dc; }
  .ai-modal-sub { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: #888; margin-bottom: 18px; line-height: 1.5; }
  .ai-modal-sub a { color: #e8b84b; text-decoration: none; }
  .ai-modal-sub a:hover { text-decoration: underline; }
  .ai-modal-field { margin-bottom: 18px; }
  .ai-modal-label {
    display: block; font-family: 'DM Mono', monospace; font-size: 0.62rem;
    text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 6px;
  }
  .ai-modal-input {
    width: 100%; background: #0f0f11; border: 1px solid #2a2a30; border-radius: 6px;
    color: #e8e4dc; font-family: 'DM Mono', monospace; font-size: 0.82rem;
    padding: 10px 12px; outline: none; transition: border-color 0.15s;
  }
  .ai-modal-input:focus { border-color: #e8b84b; }
  .ai-modal-actions { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
  .ai-modal-clear {
    background: none; border: none; color: #888; font-family: 'DM Mono', monospace;
    font-size: 0.7rem; cursor: pointer; padding: 0; text-decoration: underline;
  }
  .ai-modal-clear:hover { color: #e05a5a; }
  .ai-modal-right { display: flex; gap: 10px; }
  .ai-modal-cancel {
    background: none; border: 1px solid #333; color: #888;
    padding: 8px 18px; border-radius: 6px; font-size: 0.82rem; cursor: pointer;
  }
  .ai-modal-cancel:hover { border-color: #555; color: #bbb; }
  .ai-modal-save {
    background: #e8b84b; color: #0f0f11; border: none;
    padding: 8px 20px; border-radius: 6px; font-weight: 600; font-size: 0.82rem; cursor: pointer;
  }
  .ai-modal-save:hover { opacity: 0.85; }
`;

const html = `
  <div class="ai-container">
    <div class="ai-header">
      <div class="ai-heading">
        <div class="ai-heading-icon">AI</div>
        <div>
          <h2 class="ai-title">Project Overview</h2>
          <div class="ai-subtitle" id="ai-status">Powered by OpenAI</div>
        </div>
      </div>
      <div class="ai-actions">
        <span class="ai-meta" id="ai-timestamp"></span>
        <button class="ai-icon-btn" id="ai-settings-btn" title="OpenAI API key">&#9881;</button>
        <button class="ai-btn-primary" id="ai-generate-btn">
          <span id="ai-generate-label">Generate Summary</span>
        </button>
      </div>
    </div>
    <div class="ai-content" id="ai-content">
      <p class="ai-empty">Click "Generate Summary" for an AI-powered overview of your tasks.</p>
    </div>
  </div>
`;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function readKanbanTasks() {
  const root = document.getElementById('feature-kanban');
  if (!root) return [];
  const tasks = [];
  root.querySelectorAll('.kb-col').forEach((col) => {
    const status = col.querySelector('.kb-col-label')?.textContent.trim().replace(/\s+/g, ' ') || 'Unknown';
    col.querySelectorAll('.kb-card').forEach((card) => {
      tasks.push({
        title: card.querySelector('.kb-card-title')?.textContent.trim() || '',
        description: card.querySelector('.kb-card-desc')?.textContent.trim() || '',
        priority: card.querySelector('.kb-priority')?.textContent.trim() || '',
        date: card.querySelector('.kb-card-date')?.textContent.trim() || '',
        status,
      });
    });
  });
  return tasks;
}

function readUpcomingTasks() {
  const root = document.getElementById('feature-task-creator');
  if (!root) return [];
  const items = [];
  root.querySelectorAll('.task-item').forEach((item) => {
    const titleEl = item.querySelector('.task-title');
    const badgeEl = item.querySelector('.task-badge');
    const title = titleEl
      ? titleEl.textContent.replace(badgeEl?.textContent || '', '').trim()
      : '';
    const meta = item.querySelector('.task-meta')?.textContent.trim() || '';
    const priority = badgeEl?.textContent.trim() || '';
    if (title) items.push({ title, priority, meta });
  });
  return items;
}

async function callOpenAI(apiKey, kanban, upcoming) {
  const payload = {
    project: 'TaskLU',
    kanban_tasks: kanban,
    upcoming_tasks: upcoming,
    counts_by_status: kanban.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {}),
  };

  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.6,
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content:
            'You are a project management assistant for the TaskLU dashboard. Analyze the user\'s tasks and produce a concise, actionable project summary in markdown. Use these sections: ### Status, ### Priorities, ### Recommendations. Keep each section short (2-4 bullets or sentences). Be specific - reference actual task titles. Do not invent tasks. Avoid filler.',
        },
        {
          role: 'user',
          content: `Here is the current project state as JSON:\n\n${JSON.stringify(payload, null, 2)}\n\nWrite the summary now.`,
        },
      ],
    }),
  });

  if (!res.ok) {
    let detail = '';
    try {
      const errBody = await res.json();
      detail = errBody.error?.message || JSON.stringify(errBody);
    } catch {
      detail = await res.text();
    }
    throw new Error(`${res.status} ${res.statusText}${detail ? ` — ${detail}` : ''}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

function renderMarkdown(md) {
  const safe = escapeHtml(md);
  const lines = safe.split('\n');
  const out = [];
  let inList = false;

  const inline = (s) =>
    s
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');

  const flushList = () => {
    if (inList) {
      out.push('</ul>');
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    const h = line.match(/^(#{1,4})\s+(.+)$/);
    if (h) {
      flushList();
      const lvl = Math.min(h[1].length + 1, 4);
      out.push(`<h${lvl}>${inline(h[2])}</h${lvl}>`);
      continue;
    }
    const li = line.match(/^[-*]\s+(.+)$/);
    if (li) {
      if (!inList) {
        out.push('<ul>');
        inList = true;
      }
      out.push(`<li>${inline(li[1])}</li>`);
      continue;
    }
    flushList();
    out.push(`<p>${inline(line)}</p>`);
  }
  flushList();
  return out.join('');
}

function showKeyModal(currentKey, onSave) {
  const overlay = document.createElement('div');
  overlay.className = 'ai-overlay';
  overlay.innerHTML = `
    <div class="ai-modal" role="dialog" aria-modal="true">
      <h2 class="ai-modal-title">OpenAI API Key</h2>
      <p class="ai-modal-sub">
        Stored locally in your browser only — never sent anywhere except OpenAI.
        Get a key at <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener">platform.openai.com</a>.
      </p>
      <div class="ai-modal-field">
        <label class="ai-modal-label" for="ai-key-input">Secret key</label>
        <input id="ai-key-input" class="ai-modal-input" type="password" placeholder="sk-..." value="${escapeHtml(currentKey || '')}" autocomplete="off" />
      </div>
      <div class="ai-modal-actions">
        <button class="ai-modal-clear" id="ai-key-clear" type="button">Remove saved key</button>
        <div class="ai-modal-right">
          <button class="ai-modal-cancel" id="ai-key-cancel" type="button">Cancel</button>
          <button class="ai-modal-save" id="ai-key-save" type="button">Save</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const input = overlay.querySelector('#ai-key-input');
  input.focus();
  input.select();

  const close = () => document.body.removeChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  overlay.querySelector('#ai-key-cancel').addEventListener('click', close);
  overlay.querySelector('#ai-key-clear').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    onSave('');
    close();
  });
  const save = () => {
    const v = input.value.trim();
    if (v) localStorage.setItem(STORAGE_KEY, v);
    else localStorage.removeItem(STORAGE_KEY);
    onSave(v);
    close();
  };
  overlay.querySelector('#ai-key-save').addEventListener('click', save);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') close();
  });
}

function formatTimestamp(iso) {
  const d = new Date(iso);
  const diffMin = Math.round((Date.now() - d.getTime()) / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function initAiOverview(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  container.innerHTML = html;

  const contentDiv = container.querySelector('#ai-content');
  const generateBtn = container.querySelector('#ai-generate-btn');
  const generateLabel = container.querySelector('#ai-generate-label');
  const settingsBtn = container.querySelector('#ai-settings-btn');
  const statusEl = container.querySelector('#ai-status');
  const timestampEl = container.querySelector('#ai-timestamp');

  const refreshStatus = () => {
    const hasKey = !!localStorage.getItem(STORAGE_KEY);
    statusEl.textContent = hasKey ? 'Powered by OpenAI · key set' : 'Powered by OpenAI · no key';
  };

  const renderCachedIfAny = () => {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (cached?.summary && cached?.at) {
        contentDiv.innerHTML = renderMarkdown(cached.summary);
        timestampEl.textContent = `updated ${formatTimestamp(cached.at)}`;
      }
    } catch { /* ignore */ }
  };

  refreshStatus();
  renderCachedIfAny();

  settingsBtn.addEventListener('click', () => {
    showKeyModal(localStorage.getItem(STORAGE_KEY) || '', () => refreshStatus());
  });

  generateBtn.addEventListener('click', async () => {
    let apiKey = localStorage.getItem(STORAGE_KEY);
    if (!apiKey) {
      showKeyModal('', (saved) => {
        if (saved) generateBtn.click();
        refreshStatus();
      });
      return;
    }

    const kanban = readKanbanTasks();
    const upcoming = readUpcomingTasks();

    if (kanban.length === 0 && upcoming.length === 0) {
      contentDiv.innerHTML = '<p class="ai-empty">No tasks yet. Add some tasks and try again.</p>';
      return;
    }

    generateBtn.disabled = true;
    generateLabel.innerHTML = '<span class="ai-spinner"></span> Generating';
    contentDiv.innerHTML = '<div class="ai-loading"><span class="ai-loading-dots"></span> Analyzing your project...</div>';

    try {
      const summary = await callOpenAI(apiKey, kanban, upcoming);
      if (!summary) throw new Error('Empty response from OpenAI');
      contentDiv.innerHTML = renderMarkdown(summary);
      const stamp = new Date().toISOString();
      localStorage.setItem(CACHE_KEY, JSON.stringify({ summary, at: stamp }));
      timestampEl.textContent = `updated ${formatTimestamp(stamp)}`;
    } catch (err) {
      contentDiv.innerHTML = `<div class="ai-error"><strong>Couldn't generate summary.</strong><br>${escapeHtml(err.message || String(err))}</div>`;
    } finally {
      generateBtn.disabled = false;
      generateLabel.textContent = 'Regenerate';
      refreshStatus();
    }
  });
}

initAiOverview('feature-ai-overview');
