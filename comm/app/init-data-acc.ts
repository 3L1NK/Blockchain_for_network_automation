import * as anchor from '@project-serum/anchor';
import { Comm } from '../target/types/comm';
import * as fs from 'fs';

// #region main
const provider = anchor.Provider.env();
// Configure the client to use the local cluster.
anchor.setProvider(provider);
const program = anchor.workspace.Comm as anchor.Program<Comm>;
const sensorAccount = anchor.web3.Keypair.fromSecretKey(
  Buffer.from(
    JSON.parse(
      fs.readFileSync('../wallets/sensor-keypair.json', {
        encoding: "utf-8",
      })
    )
  )
);
const dataAccount = anchor.web3.Keypair.generate();
fs.writeFileSync('../wallets/data-acc.txt', dataAccount.publicKey.toBase58());

async function main() {
  const tx = await program.rpc.initialize(
  sensorAccount.publicKey,
  100,
  -100,
  {
      accounts: {
      dataAccount: dataAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [dataAccount],
  });
  return tx;
}
const tx = main().then(() => console.log("Your transaction signature", tx));
console.log("saved data account", dataAccount.publicKey, "to '../wallets/data-acc.txt");