import { useState } from 'react'
import { Button, Container, Navbar } from 'react-bootstrap';

const hasMetaMask = window.ethereum && window.ethereum.isMetaMask;
const hasKaikas = window.klaytn && window.klaytn.isKaikas;

function App() {
  const [wallet, setWallet] = useState({
    account: null,
    provider: null,
  })

  const connectMetamask = async () => {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    setWallet({
      account: accounts[0],
      provider: window.ethereum,
    });
  }
  const connectKaikas = async () => {
    let accounts = await window.klaytn.request({
      method: "eth_requestAccounts",
    })
    setWallet({
      account: accounts[0],
      provider: window.klaytn,
    });
  }
  const disconnect = async () => {
    setWallet({
      account: null,
      provider: null,
    });
  }

  return (
    <Container>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Navbar.Brand>Poll dApp demo</Navbar.Brand>
        <div class="ml-auto">
          { !wallet.account && hasMetaMask &&
            <Button variant="primary" onClick={connectMetamask}>Connect MetaMask</Button> }
          { !wallet.account && hasKaikas &&
            <Button variant="primary" onClick={connectKaikas}>Connect Kaikas</Button> }
          { wallet.account  &&
            <Button variant="secondary" onClick={disconnect}>Disconnect</Button> }
        </div>
      </Navbar>

      { wallet.account &&
        <div>Connected as: { wallet.account }</div> }
    </Container>
  )
}

export default App
