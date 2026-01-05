import React from 'react';

interface LogoProps {
  className?: string;
  isScrolled?: boolean;
  isWhiteBackground?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = 'h-10 w-auto', isScrolled = false, isWhiteBackground = false }) => {
  // Use white logo when transparent background, blue logo when white background
  // This matches the original site behavior: white logo on transparent/dark backgrounds, blue on white backgrounds
  const logoSrc = isWhiteBackground 
    ? '/logos/Forza-Eagle-Logo-Blue.svg' 
    : '/logos/Forza-Eagle-Logo-White.svg';

  return (
    <a href="/" className="flex items-center">
      <img 
        key={logoSrc}
        src={logoSrc}
        alt="Forza Logo"
        className={className}
      />
    </a>
  );
};  

export default Logo; 
