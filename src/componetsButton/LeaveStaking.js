import React, { Component } from 'react';
import nftToken from "../abis/NFTERC721.json"
import caosToken from "../abis/TestERC20.json"
import nftStake from "../abis/NFTStake.json"
import Web3 from 'web3';



class LeaveStaking extends Component  {
 

              leaveStaking = async () => {
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
               
               this.state.contract2.methods.leaveStaking(1,[idestake])
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
        
     
        <button onClick={this.leaveStaking}>
            levantarrrrr
        </button>
  
      </div>
    );
    }
  }
  
  export default LeaveStaking;
  
