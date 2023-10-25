import * as anchor from '@project-serum/anchor';
import { Comm } from '../target/types/comm';
import * as fs from 'fs';

const provider = anchor.Provider.env();
anchor.setProvider(provider);
const program = anchor.workspace.Comm as anchor.Program<Comm>;
const dataAccount = fs.readFileSync('../wallets/data-acc.txt').toString();

async function setUpper(value: number) {
    await program.rpc.setUpperBound(value, {accounts: {dataAccount: dataAccount, adminAuth: provider.wallet.publicKey}});

    let stateData = await program.account.stateData.fetch(dataAccount);
    console.log('new upper is:', stateData.upperBound.toString());
}
async function setLower(value: number) {
    await program.rpc.setLowerBound(value, {accounts: {dataAccount: dataAccount, adminAuth: provider.wallet.publicKey}});

    let stateData = await program.account.stateData.fetch(dataAccount);
    console.log('new lower is:', stateData.lowerBound.toString());
}

if (process.argv.length != 4) {
    console.log("usage: node set-bounds.js [option] [value]");
    console.log("option: u (for upper bound); l (for lower bound)"); 
}
switch (process.argv[2]) {
    case 'u':
        setUpper(parseInt(process.argv[3])).then(() => console.log("done."))
        break;
    case 'l':
        setLower(parseInt(process.argv[3])).then(() => console.log("done."))
        break;
    default:
        console.log("something went wrong!");
        console.log("usage: node set-bounds.js [option] [value]");
        console.log("option: u (for upper bound); l (for lower bound)"); 
}