import React,  { Component } from 'react'
import nftToken from "../abis/NFTERC721.json"
import caosToken from "../abis/TestERC20.json"
import nftStake from "../abis/NFTStake.json"
import Web3 from 'web3';
import BalanceNftDashbord from "../componetsButton/BalanceNftDashbord"
import '../assets/css/Dashboard.css'
import Card from '../components/Card';
import CreatePool from '../componetsButton/CreatePool';
import EnvioToken from '../componetsButton/EnvioToken';
const BN = require('bn.js');



class Dashboard extends Component {

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
    const balanceBNB = await web3.eth.getBalance(accounts[0])/1000000000000000000
    this.setState({balanceBNB: balanceBNB})
    this.setState({account: accounts[0]})
    const networkId = 56
    const networkData = nftToken.networks[networkId]
    const networkData1 = caosToken.networks[networkId]
    const networkData2 = nftStake.networks[networkId]

          if(networkData,networkData1,networkData2) {
            const abi = nftToken.abi
            const abi1 = caosToken.abi
         
      
            const address = networkData.address
            const address1 = networkData1.address
            
            var BN = web3.utils.BN;
          
            const contract = new web3.eth.Contract(abi, address)
            const contract1 = new web3.eth.Contract(abi1, address1)
          
            const balance = await contract.methods.balanceOf(accounts[0]).call()
            document.getElementById("balance").textContent=balance
           
            this.setState({contract})

            const totalmint = await contract.methods.totalMint().call()
            


            var balance1 = await contract1.methods.balanceOf(accounts[0]).call()
            document.getElementById("totalToken").textContent = balance1/1000000000000000000

       
           
            this.setState({contract1})

          
            
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
            balanceBNB : ""
           
          }
        }


  render(){
  return (
<div className = 'Page-dashboard container'>
          <div className='tittle-card ' >
            <h1 className='tittle pt-4 text-center '> DASHBOARD </h1>


          </div>
          
          <div className='row pt-4'>
         
            <Card name='Account' content={this.state.account}/>
            <div className='col-md-3 pt-2  col-sm-6'>
                            <div className=" card-container ">
                            <div className='card'>
                            <div className='card-content'>
                            <div className = 'name-card'> <h2>Balance NFT</h2> </div>
                            <div className= 'contentBx'>
                              <h3 id="balance" ></h3> 
                            
                      </div>
                     </div>
                          

                   </div>
               </div>
            </div>
         <div className='col-md-3 pt-2  col-sm-6'>
                <div className=" card-container ">
                <div className='card'>
                <div className='card-content'>
                <div className = 'name-card'> <h2>Total Token</h2> </div>
                <div className= 'contentBx'>
                  <h3 id="totalToken" ></h3> 
                 
                    </div>
                  </div>
             

                  </div>
                  </div>
            </div>
            <Card name='Total BNB' content={this.state.balanceBNB}/>
          </div>
 
     
      
          <h2 className="pt-4 text-white">ROBOTS Y NFT</h2>
          <div className='row'>
         
            <BalanceNftDashbord></BalanceNftDashbord>
          </div>
          





    </div>
  )
  }
}

export default Dashboard

