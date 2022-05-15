import React from 'react'
import '../assets/css/BalanceNft.css'
import robot from '../assets/img/robot.webm'
import Pool0 from "../componetsButton/Pool0"
import Pool1 from "../componetsButton/Pool1"
import Pool2 from "../componetsButton/Pool2"
import Pool3 from "../componetsButton/Pool3"

const BalanceNftP = () => {
  return (

    <div className='row pt-4 ml-2'>
          <div className="col-md-12  ">
                          
         <Pool0/>
         <Pool1/>
         <Pool2/>
         <Pool3/>

           
            
        </div>
  
       
    </div>
  
  )
}

export default BalanceNftP