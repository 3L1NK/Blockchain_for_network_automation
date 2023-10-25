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
// #region main
const provider = anchor.Provider.env();
// Configure the client to use the local cluster.
anchor.setProvider(provider);
const program = anchor.workspace.Comm;
const sensorAccount = anchor.web3.Keypair.fromSecretKey(Buffer.from(JSON.parse(fs.readFileSync('../wallets/sensor-keypair.json', {
    encoding: "utf-8",
}))));
const dataAccount = anchor.web3.Keypair.generate();
fs.writeFileSync('../wallets/data-acc.txt', dataAccount.publicKey.toBase58());
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const tx = yield program.rpc.initialize(sensorAccount.publicKey, 100, -100, {
            accounts: {
                dataAccount: dataAccount.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [dataAccount],
        });
        return tx;
    });
}
const tx = main().then(() => console.log("Your transaction signature", tx));
console.log("saved data account", dataAccount.publicKey, "to '../wallets/data-acc.txt");
