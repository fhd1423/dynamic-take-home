import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from "react";
import { DynamicContextProvider, DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react';
import { useRouter } from 'next/router';

import { ethers, JsonRpcProvider, Wallet } from "ethers"
const provider = new JsonRpcProvider('https://goerli.infura.io/v3/91de7ed3c17344cc95f8ea31bf6b3adf')
let userWallet = ethers.Wallet.createRandom(provider)

const createWalletForUser = () => {
  userWallet = ethers.Wallet.createRandom(provider)
  console.log('address: ', userWallet.address)
  console.log('private key: ', userWallet.privateKey)
}

const Navbar = () => {
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
              <button type="button" onClick={() => setShowAuthFlow(true)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
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

  return (<div className="flex justify-center items-center h-screen w-full">
    <button className="p-4 border-b rounded-lg border-black bg-gray-500 justify-center" onClick={() => createWalletForUser()} >Create New Wallet</button>
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

