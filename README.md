# SoPool
# AlyraSolanaProject


## Development

### Frontend

To start development, install dependencies

```shell
# ./frontend/alyra_solana_project
pnpm install
```

launch development server, the hot reload is automatic

```shell
# ./frontend/alyra_solana_project
pnpm run dev
```

### Build frontend

```shell
# ./frontend/alyra_solana_project
pnpm run build
```

### Tests

To launch the tests, run:

```shell
# ./.
anchor test
```


## Deploy frontend to production

Just push to main or merge pull request into main, if code can build without errors then Vercel deploys it

## Deploy Smart Contracts to production

### Devnet


#### Devnet smart contracts addresses

Lottery: D7ZJp9xHNS9RbaFuyWTiEXB1Ee4L4k4qtYoU9TDg1KUe
Staking: FEYNE1BSyocAfn58PRb1jhQ3NKbm76osSyc9iJDTMDhj
SoPool: 3attdVJrdoB1J82iRdp3Gpo8KmKUK4R4SB5fzKRLFNpH

#### Commands to deploy to devnet

build 
```shell
# ./.
anchor build
```

```shell
# ./.
anchor deploy --provider.cluster devnet --provider.wallet ./common_wallet.json
```

### Main net

build 
```shell
# ./.
anchor build
```

```shell
# ./.
anchor deploy --provider.cluster mainnet --provider.wallet ./common_wallet.json
```