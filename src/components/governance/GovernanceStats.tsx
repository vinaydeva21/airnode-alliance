
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  value: string | number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label }) => {
  return (
    <Card className="glass-card">
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">{value}</div>
          <div className="text-sm text-white/70">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
};

interface GovernanceStatsProps {
  activeProposals: number;
  participationRate: number;
  votingPower: number;
}

const GovernanceStats: React.FC<GovernanceStatsProps> = ({ 
  activeProposals,
  participationRate,
  votingPower
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard value={activeProposals} label="Active Proposals" />
      <StatCard value={`${participationRate}%`} label="Governance Participation" />
      <StatCard value={votingPower.toLocaleString()} label="Your Voting Power" />
    </div>
  );
};

export default GovernanceStats;
