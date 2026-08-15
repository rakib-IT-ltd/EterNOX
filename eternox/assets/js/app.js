/* ═══════════════════════════════════════════════════════
   ETERNOX — MAIN APP MODULE
   Airdrop system, mobile menu, waitlist, design editor
   Entry point — loads after all other scripts
   ═══════════════════════════════════════════════════════ */

'use strict';

// ── AIRDROP SYSTEM ──
const AD_KEY = 'eternox_airdrop_v2';
let adState  = JSON.parse(localStorage.getItem(AD_KEY) || JSON.stringify({
  twitter:  { visited:false, done:false, username:'', wallet:'' },
  telegram: { visited:false, done:false, username:'', wallet:'' },
  totalClaimed: 0
}));

function adSave() { localStorage.setItem(AD_KEY, JSON.stringify(adState)); }

function adLog(msg, type) {
  const log = document.getElementById('ad-log');
  if (!log) return;
  const now = new Date();
  const ts  = [now.getHours(),now.getMinutes(),now.getSeconds()].map(n=>String(n).padStart(2,'0')).join(':');
  const div = document.createElement('div');
  div.style.color = type==='success'?'#4ab8cc':type==='error'?'#e57373':type==='ok'?'#0fa86a':'rgba(255,255,255,0.6)';
  div.textContent = '['+ts+'] ' + msg;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function adUpdateTotal(add) {
  adState.totalClaimed = (adState.totalClaimed||0) + (add||0);
  adSave();
  const el = document.getElementById('ad-total-claimed');
  if (el) el.innerHTML = adState.totalClaimed.toLocaleString() + ' <span style="font-size:1rem;font-weight:500;">NOX</span>';
}

function adMarkVisited(platform) {
  adState[platform].visited = true;
  adSave();
  const btnId = platform==='twitter' ? 'ad-tw-btn' : 'ad-tg-btn';
  adWatchInputs();
  adLog('Step 1 ✓ — opened ' + (platform==='twitter' ? 'Twitter @EterNox01':'Telegram t.me/eternox1'), 'success');
}

function adValidWallet(w) { return /^0x[0-9a-fA-F]{40}$/.test(w.trim()); }

function adWatchInputs() {
  ['twitter','telegram'].forEach(p => {
    if (adState[p].done) return;
    const uId = p==='twitter' ? 'ad-tw-user' : 'ad-tg-user';
    const wId = p==='twitter' ? 'ad-tw-wallet' : 'ad-tg-wallet';
    const bId = p==='twitter' ? 'ad-tw-btn' : 'ad-tg-btn';
    const u = document.getElementById(uId);
    const w = document.getElementById(wId);
    const b = document.getElementById(bId);
    if (!u||!w||!b) return;
    const ready = u.value.trim().length>=2 && adValidWallet(w.value) && adState[p].visited;
    b.disabled = !ready;
    if (!adState[p].visited && u.value.trim().length>=2 && adValidWallet(w.value)) {
      b.textContent = '↑ ' + (p==='twitter'?'Follow first':'Join first') + ', then claim';
    } else if (ready) {
      b.textContent = '✓ I ' + (p==='twitter'?'followed':'joined') + ' — Claim 250 NOX';
    }
  });
}

function adSubmit(platform) {
  const uId = platform==='twitter' ? 'ad-tw-user' : 'ad-tg-user';
  const wId = platform==='twitter' ? 'ad-tw-wallet' : 'ad-tg-wallet';
  const u = document.getElementById(uId)?.value.trim();
  const w = document.getElementById(wId)?.value.trim();
  const label = platform==='twitter' ? 'Twitter' : 'Telegram';

  if (!u || u.length < 2) {
    adLog('❌ Enter your ' + label + ' username', 'error');
    return;
  }
  if (!adValidWallet(w)) {
    adLog('❌ Invalid wallet — must start with 0x and be 42 chars', 'error');
    return;
  }
  if (!adState[platform].visited) {
    adLog('❌ Please follow/join first, then claim', 'error');
    return;
  }
  if (adState[platform].done) {
    adLog('⚠️ Already claimed for ' + label, 'error');
    return;
  }

  // Save
  adState[platform].done     = true;
  adState[platform].username = u;
  adState[platform].wallet   = w;
  adSave();

  // Save to submissions list
  const subs = JSON.parse(localStorage.getItem('eternox_subs')||'[]');
  subs.push({ platform, username:u, wallet:w, ts:new Date().toISOString(), status:'pending' });
  localStorage.setItem('eternox_subs', JSON.stringify(subs));

  // Mark card done
  const card = document.getElementById('ad-card-'+platform);
  if (card) {
    card.style.borderColor = 'rgba(15,168,106,0.4)';
    card.style.background  = 'rgba(15,168,106,0.08)';
  }
  const doneEl = document.getElementById('ad-'+platform.slice(0,2)+'-done');
  if (doneEl) doneEl.style.display = 'block';
  const btn = document.getElementById('ad-'+platform.slice(0,2)+'-btn');
  if (btn) btn.style.display = 'none';

  adUpdateTotal(250);
  adLog('✅ ' + label + ' submitted! @'+u+' · '+w.slice(0,8)+'...'+w.slice(-4), 'ok');
  adLog('⏳ Team will verify & send 250 NOX within 24h of launch', 'success');

  // Both done?
  if (adState.twitter.done && adState.telegram.done) {
    const both = document.getElementById('ad-both-done');
    if (both) both.style.display = 'block';
    adLog('🎉 ALL TASKS DONE — 500 NOX earned!', 'ok');
  }
}

// Restore state on load
window.addEventListener('DOMContentLoaded', function() {
  adUpdateTotal(0);
  ['twitter','telegram'].forEach(p => {
    if (!adState[p].done) return;
    const card = document.getElementById('ad-card-'+p);
    if (card) { card.style.borderColor='rgba(15,168,106,0.4)'; card.style.background='rgba(15,168,106,0.08)'; }
    const doneEl = document.getElementById('ad-'+p.slice(0,2)+'-done');
    if (doneEl) doneEl.style.display = 'block';
    const btn = document.getElementById('ad-'+p.slice(0,2)+'-btn');
    if (btn) btn.style.display = 'none';
    const uEl = document.getElementById('ad-'+p.slice(0,2)+'-user');
    const wEl = document.getElementById('ad-'+p.slice(0,2)+'-wallet');
    if (uEl) uEl.value = adState[p].username;
    if (wEl) wEl.value = adState[p].wallet;
  });
  if (adState.twitter.done && adState.telegram.done) {
    const both = document.getElementById('ad-both-done');
    if (both) both.style.display = 'block';
  }

  // Watch inputs
  ['ad-tw-user','ad-tw-wallet','ad-tg-user','ad-tg-wallet'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', adWatchInputs);
  });

  // Auto-reconnect wallet
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.request({ method:'eth_accounts' }).then(accs => {
      if (accs.length) {
        userAccount = accs[0];
        provider    = new ethers.providers.Web3Provider(window.ethereum);
        signer      = provider.getSigner();
        if (typeof onWalletConnected === 'function') onWalletConnected();
      }
    }).catch(()=>{});
  }
});



