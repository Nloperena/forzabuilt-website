import { useState, useEffect } from 'react';

export const useNavigate = () => {
  return (path: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };
};

export const useParams = () => {
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Very basic param extraction from URL if needed
      // This is a fallback; it's better to pass params as props in Astro
      const parts = window.location.pathname.split('/').filter(Boolean);
      const mockParams: Record<string, string> = {};
      
      if (parts[0] === 'industries' && parts[1]) {
        mockParams.industry = parts[1];
      }
      if (parts[0] === 'products' && parts[1]) {
        mockParams.productCategory = parts[1];
      }
      
      setParams(mockParams);
    }
  }, []);

  return params;
};



