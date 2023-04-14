const { ethers, JsonRpcProvider, Wallet } = require("ethers")
const provider = new JsonRpcProvider('https://goerli.infura.io/v3/91de7ed3c17344cc95f8ea31bf6b3adf')


const createWalletForUser = () => {
  userWallet = ethers.Wallet.createRandom(provider)
}

const getBalanceForUser = async () => {
  let userBalance = await provider.getBalance(userWallet.address)
  console.log(userBalance.toString())
}

const signMessage = async (string) => {
  let result = await userWallet.signMessage(string)
  console.log(result)
}

const sendTransaction = async (toAddress, amount) => {
  const tx = {
    to: toAddress,
    value: ethers.parseEther(amount).toString()
  }

  let transaction = await userWallet.sendTransaction(tx)
  await transaction.wait();
  console.log(`Transaction successful with hash: ${transaction.hash}`)
}

export { createWalletForUser, getBalanceForUser, signMessage, sendTransaction }