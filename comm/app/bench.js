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
const fs = __importStar(require("fs"));
const provider = anchor.Provider.env();
anchor.setProvider(provider);
const sensorAccount = anchor.web3.Keypair.fromSecretKey(Buffer.from(JSON.parse(fs.readFileSync('../wallets/sensor-keypair.json', {
    encoding: "utf-8",
}))));
const program = anchor.workspace.Comm;
const dataAccount = fs.readFileSync('../wallets/data-acc.txt').toString();
function setUpper(value) {
    return __awaiter(this, void 0, void 0, function* () {
        yield program.rpc.setUpperBound(value, { accounts: { dataAccount, adminAuth: provider.wallet.publicKey } });
        let stateData = yield program.account.stateData.fetch(dataAccount);
        console.log('new upper is:', stateData.upperBound.toString());
    });
}
function setLower(value) {
    return __awaiter(this, void 0, void 0, function* () {
        yield program.rpc.setLowerBound(value, { accounts: { dataAccount, adminAuth: provider.wallet.publicKey } });
        let stateData = yield program.account.stateData.fetch(dataAccount);
        console.log('new lower is:', stateData.lowerBound.toString());
    });
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield program.rpc.evaluate([0, 0, 0, 0, 0, 0, 0, 0, 0, 0], { accounts: { dataAccount, sensorAuth: sensorAccount.publicKey }, signers: [sensorAccount] });
        let t1, t2;
        let listener;
        listener = program.addEventListener("StateChanged", (_event, _slot) => {
            t2 = Date.now();
            console.log("received event after: ", (t2 - t1).toString(), "ms");
        });
        yield program.rpc.evaluate([0, 0, 0, 0, 0, 0, 0, 0, 0, 0], { accounts: { dataAccount, sensorAuth: sensorAccount.publicKey }, signers: [sensorAccount] });
        sleep(200);
        t1 = Date.now();
        // trigger event!
        yield program.rpc.evaluate([101, 0, 0, 0, 0, 0, 0, 0, 0, 0], { accounts: { dataAccount, sensorAuth: sensorAccount.publicKey }, signers: [sensorAccount] });
        console.log("triggered!");
        sleep(100).then(() => program.removeEventListener(listener));
    });
}
// reset to state 0
setUpper(100);
setLower(-100);
main().then(() => console.log("done"));
