
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
        className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-mono-gray-300 animate-pulse-slow"
        style={{ 
          filter: "blur(4px)",
          opacity: 0.6
        }}
      />
      <div 
        className="absolute inset-1 rounded-full bg-gradient-to-br from-mono-gray-100 to-mono-gray-400 overflow-hidden flex items-center justify-center border border-mono-gray-300"
      >
        <div className="w-3/4 h-3/4 rounded-full bg-mono-gray-900 flex items-center justify-center border border-mono-gray-600">
          <div className="w-1/2 h-1/2 rounded-full bg-gradient-to-br from-mono-gray-200 to-mono-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default Logo;
