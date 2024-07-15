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

command to deploy to devnet

build 
```shell
# ./programs/<program> 
anchor build
```

```shell
# ./programs/<program>
anchor deploy
```

### Main net

...TODO...