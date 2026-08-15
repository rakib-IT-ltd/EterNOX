/* ═══════════════════════════════════════════════════════
   ETERNOX — NETWORK CONFIGURATION
   Mindchain (Mind Smart Chain) — Chain ID 9996
   ═══════════════════════════════════════════════════════ */

const NETWORK_CONFIG = {
  chainId:     9996,
  chainIdHex:  '0x270C',
  chainName:   'Mind Smart Chain',
  rpcUrls:     [
    'https://rpc-msc.mindchain.info',
    'https://seednode.mindchain.info',
  ],
  nativeCurrency: {
    name:     'MIND',
    symbol:   'MIND',
    decimals: 18,
  },
  blockExplorerUrls: ['https://mainnet.mindscan.info'],
  mindscanApi:       'https://mainnet.mindscan.info',
  dexUrl:            'https://v2.mindchain.info/',
};

// Rates (update with live oracle later)
const PRICE_CONFIG = {
  noxPriceUsd:  0.0213,
  mindPriceUsd: 0.05,
  get noxPerMind() { return this.mindPriceUsd / this.noxPriceUsd; },
  get mindPerNox() { return this.noxPriceUsd / this.mindPriceUsd; },
};

if (typeof module !== 'undefined') {
  module.exports = { NETWORK_CONFIG, PRICE_CONFIG };
}
