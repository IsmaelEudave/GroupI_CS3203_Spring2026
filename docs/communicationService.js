// communicationService.js

/**
 * Communication Service (Phase 1)
 * Provides infrastructure for sharing and transferring tasks via email.
 */

class CommunicationService {
  constructor() {
    this.sharedTasks = JSON.parse(localStorage.getItem('taskLU_sharedTasks')) || [];
    this._injectModalStyles();
  }

  _injectModalStyles() {
    if (document.getElementById('comm-service-styles')) return;
    const style = document.createElement('style');
    style.id = 'comm-service-styles';
    style.innerHTML = `
      .comm-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.75);
        display: flex; align-items: center; justify-content: center;
        z-index: 10000; padding: 16px; font-family: 'DM Sans', sans-serif;
      }
      .comm-modal {
        background: #16161a; border: 1px solid #2a2a30; border-radius: 12px;
        padding: 28px; width: 100%; max-width: 400px; box-shadow: 0 24px 64px rgba(0,0,0,0.6);
        color: #e8e4dc;
      }
      .comm-modal-title {
        font-family: 'DM Serif Display', serif; font-size: 1.3rem; margin: 0 0 8px 0; color: #e8e4dc;
      }
      .comm-modal-subtitle {
        font-family: 'DM Mono', monospace; font-size: 0.75rem; color: #888;
        margin-bottom: 20px; line-height: 1.4;
      }
      .comm-field { margin-bottom: 20px; }
      .comm-label {
        display: block; font-family: 'DM Mono', monospace; font-size: 0.65rem;
        text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 6px;
      }
      .comm-input {
        width: 100%; background: #0f0f11; border: 1px solid #2a2a30; border-radius: 6px;
        color: #e8e4dc; font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
        padding: 9px 12px; box-sizing: border-box; outline: none; transition: border-color 0.15s;
      }
      .comm-input:focus { border-color: #e8b84b; }
      .comm-actions { display: flex; justify-content: flex-end; gap: 10px; }
      .comm-btn-cancel {
        background: none; border: 1px solid #333; color: #888; padding: 8px 18px;
        border-radius: 6px; font-size: 0.85rem; cursor: pointer; transition: all 0.15s;
      }
      .comm-btn-cancel:hover { border-color: #555; color: #bbb; }
      .comm-btn-submit {
        background: #e8b84b; color: #0f0f11; border: none; padding: 8px 20px;
        border-radius: 6px; font-weight: 600; font-size: 0.85rem; cursor: pointer;
      }
      .comm-btn-submit:hover { opacity: 0.85; }
    `;
    document.head.appendChild(style);
  }

  /**
   * Opens a polished modal to invite/share a task with a user via email.
   * @param {string} taskTitle 
   * @param {function} onShare Callback returning the email
   */
  promptShare(taskTitle, onShare) {
    const overlay = document.createElement('div');
    overlay.className = 'comm-overlay';

    const modal = document.createElement('div');
    modal.className = 'comm-modal';

    modal.innerHTML = `
      <h2 class="comm-modal-title">Share Task</h2>
      <p class="comm-modal-subtitle">Sharing: <strong>${this._escapeHtml(taskTitle)}</strong></p>
      
      <div class="comm-field">
        <label class="comm-label">Team Member Email</label>
        <input type="email" class="comm-input" id="comm-email-input" placeholder="e.g. colleague@example.com" autofocus>
      </div>

      <div class="comm-actions">
        <button class="comm-btn-cancel" id="comm-cancel-btn">Cancel</button>
        <button class="comm-btn-submit" id="comm-submit-btn">Send Invite</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const input = document.getElementById('comm-email-input');
    const cancelBtn = document.getElementById('comm-cancel-btn');
    const submitBtn = document.getElementById('comm-submit-btn');

    const close = () => document.body.removeChild(overlay);

    cancelBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    const submit = () => {
      const email = input.value.trim();
      if (!email) return;
      onShare(email);
      close();
    };

    submitBtn.addEventListener('click', submit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submit();
    });
  }

  shareTaskToEmail(taskObj, email) {
    const shareRecord = {
      id: Date.now(),
      task: taskObj,
      sharedWith: email,
      sharedAt: new Date().toISOString()
    };
    this.sharedTasks.push(shareRecord);
    localStorage.setItem('taskLU_sharedTasks', JSON.stringify(this.sharedTasks));
    console.log('[CommunicationService] Task shared successfully:', shareRecord);
    // In Phase 4 we will add UI confirmation feedback. For now, alert works.
    alert(`Task "${taskObj.title}" shared with ${email}`);
  }

  _escapeHtml(unsafe) {
    return (unsafe || '').toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

export const communicationService = new CommunicationService();
