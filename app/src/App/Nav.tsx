import { useState, useEffect, ReactElement } from "react";
import { Button, Stack, Modal, Navbar, Badge } from "react-bootstrap";
import { ethers } from "ethers";
import { User, EIP1193Provider } from "../type/common";

const RPC_ENDPOINT = import.meta.env.VITE_RPC_ENDPOINT;
const hasMetaMask = window.ethereum && window.ethereum.isMetaMask;
const hasKaikas = window.klaytn && window.klaytn.isKaikas;

const Nav = ({
  user,
  setUser,
}: {
  user?: User;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}): ReactElement => {
  const [modalShow, setModalShow] = useState(false);
  const handleModalOpen = () => setModalShow(true);
  const handleModalClose = () => setModalShow(false);

  const connectWallet = async (proxy: EIP1193Provider) => {
    // https://docs.ethers.org/v5/getting-started/#getting-started--connecting
    await proxy.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(proxy);
    const signer = provider.getSigner();
    setUser({
      address: await signer.getAddress(),
      proxy,
      provider,
      signer,
    });
    handleModalClose();
  }
  const connectMetamask = async () => connectWallet(window.ethereum);
  const connectKaikas = async () => connectWallet(window.klaytn);
  const disconnect = async () => {
    setUser(undefined);
  };

  const abbreviateAddress = (address: string): string => {
    return address.substring(0, 6) + "..." + address.substring(38);
  };

  const desiredChainId = async () => {
    const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
    const netinfo = await provider.getNetwork();
    return netinfo.chainId;
  }
  useEffect(() => {
    // https://docs.metamask.io/wallet/reference/provider-api/#accountschanged
    if (user) {
      user.proxy.on('accountsChanged', () => {
        console.log('accountsChanged');
        connectWallet(user.proxy);
      });

      // https://eips.ethereum.org/EIPS/eip-3326
      // Wallet will pop-up if the wallet is connected to a wrong chain.
      desiredChainId().then((chainId) => {
        user.proxy.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ethers.utils.hexlify(chainId) }],
        });
      });
    }
  });

  return (
    <>
      <Navbar>
        <Navbar.Brand>Poll dApp demo</Navbar.Brand>
        {user ? (
          <>
            <div className="ms-auto">
              <Navbar.Text className="p-2">Connected as: {abbreviateAddress(user.address)}</Navbar.Text>
              <Button variant="secondary" onClick={disconnect}>
                Disconnect
              </Button>
            </div>
          </>
        ) : (
          <Button className="ms-auto" variant="primary" onClick={handleModalOpen}>
            Connect Wallet
          </Button>
        )}
      </Navbar>

      <Modal show={modalShow} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Connect Wallet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={3}>
            {hasMetaMask && (
              <Button className="p-2" variant="primary" onClick={connectMetamask}>
                Connect MetaMask
              </Button>
            )}
            {hasKaikas && (
              <Button className="p-2" variant="primary" onClick={connectKaikas}>
                Connect Kaikas
              </Button>
            )}
          </Stack>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Nav;
