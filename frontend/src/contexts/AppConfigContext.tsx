import React, { ReactNode, createContext, useState, useEffect } from 'react';
import { fetchAppConfigState } from '../api/index.js';
import { useLocation } from 'react-router-dom';

export const AppConfigContext = createContext({
  isConfigured: false,
  refreshConfig: () => {}
});

// TODO: change name to something more appropriate 
export const AppConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isConfigured, setIsConfigured] = useState(false);
    const location = useLocation();
  
    const refreshConfig = async () => {
      const config = await fetchAppConfigState();
      setIsConfigured(config.isApiKeySet);
    };
  
    useEffect(() => {
      refreshConfig();

      // TODO add a temrinating function for this
    }, [location]);
  
    return (
      <AppConfigContext.Provider value={{ isConfigured, refreshConfig }}>
        {children}
      </AppConfigContext.Provider>
    );
  };