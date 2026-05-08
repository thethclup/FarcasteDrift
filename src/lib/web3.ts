import { buildAttributedTransaction, BUILDER_CODE } from './erc8021';

// MOCK CONSTANTS FOR PREVIEW PURPOSES
const MOCK_WALLET = '0x1A2B3c4D5E6F7890123456789ABCDEF012345678';

export async function connectWalletMock(): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_WALLET), 800));
}

export async function submitScoreTx(score: number, distance: number, wallet: string) {
  const mockTxData = `0xmockDataScore${score}Dist${distance}`;
  const tx = await buildAttributedTransaction('0xGameContractAddress', mockTxData);
  
  console.log('Sending transaction:', tx);
  
  return new Promise<{success: boolean, hash: string}>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        hash: '0x' + Math.random().toString(16).slice(2, 64).padEnd(64, '0')
      });
    }, 1200);
  });
}

export async function sayGMTx() {
  const tx = await buildAttributedTransaction('0xGMContract', '0xGM123');
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve('0x' + Math.random().toString(16).slice(2, 64).padEnd(64, '0'));
    }, 1000);
  });
}
