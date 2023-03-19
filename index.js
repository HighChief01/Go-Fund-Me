// in node js/backend javascript, we use require
// in frontend javascript, we use import
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"
console.log(ethers)


const connectBtn = document.getElementById("connectBtn")
const fundBtn = document.getElementById("fundBtn")
const balanceBtn = document.getElementById("balanceBtn")
const withdrawBtn = document.getElementById("withdrawBtn")

connectBtn.onclick = connect
fundBtn.onclick = fund
balanceBtn.onclick = getBalance
withdrawBtn.onclick = withdraw

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        console.log("I see a metamask")
        await ethereum.request({ method: "eth_requestAccounts" })
        console.log("connected")
        connectBtn.innerHTML = "connected"
    } else {
        console.log("No metamask")
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`funding with  ${ethAmount}...`)
    if(typeof window.ethereum !== "undefined"){
        //provider : connection to the blockchain
        //signer : wallet with some gas to call functions
        //contract : that we are interacting with
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(signer)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
        const transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)})
        //listen for the transaction to be mined
        //listen for an event
        await listenForTransactionMine(transactionResponse, provider)
        console.log("Done")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    // return new Promise
    //we want to create a listener for the blockchain 
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`completed with ${transactionReceipt.confirmations} `)
        resolve()
        })
    })
    
}

async function getBalance() {
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function withdraw() {
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(signer)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
        const transactionResponse = await contract.withdraw()
        //listen for the transaction to be mined
        //listen for an event
        await listenForTransactionMine(transactionResponse, provider)
        console.log("Done")
        } catch (error) {
            console.log(error)
        }
    }
}