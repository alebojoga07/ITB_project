import React, { useState } from "react";
import { ethers } from "ethers"; 
import { contract } from "./ethersConfig"; 

function App() {
    const [userAddress, setUserAddress] = useState(null);
    const [balance, setBalance] = useState(null);
    const [suiMessage, setSuiMessage] = useState(""); 

    const connectMetaMask = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

                const address = accounts[0];
                setUserAddress(address);

                console.log("Conectat la MetaMask:", address);

                const balance = await contract.balanceOf(address);
                setBalance(ethers.utils.formatUnits(balance, 18));
            } catch (error) {
                console.error("Eroare la conectarea la MetaMask:", error);
            }
        } else {
            alert("MetaMask nu este instalat! Te rog instalează MetaMask.");
        }
    };

    const mintTokens = async () => {
        if (!userAddress) {
            alert("Te rog conectează-te la MetaMask.");
            return;
        }
    
        const recipient = userAddress;
        const amount = ethers.utils.parseUnits("1000", 18);
    
        try {
            const owner = await contract.owner();
            console.log("Proprietarul contractului:", owner);
    
            if (owner.toLowerCase() !== userAddress.toLowerCase()) {
                alert("Doar proprietarul poate minte tokenuri.");
                return;
            }
    
            console.log("Începem tranzacția de mint...");
            const tx = await contract.mint(recipient, amount);
            console.log("Tranzacția a fost trimisă:", tx);
    
            await tx.wait(); 
            console.log("Minted 1000 tokens to:", recipient);
                const balance = await contract.balanceOf(recipient);
            setBalance(ethers.utils.formatUnits(balance, 18));
        } catch (error) {
            console.error("Eroare la mint:", error);
            alert("Eroare la minting. Verifică consola pentru detalii.");
        }
    };
    
    const burnTokens = async () => {
        if (!userAddress) {
            alert("Te rog conectează-te la MetaMask.");
            return;
        }

        const amount = ethers.utils.parseUnits("500", 18); 

        try {
            console.log("Începem tranzacția de burn...");
            const tx = await contract.burn(amount);
            console.log("Tranzacția a fost trimisă:", tx);
            await tx.wait(); 
            console.log("Burned 500 tokens");

            const balance = await contract.balanceOf(userAddress);
            setBalance(ethers.utils.formatUnits(balance, 18));
        } catch (error) {
            console.error("Eroare la burn:", error);
            alert("Eroare la arderea token-urilor. Verifică consola pentru detalii.");
        }
    };

    const checkBalance = async () => {
        if (!userAddress) {
            alert("Te rog conectează-te la MetaMask.");
            return;
        }

        try {
            const balance = await contract.balanceOf(userAddress);
            console.log(`Soldul tău: ${ethers.utils.formatUnits(balance, 18)} IBT`);
            setBalance(ethers.utils.formatUnits(balance, 18)); 
        } catch (error) {
            console.error("Eroare la verificarea soldului:", error);
            alert("Eroare la verificarea soldului. Verifică consola pentru detalii.");
        }
    };

    
    const handleSuiAction = () => {
        setSuiMessage("Funcționalitatea Sui nu este activă ");
    };

    return (
        <div className="App">
            <h1>Blockchain Bridge</h1>
            <h2>Ethereum</h2>

            {}
            <button onClick={connectMetaMask}>Conectează-te la MetaMask</button>
            {userAddress && <p>Adresa ta Ethereum: {userAddress}</p>}
            {balance !== null && <p>Soldul tău: {balance} IBT</p>}

            {}
            <button onClick={mintTokens}>Mint Tokens</button>
            <button onClick={burnTokens}>Burn Tokens</button>
            <button onClick={checkBalance}>Verifică Sold</button>

            {}
            <h2>Sui </h2>
            <button onClick={handleSuiAction}>Acțiune Sui</button>
            {suiMessage && <p>{suiMessage}</p>} {}
        </div>
    );
}

export default App;
