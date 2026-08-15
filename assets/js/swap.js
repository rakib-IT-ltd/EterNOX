/* ═══════════════════════════════════════════════════════
   ETERNOX — SWAP MODAL MODULE
   MIND → $NOX swap via MindchainSwap
   Opens swap modal, calculates rates, executes swap
   ═══════════════════════════════════════════════════════ */

'use strict';

function openSwapModal() { document.getElementById('swap-overlay').classList.add('open'); calcSwap(); }
function closeSwap() { document.getElementById('swap-overlay').classList.remove('open'); }
function goToPancake() { window.open(PANCAKE_URL, '_blank'); }

function setTab(btn, tab) {
  document.querySelectorAll('.swap-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  ['swap','buy','bridge'].forEach(t => { document.getElementById('tab-'+t).style.display = t===tab?'block':'none'; });
}

function calcSwap() {
  const bnb = parseFloat(document.getElementById('bnb-amount').value) || 0;
  const flx = (bnb * RATE * 0.997).toFixed(1);
  document.getElementById('flx-amount').value = flx;
  document.getElementById('swap-rate').textContent = `1 BNB = ${RATE.toFixed(1)} NOX`;
  document.getElementById('swap-fee').textContent = `${(bnb * 0.003).toFixed(4)} BNB`;
  document.getElementById('swap-min').textContent = `${(parseFloat(flx) * 0.995).toFixed(1)} NOX`;
}

function copyContract() {
  navigator.clipboard.writeText(CONTRACT).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.textContent = 'Copied!'; btn.style.background = '#0fa86a';
    setTimeout(() => { btn.textContent = 'Copy'; btn.style.background = ''; }, 2000);
  });
}

// Close modal on Escape key
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSwap(); });

// ── GENERATE CHART BARS ──
const bars = document.getElementById('chart-bars');
const heights = [35, 42, 38, 55, 48, 62, 50, 70, 58, 75, 65, 80, 68, 85, 72, 90, 78, 82, 88, 95];
heights.forEach((h, i) => {
  const b = document.createElement('div');
  b.className = 'bar up';
  b.style.height = h + '%';
  b.style.animationDelay = (i * 0.03) + 's';
  bars.appendChild(b);
});

// Animate numbers in stats band
const nums = document.querySelectorAll('.stat-num span');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseFloat(el.textContent);
      const isInt = Number.isInteger(target);
      let start = 0; const duration = 1400;
      const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = isInt ? Math.floor(ease * target) : (ease * target).toFixed(1);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = isInt ? target : target.toFixed(1);
      };
      requestAnimationFrame(step);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.5 });
nums.forEach(n => observer.observe(n));



function toggleEditor() {
  const ed = document.getElementById('design-editor');
  const btn = document.getElementById('editor-toggle');
  const open = ed.style.display === 'none';
  ed.style.display = open ? 'block' : 'none';
  btn.textContent = open ? '✕' : '🎨';
}

function showTab(name) {
  ['colors','text','layout','learn'].forEach(t => {
    document.getElementById('panel-'+t).style.display = t===name ? 'block' : 'none';
    const tab = document.getElementById('tab-'+t);
    tab.style.background = t===name ? 'rgba(124,58,237,0.2)' : 'none';
    tab.style.color = t===name ? '#a78bfa' : 'rgba(255,255,255,0.4)';
  });
}

function setVar(name, value) {
  document.documentElement.style.setProperty(name, value);
}

function darken(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return '#' + [Math.max(0,r-30), Math.max(0,g-30), Math.max(0,b-30)].map(x=>x.toString(16).padStart(2,'0')).join('');
}

