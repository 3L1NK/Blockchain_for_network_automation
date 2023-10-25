import * as anchor from '@project-serum/anchor';
import { Comm } from '../target/types/comm';
import * as fs from 'fs';

const provider = anchor.Provider.env();
anchor.setProvider(provider);
const sensorAccount = anchor.web3.Keypair.fromSecretKey(
    Buffer.from(
      JSON.parse(
        fs.readFileSync('../wallets/sensor-keypair.json', {
          encoding: "utf-8",
        })
      )
    )
);
const program = anchor.workspace.Comm as anchor.Program<Comm>;
const dataAccount = fs.readFileSync('../wallets/data-acc.txt').toString();

async function setUpper(value: number) {
    await program.rpc.setUpperBound(value, {accounts: {dataAccount, adminAuth: provider.wallet.publicKey}});

    let stateData = await program.account.stateData.fetch(dataAccount);
    console.log('new upper is:', stateData.upperBound.toString());
}
async function setLower(value: number) {
    await program.rpc.setLowerBound(value, {accounts: {dataAccount, adminAuth: provider.wallet.publicKey}});

    let stateData = await program.account.stateData.fetch(dataAccount);
    console.log('new lower is:', stateData.lowerBound.toString());
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function main() {
  await program.rpc.evaluate([0,0,0,0,0,0,0,0,0,0], {accounts: {dataAccount, sensorAuth: sensorAccount.publicKey}, signers: [sensorAccount]});
  let t1: number, t2: number;
  let listener;

  listener = program.addEventListener("StateChanged", (_event, _slot) => {
    t2 = Date.now();
    console.log("received event after: ", (t2 - t1).toString(), "ms");
  });
  await program.rpc.evaluate([0,0,0,0,0,0,0,0,0,0], {accounts: {dataAccount, sensorAuth: sensorAccount.publicKey}, signers: [sensorAccount]});

  sleep(200);
  t1 = Date.now();
  // trigger event!
  await program.rpc.evaluate([101,0,0,0,0,0,0,0,0,0], {accounts: {dataAccount, sensorAuth: sensorAccount.publicKey}, signers: [sensorAccount]});
  console.log("triggered!");
  sleep(100).then(() => program.removeEventListener(listener));
}
// reset to state 0
setUpper(100);
setLower(-100);
main().then(() => console.log("done"));

