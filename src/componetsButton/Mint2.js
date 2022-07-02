import React, { Component } from 'react';
import nftToken from "../abis/NFTERC721.json"
import Web3 from 'web3';
import robot from '../assets/img/robot2.png'



class Mint2 extends Component  {
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
    
              if(networkData) {
                const abi = nftToken.abi
          
                const address = networkData.address
              
                const contract = new web3.eth.Contract(abi, address)
              
                const price22 = await contract.methods.PRICE2().call()
   


                var robot2 = await contract.methods.returnRobot2().call()

              
                
                document.getElementById("robot2").textContent=robot2
         
           
                this.setState({contract})
    
              
                
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
               
              }
            }
    
    

//MINTEO DE ROBOT1
async mint2(){

  const web3 = window.web3
  const networkId = 56
  const networkData = nftToken.networks[networkId]
  const abi = nftToken.abi
  const address = networkData.address
  const contract = new web3.eth.Contract(abi, address)
  const accounts = await web3.eth.getAccounts()
  const price2 = await contract.methods.PRICE2().call()

      await contract.methods.mint2(accounts[0], 2, 2)
       .send({ from: accounts[0], gas: 1111110, value: price2})  
   
    
   
       .on('transactionHash', function(hash){
         document.getElementById("web3_message").textContent="Minting...";
       })
       .on('receipt', function(receipt){
         document.getElementById("web3_message").textContent="Success! Minting finished.";    })
       .catch((revertReason) => {
        // getRevertReason(revertReason.receipt.transactionHash);
       });
   }

  
  
    render(){
    return (
      <div className="col-md-3  col-sm-6 marg">
      <div className="">
      <div className="card-mint">
      <p  style={{color:"white"}}><strong> <span id="robot2"></span> /0 </strong></p>
      <img style={{width:"100%"}} src={robot} ></img>
      <p style={{color:"white"}}><strong>PRICE: -  BNB</strong></p>
     
        </div>
        </div>
      </div>
    );
    }
  }
  
  export default Mint2;