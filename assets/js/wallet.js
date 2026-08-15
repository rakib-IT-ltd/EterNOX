/* ═══════════════════════════════════════════════════════
   ETERNOX — WALLET CONNECTION MODULE
   MetaMask + Mindchain (Chain ID: 9996)
   Auto-add network, auto-reconnect, wallet bar UI
   ═══════════════════════════════════════════════════════ */

'use strict';

let provider    = null;
let signer      = null;
let userAccount = null;

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