function applyTheme(name) {
  const themes = {
    purple: { '--blue':'#7c3aed','--blue-d':'#5b21b6','--blue-l':'#ede9fe' },
    logo: { '--blue':'#2a5f6e','--blue-d':'#1b3f4a','--blue-l':'#d6eef2','--white':'#f4fafb','--off':'#e8f4f7','--ink':'#0d1f24','--ink2':'#2e4f58','--gold':'#7ecfdd','--green':'#4ab8cc' },
    blue:   { '--blue':'#1a56f0','--blue-d':'#1040cc','--blue-l':'#ebf0fe' },
    green:  { '--blue':'#059669','--blue-d':'#047857','--blue-l':'#d1fae5' },
    dark:   { '--white':'#111827','--off':'#1f2937','--ink':'#f9fafb','--ink2':'#d1d5db','--rule':'#374151' },
    orange: { '--blue':'#ea580c','--blue-d':'#c2410c','--blue-l':'#ffedd5' },
  };
  Object.entries(themes[name] || {}).forEach(([k,v]) => setVar(k, v));
}

function changeFonts(val) {
  const links = {
    'inter': 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
    'mono': '',
    'serif': 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Georgia&display=swap',
    'syne-dm': 'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap',
  };
  const fontCss = {
    'inter': "document.body.style.fontFamily='Inter,sans-serif'; document.querySelectorAll('h1,h2,h3,h4').forEach(e=>e.style.fontFamily='Inter,sans-serif')",
    'mono': "document.body.style.fontFamily='ui-monospace,monospace'; document.querySelectorAll('h1,h2,h3,h4').forEach(e=>e.style.fontFamily='ui-monospace,monospace')",
    'serif': "document.body.style.fontFamily='Georgia,serif'; document.querySelectorAll('h1,h2,h3,h4').forEach(e=>e.style.fontFamily='Playfair Display,serif')",
    'syne-dm': "document.body.style.fontFamily=''; document.querySelectorAll('h1,h2,h3,h4').forEach(e=>e.style.fontFamily='')",
  };
  if (links[val]) {
    const l = document.createElement('link'); l.rel='stylesheet'; l.href=links[val];
    document.head.appendChild(l);
  }
  if (fontCss[val]) {
    try {
      const fn = new Function(fontCss[val]);
      fn();
    } catch(e) { console.warn('Font change error:', e); }
  }
}

function changePadding(val) {
  document.querySelectorAll('.section').forEach(s => { s.style.paddingTop=val+'px'; s.style.paddingBottom=val+'px'; });
}

let editMode = false;
function toggleEditMode() {
  editMode = !editMode;
  const btn = document.getElementById('edit-mode-btn');
  if (editMode) {
    document.body.setAttribute('contenteditable', 'true');
    document.querySelectorAll('a,button,input,select').forEach(el => el.setAttribute('contenteditable','false'));
    btn.textContent = '✅ Editing ON — click any text to change it';
    btn.style.background = 'rgba(15,168,106,0.2)';
    btn.style.borderColor = 'rgba(15,168,106,0.4)';
    btn.style.color = '#5edbaa';
    document.addEventListener('keydown', escHandler);
  } else {
    document.body.removeAttribute('contenteditable');
    btn.textContent = '🖊 Click to activate text editing';
    btn.style.background = 'rgba(124,58,237,0.15)';
    btn.style.borderColor = 'rgba(124,58,237,0.4)';
    btn.style.color = '#a78bfa';
    document.removeEventListener('keydown', escHandler);
  }
}
function escHandler(e) { if(e.key==='Escape') toggleEditMode(); }



/* ═══════════════════════════════════════════════════════
   ETERNOX — COMPLETE JS ENGINE
   Wallet Connect · Live Stats · Airdrop System
   Mindchain Chain ID: 9996
   ═══════════════════════════════════════════════════════ */

const CHAIN_ID   = 9996;
const CHAIN_HEX  = '0x270C';
const RPC_URL    = 'https://rpc-msc.mindchain.info';
const EXPLORER   = 'https://mainnet.mindscan.info';
const MINDSCAN   = 'https://mainnet.mindscan.info';
const NOX_CA     = 'YOUR_NOX_CONTRACT_ADDRESS';
const NOX_PRICE  = 0.0213;
const MIND_PRICE = 0.05;
const NOX_PER_MIND = NOX_PRICE / MIND_PRICE;

let provider = null, signer = null, userAccount = null;

