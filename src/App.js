import React, { Component } from 'react';
import './App.css';
import {BrowserRouter ,Routes, Route} from 'react-router-dom';
import Layout from './Layout/Layout';
import Dashboard from './pages/Dashboard';
import Workers from './pages/Workers';
import BountyNFT from './pages/BountyNFT';
import Support from './pages/Support'
import MarketPlace from './pages/MarketPlace'
import { ToogleProvider } from './context/ToogleContex';



class App extends Component  {





  render(){
  return (
 
     <ToogleProvider>
        <BrowserRouter>
          <Layout>
              <Routes>
                <Route path='/' element={<Dashboard/>}/>
                <Route path='/workers' element={<Workers/>}/>
                <Route path='/DroidNft' element={<BountyNFT/>}/>
                <Route path='/Marketplace' element={<MarketPlace/>}/>
                <Route path='/Support' element={<Support/>}/>
              </Routes>
          </Layout>      
      </BrowserRouter>
    </ToogleProvider>

  );
  }
}

export default App;