// ── MOBILE MENU ──
function openMobileMenu() {
  var d = document.getElementById('mobile-drawer');
  if (d) { d.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeMobileMenu() {
  var d = document.getElementById('mobile-drawer');
  if (d) { d.classList.remove('open'); document.body.style.overflow = ''; }
}

// ── WAITLIST ──
function joinWaitlist() {
  var e = document.getElementById('waitlist-email');
  var m = document.getElementById('waitlist-msg');
  if (!e || !m) return;
  var v = e.value.trim();
  if (!isValidEmail(v)) {
    e.style.borderColor = '#e57373';
    setTimeout(function() { e.style.borderColor = 'rgba(126,207,221,0.25)'; }, 2000);
    return;
  }
  storage.push('eternox_waitlist', v);
  m.style.display = 'block';
  e.value = '';
  e.placeholder = 'Thanks! ✓';
  e.style.borderColor = '#0fa86a';
}

// ── HERO QUICK BUY ──
function heroQuickBuy() {
  if (typeof userAccount !== 'undefined' && userAccount) openSwapModal();
  else connectWallet();
}

// ── INIT ON DOM READY ──
document.addEventListener('DOMContentLoaded', function() {
  // Restore airdrop state
  if (typeof adUpdateTotal === 'function') adUpdateTotal(0);

  // Set logo images from master
  var master = document.getElementById('nox-logo-master');
  if (master) {
    document.querySelectorAll('img[src*="LOGO_PLACEHOLDER"]').forEach(function(img) {
      img.src = master.src;
    });
  }

  // Auto-reconnect wallet
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.request({ method: 'eth_accounts' }).then(function(accs) {
      if (accs.length) {
        userAccount = accs[0];
        provider    = new ethers.providers.Web3Provider(window.ethereum);
        signer      = provider.getSigner();
        if (typeof onWalletConnected === 'function') onWalletConnected();
      }
    }).catch(function() {});
  }

  // Swipe to close drawer
  var d = document.getElementById('mobile-drawer');
  if (d) {
    var sx = 0;
    d.addEventListener('touchstart', function(e) { sx = e.touches[0].clientX; }, { passive: true });
    d.addEventListener('touchend',   function(e) {
      if (e.changedTouches[0].clientX - sx > 55) closeMobileMenu();
    }, { passive: true });
  }

  // Sticky bar scroll behaviour
  var bar = document.getElementById('mobile-buy-bar');
  if (bar) bar.style.transform = 'translateY(100%)';
  window.addEventListener('scroll', function() {
    if (!bar) return;
    bar.style.transition = 'transform 0.3s ease';
    bar.style.transform  = window.scrollY > 280 ? 'translateY(0)' : 'translateY(100%)';
  }, { passive: true });
});
