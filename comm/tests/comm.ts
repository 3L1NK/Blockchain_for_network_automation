import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Comm } from '../target/types/comm';

describe('comm', () => {

  const provider = anchor.Provider.env();
  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  const program = anchor.workspace.Comm as Program<Comm>;
  const dataAccount = anchor.web3.Keypair.generate();
  const sensorAccount = anchor.web3.Keypair.generate();

  it('Is initialized!', async () => {
    // Add your test here.
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
    console.log("Your transaction signature", tx);
    console.log("created data account", dataAccount.publicKey.toBase58())
    
    const account = await program.account.stateData.fetch(dataAccount.publicKey);
    console.log('State is', account.state.toString())
  });
  
  it('Evaluate!', async () => {
    await program.rpc.evaluate(
      [-12.1,30.0,89.2,23.6,0.3,-26.7,-67.9,-13.2,5.1,100.3],
      {
        accounts: {dataAccount: dataAccount.publicKey, sensorAuth: sensorAccount.publicKey},
        signers: [sensorAccount]
      }
    );
    let account = await program.account.stateData.fetch(dataAccount.publicKey);
    console.log('State is', account.state.toString());

    await program.rpc.evaluate(
      [-12,30,89,23,0,-26,-67,-13,5,14],
      {
        accounts: {dataAccount: dataAccount.publicKey, sensorAuth: sensorAccount.publicKey},
        signers: [sensorAccount]
      }
    );
    account = await program.account.stateData.fetch(dataAccount.publicKey);
    console.log('State is', account.state.toString());
  });

  it('Set upper and lower bounds!', async () => {

    let account = await program.account.stateData.fetch(dataAccount.publicKey);
    console.log('Upper is', account.upperBound.toString());
    console.log('Lower is', account.lowerBound.toString());

    await program.rpc.setUpperBound(150.67, {accounts: {dataAccount: dataAccount.publicKey, adminAuth: provider.wallet.publicKey}});
    await program.rpc.setLowerBound(-180, {accounts: {dataAccount: dataAccount.publicKey, adminAuth: provider.wallet.publicKey}});

    account = await program.account.stateData.fetch(dataAccount.publicKey);
    console.log('Upper is', account.upperBound.toString());
    console.log('Lower is', account.lowerBound.toString());
  });

  it('Listen to event', async () => {
    let listener = null;
    program.rpc.evaluate(
      [-12,30,189,23,0,-26,-67,-13,5,14],
      {
        accounts: {dataAccount: dataAccount.publicKey, sensorAuth: sensorAccount.publicKey},
        signers: [sensorAccount]
      }
    );
    let [event, _slot] = await new Promise((resolve, _reject) => {
      listener = program.addEventListener("StateChanged", (event, _slot) => {
        resolve([event, _slot]);
      });
      program.rpc.evaluate(
        [-12,30,-179,23,0,-26,-67,-13,5,14],
        {
          accounts: {dataAccount: dataAccount.publicKey, sensorAuth: sensorAccount.publicKey},
          signers: [sensorAccount]
        }
      );
    });
    await program.removeEventListener(listener);
    console.log(event);
  });

  it('No authority', async () => {
    const acc_new = anchor.web3.Keypair.generate();
    program.rpc.evaluate([-12,30,-189,23,0,-26,-67,-13,5,14], {accounts: {dataAccount: dataAccount.publicKey, sensorAuth: sensorAccount.publicKey}});
    let account = await program.account.stateData.fetch(dataAccount.publicKey);
    console.log('State is', account.state.toString());
  });
});
