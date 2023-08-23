import { useState, useEffect, ReactElement } from "react";
import { Button, Stack, Modal, Navbar, Badge } from "react-bootstrap";
import { ethers } from "ethers";
import { User } from "../type/common";

const hasMetaMask = window.ethereum && window.ethereum.isMetaMask;

const Nav = ({
  user,
  setUser,
}: {
  user?: User;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}): ReactElement => {
  const [modalShow, setModalShow] = useState(false);
  const [netStat, setNetStat] = useState({
    lastRefresh: Date.now(),
    health: "connecting",
  });

  const connectMetamask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    setUser({
      address: await signer.getAddress(),
      provider,
      signer,
    });
    handleModalClose();
  };

  const disconnect = async () => {
    setUser(undefined);
  };

  const refreshNetworkStatus = async () => {
    try {
      await user?.provider.getBlockNumber();
      setNetStat({ lastRefresh: Date.now(), health: "healthy" });
    } catch (e) {
      setNetStat({ lastRefresh: netStat.lastRefresh, health: "unreachable" });
    }
  };

  const handleModalOpen = () => setModalShow(true);
  const handleModalClose = () => setModalShow(false);

  const abbreviateAddress = (address: string): string => {
    return address.substring(0, 6) + "..." + address.substring(38);
  };

  useEffect(() => {
    if (user) {
      const timer = setInterval(refreshNetworkStatus, 2000);
      return () => clearInterval(timer);
    }
  }, [!!user]);

  useEffect(() => {
    if (hasMetaMask) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setUser({
            address: accounts[0],
            provider,
             signer,
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
            <Badge bg="info">Chain Id : {user.provider.network?.chainId}</Badge>
            <div className="p-2">Connected as {abbreviateAddress(user.address)}</div>
            <Button className="ms-auto" variant="secondary" onClick={disconnect}>
              Disconnect
            </Button>
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
          </Stack>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Nav;
