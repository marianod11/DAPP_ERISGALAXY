import React from 'react'
import logo  from  '../assets/img/ISOLOGOTIPO.png'
import { Link ,useLocation } from 'react-router-dom'
import NavLinks  from '../assets/Json/Navlink.json'


export const Siderbar = () => {

let location = useLocation();
const[activate,setactivate]=React.useState(location.pathname);

    return ( 
    <div className= 'siderbar' >
        <div className='siderbar-header'>
            <div className="siderbar-logo-container">
                <div className='logo-container'>
                    <img className="logo-sidebar "src={logo} alt="" />
                </div>
      
              
            </div>
        </div>
        <div className="siderbar-body">
            <ul className="navigation-list">
                    {
                    NavLinks.map((item) => (
                        <li className={ activate === item.path ? 'navigation-list-item activate':'navigation-list-item'} key={item.key}  >
                            <Link className='navigation-link ' to={''+item.path} onClick={()=>{setactivate(''+item.path)} }  >
                                <p>{''+item.name}</p >
                            </Link>
                        </li>
                    ))
                    }           
            </ul>
        </div>
    </div>
    )
}
