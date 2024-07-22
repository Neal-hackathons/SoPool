# SoPool

# Presentation

Names:

- Francis

- François Beillouin

- ...

Project's resume : ...

Deployed project: https://sopool.vercel.app/

Stack: NextJS, Anchor

frontend: ./frontend/alyra_solana_project

programs: ./programs

tests: ./tests

#### Solana Explorer links

Lottery: https://solscan.io/account/13r5dniDEeMszUj4kMyQHcpQEKQmvDWYwjevdkB4Ta9?cluster=devnet

Staking: https://solscan.io/account/3K44q3YYWGyeXsW3sh5zM1QkfDNiPjuSKPJko5v28WPo?cluster=devnet


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
# new shell session: test_validator_session
# ~
solana-test-validator
```

```shell
# ./.
solana airdrop -k ./common_wallet.json 100
```


```shell
# shell session: test_validator_session
# ~
exit
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

Lottery: 13r5dniDEeMszUj4kMyQHcpQEKQmvDWYwjevdkB4Ta9

Staking: 3K44q3YYWGyeXsW3sh5zM1QkfDNiPjuSKPJko5v28WPo

#### Commands to deploy to devnet


```shell
# ./.
solana config set --url devnet
```

Update programs' addresses

```shell
# ./.
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

### Upgrade program

```shell
# ./.
anchor upgrade target/deploy/lottery.so --provider.cluster devnet --program-id 13r5dniDEeMszUj4kMyQHcpQEKQmvDWYwjevdkB4Ta9
```

### Extend storage

```shell
# ./.
solana program extend 13r5dniDEeMszUj4kMyQHcpQEKQmvDWYwjevdkB4Ta9 50000
```

### Main net

Update programs' addresses

```shell
# ./.
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