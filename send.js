import TransportNodeHidModule from '@ledgerhq/hw-transport-node-hid';
import SuiLedgerClient from '@mysten/ledgerjs-hw-app-sui';
import {LedgerSigner} from '@mysten/signers/ledger';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';


const TransportNodeHid = TransportNodeHidModule.default ?? TransportNodeHidModule;
const transport = await TransportNodeHid.open(undefined);
const ledgerClient = new SuiLedgerClient(transport);
const suiClient = new SuiClient({url: getFullnodeUrl('mainnet')});
import 'dotenv/config';


const VALIDATOR_ADDRESS = process.env.VALIDATOR_ADDRESS;
const REWARD_ADDRESS = process.env.REWARD_ADDRESS;
const DERIVATION_PATH = process.env.DERIVATION_PATH;

const LEAVE = (1n * 10n ** 9n) / 2n; // 500_000_000n (0.5 IOTA)

const signer = await LedgerSigner.fromDerivationPath(DERIVATION_PATH, ledgerClient, suiClient,);
// Log the SUI address:
console.log(signer.toSuiAddress());

export async function send() {
    // 1. Display all the coins
    const coins = await suiClient.getCoins({
        owner: VALIDATOR_ADDRESS,
    });
    const coinIds = (coins.data ?? coins).map(c => c.coinObjectId);

    // 2. Build Transaction Leave 0.5 Sui and send the rest
    console.table(coinIds)
    const sendTx = new Transaction();
    sendTx.setSender(VALIDATOR_ADDRESS);

    const [keep] = sendTx.splitCoins(sendTx.gas, [LEAVE]);
    sendTx.transferObjects([keep], VALIDATOR_ADDRESS);
    sendTx.transferObjects([sendTx.gas], REWARD_ADDRESS);


    const sendTxBytes = await sendTx.build({client: suiClient});
    console.log("bytes", sendTxBytes)

    // 3. Sign Using Ledger
    console.log('Open your Ledger, unlock it, and open the SUI app to sign the transaction.....');
    const {signature} = await signer.signTransaction(sendTxBytes);
    console.log("sendSignature", signature)

    // 4. Execute the transaction
    const sendResult = await suiClient.executeTransactionBlock({
        transactionBlock: sendTxBytes,
        signature: signature,
        requestType: 'WaitForLocalExecution',
        options: {showEffects: true},
    });
    console.log(`Send Transaction → ${sendResult.digest}`);
}

await send();