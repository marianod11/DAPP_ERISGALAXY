import React, { Component } from 'react';
import nftToken from "../abis/NFTERC721.json"
import caosToken from "../abis/TestERC20.json"
import nftStake from "../abis/NFTStake.json"
import Web3 from 'web3';



class ClaimRewards extends Component  {
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
                document.getElementById("nft_balance").textContent=balance;

     

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

           claimReward = async () => {
                const web3 = window.web3
                const networkId = 56
                const networkData2 = nftStake.networks[networkId]
                const abi2 = nftStake.abi
                const address2 = networkData2.address
                const contract2 = new web3.eth.Contract(abi2, address2)

                 let ActiveStakes = await contract2.methods.ActiveStakes(1, this.state.account).call()
                    for (var i=1; i<= ActiveStakes; i++ ){
                    var idestake = await contract2.methods.stakedTokenByIndex(1,this.state.account, [i-1]).call()
                    
       
              
                }
               
               this.state.contract2.methods.claimRewards(0,[idestake])
                .send({ from: this.state.account, gas: 1000000 })
              
              
                  .on('transactionHash', function(hash){
                    document.getElementById("web3_message").textContent="levantoandoooo...";
                  })
                  .on('receipt', function(receipt){
                    document.getElementById("web3_message").textContent="Success! Minting finished.";    })
                  .catch((revertReason) => {
                 //   getRevertReason(revertReason.receipt.transactionHash);
                  });
              
              }
  
  
    render(){
    return (




        
      <div className="">
        
     
        <button onClick={this.claimReward}>
            claimetwaeeeese
        </button>
  
      </div>
    );
    }
  }
  
  export default ClaimRewards;
  