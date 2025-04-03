"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import ProposalForm from "@/components/ProposalForm";
import { toast } from "sonner";
import { Clock, CheckCircle, Users, BarChart3, FileText } from "lucide-react";

// Import types
import { Proposal, Vote, TreasuryData } from "@/types/governance";

// Import components
import ActiveProposalsTab from "@/components/governance/ActiveProposalsTab";
import RecentProposalsTab from "@/components/governance/RecentProposalsTab";
import MyVotesTab from "@/components/governance/MyVotesTab";
import TreasuryTab from "@/components/governance/TreasuryTab";
import GovernanceStats from "@/components/governance/GovernanceStats";

const Governance = () => {
  // State for proposals
  const [activeProposals, setActiveProposals] = useState<Proposal[]>([
    {
      id: "prop-001",
      title: "Increase Treasury Allocation for New AirNodes",
      description:
        "Proposal to increase treasury allocation for purchasing new AirNodes from 20% to 30% of monthly revenue.",
      status: "Active",
      endTime: "3 days left",
      votesFor: 65,
      votesAgainst: 15,
      abstain: 20,
      totalVotes: 100,
      threshold: 51,
      category: "treasury",
    },
    {
      id: "prop-002",
      title: "Reduce Staking Lock Period",
      description:
        "Reduce the minimum staking lock period from 90 days to 60 days to increase liquidity.",
      status: "Active",
      endTime: "5 days left",
      votesFor: 40,
      votesAgainst: 35,
      abstain: 10,
      totalVotes: 85,
      threshold: 51,
      category: "governance",
    },
  ]);

  const [recentProposals, setRecentProposals] = useState<Proposal[]>([
    {
      id: "prop-000",
      title: "Add Support for Layer 2 Solutions",
      status: "Passed",
      endTime: "Ended 2 days ago",
      votesFor: 82,
      votesAgainst: 8,
      totalVotes: 90,
      threshold: 51,
      category: "technical",
    },
    {
      id: "prop-00a",
      title: "Introduce Tiered Reward Structure",
      status: "Rejected",
      endTime: "Ended 1 week ago",
      votesFor: 30,
      votesAgainst: 60,
      totalVotes: 90,
      threshold: 51,
      category: "treasury",
    },
  ]);

  // State for votes
  const [myVotes, setMyVotes] = useState<Vote[]>([
    {
      proposalId: "prop-000",
      proposalTitle: "Add Support for Layer 2 Solutions",
      vote: "For",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ]);

  // State for wallet and proposal form
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);

  // Mock treasury data
  const treasuryData: TreasuryData = {
    totalBalance: 2450000,
    allocation: {
      newAirNodes: 25,
      rewards: 45,
      operations: 20,
      reserve: 10,
    },
    recentTransactions: [
      {
        id: "tx-001",
        description: "Monthly rewards distribution",
        amount: -125000,
        date: "Dec 01, 2023",
      },
      {
        id: "tx-002",
        description: "New AirNode acquisition",
        amount: -350000,
        date: "Nov 15, 2023",
      },
      {
        id: "tx-003",
        description: "Revenue from existing AirNodes",
        amount: 425000,
        date: "Nov 01, 2023",
      },
    ],
  };

  // Handle voting
  const handleVote = (
    proposalId: string,
    voteType: "For" | "Against" | "Abstain"
  ) => {
    setActiveProposals((prevProposals) =>
      prevProposals.map((proposal) => {
        if (proposal.id === proposalId) {
          const updatedProposal = { ...proposal };

          if (voteType === "For") {
            updatedProposal.votesFor += 1;
          } else if (voteType === "Against") {
            updatedProposal.votesAgainst += 1;
          } else if (
            voteType === "Abstain" &&
            updatedProposal.abstain !== undefined
          ) {
            updatedProposal.abstain += 1;
          }

          updatedProposal.totalVotes += 1;
          return updatedProposal;
        }
        return proposal;
      })
    );

    const votedProposal = activeProposals.find((p) => p.id === proposalId);
    if (votedProposal) {
      setMyVotes((prev) => [
        ...prev,
        {
          proposalId,
          proposalTitle: votedProposal.title,
          vote: voteType,
          timestamp: new Date(),
        },
      ]);

      toast.success(`Vote cast: ${voteType}`, {
        description: `You voted on "${votedProposal.title.substring(
          0,
          30
        )}..."`,
      });
    }
  };

  // Handle proposal creation
  const handleCreateProposal = (newProposal: Proposal) => {
    setActiveProposals((prev) => [newProposal, ...prev]);
  };

  // Simulated wallet connection effect
  useEffect(() => {
    const checkWalletStatus = () => {
      setIsWalletConnected(true);
    };

    const timer = setTimeout(checkWalletStatus, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <NetworkBackground>
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Governance</h1>
              <p className="text-white/70">
                Shape the future of AirNode Alliance
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <Button
                onClick={() => setShowProposalForm(true)}
                className="flex gap-2"
              >
                <FileText size={16} />
                Create Proposal
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <GovernanceStats
            activeProposals={14}
            participationRate={78}
            votingPower={3250}
          />

          {/* Main Content Tabs */}
          <Tabs defaultValue="active" className="mt-8">
            <TabsList className="bg-ana-darkblue/50 border border-ana-purple/20">
              <TabsTrigger value="active" className="gap-2">
                <Clock size={14} />
                Active Proposals
              </TabsTrigger>
              <TabsTrigger value="recent" className="gap-2">
                <CheckCircle size={14} />
                Recent Proposals
              </TabsTrigger>
              <TabsTrigger value="my" className="gap-2">
                <Users size={14} />
                My Votes
              </TabsTrigger>
              <TabsTrigger value="treasury" className="gap-2">
                <BarChart3 size={14} />
                Treasury
              </TabsTrigger>
            </TabsList>

            {/* Active Proposals Tab */}
            <TabsContent value="active" className="mt-6">
              <ActiveProposalsTab
                proposals={activeProposals}
                onVote={handleVote}
              />
            </TabsContent>

            {/* Recent Proposals Tab */}
            <TabsContent value="recent" className="mt-6">
              <RecentProposalsTab proposals={recentProposals} />
            </TabsContent>

            {/* My Votes Tab */}
            <TabsContent value="my" className="mt-6">
              <MyVotesTab votes={myVotes} />
            </TabsContent>

            {/* Treasury Tab */}
            <TabsContent value="treasury" className="mt-6">
              <TreasuryTab treasuryData={treasuryData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ProposalForm
        open={showProposalForm}
        onClose={() => setShowProposalForm(false)}
        onSubmit={handleCreateProposal}
      />

      <Footer />
    </NetworkBackground>
  );
};

export default Governance;
