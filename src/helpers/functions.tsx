import db from './init-firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";

import { ethers, JsonRpcProvider } from "ethers"
const provider = new JsonRpcProvider('https://sepolia.infura.io/v3/91de7ed3c17344cc95f8ea31bf6b3adf')

const getBalanceForUser = async (public_key: string) => {
  try {
    let userBalance = await provider.getBalance(public_key)
    return ethers.formatEther(userBalance)
  } catch (e) {
    throw new Error('Invalid address')
  }
}

const signMessage = async (private_key: string, message: string) => {
  try {
    let userWallet = new ethers.Wallet(private_key, provider);
    let result = await userWallet.signMessage(message)
    return result
  } catch (e) {
    throw new Error('Invalid private key')
  }
}

const sendTransaction = async (private_key: string, toAddress: string, amount: string) => {
  if (parseFloat(amount) > 0) {
    if (!ethers.isAddress(toAddress))
      throw new Error('invalid address')
    const tx = {
      to: toAddress,
      value: ethers.parseEther(amount).toString()
    };
    let userWallet;
    try {
      userWallet = new ethers.Wallet(private_key, provider);
      let transaction = await userWallet.sendTransaction(tx);
      await transaction.wait();

      console.log(`Transaction successful with hash: ${transaction.hash}`);
      return transaction;
    } catch (e) {
      if (!userWallet) {
        throw new Error('invalid private key');
      } else {
        throw new Error('error sending transaction, check that you have enough balance');
      }
    }
  }
  else { throw new Error('amount must be greater than 0'); }
};

const checkWalletExists = async (metamask: string) => {
  if (metamask === '') return { exists: false };
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
  if ((await checkWalletExists(metamask)).exists) {
    alert('A wallet already exists for this user.');
    return;
  }
  // Create new wallet for user
  const userWallet = ethers.Wallet.createRandom(provider);
  alert('Your wallet has been created: ' + userWallet.address + '. Now loading your wallet..');

  // Store wallet in Firestore
  await addDynamicWalletToFirestore(metamask, userWallet.address, userWallet.privateKey);
}

const addDynamicWalletToFirestore = async (metamask: string, public_key: string, private_key: string) => {
  await setDoc(doc(db, "users", metamask), {
    public_key: public_key,
    private_key: private_key
  });
}

const functions = {
  getBalanceForUser,
  signMessage,
  sendTransaction,
  checkWalletExists,
  createWalletForUser,
  addDynamicWalletToFirestore
};

export default functions;