# Eternox ($NOX) — Mindchain DEX Token

> Earn from every trade. $NOX turns Mindchain volume into your yield.

[![Mindchain](https://img.shields.io/badge/Mindchain-Chain%209996-teal)](https://v2.mindchain.info)
[![Standard](https://img.shields.io/badge/Standard-MIND20-blue)](https://mainnet.mindscan.info)
[![Twitter](https://img.shields.io/twitter/follow/EterNox01?style=social)](https://twitter.com/EterNox01)
[![Telegram](https://img.shields.io/badge/Telegram-Join-blue)](https://t.me/eternox1)

---

## Token Details

| Property | Value |
|---|---|
| Name | Eternox |
| Symbol | $NOX |
| Total Supply | 1,000,000,000 |
| Standard | MIND20 |
| Chain | Mindchain (Chain ID: 9996) |
| Price | $0.0213 |
| DEX | MindchainSwap (v2.mindchain.info) |
| Explorer | mainnet.mindscan.info |

---

## Project Structure

```
eternox/
├── index.html              ← Main website (open this in browser)
├── assets/
│   ├── css/
│   │   ├── style.css       ← Main styles + variables
│   │   ├── responsive.css  ← Mobile/tablet breakpoints
│   │   └── animations.css  ← Keyframes + animated elements
│   ├── js/
│   │   ├── utils.js        ← Shared helpers (formatters, validators)
│   │   ├── token.js        ← Live stats + ticker (MindScan API)
│   │   ├── wallet.js       ← MetaMask + Mindchain connection
│   │   ├── swap.js         ← Swap modal (MIND → $NOX)
│   │   └── app.js          ← Airdrop, mobile menu, main init
│   └── images/
│       └── nox-logo.png    ← $NOX token logo
├── config/
│   ├── token.config.js     ← ⚠️ UPDATE: contract address here
│   └── network.config.js   ← Mindchain RPC, Chain ID, prices
├── contracts/
│   ├── NOX.sol             ← Solidity smart contract
│   └── abi/NOX.json        ← ABI for frontend integration
└── docs/
    ├── whitepaper/         ← Add whitepaper PDF here
    ├── tokenomics/         ← Tokenomics charts/data
    └── legal/              ← Terms, privacy policy
```

---

## Quick Start

### 1. Open the website locally
```bash
# Just open index.html in any browser — no server needed
open index.html
# or double-click index.html in file explorer
```

### 2. Deploy to Netlify (free)
```bash
# Drag the entire eternox/ folder to netlify.com/drop
# Your site is live in 30 seconds
```

### 3. After deploying your $NOX contract
```javascript
// Edit config/token.config.js
contractAddress: 'YOUR_NOX_CONTRACT_ADDRESS', // ← Replace this
```

---

## Deploy the Smart Contract

### Using Remix IDE (easiest)
1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Upload `contracts/NOX.sol`
3. Add Mindchain to MetaMask:
   - **RPC:** `https://rpc-msc.mindchain.info`
   - **Chain ID:** `9996`
   - **Symbol:** `MIND`
   - **Explorer:** `https://mainnet.mindscan.info`
4. Select **Injected Provider - MetaMask**
5. Deploy `EternoxToken` contract
6. Copy the deployed address → paste into `config/token.config.js`

### After deployment
- Verify contract on [mainnet.mindscan.info](https://mainnet.mindscan.info)
- Add liquidity on [MindchainSwap](https://v2.mindchain.info)
- Lock LP tokens (recommended: 1 year minimum)
- Submit to CoinGecko + CoinMarketCap

---

## Airdrop System

Users earn **500 $NOX** by:
1. Following [@EterNox01](https://twitter.com/EterNox01) on Twitter (+250 NOX)
2. Joining [t.me/eternox1](https://t.me/eternox1) on Telegram (+250 NOX)

To view all submissions (in browser console):
```javascript
JSON.parse(localStorage.getItem('eternox_subs'))
```

---

## Community

- 🐦 Twitter: [@EterNox01](https://twitter.com/EterNox01)
- ✈️ Telegram: [t.me/eternox1](https://t.me/eternox1)
- 🔗 DEX: [v2.mindchain.info](https://v2.mindchain.info)
- 📊 Explorer: [mainnet.mindscan.info](https://mainnet.mindscan.info)

---

## ⚠️ Disclaimer

$NOX is a utility token. Nothing in this repository constitutes financial or investment advice. Cryptocurrency investments carry significant risk. Always do your own research before investing.

---

*Built on Mindchain · 2025 Eternox*
