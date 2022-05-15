import React from 'react'
import A29  from '../assets/img/A29.png'
import panel from '../assets/img/panel.png'
export const Robot = () => {
  return (
    <div> 
        <img  className='panel-robot' src={panel} alt="" />
        <img className='robot'src={A29} alt="" />
       
    </div>
  )
}
