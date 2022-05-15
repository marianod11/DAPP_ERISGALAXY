import React from 'react'

export default function Card({name ,content}) {
  return (
    <div className='col-md-3 pt-2  col-sm-6'>
    <div className=" card-container ">
       <div className='card'>
          <div className='card-content'>
            <div className = 'name-card'> <h2>{name}</h2> </div>
            <div className= 'contentBx'>
                {name==='Account' ? <h4 >{content}</h4>:<h3 >{content}</h3> }
                 
            </div>
           </div>
             

       </div>
       </div>
</div>
  )
}
