
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ThumbsUp, ThumbsDown, Ban } from "lucide-react";
import { Vote } from "@/types/governance";

interface MyVotesTabProps {
  votes: Vote[];
}

const MyVotesTab: React.FC<MyVotesTabProps> = ({ votes }) => {
  return (
    <>
      {votes.length > 0 ? (
        <div className="space-y-4">
          {votes.map((vote, index) => (
            <Card key={`${vote.proposalId}-${index}`} className="glass-card">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-white">{vote.proposalTitle}</h3>
                    <p className="text-sm text-white/70">
                      {vote.timestamp.toLocaleDateString()} at {vote.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge 
                    className={`${
                      vote.vote === "For" ? "bg-green-500/20" :
                      vote.vote === "Against" ? "bg-red-500/20" : "bg-gray-500/20"
                    } text-white`}
                  >
                    {vote.vote === "For" && <ThumbsUp size={14} className="mr-1" />}
                    {vote.vote === "Against" && <ThumbsDown size={14} className="mr-1" />}
                    {vote.vote === "Abstain" && <Ban size={14} className="mr-1" />}
                    {vote.vote}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">My Voting History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <AlertTriangle size={40} className="mx-auto mb-4 text-white/30" />
              <p className="text-white/70">You haven't voted on any proposals yet.</p>
              <p className="text-white/50 text-sm mt-2">Active proposals can be found in the "Active Proposals" tab.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default MyVotesTab;
