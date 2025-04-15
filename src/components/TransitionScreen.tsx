
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-ana-darkblue">
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
        {/* Animated background rays - making sure they cover the full screen */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="absolute top-1/2 left-1/2 h-[300%] w-[300%] -translate-x-1/2 -translate-y-1/2">
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-ana-purple/5 animate-pulse-slow" />
            <div className="absolute top-0 left-1/4 h-full w-1/6 -translate-x-1/2 bg-ana-purple/20 transform -skew-x-12 animate-pulse-slow" />
            <div className="absolute top-0 left-2/4 h-full w-1/6 -translate-x-1/2 bg-ana-purple/20 transform -skew-x-12 animate-pulse-slow" style={{ animationDelay: '0.3s' }} />
            <div className="absolute top-0 left-3/4 h-full w-1/6 -translate-x-1/2 bg-ana-purple/20 transform -skew-x-12 animate-pulse-slow" style={{ animationDelay: '0.6s' }} />
            <div className="absolute top-0 right-1/4 h-full w-1/6 -translate-x-1/2 bg-ana-purple/20 transform skew-x-12 animate-pulse-slow" style={{ animationDelay: '0.9s' }} />
          </div>
        </div>
        
        {/* Network logo in the center */}
        <div className="relative z-10 bg-white rounded-full p-4 shadow-lg shadow-ana-purple/30 border-4 border-ana-purple animate-pulse-slow">
          <img 
            src={getNetworkLogo()} 
            alt={`${targetNetwork} Network`}
            className="w-24 h-24 md:w-32 md:h-32"
          />
        </div>
        
        {/* Network name */}
        <div className="relative z-10 mt-8 text-white">
          <h2 className="text-2xl md:text-3xl font-bold capitalize text-center animate-pulse-slow">
            {targetNetwork === "cardano" ? "Switching to Cardano Network" : "Switching to Ethereum Network"}
          </h2>
          <p className="mt-2 text-center text-white/70">Please wait while we connect you...</p>
        </div>
      </div>
    </div>
  );
};

export default TransitionScreen;