/* ─────────────────────────────────────────
   WALLET CONNECT
───────────────────────────────────────── */
async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask not found!\n\nInstall MetaMask and add Mindchain:\n• Chain ID: 9996\n• RPC: https://rpc-msc.mindchain.info\n• Symbol: MIND');
    return;
  }
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    userAccount = accounts[0];
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer   = provider.getSigner();
    const network = await provider.getNetwork();
    if (network.chainId !== CHAIN_ID) await switchToMindchain();
    onWalletConnected();
  } catch(e) {
    if (e.code !== 4001) alert('Connection failed: ' + e.message);
  }
}

async function switchToMindchain() {
  try {
    await window.ethereum.request({ method:'wallet_switchEthereumChain', params:[{chainId:CHAIN_HEX}] });
  } catch(e) {
    if (e.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{ chainId:CHAIN_HEX, chainName:'Mind Smart Chain',
          nativeCurrency:{name:'MIND',symbol:'MIND',decimals:18},
          rpcUrls:[RPC_URL,'https://seednode.mindchain.info'],
          blockExplorerUrls:[EXPLORER] }]
      });
    } else throw e;
  }
}

function onWalletConnected() {
  const short = userAccount.slice(0,6)+'…'+userAccount.slice(-4);

  // Hide connect btn, show buy btn
  const cBtn = document.getElementById('wallet-connect-btn');
  const bBtn = document.getElementById('wallet-connected-btn');
  if (cBtn) cBtn.style.display = 'none';
  if (bBtn) { bBtn.style.display = 'inline-flex'; bBtn.style.removeProperty('display'); bBtn.style.display = 'inline-flex'; }

  // Show wallet bar
  const bar = document.getElementById('wallet-bar');
  if (bar) { bar.style.display = 'flex'; }
  const addrEl = document.getElementById('wallet-addr');
  if (addrEl) addrEl.textContent = short;

  // Fetch balance
  provider.getBalance(userAccount).then(bal => {
    const b = parseFloat(ethers.utils.formatEther(bal)).toFixed(4);
    const el = document.getElementById('wallet-mind-bal');
    if (el) el.textContent = b + ' MIND';
    const swBal = document.getElementById('sw-mind-bal');
    if (swBal) swBal.textContent = 'Bal: ' + b + ' MIND';
  }).catch(()=>{});

  // Update swap modal
  const noWallet = document.getElementById('sw-no-wallet');
  const swBtn    = document.getElementById('sw-action-btn');
  if (noWallet) noWallet.style.display = 'none';
  if (swBtn) { swBtn.style.display = 'block'; }
  // If swap modal is open, refresh steps
  const ov = document.getElementById('swap-modal-overlay');
  if (ov && ov.style.display === 'flex') openSwapModal();

  // Auto-fill airdrop wallet fields
  ['ad-tw-wallet','ad-tg-wallet'].forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.value) { el.value = userAccount; adWatchInputs(); }
  });

  adLog('💼 Wallet connected: ' + short, 'success');

  // Update ticker with wallet info
  tkData.wallet = short;
  tkBuild && tkBuild();

  // Update hero quick buy button
  const hqb = document.getElementById('hero-quick-buy');
  if (hqb) {
    hqb.textContent = '⚡ Buy $NOX';
    hqb.style.background = 'rgba(126,207,221,0.25)';
  }

  // Listen for changes
  window.ethereum.on('accountsChanged', accs => {
    if (!accs.length) disconnectWallet();
    else { userAccount = accs[0]; onWalletConnected(); }
  });
  window.ethereum.on('chainChanged', () => window.location.reload());
}

function disconnectWallet() {
  userAccount = null; provider = null; signer = null;
  const cBtn = document.getElementById('wallet-connect-btn');
  const bBtn = document.getElementById('wallet-connected-btn');
  const bar  = document.getElementById('wallet-bar');
  if (cBtn) cBtn.style.display = 'flex';
  if (bBtn) bBtn.style.display = 'none';
  if (bar)  bar.style.display  = 'none';
}

/* ─────────────────────────────────────────
   SWAP MODAL
───────────────────────────────────────── */

function heroQuickBuy() {
  if (typeof userAccount !== 'undefined' && userAccount) {
    openSwapModal();
  } else {
    connectWallet();
  }
}

