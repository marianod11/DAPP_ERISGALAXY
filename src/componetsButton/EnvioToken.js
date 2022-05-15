import React, { Component } from 'react';
import nftToken from "../abis/NFTERC721.json"
import caosToken from "../abis/TestERC20.json"
import nftStake from "../abis/NFTStake.json"
import Web3 from 'web3';



class EnvioToken extends Component  {
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


              envioToken = () => {

                
                this.state.contract1.methods.approve("0x8Ec9E8820153841074E321E9bD701dc6f5078F93", 10000 )
                .send({ from: this.state.account, gas: 1000000})
              }
  
  
    render(){
    return (




        
      <div className="">
        
     
        <button onClick={this.envioToken}>
            ENVIOO TOKENNN
        </button>
  
      </div>
    );
    }
  }
  
  export default EnvioToken;