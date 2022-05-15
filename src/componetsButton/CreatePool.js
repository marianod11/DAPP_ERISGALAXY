import React, { Component } from 'react';
import nftToken from "../abis/NFTERC721.json"
import caosToken from "../abis/TestERC20.json"
import nftStake from "../abis/NFTStake.json"
import Web3 from 'web3';



class CreatePool extends Component  {
    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
      }
    
      async loadWeb3() {
        if(window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        }
    
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        }
    
        else {
          window.alert('¡Considera usar Metamask!')
        }
    
      }
    
      async loadBlockchainData(){
        const web3 = window.web3
        // Cargar una cuenta
        const accounts = await web3.eth.getAccounts()
        this.setState({account: accounts[0]})
        const networkId = 56
        const networkData = nftToken.networks[networkId]
        const networkData1 = caosToken.networks[networkId]
        const networkData2 = nftStake.networks[networkId]
    
              if(networkData,networkData1,networkData2) {
                const abi = nftToken.abi
                const abi1 = caosToken.abi
                const abi2 = nftStake.abi
          
                const address = networkData.address
                const address1 = networkData1.address
                const address2 = networkData2.address
              
                const contract = new web3.eth.Contract(abi, address)
                const contract1 = new web3.eth.Contract(abi1, address1)
                const contract2 = new web3.eth.Contract(abi2, address2)
              
                const balance = await contract.methods.balanceOf(accounts[0]).call()
           
                this.setState({contract})
                this.setState({contract1})
                this.setState({contract2})


               
              
                
              } else {
                window.alert('¡Smart Contract no desplegado en la red!')
              }
            }
    
    
       
            constructor(props) {
                super(props)
                this.state = {
                  account: '',
                  contract: null,
                  totalSupply: 0,
                  balance: "",
                  contract1 : null,
                  balance1: "",
                  contract2 : null,
              
                }
              }


               createPool = () => {

                const currentTimeStamp = Math.floor(Date.now() / 1000);
                const startTime = currentTimeStamp 
                const endingDate = startTime + 30 * 24 * 60 * 60 * 30;
                
              

                const pool = {
                  "nftContract" :"0x0701F3B71d40B4E9aCcA4801c8fE90473b04F522" , 
                  "rewardContract": "0x5D739A457ca4dc3b10Cd1A6c566686C700A7cc96", 
                  "rewardSupply": "1000",
                  "cycle": "5",
                  "rewardPerCycle": "10",
                  "maxCycles": "25",
                  "endingDate": endingDate,
                  "isActive": true,
                  "multiplierSigner":"0xcc73DBc8d2fecB3622afb37a27e3e606A88B6377",
                  "maxStakePerWallet": "3"
                }
              
               this.state.contract2.methods.createPool(pool)
               .send({ from: this.state.account, gas: 1000000})
              }
  
  
    render(){
    return (




        
      <div className="">
        
     
        <button onClick={this.createPool}>
            crateeepoolll
        </button>
  
      </div>
    );
    }
  }
  
  export default CreatePool;