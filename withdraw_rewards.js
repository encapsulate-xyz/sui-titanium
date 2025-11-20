import TransportNodeHidModule from '@ledgerhq/hw-transport-node-hid';
import SuiLedgerClient from '@mysten/ledgerjs-hw-app-sui';
import {LedgerSigner} from '@mysten/signers/ledger';
import {getFullnodeUrl, SuiClient} from '@mysten/sui/client';
import {Transaction} from '@mysten/sui/transactions';

const TransportNodeHid = TransportNodeHidModule.default ?? TransportNodeHidModule;
const transport = await TransportNodeHid.open(undefined);
const ledgerClient = new SuiLedgerClient(transport);
const suiClient = new SuiClient({url: getFullnodeUrl('mainnet')});
import 'dotenv/config';


const VALIDATOR_ADDRESS = process.env.VALIDATOR_ADDRESS;
const DERIVATION_PATH = process.env.DERIVATION_PATH;

const signer = await LedgerSigner.fromDerivationPath(DERIVATION_PATH, ledgerClient, suiClient,);

// Log the IOTA address:
console.log(signer.toSuiAddress());

export async function withdraw_rewards() {


    // 1. Get all staked iota ids
    const ids = (await suiClient.getStakes({
        owner: VALIDATOR_ADDRESS,
    })).flatMap(x => (x.stakes ?? []).map(s => s.stakedSuiId));
    console.table(ids)


    const unStakeTx = new Transaction();
    unStakeTx.setSender(VALIDATOR_ADDRESS);

    // 2. Build the unStake transaction using all the staked ids
    for (const id of ids) {
        unStakeTx.moveCall({
            target: '0x3::sui_system::request_withdraw_stake',
            arguments: [unStakeTx.object.system(), unStakeTx.object(id)],
        });
    }

    const unStakeTxBytes = await unStakeTx.build({client: suiClient});
    console.log("bytes", unStakeTxBytes)


    // 3. Sign Using Ledger
    console.log('Open your Ledger, unlock it, and open the SUI app to sign the transaction.....');
    const {signature} = await signer.signTransaction(unStakeTxBytes);
    console.log("UnStakeSignature", signature)


    // 4. Execute the transaction
    const unStakeTxResult = await suiClient.executeTransactionBlock({
        transactionBlock: unStakeTxBytes,
        signature: signature,
        requestType: 'WaitForLocalExecution',
        options: {showEffects: true},
    });
    console.log(`UnStakeTxResult Transaction → ${unStakeTxResult.digest}`);
}

await withdraw_rewards();
