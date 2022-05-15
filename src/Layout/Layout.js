import React from 'react'
import { Siderbar } from '../components/Siderbar'
import { Topbar } from '../components/Topbar'
import { ToogleContext } from './../context/ToogleContex';
import Footer from './../components/Footer';

const Layout = ({children}) => {
  const {toogle}=React.useContext(ToogleContext);
  return (

        
        <div className={toogle ?  'active-panel' :'panel'}>
              <Siderbar />
            <div className= 'top-bar'>
              <Topbar/>
            </div>
            <div className= 'main-content' >
                {children}
            </div> 
            <Footer/>  
        </div>
        

    
  )
}

export default Layout