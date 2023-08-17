# Getting Started

## Guide For Development

- Compile
- Test: unit test & coverage test
- Deploy test: localhost node & simulation
- Script: script for complex tasks
- Library: reusable codes for 3rd party
- Deploy: deploy contracts on-chain
- Publish: publish library and deployments

### Compile

All contracts in [contracts/](contracts/) directory are compiled.

```bash
forge build
# or
npx hardhat compile
```

### Test

#### Unit Test

Files in [test/](test/) directory are run.

```bash
npx hardhat test
```

#### Coverage Test

Coverage test is to figure out the coverage of the unit test.

```bash
npx hardhat coverage
```

### Deploy test

#### Spawning a localhost Node

To spawn a localhost network with ethereum node:

```bash
anvil
# or
npx hardhat node
```

To spawn a localhost network with klaytn node:

```bash
npx hardhat klaytn-node
```

#### Deployment on localhost

To run deploy scripts on the localhost network:

```bash
npx hardhat deploy --network localhost
```

[hardhat-utils](https://github.com/klaytn/hardhat-utils) plugin imports symbols from hardhat artifacts for `call` and `send` commands. Check the number variable with:

```bash
npx hardhat call Counter number --network localhost
```

### Deployment

You need to create a network label for each deployment purpose.
For example, if we need one for QA on Baobab, append to networks in `hardhat.config.ts`:

```typescript
const config: HardhatUserConfig = {
  // ...
  networks: {
    baobab: {
      /* ... */
    },
    cypress: {
      /* ... */
    },
    "baobab-qa": {
      url: process.env.BAOBAB_URL || "https://archive-en.baobab.klaytn.net",
      accounts: [process.env.PRIVATE_KEY as string],
      live: false,
      saveDeployments: true,
    },
  },
  // ...
};
```

To deploy:

```bash
export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
npx hardhat deploy --network baobab-qa
```

### Verification

Upload the following file to [scope](https://scope.klaytn.com/) or [finder](https://www.klaytnfinder.io/):

```bash
npx hardhat smart-flatten Poll
```

then submit the `artifacts/Poll.flat.sol` file.

