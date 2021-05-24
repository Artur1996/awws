const { setPlayerData, setTagData, getPlayerData, setLand, getLand, getLandById, getPlanets, setBag, getBag, getLandMiningParams, getBagMiningParams, getNextMineDelay, doWork, lastMineTx, doWorkWorker, setLandCommission, claim, getBountyFromTx } = require("./mine.js");
const {
    getMap,
    getBalance,
    stake,
    unstake,
    getStaked,
    getUnstakes,
    refund,
    subscribe,
    getAssets,
    agreeTerms,
    agreedTermsVersion,
} = require("./federation.js");


import { federation_account, mining_account, token_account, collection, atomic_endpoint, aa_api, eos_rpc } from "./constants";
import * as waxjs from "@waxio/waxjs/dist";

window.setPlayerData = setPlayerData;
window.setTagData = setTagData;
window.getPlayerData = getPlayerData;
window.setLand = setLand;
window.getLand = getLand;
window.getLandById = getLandById;
window.getPlanets = getPlanets;
window.setBag = setBag;
window.getBag = getBag;
window.getLandMiningParams = getLandMiningParams;
window.getBagMiningParams = getBagMiningParams;
window.getNextMineDelay = getNextMineDelay;
window.doWork = doWork;
window.lastMineTx = lastMineTx;
window.doWorkWorker = doWorkWorker;
window.setLandCommission = setLandCommission;
window.claim = claim;
window.getBountyFromTx = getBountyFromTx;

window.getMap = getMap;
window.getBalance = getBalance;
window.stake = stake;
window.unstake = unstake;
window.getStaked = getStaked;
window.getUnstakes = getUnstakes;
window.refund = refund;
window.subscribe = subscribe;
window.getAssets = getAssets;
window.agreeTerms = agreeTerms;
window.agreedTermsVersion = agreedTermsVersion;

window.federation_account = federation_account;
window.mining_account = mining_account;
window.token_account = token_account;
window.collection = collection;
window.atomic_endpoint = atomic_endpoint;
window.aa_api = aa_api;
window.eos_rpc = eos_rpc;

// Temporary data
// Will be replaced by waxapi later
import { Api } from "eosjs";
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { TextDecoder, TextEncoder } from "text-encoding";

const privatekey = '5KJEamqm4QT2bmDwQEmRAB3EzCrCmoBoX7f6MRdrhGjGgHhzUyf';
const signatureProvider = new JsSignatureProvider([privatekey]);
window.eos_api = new Api({
    rpc: eos_rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder(),
});

window.wax = new waxjs.WaxJS('https://wax.greymass.com');
//automatically check for credentials
autoLogin();
//checks if autologin is available 
async function autoLogin() {
    let isAutoLoginAvailable = await wax.isAutoLoginAvailable();
    if (isAutoLoginAvailable) {
        let userAccount = wax.userAccount;
        let pubKeys = wax.pubKeys;
        let str = 'AutoLogin enabled for account: ' + userAccount
        // + '<br/>Active: ' + pubKeys[0] + '<br/>Owner: ' + pubKeys[1]
        document.getElementById('autologin').insertAdjacentHTML('beforeend', str);
    }
    else {
        document.getElementById('autologin').insertAdjacentHTML('beforeend', 'Not auto-logged in');
    }
}

//normal login. Triggers a popup for non-whitelisted dapps
window.login = async function () {
    try {
        //if autologged in, this simply returns the userAccount w/no popup
        let userAccount = await wax.login();
        let pubKeys = wax.pubKeys;
        let str = 'Account: ' + userAccount + '<br/>Active: ' + pubKeys[0] + '<br/>Owner: ' + pubKeys[1]
        document.getElementById('loginresponse').insertAdjacentHTML('beforeend', str);
    } catch (e) {
        document.getElementById('loginresponse').append(e.message);
    }
}

async function sign() {
    if (!wax.api) {
        return document.getElementById('response').append('* Login first *');
    }

    try {
        const result = await wax.api.transact({
            actions: [{
                account: 'eosio',
                name: 'delegatebw',
                authorization: [{
                    actor: wax.userAccount,
                    permission: 'active',
                }],
                data: {
                    from: wax.userAccount,
                    receiver: wax.userAccount,
                    stake_net_quantity: '0.00000001 WAX',
                    stake_cpu_quantity: '0.00000000 WAX',
                    transfer: false,
                    memo: 'This is a WaxJS/Cloud Wallet Demo.'
                },
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30
        });
        document.getElementById('response').append(JSON.stringify(result, null, 2))
    } catch (e) {
        document.getElementById('response').append(e.message);
    }
}
