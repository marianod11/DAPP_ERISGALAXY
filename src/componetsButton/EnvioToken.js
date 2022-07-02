import React, { Component } from 'react';
import nftToken from "../abis/NFTERC721.json"
import caosToken from "../abis/TestERC20.json"
import nftStake from "../abis/NFTStake.json"
import Web3 from 'web3';



class EnvioToken extends Component  {



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
