/* ═══════════════════════════════════════════════════════
   ETERNOX — TOKEN CONFIGURATION
   Update CONTRACT_ADDRESS after deployment on Mindchain
   ═══════════════════════════════════════════════════════ */

const TOKEN_CONFIG = {
  name:            'Eternox',
  symbol:          '$NOX',
  contractAddress: '0x9A7ea4c9B7B0b628241F08ECC290b4C17F5f6955',
  decimals:        18,
  totalSupply:     1_000_000_000,
  price:           0.0213,
  standard:        'MIND20',
  twitter:         'https://x.com/EterNox01',
  telegram:        'https://t.me/eternox1',
  dex:             'https://v2.mindchain.info/',
  explorer:        'https://mainnet.mindscan.info',
  airdropPool:     10_000_000,
  airdropPerTask:  250,
};

// Export for use in other modules
if (typeof module !== 'undefined') module.exports = TOKEN_CONFIG;
