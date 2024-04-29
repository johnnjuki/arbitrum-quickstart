"use client";

import { ethers} from 'ethers';
import { useCallback, useRef, useState } from 'react';

import VendingMachineContract from '@/utils/VendingMachine.sol/VendingMachine.json';

export const VendingMachine = () => {
    const [identity, setIdentity] = useState<string>('');
    const [contractAddress, setContractAddress] = useState<string>('');
    const [cupcakeBalance, setCupcakeBalance] = useState<number>(0);
    const cupcakeRef = useRef(null);
    const errorIndicatorRef = useRef(null);
  
    function truncateAddress(text: string) {
      if (text == null || text === '') {
        return 'no name';
      }
      if (text.length < 10) {
        return text;
      }
      return text.slice(0, 5) + '...' + text.slice(-3);
    }
  
    
    async function giveCupcakeTo(identity: string, vendingMachineContractAddress: string) {
      const contract = initContract(vendingMachineContractAddress);
      // @ts-ignore
      const cupcakeCountBefore = Number(await contract.getCupcakeBalanceFor(identity));
      // @ts-ignore
      const transaction = await contract.giveCupcakeTo(identity);
      const receipt = await transaction.wait();
      // @ts-ignore
      const cupcakeCountAfter = Number(await contract.getCupcakeBalanceFor(identity));
      const succeed = cupcakeCountAfter == cupcakeCountBefore + 1;
      return succeed
    }
  
    // async function getCupcakeBalanceFor(identity: string, vendingMachineContractAddress: string) {
    //   // console log everything in one line
    //   console.log(`getting cupcake balance for ${identity} on ${vendingMachineContractAddress}`);
    //   const contract = await initContract(vendingMachineContractAddress);
    //   // @ts-ignore
    //   const cupcakeBalance = await contract.getCupcakeBalanceFor(identity);
    //   return Number(BigInt(cupcakeBalance));
    //   // TODO
    // }
  
    // async function getWalletAddress() {
    //   if (ethereumAvailable()) {
    //     // "hey metamask, let's get the user's wallet address"
    //     const signer = await initSigner();
    //     // @ts-ignore
    //     const walletAddress = await signer.getAddress();
    //     console.log(`wallet address: ${walletAddress}`);
    //     return walletAddress;
    //   }
    // }
  
    async function initContract(vendingMachineContractAddress: string) {
      if (ethereumAvailable()) {
        // "hey metamask, let's use the network and account the user has selected to interact with the contract"
        const signer = await initSigner();
        const contract = new ethers.Contract(vendingMachineContractAddress, VendingMachineContract.abi, signer);
        return contract;
      }
    }
  
    async function initSigner() {
      if(ethereumAvailable()) {
        // "hey metamask, let's prepare to sign transactions with the account the user has selected"
        await requestAccount();
        const metamaskProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await metamaskProvider.getSigner();
        return signer;
      }
    }
  
    async function requestAccount() {
      if (ethereumAvailable()) {
  // "hey metamask, please ask the user to connect their wallet and select an account"
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      }
    }
  
    function ethereumAvailable() {
      // TODO return 'ethereum' in window || 'Ethereum' in window;
      return typeof window.ethereum !== 'undefined';
    }
  
    // const updateSuccessIndicator = (success: boolean) => {
    //   errorIndicatorRef.current.classList.toggle('visible', !success);
    // }
  
    // const callWeb3VendingMachine = useCallback(
    //   async (func : any) => {
    //     return await func(identity, contractAddress);
    //   }, [identity, contractAddress]
    // );
  
    const handleCupcakePlease = useCallback(async () => {
      try {
        let gotCupcake;
        gotCupcake = await giveCupcakeTo(identity, contractAddress);
  
        let existingFadeout;
        if (gotCupcake) {
          // cupcakeRef.current.style.opacity = 1;
          // cupcakeRef.current.style.transition = 'unset';
          // clearTimeout(existingFadeout);
  
          // existingFadeout = setTimeout(() => {
          //   cupcakeRef.current.style.transition = 'opacity 5.5s';
          //   cupcakeRef.current.style.opacity = 0;
          // }, 0);
  
          // setTimeout(() => {
          //   cupcakeRef.current.style.transition = 'opacity 0s';
          //   cupcakeRef.current.style.opacity = 0;
          // }, 5000);
  
          // await handleRefreshBalance();
          
          
  
        } else if (gotCupcake === false) {
          alert('HTTP 429: Too many Cupcakes (you must wait at least 5 seconds between cupcakes)');
        }
  
        console.log('gotCupcake: ' + gotCupcake);
      } catch (error) {
        console.error('ERROR: handleCupcakePlease: ' + error);
        // updateSuccessIndicator(false);
      }
    }, [ giveCupcakeTo]);
  
    // const handleRefreshBalance = useCallback(async () => {
    //   try {
    //     setCupcakeBalance(await getCupcakeBalanceFor());
    //     updateSuccessIndicator(true);
    //   } catch (err) {
    //     console.error('ERROR: handleRefreshBalance: ' + err);
    //     updateSuccessIndicator(false);
    //   }
    // }, [getCupcakeBalanceFor]);
    
  
  
  
    return (
      <div className='vending-machine'>
        <h4 className='mb-10'>Free Cupcakes</h4>
        <label>Metamask wallet address</label>
        <input type="text" placeholder='Enter Metamask wallet address' value={identity} onChange={(event) => setIdentity(event.target.value)} />
        <label> Contract Address: </label>
        <input 
        type='text'
        placeholder='Enter contract address'
        value={contractAddress}
        onChange={(event) => setContractAddress(event.target.value)}
        />
        <button className='cupcake-please' onClick={handleCupcakePlease}>
          Cupcake Please!
        </button>
        <p className='balance-wrapper'>
          <span>Balance: </span>
          <span>
            {cupcakeBalance} {`${truncateAddress(identity)}`}
          </span>
        </p>
      </div>
    )
  }