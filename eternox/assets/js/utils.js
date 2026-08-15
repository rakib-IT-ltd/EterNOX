/* ═══════════════════════════════════════════════════════
   ETERNOX — UTILITY FUNCTIONS
   Shared helpers used across all modules
   ═══════════════════════════════════════════════════════ */

'use strict';

// Format large numbers
function fmtNum(n) {
  n = parseInt(n);
  if (isNaN(n)) return '—';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toLocaleString();
}

// Validate EVM wallet address
function isValidWallet(addr) {
  return /^0x[0-9a-fA-F]{40}$/.test((addr || '').trim());
}

// Shorten wallet address: 0x1234...5678
function shortAddr(addr) {
  if (!addr || addr.length < 10) return addr;
  return addr.slice(0, 6) + '…' + addr.slice(-4);
}

// Validate email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim());
}

// LocalStorage helpers with JSON
const storage = {
  get:    (key, fallback = null) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  set:    (key, val)            => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
  push:   (key, item, max = 1000) => {
    const arr = storage.get(key, []);
    arr.push(item);
    if (arr.length > max) arr.splice(0, arr.length - max);
    storage.set(key, arr);
  },
};

// Add log entry to airdrop log
function adLog(msg, type) {
  const log = document.getElementById('ad-log');
  if (!log) return;
  const now = new Date();
  const ts  = [now.getHours(), now.getMinutes(), now.getSeconds()]
                .map(n => String(n).padStart(2, '0')).join(':');
  const div = document.createElement('div');
  const colors = { success: '#7ecfdd', error: '#e57373', ok: '#0fa86a' };
  div.style.color = colors[type] || 'rgba(255,255,255,0.7)';
  div.textContent = `[${ts}] ${msg}`;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

// Safe querySelector
function $(sel, ctx = document) { return ctx.querySelector(sel); }
function $$(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }
