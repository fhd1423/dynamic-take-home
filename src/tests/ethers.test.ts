import functions from '../helpers/functions';
const { getBalanceForUser, signMessage, sendTransaction } = functions;

import { ethers, JsonRpcProvider, Provider } from "ethers"
const provider = new JsonRpcProvider('https://sepolia.infura.io/v3/91de7ed3c17344cc95f8ea31bf6b3adf')

let some_private_key = '0x36511db43b20b3d6db5e8b8bbe7f472fa1533c4afbf3eef6d6c679781e4cb1cd'
let some_address = '0xE20759415B5D5135dF30fe0D7B5E7a58eEc49248' // has sepolia eth


describe('getBalanceForUser', () => {
  test('valid balance, 0.01', async () => {
    const balance = await getBalanceForUser(some_address);
    expect(parseFloat(balance)).toBeGreaterThan(0.5);
  });

  test('zero balance, 0.0', async () => {
    let new_address = ethers.Wallet.createRandom(provider).address
    const balance = await getBalanceForUser(new_address);
    expect(balance).toBe('0.0');
  });

  test('throws an error for invalid address', async () => {
    const invalidAddress = '0x1234567890abcdef';
    await expect(getBalanceForUser(invalidAddress)).rejects.toThrow('Invalid address');
  });
});


describe('signMessage', () => {
  test('different private keys should have different messages', async () => {
    const privateKey1 = ethers.Wallet.createRandom(provider).privateKey;
    const privateKey2 = ethers.Wallet.createRandom(provider).privateKey;
    const message = 'Hi There';

    const signature1 = await signMessage(privateKey1, message);
    const signature2 = await signMessage(privateKey2, message);

    expect(signature1).not.toEqual(signature2);
  });

  test('should return different signatures for different messages', async () => {
    const privateKey = ethers.Wallet.createRandom(provider).privateKey;
    const message1 = 'First Message';
    const message2 = 'Second Message';

    const signature1 = await signMessage(privateKey, message1);
    const signature2 = await signMessage(privateKey, message2);

    expect(signature1).not.toEqual(signature2);
  });

  test('should throw an error if the private key is invalid', async () => {
    const invalidPrivateKey = '0x1234567890abcdef';
    const message = 'Hi there';

    await expect(signMessage(invalidPrivateKey, message)).rejects.toThrow('Invalid private key');
  });
});

describe('sendTransaction', () => {
  test('should throw an error if the amount is not greater than 0', async () => {
    const amount = '0';
    await expect(sendTransaction(some_private_key, some_address, amount)).rejects.toThrow('amount must be greater than 0');
  });

  test('should throw an error if the private key is invalid', async () => {
    const invalidPrivateKey = '0x1234567890abcdef';
    const validAddress = some_address;
    const amount = '0.01';

    await expect(
      sendTransaction(invalidPrivateKey, validAddress, amount)
    ).rejects.toThrow('invalid private key');
  });


  test('should throw an error if the receiver address is invalid', async () => {
    const validPrivateKey = some_private_key;
    const invalidAddress = '0x1234567890abcdef';
    const amount = '0.01';

    await expect(
      sendTransaction(validPrivateKey, invalidAddress, amount)
    ).rejects.toThrow('invalid address');
  });
  test('should successfully send a transaction if the private key, address, and amount are valid', async () => {
    const senderPrivateKey = some_private_key;
    const receiverAddress = some_address;
    const amount = '0.01';

    const transaction = await sendTransaction(senderPrivateKey, receiverAddress, amount);

    expect(transaction.to).toEqual(some_address);
    expect(transaction.value).toEqual(ethers.parseEther('0.01'))
  }, 30000);

  test('should throw an error if no balance', async () => {
    const validPrivateKey_no_balance = ethers.Wallet.createRandom(provider).privateKey
    const validAddress = some_address;
    const amount = '0.01';

    await expect(
      sendTransaction(validPrivateKey_no_balance, validAddress, amount)
    ).rejects.toThrow('error sending transaction, check that you have enough balance');
  }, 30000);

});
