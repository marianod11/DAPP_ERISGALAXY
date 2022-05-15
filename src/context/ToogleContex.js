import React from 'react';

export const ToogleContext=React.createContext();

export const ToogleProvider= ({children})=>{
    const [toogle,settoogle]=React.useState(true)
    return(
    
        <ToogleContext.Provider value={{ toogle, settoogle }}>
            { children }
        </ToogleContext.Provider>
        )
    
}

