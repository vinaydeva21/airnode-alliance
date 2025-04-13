
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useWeb3 } from "@/contexts/Web3Context";
import { Loader2 } from "lucide-react";

interface ClaimRewardsButtonProps {
  availableRewards?: number;
}

const ClaimRewardsButton = ({ availableRewards = 0 }: ClaimRewardsButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { web3State } = useWeb3();

  const handleClaimRewards = async () => {
    if (!web3State.connected) {
      toast.error("Please connect your wallet to claim rewards");
      return;
    }

    if (availableRewards <= 0) {
      toast.error("No rewards available to claim");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call/blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Rewards claimed successfully!", {
        description: `You claimed ${availableRewards.toFixed(2)} ANA tokens`
      });
      
      // In a real implementation, we would call the contract method here
      // await stakingContract.claimRewards();
    } catch (error) {
      console.error("Error claiming rewards:", error);
      toast.error("Failed to claim rewards");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClaimRewards}
      disabled={isLoading || availableRewards <= 0 || !web3State.connected}
      className="w-full bg-ana-purple hover:bg-ana-purple/90"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Claiming...
        </>
      ) : (
        "Claim Rewards"
      )}
    </Button>
  );
};

export default ClaimRewardsButton;
