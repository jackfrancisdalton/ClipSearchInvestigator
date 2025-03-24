import { ReactNode, createContext, useState, useEffect } from 'react';
import { fetchAppConfigState } from '../api/index.js';
import { useLocation } from 'react-router-dom';

export const AppConfigContext = createContext({
  isConfigured: false,
  refreshConfig: () => {}
});

export const AppConfigProvider = ({ children }: { children: ReactNode }) => {
    const [isConfigured, setIsConfigured] = useState(false);
    const location = useLocation();
  
    const refreshConfig = async () => {
      const config = await fetchAppConfigState();
      setIsConfigured(config.isApiKeySet);
    };
  
    useEffect(() => {
      refreshConfig();
    }, [location]);
  
    return (
      <AppConfigContext.Provider value={{ isConfigured, refreshConfig }}>
        {children}
      </AppConfigContext.Provider>
    );
  };