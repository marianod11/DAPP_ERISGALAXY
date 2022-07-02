import React, { Component } from 'react';
import nftToken from "../abis/NFTERC721.json"
import caosToken from "../abis/TestERC20.json"
import nftStake from "../abis/NFTStake.json"
import Web3 from 'web3'
import '../assets/css/Workers.css'


class BalanceNft extends Component  {
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
  
