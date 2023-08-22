import { ethers } from "ethers";

export type User = {
  address: string;
  provider: ethers.providers.Web3Provider;
  signer: ethers.providers.JsonRpcSigner;
};
