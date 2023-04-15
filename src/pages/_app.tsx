import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from "react";
import { DynamicContextProvider, DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react';
import { useRouter } from 'next/router';
import db from './init-firebase';
import { collection, addDoc } from "firebase/firestore";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { ethers, JsonRpcProvider, Wallet } from "ethers"
const provider = new JsonRpcProvider('https://sepolia.infura.io/v3/91de7ed3c17344cc95f8ea31bf6b3adf')



const getBalanceForUser = async (publicKey: string) => {
  let userBalance = await provider.getBalance(publicKey)
  return ethers.formatEther(userBalance)
}

const signMessage = async (private_key: string, message: string) => {
  let userWallet = new ethers.Wallet(private_key, provider);
  let result = await userWallet.signMessage(message)
  return result
}

const sendTransaction = async (private_key: string, toAddress: string, amount: string) => {
  const tx = {
    to: toAddress,
    value: ethers.parseEther(amount).toString()
  }
  let userWallet = new ethers.Wallet(private_key, provider);
  try {
    let transaction = await userWallet.sendTransaction(tx)
    await transaction.wait();

    console.log(`Transaction successful with hash: ${transaction.hash}`)
    return transaction
  }
  catch (e) {
    return false
  }
}

const checkWalletExists = async (metamask: string) => {
  const docRef = doc(db, "users", metamask);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const { public_key, private_key } = docSnap.data();
    return { exists: true, public_key, private_key };
  }
  return { exists: false };
}

const createWalletForUser = async (metamask: string) => {
  // Check if wallet already exists for this user
  const docRef = doc(db, "users", metamask);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    alert('A wallet already exists for this user.');
    return;
  }

  // Create new wallet for user
  const userWallet = ethers.Wallet.createRandom(provider);
  console.log('address: ', userWallet.address);
  console.log('private key: ', userWallet.privateKey);
  console.log('connected wallet: ', metamask);
  alert('Your wallet has been created: ' + userWallet.address);

  // Store wallet in Firestore
  await addDynamicWalletToFirestore(metamask, userWallet.address, userWallet.privateKey);
}

const addDynamicWalletToFirestore = async (metamask: string, public_key: string, private_key: string) => {
  await setDoc(doc(db, "users", metamask), {
    public_key: public_key,
    private_key: private_key
  });
  console.log('added');
}

const Navbar = () => {
  const [shouldRender, setShouldRender] = useState(false);
  const {
    handleLogOut,
    setShowAuthFlow,
    showAuthFlow,
    primaryWallet
  } = useDynamicContext();
  const router = useRouter()

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <p className="text-white font-bold text-lg">Dynamic Take Home</p>
          </div>
          {primaryWallet && !showAuthFlow ? (
            <div className="hidden md:flex items-center">
              <p className="text-gray-300 mr-4">{primaryWallet.address}</p>
              <button type="button" onClick={handleLogOut} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                Log Out
              </button>
            </div>
          ) : (
            <div className="hidden md:block">
              <button type="button" onClick={() => { setShowAuthFlow(true) }} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                Connect With My Wallet
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
const HomePage = () => {
  const {
    handleLogOut,
    setShowAuthFlow,
    showAuthFlow,
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
    let userBalance = await getBalanceForUser(publicKey);
    alert("your dynamic wallet ETH balance is: " + userBalance.toString());
  };

  const handleSignMessageClick = async () => {
    let result = await signMessage(privateKey, stringToSign);
    alert('signed transaction: ' + result);
  };

  const handleSendTransactionClick = async () => {
    alert(`sending ${toAddress} ${amount} ETH, wait for another popup on confirmation`);
    let transaction = await sendTransaction(privateKey, toAddress, amount);
    if (transaction) alert(`Transaction successful with hash: ${transaction.hash}`);
    else alert(`error in sending, make sure you are sending to an ETH address and that your amount is below your balance`);
  };

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (primaryWallet) {
        const { exists, public_key, private_key } = await checkWalletExists(primaryWallet.address || '');
        setWalletExists(exists);
        if (exists) {
          setPublicKey(public_key);
          setPrivateKey(private_key);
        }
      }
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [primaryWallet]);

  return (
    <div>
      <div className="flex justify-end items-center w-full">
        {primaryWallet && <button className="p-4 border-b rounded-lg border-black bg-gray-500 m-4" onClick={() => {
          createWalletForUser(primaryWallet?.address || '');
          setShouldRender(!shouldRender); // trigger re-render
        }} >Create New Wallet</button>}
      </div>
      {walletExists && <div>
        <div>
          {walletExists && <p className='bg-gray-500 p-4 m-8'> Your Dynamic Wallet Address(Sepolia): {publicKey} </p>}
        </div>
        <div>
          {walletExists && <button onClick={() => handleGetBalanceClick()} className='bg-gray-500 p-4 m-8'> Check Balance </button>}
        </div>
        <div>
          {walletExists && <button onClick={() => handleSignMessageClick()} className='bg-gray-500 p-4 m-8'> Sign Message </button>}
          <input
            className='p-5 border-2 border-black'
            type="text"
            placeholder="Enter string to sign"
            value={stringToSign}
            onChange={(e) => setStringToSign(e.target.value)}
          />
        </div>
        <div>
          {walletExists && <button onClick={() => handleSendTransactionClick()} className='bg-gray-500 p-4 m-8'> Send Transaction </button>}
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


const App = () => (
  <DynamicContextProvider settings={{ environmentId: '27c02be4-503e-4531-9538-bd1a32781d30' }}>
    <div>
      <Navbar />
      <HomePage />
    </div>
  </DynamicContextProvider>
);

export default App;

