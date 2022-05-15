import React, { Component } from 'react';
import nftToken from "../abis/NFTERC721.json"
import caosToken from "../abis/TestERC20.json"
import nftStake from "../abis/NFTStake.json"
import Web3 from 'web3';
import '../assets/css/Workers.css'




class BalanceNftDashbord extends Component  {
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
        const networkId = 56;
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


                for (var i=1; i<= balance; i++ ){     
                    var nftId = await contract.methods.tokenOfOwnerByIndex(accounts[0],i-1).call()
                  
                    var nft10 = await contract.methods.nftID(nftId).call()
                    var nft2 = nft10.numero
                    var nft5 = nft10.pool
                    
                            
                    if(nft2 == 0){
                      nft2= "QmcufygVjEcF4kmjs3EMVDRkcG9WDhprANyF5DVbaRrBoX"
                    }else if(nft2 == 1){
                      nft2= "QmZf34aYSP4T846ZDYmWs3tNqGVujvwd3Zq46i8mC15nzd"
                    }else if(nft2 == 2){
                      nft2= "Qme7Y2g3kmRpjy5bFAdGYHLhkLjajwFseJHKHXenQjFmtA"
                     } else if(nft2 == 3){
                        nft2= "QmYzg7dVurMFbXSF11mBwtzKLgtXtoGFdNz8Whg63PoDh6"
                     }
                    var baseURI = await contract.methods.baseURI().call()
                    var apiJSON = baseURI + nft2;
                    var url = apiJSON;
                    fetch(url)
                        .then(response => response.json())
                        .then(data =>{
              
                            
                      
                             let element = document.getElementById("elem");
                             
                              element.innerHTML+= `<div className='card ' class="col-md-3 col-lg-3  col-xm-12 " ">
                              <img style="width:100%" src ="${data.image}"></img>
                
   
                              </div>`
                 
                 
                       
                           
                            
                 
        
                        }).catch(err=>console.log(err))            
                    }
                
    
              
                
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
    
           

  
  
    render(){
    return (




        
      <div className="container">
      

     
        <div id="elem" className='row'>


        </div>

      
     
  
      </div>
    );
    }
  }
  
  export default BalanceNftDashbord;
  