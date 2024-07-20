# SoPool
# AlyraSolanaProject


## Development

### Frontend

To start development, install dependencies

```shell
# ./frontend/alyra_solana_project
pnpm install
```

fill environment variables

```shell
# ./frontend/alyra_solana_project
cp .env.example .env
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

### Tests (local)

To launch the tests locally, run:

```shell
# ./.
solana config set --url localhost
```

```shell
# ./.
solana airdrop -k ./common_wallet.json 100
```

```shell
# ./.
yarn install
```

```shell
# ./.
anchor test --provider.cluster localnet
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


```shell
solana config set --url devnet
```

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