import { ethers } from "ethers";

// https://eips.ethereum.org/EIPS/eip-1193
export interface EIP1193Provider {
  request: (args: any) => Promise<any>;
  on: (event: string, handler: (arg: any) => void) => void;
}

export type User = {
  address: string;
  proxy: EIP1193Provider;
  provider: ethers.providers.Web3Provider;
  signer: ethers.providers.JsonRpcSigner;
};
