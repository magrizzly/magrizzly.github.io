/**
 * magrizzly.github.io — Interactive Browser Utilities
 * 100% Client-side, secure, offline-capable.
 */

(function () {
  'use strict';

  // --- Helper: Copy with feedback tooltip ---
  function copyToClipboard(text, feedbackEl) {
    if (!navigator.clipboard) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    } else {
      navigator.clipboard.writeText(text);
    }

    if (feedbackEl) {
      feedbackEl.classList.add('visible');
      setTimeout(() => feedbackEl.classList.remove('visible'), 2000);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // --- Tab Switching ---
    const tabButtons = document.querySelectorAll('.tool-tab-btn');
    const tabPanels = document.querySelectorAll('.tool-panel');

    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');
        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });

    // =========================================================================
    // 1. JSON Formatter & Validator
    // =========================================================================
    const jsonInput = document.getElementById('jsonInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const jsonStatus = document.getElementById('jsonStatus');
    const btnJsonFormat = document.getElementById('btnJsonFormat');
    const btnJsonMinify = document.getElementById('btnJsonMinify');
    const btnJsonSample = document.getElementById('btnJsonSample');
    const btnJsonClear = document.getElementById('btnJsonClear');
    const btnJsonCopy = document.getElementById('btnJsonCopy');
    const jsonCopyFeedback = document.getElementById('jsonCopyFeedback');

    function formatJson(space = 2) {
      const raw = jsonInput.value.trim();
      if (!raw) {
        jsonOutput.value = '';
        jsonStatus.innerHTML = '<span class="badge">Awaiting input</span>';
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        jsonOutput.value = JSON.stringify(parsed, null, space);
        jsonStatus.innerHTML = '<span class="badge badge-success">✓ Valid JSON</span>';
      } catch (err) {
        jsonOutput.value = '';
        jsonStatus.innerHTML = `<span class="badge" style="background: rgba(239,68,68,0.15); color: #ef4444; border-color: rgba(239,68,68,0.3);">✗ Invalid JSON: ${err.message}</span>`;
      }
    }

    if (btnJsonFormat) btnJsonFormat.addEventListener('click', () => formatJson(2));
    if (btnJsonMinify) btnJsonMinify.addEventListener('click', () => formatJson(0));

    if (btnJsonSample) {
      btnJsonSample.addEventListener('click', () => {
        const sample = {
          name: "magrizzly",
          site: "magrizzly.github.io",
          hosted: "GitHub Pages",
          tags: ["developer", "privacy", "minimalism", "open-source"],
          specs: {
            theme: "dark",
            dependencies: 0,
            buildStep: false
          }
        };
        jsonInput.value = JSON.stringify(sample);
        formatJson(2);
      });
    }

    if (btnJsonClear) {
      btnJsonClear.addEventListener('click', () => {
        jsonInput.value = '';
        jsonOutput.value = '';
        jsonStatus.innerHTML = '';
      });
    }

    if (btnJsonCopy) {
      btnJsonCopy.addEventListener('click', () => {
        if (jsonOutput.value) {
          copyToClipboard(jsonOutput.value, jsonCopyFeedback);
        }
      });
    }

    // =========================================================================
    // 2. Base64 & URL Encoder / Decoder
    // =========================================================================
    const encoderInput = document.getElementById('encoderInput');
    const encoderOutput = document.getElementById('encoderOutput');
    const btnB64Encode = document.getElementById('btnB64Encode');
    const btnB64Decode = document.getElementById('btnB64Decode');
    const btnUrlEncode = document.getElementById('btnUrlEncode');
    const btnUrlDecode = document.getElementById('btnUrlDecode');
    const btnEncoderCopy = document.getElementById('btnEncoderCopy');
    const encoderCopyFeedback = document.getElementById('encoderCopyFeedback');
    const encoderStatus = document.getElementById('encoderStatus');

    if (btnB64Encode) {
      btnB64Encode.addEventListener('click', () => {
        try {
          encoderOutput.value = btoa(unescape(encodeURIComponent(encoderInput.value)));
          encoderStatus.innerHTML = '<span class="badge badge-success">✓ Encoded to Base64</span>';
        } catch (e) {
          encoderStatus.innerHTML = `<span class="badge" style="color: #ef4444;">Error: ${e.message}</span>`;
        }
      });
    }

    if (btnB64Decode) {
      btnB64Decode.addEventListener('click', () => {
        try {
          encoderOutput.value = decodeURIComponent(escape(atob(encoderInput.value.trim())));
          encoderStatus.innerHTML = '<span class="badge badge-success">✓ Decoded from Base64</span>';
        } catch (e) {
          encoderStatus.innerHTML = `<span class="badge" style="color: #ef4444;">Invalid Base64 sequence</span>`;
        }
      });
    }

    if (btnUrlEncode) {
      btnUrlEncode.addEventListener('click', () => {
        encoderOutput.value = encodeURIComponent(encoderInput.value);
        encoderStatus.innerHTML = '<span class="badge badge-success">✓ URL Encoded</span>';
      });
    }

    if (btnUrlDecode) {
      btnUrlDecode.addEventListener('click', () => {
        try {
          encoderOutput.value = decodeURIComponent(encoderInput.value);
          encoderStatus.innerHTML = '<span class="badge badge-success">✓ URL Decoded</span>';
        } catch (e) {
          encoderStatus.innerHTML = `<span class="badge" style="color: #ef4444;">Invalid URL encoding</span>`;
        }
      });
    }

    if (btnEncoderCopy) {
      btnEncoderCopy.addEventListener('click', () => {
        if (encoderOutput.value) {
          copyToClipboard(encoderOutput.value, encoderCopyFeedback);
        }
      });
    }

    // =========================================================================
    // 3. Hashes & Random Generator
    // =========================================================================
    const hashInput = document.getElementById('hashInput');
    const sha256Output = document.getElementById('sha256Output');
    const sha512Output = document.getElementById('sha512Output');
    const btnGenHash = document.getElementById('btnGenHash');
    const btnGenUuid = document.getElementById('btnGenUuid');
    const uuidOutput = document.getElementById('uuidOutput');

    async function computeHash(message, algorithm) {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest(algorithm, msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    if (btnGenHash && hashInput) {
      const runHashes = async () => {
        const text = hashInput.value;
        if (!text) {
          if (sha256Output) sha256Output.value = '';
          if (sha512Output) sha512Output.value = '';
          return;
        }
        if (sha256Output) sha256Output.value = await computeHash(text, 'SHA-256');
        if (sha512Output) sha512Output.value = await computeHash(text, 'SHA-512');
      };

      btnGenHash.addEventListener('click', runHashes);
      hashInput.addEventListener('input', runHashes);
    }

    if (btnGenUuid && uuidOutput) {
      const generateUuid = () => {
        if (crypto.randomUUID) {
          uuidOutput.value = crypto.randomUUID();
        } else {
          // Fallback
          uuidOutput.value = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        }
      };
      btnGenUuid.addEventListener('click', generateUuid);
      generateUuid(); // Initial on load
    }

    // Hash & UUID copy buttons
    document.querySelectorAll('.btn-copy-target').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const target = document.getElementById(targetId);
        const feedback = btn.nextElementSibling;
        if (target && target.value) {
          copyToClipboard(target.value, feedback);
        }
      });
    });

    // =========================================================================
    // 4. Scratchpad (Auto-saved to localStorage)
    // =========================================================================
    const scratchpad = document.getElementById('scratchpadText');
    const scratchStats = document.getElementById('scratchStats');
    const btnDownloadScratch = document.getElementById('btnDownloadScratch');
    const btnClearScratch = document.getElementById('btnClearScratch');
    const SCRATCH_KEY = 'magrizzly_scratchpad';

    if (scratchpad) {
      // Restore saved notes
      const savedText = localStorage.getItem(SCRATCH_KEY);
      if (savedText) {
        scratchpad.value = savedText;
      }

      function updateScratchStats() {
        const val = scratchpad.value;
        const chars = val.length;
        const words = val.trim() ? val.trim().split(/\s+/).length : 0;
        const lines = val ? val.split('\n').length : 0;
        if (scratchStats) {
          scratchStats.textContent = `${words} words · ${chars} characters · ${lines} lines (Saved locally)`;
        }
      }

      scratchpad.addEventListener('input', () => {
        localStorage.setItem(SCRATCH_KEY, scratchpad.value);
        updateScratchStats();
      });

      updateScratchStats();

      if (btnClearScratch) {
        btnClearScratch.addEventListener('click', () => {
          if (confirm('Clear scratchpad content?')) {
            scratchpad.value = '';
            localStorage.removeItem(SCRATCH_KEY);
            updateScratchStats();
          }
        });
      }

      if (btnDownloadScratch) {
        btnDownloadScratch.addEventListener('click', () => {
          const blob = new Blob([scratchpad.value], { type: 'text/markdown;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `scratchpad-${new Date().toISOString().slice(0, 10)}.md`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
      }
    }
  });
})();
