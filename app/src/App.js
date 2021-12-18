import React, { useEffect, useState } from 'react';
import './App.css';
import CandyMachine from './CandyMachine';
import { checkIfWalletIsConnected, connectWallet } from './utils';

// Constants

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  useEffect(() => {
    const onLoad = async () => {
      const address = await checkIfWalletIsConnected();
      setWalletAddress(address)
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          { !walletAddress ? <button
            className="cta-button connect-wallet-button"
            onClick={ () => connectWallet().then(setWalletAddress) }
          >
            Connect to Wallet
          </button> : <div className="connected-container">
            <CandyMachine walletAddress={ window.solana } />
            {/* { gifs.map((gif, i) => <GifItem onUpdate={ () => fetchGifs() } gif={ gif } key={ gif.gifLink } />) } */ }
          </div> }
        </div>
        <div className="footer-container">
        </div>
      </div>
    </div>
  );
};

export default App;
