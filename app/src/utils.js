import config from "./config";
import { Connection } from '@solana/web3.js';
import { Program, Provider } from '@project-serum/anchor';
import { candyMachineProgram } from "./CandyMachine/helpers";


const getProvider = () => {
  const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;
  // Create a new connection object
  const connection = new Connection(rpcHost);

  // Create a new Solana provider object
  const provider = new Provider(
    connection,
    window.solana,
    config.opts.preflightCommitment
  );

  return provider;
};
const getCandyMachineState = async () => {
  const provider = getProvider();

  // Get metadata about your deployed candy machine program
  const idl = await Program.fetchIdl(candyMachineProgram, provider);

  // Create a program that you can call
  const program = new Program(idl, candyMachineProgram, provider);

  // Fetch the metadata from your candy machine
  const candyMachine = await program.account.candyMachine.fetch(
    process.env.REACT_APP_CANDY_MACHINE_ID
  );

  // Parse out all our metadata and log it out
  const itemsAvailable = candyMachine.data.itemsAvailable.toNumber();
  const itemsRedeemed = candyMachine.itemsRedeemed.toNumber();
  const itemsRemaining = itemsAvailable - itemsRedeemed;
  const goLiveData = candyMachine.data.goLiveDate.toNumber();

  // We will be using this later in our UI so let's generate this now
  const goLiveDateTimeString = `${new Date(
    goLiveData * 1000
  ).toGMTString()}`
 
  return {
    itemsAvailable,
    itemsRedeemed,
    itemsRemaining,
    goLiveData,
    goLiveDateTimeString,
  };
};

const connectWallet = async () => {
  const { solana } = window;
  if (solana) {
    const response = await solana.connect();
    console.log('Connected with Public Key:', response.publicKey.toString());
    return response.publicKey.toString();
  }
};

const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;

    if (solana) {
      if (solana.isPhantom) {
        console.log('Phantom wallet found!');
        /*
      * The solana object gives us a function that will allow us to connect
      * directly with the user's wallet!
      */
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log('Connected with Public Key:', response.publicKey.toString());
        return response.publicKey.toString()
      }
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  } catch (error) {
    console.error(error);
  }
};

export {
  getProvider,
  connectWallet,
  checkIfWalletIsConnected,
  getCandyMachineState
}