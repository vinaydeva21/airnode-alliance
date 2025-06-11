
import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 40, className = "" }) => {
  return (
    <div 
      className={`relative ${className}`} 
      style={{ 
        width: size, 
        height: size 
      }}
    >
      <div 
        className="absolute inset-0 rounded-full bg-gradient-to-br from-ana-purple via-ana-pink to-ana-blue animate-pulse-slow"
        style={{ 
          filter: "blur(8px)",
          opacity: 0.7
        }}
      />
      <div 
        className="absolute inset-1 rounded-full bg-gradient-to-br from-ana-purple to-ana-pink overflow-hidden flex items-center justify-center"
      >
        <div className="w-3/4 h-3/4 rounded-full bg-ana-darkblue flex items-center justify-center">
          <div className="w-1/2 h-1/2 rounded-full bg-gradient-to-br from-ana-blue to-ana-purple" />
        </div>
      </div>
    </div>
  );
};

export default Logo;
