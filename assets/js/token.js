/* ═══════════════════════════════════════════════════════
   ETERNOX — TOKEN & LIVE STATS MODULE
   Fetches live data from MindScan Blockscout API
   Updates: ticker bar, stats band, price displays
   ═══════════════════════════════════════════════════════ */

'use strict';

const TICKER_MINDSCAN = 'https://mainnet.mindscan.info';
const TICKER_NOX_CA   = 'YOUR_NOX_CONTRACT_ADDRESS';

const tkData = {
  price:   '$0.0213',
  change:  '+0.00%',
  holders: '—',
  txns:    '—',
  block:   '—',
  gas:     '—',
  supply:  '1,000,000,000',
  network: 'Mindchain',
  status:  'LIVE'
};

function tkFmt(n) {
  n = parseInt(n);
  if (n >= 1e9) return (n/1e9).toFixed(2)+'B';
  if (n >= 1e6) return (n/1e6).toFixed(2)+'M';
  if (n >= 1e3) return (n/1e3).toFixed(1)+'K';
  return n.toString();
}

function tkBuild() {
  const items = [
    `<div class="tk-item"><span class="tk-dot"></span><span class="tk-label">LIVE</span><span class="tk-val white">Mindchain Network</span></div>`,
    `<div class="tk-item"><span class="tk-label">$NOX</span><span class="tk-val">${tkData.price}</span><span class="tk-val green" style="font-size:0.65rem;">${tkData.change}</span></div>`,
    `<div class="tk-item"><span class="tk-label">Holders</span><span class="tk-val white">${tkData.holders}</span></div>`,
    `<div class="tk-item"><span class="tk-label">Transactions</span><span class="tk-val white">${tkData.txns}</span></div>`,
    `<div class="tk-item"><span class="tk-label">Block</span><span class="tk-val white">${tkData.block}</span></div>`,
    `<div class="tk-item"><span class="tk-label">Gas</span><span class="tk-val white">${tkData.gas}</span></div>`,
    `<div class="tk-item"><span class="tk-label">Supply</span><span class="tk-val white">${tkData.supply} NOX</span></div>`,
    `<div class="tk-item"><span class="tk-label">Standard</span><span class="tk-val white">MIND20</span></div>`,
    `<div class="tk-item"><span class="tk-label">Chain ID</span><span class="tk-val white">9996</span></div>`,
    `<div class="tk-sep">✦</div>`,
    `<div class="tk-item"><span class="tk-label">Twitter</span><span class="tk-val white">@EterNox01</span></div>`,
    `<div class="tk-item"><span class="tk-label">Telegram</span><span class="tk-val white">t.me/eternox1</span></div>`,
    `<div class="tk-item"><span class="tk-label">Airdrop</span><span class="tk-val green">500 NOX FREE ↓</span></div>`,
    `<div class="tk-sep">✦</div>`,
  ];
  const html = items.join('');
  const s1 = document.getElementById('tk-set-1');
  const s2 = document.getElementById('tk-set-2');
  if (s1) s1.innerHTML = html;
  if (s2) s2.innerHTML = html;
}

async function tkFetchLive() {
  try {
    const r = await fetch(TICKER_MINDSCAN + '/api/v2/stats', { signal: AbortSignal.timeout(6000) });
    if (r.ok) {
      const d = await r.json();
      if (d.total_transactions) tkData.txns  = tkFmt(d.total_transactions);
      if (d.latest_block)       tkData.block = '#' + parseInt(d.latest_block).toLocaleString();
      if (d.gas_prices && d.gas_prices.average)
        tkData.gas = parseFloat(d.gas_prices.average).toFixed(1) + ' Gwei';
    }
  } catch(e) {}

  if (TICKER_NOX_CA !== 'YOUR_NOX_CONTRACT_ADDRESS') {
    try {
      const r2 = await fetch(TICKER_MINDSCAN + '/api/v2/tokens/' + TICKER_NOX_CA, { signal: AbortSignal.timeout(6000) });
      if (r2.ok) {
        const t = await r2.json();
        if (t.holders) tkData.holders = tkFmt(t.holders);
      }
    } catch(e) {}
  } else {
    tkData.holders = 'At Launch';
  }

  tkBuild(); // rebuild ticker with fresh data
}

// Start ticker
document.addEventListener('DOMContentLoaded', function() {
  tkBuild();       // show immediately with defaults
  tkFetchLive();   // then fetch live data
  setInterval(tkFetchLive, 30000); // refresh every 30s
});



// ── SWAP MODAL ──
const CONTRACT = 'YOUR_CONTRACT_ADDRESS';
const PANCAKE_URL = `https://v2.mindchain.info/swap?outputCurrency=${CONTRACT}`;
const BNB_PRICE = 580; // update with real price
const NOX_PRICE = 0.2847;
const RATE = BNB_PRICE / NOX_PRICE;


function heroQuickBuy() {
  if (typeof userAccount !== 'undefined' && userAccount) {
    openSwapModal();
  } else {
    connectWallet();
  }
}

