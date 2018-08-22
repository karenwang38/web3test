const Web3 = require('web3');

/*
* connect to ethereum node
*/ 
const ethereumUri = 'http://localhost:8545';

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(ethereumUri));

if(!web3.isConnected()){
    throw new Error('unable to connect to ethereum node at ' + ethereumUri);
}else{
    console.log('connected to ehterum node at ' + ethereumUri);
    let coinbase = web3.eth.coinbase;
    console.log('coinbase:' + coinbase);
    let balance = web3.eth.getBalance(coinbase);
    console.log('balance:' + web3.fromWei(balance, 'ether') + " ETH");
    let accounts = web3.eth.accounts;
    console.log(accounts);
}

// 合约ABI
var abi = [	{		"constant":false,		"inputs":[			{				"name":"addr",				"type":"address"			}		],		"name":"getBalance",		"outputs":[			{				"name":"",				"type":"uint256"			}		],		"payable":false,		"stateMutability":"nonpayable",		"type":"function"	},	{		"constant":false,		"inputs":[			{				"name":"receiver",				"type":"address"			},			{				"name":"amount",				"type":"uint256"			}		],		"name":"sendCoin",		"outputs":[			{				"name":"sufficient",				"type":"bool"			}		],		"payable":false,		"stateMutability":"nonpayable",		"type":"function"	},	{		"anonymous":false,		"inputs":[			{				"indexed":true,				"name":"_from",				"type":"address"			},			{				"indexed":true,				"name":"_to",				"type":"address"			},			{				"indexed":false,				"name":"_value",				"type":"uint256"			}		],		"name":"Transfer",		"type":"event"	},	{		"inputs":[],		"payable":false,		"stateMutability":"nonpayable",		"type":"constructor"	}];

// 合约地址
var address ="0x5b6b01f7e36423c2367014176d29f7c328d92d0d";
var metacoin = web3.eth.contract(abi).at(address);


/*
watch中的回调函数如果被执行，说明事件已被触发，也就是说某笔交易已经处理完，检查交易hash是否一致，可以判定产生这个事件的交易是否是自己发送的交易，如果是，就可以进行其他操作，比如查询最新的余额。
*/

var account_one = web3.eth.accounts[0];
var account_two = web3.eth.accounts[1];

var account_one_balance = metacoin.getBalance.call(account_one);
console.log("account one balance:", account_one_balance.toNumber());

var txhash = metacoin.sendCoin.sendTransaction(account_two, 100, { from: account_one });

var myEvent = metacoin.Transfer();
myEvent.watch(function (err, result) {
    if (!err) {
        if (result.transactionHash == txhash) {
            var account_one_balance = metacoin.getBalance.call(account_one);
            console.log("account one balance after sendCoin:", account_one_balance.toNumber());
        }
    } else {
        console.log(err);
    }
    myEvent.stopWatching();
});