function openSwapModal() {
  const ov = document.getElementById('swap-modal-overlay');
  if (!ov) return;
  ov.style.display = 'flex';
  const rate = document.getElementById('sw-rate');
  if (rate) rate.textContent = (1/NOX_PER_MIND).toFixed(2);
  const noWallet = document.getElementById('sw-no-wallet');
  const swBtn    = document.getElementById('sw-action-btn');
  // Update step indicators
  const s1 = document.getElementById('sw-step-1');
  const s2 = document.getElementById('sw-step-2');
  const s3 = document.getElementById('sw-step-3');
  if (!userAccount) {
    if (noWallet) noWallet.style.display = 'block';
    if (swBtn)    swBtn.style.display = 'none';
    // Step 1 active
    if (s1) { s1.style.opacity='1'; s1.classList.add('active'); }
    if (s2) s2.style.opacity='0.3';
    if (s3) s3.style.opacity='0.3';
  } else {
    if (noWallet) noWallet.style.display = 'none';
    if (swBtn) { swBtn.style.display = 'block'; swBtn.style.removeProperty('display'); swBtn.style.display = 'block'; }
    // Step 2 active
    if (s1) { s1.style.opacity='0.6'; s1.classList.remove('active'); s1.classList.add('done'); }
    if (s2) { s2.style.opacity='1'; s2.classList.add('active'); }
    if (s3) s3.style.opacity='0.3';
  }
}
function closeSwapModal() {
  const ov = document.getElementById('swap-modal-overlay');
  if (ov) ov.style.display = 'none';
}

function swCalcNOX() {
  const amt = parseFloat(document.getElementById('sw-mind-in').value) || 0;
  const out  = amt * (1/NOX_PER_MIND) * 0.995;
  const outEl = document.getElementById('sw-nox-out');
  if (outEl) outEl.value = out > 0 ? out.toFixed(4) : '';
  const btn = document.getElementById('sw-action-btn');
  if (btn) {
    if (amt > 0 && userAccount) {
      btn.disabled = false;
      btn.textContent = 'Swap MIND → $NOX ↗';
      // Advance to step 3
      const s2 = document.getElementById('sw-step-2');
      const s3 = document.getElementById('sw-step-3');
      if (s2) { s2.classList.remove('active'); s2.classList.add('done'); }
      if (s3) { s3.style.opacity='1'; s3.classList.add('active'); }
    } else if (amt <= 0) {
      btn.disabled = true;
      btn.textContent = 'Enter amount to swap';
      const s3 = document.getElementById('sw-step-3');
      if (s3) { s3.style.opacity='0.3'; s3.classList.remove('active'); }
    }
  }
}

async function swExecute() {
  const amt = parseFloat(document.getElementById('sw-mind-in').value);
  if (!amt || amt <= 0) return;
  if (!userAccount) { openSwapModal(); return; }
  const btn = document.getElementById('sw-action-btn');
  const sts = document.getElementById('sw-status');

  if (NOX_CA === 'YOUR_NOX_CONTRACT_ADDRESS') {
    if (sts) sts.textContent = 'Redirecting to MindchainSwap…';
    if (btn) { btn.disabled = true; btn.textContent = 'Opening DEX…'; }
    setTimeout(() => {
      window.open('https://v2.mindchain.info/', '_blank');
      closeSwapModal();
      if (btn) { btn.disabled = false; swCalcNOX(); }
      if (sts) sts.textContent = '';
    }, 1000);
    return;
  }

  try {
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Confirm in wallet…'; }
    if (sts) sts.textContent = 'Confirm transaction in MetaMask…';
    const net = await provider.getNetwork();
    if (net.chainId !== CHAIN_ID) { await switchToMindchain(); return; }
    if (sts) sts.textContent = 'Opening MindchainSwap…';
    window.open('https://v2.mindchain.info/?outputCurrency=' + NOX_CA + '&exactAmount=' + amt, '_blank');
    closeSwapModal();
  } catch(e) {
    if (sts) sts.textContent = e.code === 4001 ? 'Cancelled.' : 'Error: ' + e.message;
  } finally {
    if (btn) { btn.disabled = false; swCalcNOX(); }
  }
}

