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


//调用合约函数
var account_one = web3.eth.accounts[0];
var account_one_balance = metacoin.getBalance.call(account_one);
console.log("account one balance: ", account_one_balance.toNumber());


var account_two = web3.eth.accounts[1];
// 提交交易到区块链，会立即返回交易hash，但是交易要等到被矿工收录到区块中后才生效
var txhash = metacoin.sendCoin.sendTransaction(account_two, 100, {from:account_one});
console.log(txhash);

/*
在sendCoin函数后加上.sendTransaction()指明要向区块链发送交易
合约代码中sendCoin函数只有两个参数，而在web3中通过.sendTransaction()调用合约函数的时候需要增加最后一个参数，它是一个javascript对象，里面可以指定from/value/gas等属性，上面的例子用from来指定交易的发送者
上面的调用语句执行后，会向区块链提交一笔交易，这笔交易的发送者是account_one，接收者是metacoin的地址，交易的作用是以account_two和100作为参数执行合约的sendCoin函数
函数会立即返回交易的hash，表明交易已经提交到区块链，但是并不知道交易何时处理完成，交易要等到被旷工收录到区块中后才会生效
*/

// 获取事件对象
var myEvent = metacoin.Transfer();
// 监听事件，监听到事件后会执行回调函数
myEvent.watch(function(err, result) {
    if (!err) {
        console.log(result);
    } else {
        console.log(err);
    }
    myEvent.stopWatching();
});













