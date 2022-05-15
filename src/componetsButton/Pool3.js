import '../assets/css/BalanceNft.css'
import '../assets/css/Workers.css'
import React, { Component } from 'react';
import nftToken from "../abis/NFTERC721.json"
import caosToken from "../abis/TestERC20.json"
import nftStake from "../abis/NFTStake.json"
import Web3 from 'web3';


class Pool3 extends Component {
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
              
              

                const Pool = await contract2.methods.ActiveStakes(3, accounts[0] ).call()
                document.getElementById("poolNumero4").textContent=Pool;

     
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
            
                          
                    
                           let element = document.getElementById("elem3");
                           
                           if(nft5 == 3){

                          
                            element.innerHTML+= `  <div className='card ' style="text-align:center"  >
                            <img style="width:100%;border-radius: 10px" src ="${data.image}"></img>
       
                            <div style="display:flex; ">
                            <button class='btn-pool2 mx-auto approve3'  data-id='${nftId}' > appoveeee </button>
                            <button class='btn-pool2 mx-auto stake3' data-id='${nftId}'  data-pool='${nft5}' > stakeee </button>
                            </div>
                            </div>`
               
                            document.querySelectorAll(".stake3").forEach((button) => {
                              button.addEventListener("click", this.enterStaking);  
                           
                          });
                          document.querySelectorAll(".approve3").forEach((button) => {
                           button.addEventListener("click", this.approve)
                          });
      
                        }
                         
                          
               
      
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
            
              await contract.methods.approve("0x2bEb03BF67F091C0405E8d55B48439D4EbfBcF5C",ids)
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

           claimReward = async () => {
                const web3 = window.web3
                const networkId = 56
                const networkData2 = nftStake.networks[networkId]
                const abi2 = nftStake.abi
                const address2 = networkData2.address
                const contract2 = new web3.eth.Contract(abi2, address2)

                 let ActiveStakes = await contract2.methods.ActiveStakes(3, this.state.account).call()
                    for (var i=1; i<= ActiveStakes; i++ ){
                    var idestake = await contract2.methods.stakedTokenByIndex(3,this.state.account, [i-1]).call()
                    
       
              
                }
               
               this.state.contract2.methods.claimRewards(3,[idestake])
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
                  <div className='card-pool-active row mt-2'> 
                        <div className='text-pool col-md-8 col-sm-12'>
                           <h1 className='tittle-pool'>POOL : LEGENDARIO </h1> 
                           <h3><span id='poolNumero4'> - </span> /4</h3>
                           <p> APY 100% 45 DAYS</p>
                        </div>
                        <div className='container-btn col-md-4 col-sm-12 mx-auto'>
                            <button className='btn-pool col-sm-12  mt-4' >
                               UnStake
                           </button>
                           <button  onClick={this.claimReward} className='btn-pool col-sm-12 mt-2' >
                               Claim Reward
                           </button>
                        </div> 

                        <div className='nft-item col-md-12 row   mx-auto  '>
                            <div className=' col-lg-3 col-md-6 mx-auto mint'  id="elem3">
                            
                      </div>
     
       
     </div> 

 </div>
    
  
  )
}
}

export default Pool3;