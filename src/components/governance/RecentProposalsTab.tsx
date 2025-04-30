
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { Proposal } from "@/types/governance";

interface RecentProposalsTabProps {
  proposals: Proposal[];
}

const RecentProposalsTab: React.FC<RecentProposalsTabProps> = ({ proposals }) => {
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
              </div>
              <Badge 
                variant="outline" 
                className={`${
                  proposal.status === "Passed" 
                    ? "bg-green-500/10 border-green-500/30" 
                    : "bg-red-500/10 border-red-500/30"
                } text-white flex items-center gap-1 h-fit`}
              >
                {proposal.status === "Passed" ? (
                  <CheckCircle size={14} />
                ) : (
                  <XCircle size={14} />
                )}
                {proposal.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">Final Results</span>
                  <span className="text-white">
                    {Math.round((proposal.votesFor / proposal.totalVotes) * 100)}% For |  
                    {Math.round((proposal.votesAgainst / proposal.totalVotes) * 100)}% Against
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="flex h-2 overflow-hidden text-xs rounded-full bg-ana-darkblue">
                    <div
                      style={{ width: `${(proposal.votesFor / proposal.totalVotes) * 100}%` }}
                      className="bg-green-500"
                    ></div>
                    <div
                      style={{ width: `${(proposal.votesAgainst / proposal.totalVotes) * 100}%` }}
                      className="bg-red-500"
                    ></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-start">
                    <div 
                      className="h-full w-[2px] bg-white"
                      style={{ left: `${proposal.threshold}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs mt-2">
                  <span className="text-white/50">{proposal.endTime}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecentProposalsTab;
