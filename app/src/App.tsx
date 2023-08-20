import { useState, useEffect } from 'react'
import { Button, Container, Form, Stack, Modal, Nav, Navbar, Row } from 'react-bootstrap';
import { ethers } from 'ethers';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const hasMetaMask = window.ethereum && window.ethereum.isMetaMask;
const hasKaikas = window.klaytn && window.klaytn.isKaikas;

const rpcEndpoint = "http://localhost:8545";
const rpcProvider = new ethers.providers.JsonRpcProvider(rpcEndpoint);

function App() {
  const [modalShow, setModalShow] = useState(false);
  const [wallet, setWallet] = useState({
    account: null,
    provider: null,
  })
  const [netStat, setNetStat] = useState({
    lastRefresh: Date.now(),
    health: "connecting",
  })

  const connectMetamask = async () => {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    setWallet({
      account: accounts[0],
      provider: window.ethereum,
    });
    handleModalClose();
  }
  const connectKaikas = async () => {
    let accounts = await window.klaytn.request({
      method: "eth_requestAccounts",
    })
    setWallet({
      account: accounts[0],
      provider: window.klaytn,
    });
    handleModalClose();
  }
  const disconnect = async () => {
    setWallet({
      account: null,
      provider: null,
    });
  }

  const refreshNetworkStatus = async () => {
    try {
      await rpcProvider.getBlockNumber();
      setNetStat({ lastRefresh: Date.now(), health: "healthy" });
    } catch (e) {
      setNetStat({ lastRefresh: netStat.lastRefresh, health: "unreachable" });
    }
  }

  const handleModalOpen = () => setModalShow(true);
  const handleModalClose = () => setModalShow(false);

  const abbreviateAddress = (address: string): string => {
    return address.substring(0,6) + "..." + address.substring(38);
  }

  useEffect(() => {
    const timer = setInterval(refreshNetworkStatus, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Container className="container-sm">
      <Navbar className="ps-3 pe-3 bg-light">
        <Stack direction="horizontal">
          <Navbar.Brand>Poll dApp demo</Navbar.Brand>
          <div className="p-2">network { netStat.health }</div>
          { !wallet.account &&
            <Button className="ms-auto" variant="primary" onClick={handleModalOpen}>Connect Wallet</Button> }
          { wallet.account &&
            <div className="p-2">Connected as { abbreviateAddress(wallet.account) }</div> }
          { wallet.account  &&
            <Button className="ms-auto" variant="secondary" onClick={disconnect}>Disconnect</Button> }
        </Stack>
      </Navbar>

      <Modal show={modalShow} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Connect Wallet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={3}>
            { hasMetaMask &&
              <Button className="p-2" variant="primary" onClick={connectMetamask}>Connect MetaMask</Button> }
            { hasKaikas &&
              <Button className="p-2" variant="primary" onClick={connectKaikas}>Connect Kaikas</Button> }
          </Stack>
        </Modal.Body>
      </Modal>

    </Container>
  )
}

export default App
