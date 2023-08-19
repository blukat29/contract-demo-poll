import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const hasMetaMask = window.ethereum && window.ethereum.isMetaMask;
const hasKaikas = window.klaytn && window.klaytn.isKaikas;

function App() {
    const [wallet, setWallet] = useState({
        accounts: []
    })

  const connectMetamask = async () => {
    let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
    })
      console.log('mm', accounts);
    setWallet({ accounts });
  }
  const connectKaikas = async () => {
    let accounts = await window.klaytn.request({
        method: "eth_requestAccounts",
    })
      console.log('kk', accounts);
    setWallet({ accounts });
  }

  return (
    <div className="App">
      <h2>Poll demo</h2>

      { hasMetaMask &&
        <button onClick={connectMetamask}>Connect MetaMask</button> }
      { hasKaikas &&
        <button onClick={connectKaikas}>Connect Kaikas</button> }

      { wallet.accounts.length > 0 &&
        <div>Connected as: { wallet.accounts[0] }</div> }
    </div>
  )
}

export default App
