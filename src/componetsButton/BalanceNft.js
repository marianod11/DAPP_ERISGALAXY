import React, { Component } from 'react';
import nftToken from "../abis/NFTERC721.json"
import caosToken from "../abis/TestERC20.json"
import nftStake from "../abis/NFTStake.json"
import Web3 from 'web3'
import '../assets/css/Workers.css'


class BalanceNft extends Component  {
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


                for (var i=1; i<= balance; i++ ){     
                    var nftId = await contract.methods.tokenOfOwnerByIndex(accounts[0],i-1).call()
                  
                    var nft10 = await contract.methods.nftID(i-1).call()
                    var nft2 = nft10.numero
                    var nft5 = nft10.pool
                    
                            
                    if(nft2 == 0){
                      nft2= "QmUZ2bixbn1u7TLLMEtg7Cgjgfdyby92eD6w9g365DQTqH"
                    }else if(nft2 == 1){
                      nft2= "QmThQcenWos8wNA14SDcVjtCLUK3zm8KU8TBaH3CBkHapQ"
                    }else if(nft2 == 2){
                      nft2= "QmUZ2bixbn1u7TLLMEtg7Cgjgfdyby92eD6w9g365DQTqH"
                     } else if(nft2 == 3){
                        nft2= "QmThQcenWos8wNA14SDcVjtCLUK3zm8KU8TBaH3CBkHapQ"
                     }
                    var baseURI = await contract.methods.baseURI().call()
                    var apiJSON = baseURI + nft2;
                    var url = apiJSON;
                    fetch(url)
                        .then(response => response.json())
                        .then(data =>{
              
                            
                      
                             let element = document.getElementById("elem");
                             
                              element.innerHTML+= `  <div className='card ' ">
                              <img style="width:10%" src ="${data.image}"></img>
                              <p style="color:white">${data.name}</p>
                              <p style="color:white">ID: ${nftId}</p>
                              <p style="color:white">POOL: ${nft5}</p>
                              <button class="approve"   data-id='${nftId}' > appoveeee </button>
                              <button class="stake"  data-id='${nftId}'  data-pool='${nft5}' > stakeee </button>
                              </div>`
                 
                              document.querySelectorAll(".stake").forEach((button) => {
                                button.addEventListener("click", this.enterStaking);  
                             
                            });
                            document.querySelectorAll(".approve").forEach((button) => {
                             button.addEventListener("click", this.approve)
                            });
        
                       
                           
                            
                 
        
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
    
               async approve() {

                const web3 = window.web3
                const networkId = 56
                const networkData = nftToken.networks[networkId]
                const abi = nftToken.abi
                const address = networkData.address
                const contract = new web3.eth.Contract(abi, address)
                const accounts = await web3.eth.getAccounts()
                
                let ids = this.dataset.id;
                console.log(ids)
            
              await contract.methods.approve("0xCF4bF4422fDb257FC52C5af9942f9BcBB936aF72",ids)
                  .send({ from: accounts[0], gas: 1111110 }) 
                  .on('transactionHash', function(hash){
                    document.getElementById("web3_message").textContent="enviandooooo...";
                  })
                  .on('receipt', function(receipt){
                    document.getElementById("web3_message").textContent="Success! enviado finished.";    })
                  .catch((revertReason) => {
                   //getRevertReason(revertReason.receipt.transactionHash);
                  });
              }

              async enterStaking() {

                const web3 = window.web3
                const networkId = 56
                const networkData2 = nftStake.networks[networkId]
                const abi2 = nftStake.abi
                const address2 = networkData2.address
                const contract2 = new web3.eth.Contract(abi2, address2)
                const accounts = await web3.eth.getAccounts()

                let ids = this.dataset.id;
                let pool2 = this.dataset.pool;
                console.log(pool2)
              
                await contract2.methods.enterStaking(pool2,[ids])
                .send({ from: accounts[0], gas: 1111110  })
              
                  .on('transactionHash', function(hash){
                    document.getElementById("web3_message").textContent="stalkeandooo...";
                  })
                  .on('receipt', function(receipt){
                    document.getElementById("web3_message").textContent="Success! stalkingg finished.";    })
                  .catch((revertReason) => {
                  //  getRevertReason(revertReason.receipt.transactionHash);
                  });
              
              }

  
  
    render(){
    return (




        
      <div className="">
        
     
        <div id="elem" className='col-12 mint'>

            </div>


          
     
  
      </div>
    );
    }
  }
  
  export default BalanceNft;
  