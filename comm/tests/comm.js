"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const anchor = __importStar(require("@project-serum/anchor"));
describe('comm', () => {
    const provider = anchor.Provider.env();
    // Configure the client to use the local cluster.
    anchor.setProvider(provider);
    const program = anchor.workspace.Comm;
    const dataAccount = anchor.web3.Keypair.generate();
    const sensorAccount = anchor.web3.Keypair.generate();
    it('Is initialized!', () => __awaiter(void 0, void 0, void 0, function* () {
        // Add your test here.
        const tx = yield program.rpc.initialize(sensorAccount.publicKey, 100, -100, {
            accounts: {
                dataAccount: dataAccount.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [dataAccount],
        });
        console.log("Your transaction signature", tx);
        console.log("created data account", dataAccount.publicKey);
        const account = yield program.account.stateData.fetch(dataAccount.publicKey);
        console.log('State is', account.state.toString());
    }));
    it('Evaluate!', () => __awaiter(void 0, void 0, void 0, function* () {
        yield program.rpc.evaluate([-12.1, 30.0, 89.2, 23.6, 0.3, -26.7, -67.9, -13.2, 5.1, 100.3], {
            accounts: { dataAccount: dataAccount.publicKey, sensorAuth: sensorAccount.publicKey },
            signers: [sensorAccount]
        });
        let account = yield program.account.stateData.fetch(dataAccount.publicKey);
        console.log('State is', account.state.toString());
        yield program.rpc.evaluate([-12, 30, 89, 23, 0, -26, -67, -13, 5, 14], {
            accounts: { dataAccount: dataAccount.publicKey, sensorAuth: sensorAccount.publicKey },
            signers: [sensorAccount]
        });
        account = yield program.account.stateData.fetch(dataAccount.publicKey);
        console.log('State is', account.state.toString());
    }));
    it('Set upper and lower bounds!', () => __awaiter(void 0, void 0, void 0, function* () {
        let account = yield program.account.stateData.fetch(dataAccount.publicKey);
        console.log('Upper is', account.upperBound.toString());
        console.log('Lower is', account.lowerBound.toString());
        yield program.rpc.setUpperBound(150.67, { accounts: { dataAccount: dataAccount.publicKey, adminAuth: provider.wallet.publicKey } });
        yield program.rpc.setLowerBound(-180, { accounts: { dataAccount: dataAccount.publicKey, adminAuth: provider.wallet.publicKey } });
        account = yield program.account.stateData.fetch(dataAccount.publicKey);
        console.log('Upper is', account.upperBound.toString());
        console.log('Lower is', account.lowerBound.toString());
    }));
    it('Listen to event', () => __awaiter(void 0, void 0, void 0, function* () {
        let listener = null;
        program.rpc.evaluate([-12, 30, 189, 23, 0, -26, -67, -13, 5, 14], {
            accounts: { dataAccount: dataAccount.publicKey, sensorAuth: sensorAccount.publicKey },
            signers: [sensorAccount]
        });
        let [event, _slot] = yield new Promise((resolve, _reject) => {
            listener = program.addEventListener("StateChanged", (event, _slot) => {
                resolve([event, _slot]);
            });
            program.rpc.evaluate([-12, 30, -179, 23, 0, -26, -67, -13, 5, 14], {
                accounts: { dataAccount: dataAccount.publicKey, sensorAuth: sensorAccount.publicKey },
                signers: [sensorAccount]
            });
        });
        yield program.removeEventListener(listener);
        console.log(event);
    }));
    it('No authority', () => __awaiter(void 0, void 0, void 0, function* () {
        const acc_new = anchor.web3.Keypair.generate();
        program.rpc.evaluate([-12, 30, -189, 23, 0, -26, -67, -13, 5, 14], { accounts: { dataAccount: dataAccount.publicKey, sensorAuth: sensorAccount.publicKey } });
        let account = yield program.account.stateData.fetch(dataAccount.publicKey);
        console.log('State is', account.state.toString());
    }));
});
