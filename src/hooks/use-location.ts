import { useState, useEffect } from 'react';

export const useLocation = () => {
  const [location, setLocation] = useState({
    pathname: typeof window !== 'undefined' ? window.location.pathname : '/',
    search: typeof window !== 'undefined' ? window.location.search : '',
    hash: typeof window !== 'undefined' ? window.location.hash : '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handlePopState = () => {
        setLocation({
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash,
        });
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  return location;
};




