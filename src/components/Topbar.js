import React from 'react'
import {FaBars} from 'react-icons/fa'
import { ToogleContext } from './../context/ToogleContex';
import WalletConnet from './WalletConnet';


export const Topbar = () => {
  const {toogle,settoogle}=React.useContext(ToogleContext);
  return (
    <div className='navigationBar'>
        <button id="sidebartoogle" className='btn sidebartoogle' onClick={()=>{settoogle(!toogle)}}  >
        <FaBars/>
        </button>
            <WalletConnet/>
       
        
    </div>
  )
}
