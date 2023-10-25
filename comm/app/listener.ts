import * as anchor from '@project-serum/anchor';
import { Comm } from '../target/types/comm';
import * as fs from 'fs';

const provider = anchor.Provider.env();
anchor.setProvider(provider);
const program = anchor.workspace.Comm as anchor.Program<Comm>;
const dataAccount = fs.readFileSync("../wallets/data-acc.txt").toString();

program.addEventListener("StateChanged", (event, _slot) => {
    if (event.dataAccount == dataAccount) {
        console.log("State: ",event.state);
    }
});
