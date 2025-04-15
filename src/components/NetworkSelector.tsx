
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useWeb3 } from "@/contexts/Web3Context";
import TransitionScreen from "./TransitionScreen";

interface NetworkSelectorProps {
  className?: string;
  variant?: "default" | "minimal";
}

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({ 
  className = "",
  variant = "default"
}) => {
  const { switchToSepolia } = useWeb3();
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum");
  const [showTransition, setShowTransition] = useState(false);
  const [transitionNetwork, setTransitionNetwork] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  const handleNetworkChange = async (value: string) => {
    if (value === selectedNetwork) return;
    
    if (value === "ethereum") {
      setTransitionNetwork("ethereum");
      setShowTransition(true);
      
      try {
        await switchToSepolia();
        setSelectedNetwork(value);
        setTimeout(() => setShowTransition(false), 2000);
        toast.success("Switched to Ethereum Sepolia network");
      } catch (error) {
        console.error("Failed to switch network:", error);
        setShowTransition(false);
        toast.error("Failed to switch to Ethereum network");
      }
    } else if (value === "cardano") {
      setTransitionNetwork("cardano");
      setRedirectUrl("https://airnode-alliance.netlify.app/");
      setShowTransition(true);
      toast.info("Switching to Cardano network...");
    }
  };

  const renderNetworkIcon = (network: string) => {
    if (network === "ethereum") {
      return (
        <img 
          src="/lovable-uploads/78957c5d-f008-4fef-bcea-71cf6e15aac6.png" 
          alt="Ethereum"
          className="w-6 h-6"
        />
      );
    } else if (network === "cardano") {
      return (
        <img 
          src="/lovable-uploads/68179fce-b792-49fe-929d-d919c7f3c82d.png" 
          alt="Cardano"
          className="w-6 h-6"
        />
      );
    }
    return null;
  };

  return (
    <>
      {showTransition && (
        <TransitionScreen 
          targetNetwork={transitionNetwork} 
          redirectUrl={redirectUrl}
          onComplete={() => setShowTransition(false)}
        />
      )}
      
      <Select value={selectedNetwork} onValueChange={handleNetworkChange}>
        <SelectTrigger 
          className={`${
            variant === "minimal" 
              ? "bg-transparent border-0 hover:bg-ana-purple/20 p-2" 
              : "bg-ana-darkblue/50 border-ana-purple/30 text-white w-full md:w-auto"
          } ${className}`}
        >
          <SelectValue>
            {renderNetworkIcon(selectedNetwork)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-ana-darkblue border-ana-purple/30 text-white">
          <SelectItem value="ethereum" className="flex items-center gap-2 hover:bg-ana-purple/20">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/78957c5d-f008-4fef-bcea-71cf6e15aac6.png" 
                alt="Ethereum"
                className="w-6 h-6"
              />
              <span>Ethereum</span>
            </div>
          </SelectItem>
          <SelectItem value="cardano" className="flex items-center gap-2 hover:bg-ana-purple/20">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/68179fce-b792-49fe-929d-d919c7f3c82d.png" 
                alt="Cardano"
                className="w-6 h-6"
              />
              <span>Cardano</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default NetworkSelector;
