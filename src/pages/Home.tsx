import { useEffect, useState } from "react";
import { useDynamicContext } from '@dynamic-labs/sdk-react';
import functions from '../helpers/functions';

const Home = () => {
  const {
    primaryWallet
  } = useDynamicContext();

  const [walletExists, setWalletExists] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [stringToSign, setStringToSign] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [shouldRender, setShouldRender] = useState(false);

  const handleGetBalanceClick = async () => {
    let userBalance = await functions.getBalanceForUser(publicKey);
    alert("your dynamic wallet ETH balance is: " + userBalance.toString());
  };

  const handleSignMessageClick = async () => {
    let result = await functions.signMessage(privateKey, stringToSign);
    alert('signed transaction: ' + result);
  };

  const handleSendTransactionClick = async () => {
    alert(`sending ${toAddress} ${amount} ETH, wait for another popup on confirmation`);
    let transaction = await functions.sendTransaction(privateKey, toAddress, amount);
    if (transaction) alert(`Transaction successful with hash: ${transaction.hash}`);
    else alert(`error in sending, make sure you are sending to an ETH address and that your amount is below your balance`);
  };

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (primaryWallet) {
        const { exists, public_key, private_key } = await functions.checkWalletExists(primaryWallet.address || '');
        setWalletExists(exists);
        if (exists) {
          setPublicKey(public_key);
          setPrivateKey(private_key);
        }
      }
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [primaryWallet]);

  return (
    <div>
      <div className="flex justify-end items-center w-full">
        {primaryWallet && <button className="p-4 border-b rounded-lg border-black bg-gray-500 m-4" onClick={() => {
          functions.createWalletForUser(primaryWallet?.address || '');
          setShouldRender(!shouldRender); // trigger re-render
        }} >Create New Wallet</button>}
      </div>
      {walletExists && <div>
        <div>
          <p className='bg-gray-500 p-4 m-8 rounded-md'> Your Dynamic Wallet Address(Sepolia): {publicKey} </p>
        </div>
        <div>
          <button onClick={() => handleGetBalanceClick()} className='bg-gray-500 p-4 m-8 rounded-lg hover:bg-gray-300'> Check Balance </button>
        </div>
        <div>
          <button onClick={() => handleSignMessageClick()} className='bg-gray-500 p-4 m-8 rounded-lg hover:bg-gray-300'> Sign Message </button>
          <input
            className='p-5 border-2 border-black'
            type="text"
            placeholder="Enter string to sign"
            value={stringToSign}
            onChange={(e) => setStringToSign(e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleSendTransactionClick()} className='bg-gray-500 p-4 m-8 rounded-lg hover:bg-gray-300'> Send Transaction </button>
          <input
            className='p-5 border-2 border-black'
            type="text"
            placeholder="To Address"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
          />
          <input
            className='ml-10 p-5 border-2 border-black'
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>}
    </div>
  )


}

export default Home