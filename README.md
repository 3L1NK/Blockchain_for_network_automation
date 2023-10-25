# Blockchain for Networked Automation 

[AUT-PJ Gruppe 12] Blockchain für vernetzte Automatisierungstechnik

## Dependencies
- [Rust](https://www.rust-lang.org/tools/install) 
  - Mac, Linux installation: `$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh`
- [Solana](https://docs.solana.com/cli/install-solana-cli-tools)
  - Mac, Linux installation: `$ sh -c "$(curl -sSfL https://release.solana.com/latest/install)"`)
- [Node.js](https://nodejs.org/en/)
- [Anchor](https://project-serum.github.io/anchor/getting-started/introduction.html)
  1. prebuild (only Linux): `$ npm i -g @project-serum/anchor-cli`
  1. build from source: `cargo install --git https://github.com/project-serum/anchor --tag v0.20.1 anchor-cli --locked`

## Deploy
- run `anchor deploy` from the `comm` directory to deploy to devnet. Alternativly use the Solana CLI:
  - `solana config set --keypair wallets/admin-keypair.json`
  - `solana config set --url devnet`
  - `solana program deploy --program-id target/deploy/comm-keypair.json target/deploy/comm.so`
- the sensor wallet must have some funding to work: `solana airdrop 2` will give us 2 SOL to work with. This is the limit for devnet and you may need to execute it several times to get enough funding for deployment.
## Run
clients need environment variables to run:
- `export ANCHOR_WALLET="../wallets/admin-keypair.json"` (assumes you run client from inside the `comm/app` directory)
- `export ANCHOR_PROVIDER_URL="https://api.devnet.solana.com"`
- for `sensor-client.js` we need instead the sensor keypair: `export ANCHOR_WALLET="../wallets/sensor-keypair.json"`
- `fake_sensor.py` and `sensor-client.js` use msgpack to exchange data: `pip install msgpack` for python and `npm i --save msgpack-lite` for nodejs.
- to run them together (from `comm/app` directory) use: `python3 ../../python/fake_sensor.py | node sensor-client.js`
