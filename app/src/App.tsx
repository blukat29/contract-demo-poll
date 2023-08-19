import { useState } from 'react'
import { Button, Container, Form, Stack, Modal, Nav, Navbar, Row } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const hasMetaMask = window.ethereum && window.ethereum.isMetaMask;
const hasKaikas = window.klaytn && window.klaytn.isKaikas;

function App() {
  const [wallet, setWallet] = useState({
    account: null,
    provider: null,
  })
  const [modalShow, setModalShow] = useState(false);

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

  const handleModalOpen = () => setModalShow(true);
  const handleModalClose = () => setModalShow(false);

  return (
    <Container className="container-sm">
      <Navbar className="ps-3 pe-3 bg-light">
        <Stack direction="horizontal">
          <Navbar.Brand>Poll dApp demo</Navbar.Brand>
          { !wallet.account &&
            <Button className="ms-auto" variant="primary" onClick={handleModalOpen}>Connect Wallet</Button> }
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

      { wallet.account &&
        <div>Connected as: { wallet.account }</div> }
    </Container>
  )
}

export default App
