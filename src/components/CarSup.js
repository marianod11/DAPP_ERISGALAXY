import React from 'react'
import logo from '../assets/img/ISOLOGOTIPO.png'
import '../assets/css/CardSup.css'
const CardSup = () => {
  return (
    
<div className="containers">
  <div className="cards">
    <div className="card-imgs">
      <a><img src={logo}/></a>
      
      
    </div>
    <div className="card-contents">
      <h2 className="big-titles">SUPPORT</h2>
      <h3 className="medium-titles">FOR ANY REPORT OR CONTACT, COMMUNICATE WITH THE DEVS THROUGH THE DISCORD SERVER IN THE SUPPORT SECTION</h3>
    </div>
    
    <div className='icons' > 

        <a href="https://t.me/erisGalaxyCo" ><i className="fab fa-telegram-plane icons2"></i></a>
        <a href="https://twitter.com/GalaxyEris" ><i className="fab fa-twitter icons2"></i></a>
        <a href="https://discord.com/invite/9CDkv4svYv" ><i className="fab fa-discord icons2"></i></a>
        <a href="" ><i className="fab fa-medium-m icons2"></i></a>
        <a href="https://www.instagram.com/erisgalaxyofficial/?hl=es-la" ><i class="fab fa-instagram icons2"></i></a>
  </div>


  </div>
</div>
  )
}

export default CardSup