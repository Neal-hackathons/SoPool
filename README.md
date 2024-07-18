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

Lottery: ...TO BE UPDATED...

Staking: ...TO BE UPDATED...

SoPool: ...TO BE UPDATED...

#### Commands to deploy to devnet

Update programs' addresses

```shell
anchor keys sync
```

build 

```shell
# ./.
anchor build
```

deploy

```shell
# ./.
anchor deploy --provider.cluster devnet --provider.wallet ./common_wallet.json
```

### Main net

Update programs' addresses

```shell
anchor keys sync
```


build 

```shell
# ./.
anchor build
```

deploy

```shell
# ./.
anchor deploy --provider.cluster mainnet --provider.wallet ./common_wallet.json
```