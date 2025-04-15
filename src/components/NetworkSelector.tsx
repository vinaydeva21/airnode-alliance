
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

  const handleNetworkChange = async (value: string) => {
    setSelectedNetwork(value);
    
    if (value === "ethereum") {
      try {
        await switchToSepolia();
        toast.success("Switched to Ethereum Sepolia network");
      } catch (error) {
        console.error("Failed to switch network:", error);
        toast.error("Failed to switch to Ethereum network");
      }
    } else if (value === "cardano") {
      toast.info("Redirecting to Cardano network...");
      window.open("https://airnode-alliance.netlify.app/", "_blank");
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
  );
};

export default NetworkSelector;
