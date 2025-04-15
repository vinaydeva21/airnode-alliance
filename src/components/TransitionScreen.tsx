
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface TransitionScreenProps {
  targetNetwork: string;
  redirectUrl?: string;
  onComplete?: () => void;
}

const TransitionScreen: React.FC<TransitionScreenProps> = ({ 
  targetNetwork, 
  redirectUrl,
  onComplete 
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for animation and then redirect
    const timer = setTimeout(() => {
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else if (onComplete) {
        onComplete();
      }
    }, 2000); // 2 seconds for transition

    return () => clearTimeout(timer);
  }, [redirectUrl, onComplete, navigate]);

  const getNetworkLogo = () => {
    if (targetNetwork === "ethereum") {
      return "/lovable-uploads/78957c5d-f008-4fef-bcea-71cf6e15aac6.png";
    } else if (targetNetwork === "cardano") {
      return "/lovable-uploads/68179fce-b792-49fe-929d-d919c7f3c82d.png";
    }
    return "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ana-darkblue">
      <div className="relative w-full h-full">
        {/* Light beam effect */}
        <div className="absolute top-0 left-1/2 h-full w-1/3 -translate-x-1/2 bg-gray-500/20 transform -skew-x-12" />
        
        {/* Network logo in the center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 border-2 border-ana-purple animate-pulse-slow">
          <img 
            src={getNetworkLogo()} 
            alt={`${targetNetwork} Network`}
            className="w-16 h-16 md:w-20 md:h-20"
          />
        </div>
      </div>
    </div>
  );
};

export default TransitionScreen;
