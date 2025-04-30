
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ThumbsUp, ThumbsDown, Ban } from "lucide-react";
import { Proposal } from "@/types/governance";

interface ActiveProposalsTabProps {
  proposals: Proposal[];
  onVote: (proposalId: string, voteType: "For" | "Against" | "Abstain") => void;
}

const ActiveProposalsTab: React.FC<ActiveProposalsTabProps> = ({ proposals, onVote }) => {
  return (
    <div className="space-y-6">
      {proposals.map((proposal) => (
        <Card key={proposal.id} className="glass-card overflow-hidden">
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-white">{proposal.title}</CardTitle>
                  {proposal.category && (
                    <Badge variant="outline" className="bg-ana-darkblue/50 border-ana-purple/30 ml-2">
                      {proposal.category}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-white/70 mt-1">
                  {proposal.description}
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-ana-blue/10 border-ana-blue/30 text-white flex items-center gap-1 h-fit whitespace-nowrap">
                <Clock size={14} />
                {proposal.endTime}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">Current Votes</span>
                  <span className="text-white">
                    {Math.round((proposal.votesFor / proposal.totalVotes) * 100) || 0}% For |  
                    {Math.round((proposal.votesAgainst / proposal.totalVotes) * 100) || 0}% Against |  
                    {Math.round(((proposal.abstain || 0) / proposal.totalVotes) * 100) || 0}% Abstain
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="flex h-2 overflow-hidden text-xs rounded-full bg-ana-darkblue">
                    <div
                      style={{ width: `${(proposal.votesFor / proposal.totalVotes) * 100 || 0}%` }}
                      className="bg-green-500 transition-all"
                    ></div>
                    <div
                      style={{ width: `${(proposal.votesAgainst / proposal.totalVotes) * 100 || 0}%` }}
                      className="bg-red-500 transition-all"
                    ></div>
                    <div
                      style={{ width: `${((proposal.abstain || 0) / proposal.totalVotes) * 100 || 0}%` }}
                      className="bg-gray-500 transition-all"
                    ></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-start">
                    <div 
                      className="h-full w-[2px] bg-white"
                      style={{ left: `${proposal.threshold}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-white/50">0%</span>
                  <span className="text-white/50">Threshold: {proposal.threshold}%</span>
                  <span className="text-white/50">100%</span>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 gap-2"
                  onClick={() => onVote(proposal.id, "Against")}
                >
                  <ThumbsDown size={16} />
                  Vote Against
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-transparent border-gray-500/30 text-gray-400 hover:bg-gray-500/10 hover:text-gray-300 gap-2"
                  onClick={() => onVote(proposal.id, "Abstain")}
                >
                  <Ban size={16} />
                  Abstain
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-transparent border-green-500/30 text-green-400 hover:bg-green-500/10 hover:text-green-300 gap-2"
                  onClick={() => onVote(proposal.id, "For")}
                >
                  <ThumbsUp size={16} />
                  Vote For
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ActiveProposalsTab;
