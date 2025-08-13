// contexts/OrientationContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const OrientationContext = createContext();

export function OrientationProvider({ children }) {
  const [deviceState, setDeviceState] = useState({
    isPortrait: false,
    isTooSmall: false,
    status: 'ok',
  });

  useEffect(() => {
    const checkDevice = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      const isTooSmall = window.innerWidth < 640;
      let status = 'ok';

      if (isPortrait) status = 'portrait';
      else if (isTooSmall) status = 'tooSmall';

      setDeviceState({ isPortrait, isTooSmall, status });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return (
    <OrientationContext.Provider value={deviceState}>
      {children}
    </OrientationContext.Provider>
  );
}

export function useOrientation() {
  return useContext(OrientationContext);
}
