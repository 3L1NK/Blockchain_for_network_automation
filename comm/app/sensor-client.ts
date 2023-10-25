import { decode } from 'msgpack-lite';
import * as anchor from '@project-serum/anchor';
import { Comm } from '../target/types/comm';
import * as fs from 'fs';

const provider = anchor.Provider.env();
anchor.setProvider(provider);
const program = anchor.workspace.Comm as anchor.Program<Comm>;
const dataAccount = fs.readFileSync('../wallets/data-acc.txt').toString();

async function main() {
  //const d = new Decoder();
  process.stdin.on('readable', () => {
    let chunk;
    let chunks = [];
    while (null !== (chunk = process.stdin.read())) {
      chunks.push(chunk);
    }
    const msg = Buffer.concat(chunks);
    const data = decode(msg);
    program.rpc.evaluate(data, {accounts: {dataAccount, sensorAuth: provider.wallet.publicKey}});
    console.log(data);
  });
  
  process.stdin.on('end', () => {
    console.log('stream was closed');
  });
}
console.log("start sending sensor data!");
main().then(() => console.log("Success"));