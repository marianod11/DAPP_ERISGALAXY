import React, { Component } from 'react';
import nftToken from "../abis/NFTERC721.json"
import caosToken from "../abis/TestERC20.json"
import nftStake from "../abis/NFTStake.json"
import Web3 from 'web3';



class CreatePool extends Component  {



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
