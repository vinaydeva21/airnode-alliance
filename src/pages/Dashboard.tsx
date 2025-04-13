import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import NetworkBackground from "@/components/NetworkBackground";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useWeb3 } from "@/contexts/Web3Context";
import { WifiHigh, Clock, BarChart3, Zap } from "lucide-react";
import ClaimRewardsButton from "@/components/dashboard/ClaimRewardsButton";

interface NetworkStats {
  totalNodes: number;
  totalStaked: number;
  activeNodes: number;
  avgUptime: number;
  avgEarnings: number;
  reward: number;
}

interface AirNodeData {
  id: string;
  name: string;
  location: string;
  uptime: number;
  earnings: number;
  roi: number;
}

const mockAirNodes: AirNodeData[] = [
  {
    id: "node-1",
    name: "AirNode Alpha",
    location: "New York, USA",
    uptime: 99.9,
    earnings: 125,
    roi: 15.2,
  },
  {
    id: "node-2",
    name: "AirNode Beta",
    location: "London, UK",
    uptime: 99.5,
    earnings: 110,
    roi: 14.8,
  },
  {
    id: "node-3",
    name: "AirNode Gamma",
    location: "Tokyo, Japan",
    uptime: 99.7,
    earnings: 130,
    roi: 15.5,
  },
];

const Dashboard = () => {
  const { web3State } = useWeb3();
  const [isLoading, setIsLoading] = useState(true);
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    totalNodes: 0,
    totalStaked: 0,
    activeNodes: 0,
    avgUptime: 0,
    avgEarnings: 0,
    reward: 0
  });

  useEffect(() => {
    // Simulate fetching data from an API or blockchain
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate loading time
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock data for network stats
      const mockStats: NetworkStats = {
        totalNodes: 450,
        totalStaked: 120000,
        activeNodes: 420,
        avgUptime: 99.8,
        avgEarnings: 115,
        reward: 3.75
      };

      setNetworkStats(mockStats);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <NetworkBackground>
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-20">
        <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
        
        {/* Network Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-ana-purple/20 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <WifiHigh className="h-5 w-5 mr-2 text-green-400" />
                Total AirNodes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "Loading..." : networkStats.totalNodes}</div>
              <div className="text-sm text-muted-foreground">Across the network</div>
            </CardContent>
          </Card>

          <Card className="border border-ana-purple/20 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-400" />
                Average Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "Loading..." : `${networkStats.avgUptime}%`}</div>
              <div className="text-sm text-muted-foreground">Last 24 hours</div>
            </CardContent>
          </Card>

          <Card className="border border-ana-purple/20 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-orange-400" />
                Average Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "Loading..." : `$${networkStats.avgEarnings}`}</div>
              <div className="text-sm text-muted-foreground">Per day, per node</div>
            </CardContent>
          </Card>

           <Card className="border border-ana-purple/20 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                Your Reward
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "Loading..." : `${networkStats.reward} ANA`}</div>
              <div className="text-sm text-muted-foreground">Claim your rewards</div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="nodes">My AirNodes</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="staking">Staking</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="border border-ana-purple/20 bg-card/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Network Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Nodes</div>
                    <div className="text-2xl font-bold">{networkStats.totalNodes}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Staked</div>
                    <div className="text-2xl font-bold">{networkStats.totalStaked}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Active Nodes</div>
                    <div className="text-2xl font-bold">{networkStats.activeNodes}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Average Uptime</div>
                    <div className="text-2xl font-bold">{networkStats.avgUptime}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Rewards Card - Updated to include the ClaimRewardsButton */}
            <Card className="border border-ana-purple/20 bg-card/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  Claimable Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Available to claim</div>
                    <div className="text-2xl font-bold">{networkStats.reward.toFixed(2)} ANA</div>
                  </div>
                  <Progress value={75} className="w-24 h-2" />
                </div>
                <div className="text-xs text-muted-foreground mb-4">
                  Next rewards in <span className="font-medium">12 hours 24 minutes</span>
                </div>
                
                {/* New ClaimRewardsButton component */}
                <ClaimRewardsButton availableRewards={networkStats.reward} />
              </CardContent>
            </Card>
            
            <Card className="border border-ana-purple/20 bg-card/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-none space-y-3">
                  <li className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Rewards Claimed</div>
                      <div className="text-sm text-muted-foreground">1 hour ago</div>
                    </div>
                    <div className="text-green-500">+2.5 ANA</div>
                  </li>
                  <li className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Staked ANA</div>
                      <div className="text-sm text-muted-foreground">3 hours ago</div>
                    </div>
                    <div className="text-blue-500">-10 ANA</div>
                  </li>
                  <li className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Node Uptime Increased</div>
                      <div className="text-sm text-muted-foreground">5 hours ago</div>
                    </div>
                    <div className="text-green-500">+0.1%</div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My AirNodes Tab */}
          <TabsContent value="nodes" className="space-y-6">
            <Card className="border border-ana-purple/20 bg-card/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">My AirNodes</CardTitle>
              </CardHeader>
              <CardContent>
                {mockAirNodes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockAirNodes.map((node) => (
                      <div key={node.id} className="bg-card/40 rounded-lg p-4">
                        <div className="font-medium">{node.name}</div>
                        <div className="text-sm text-muted-foreground">{node.location}</div>
                        <div className="text-sm mt-2">Uptime: {node.uptime}%</div>
                        <div className="text-sm">Earnings: ${node.earnings}/day</div>
                        <div className="text-sm">ROI: {node.roi}%</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    No AirNodes connected to your account.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <Card className="border border-ana-purple/20 bg-card/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Earnings Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$450.25</div>
                <div className="text-sm text-muted-foreground">Total earnings this month</div>
                <div className="mt-4">
                  <div className="text-sm text-muted-foreground">Last Payout</div>
                  <div className="font-medium">March 15, 2025</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staking Tab */}
          <TabsContent value="staking" className="space-y-6">
            <Card className="border border-ana-purple/20 bg-card/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Staking Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1250 ANA</div>
                <div className="text-sm text-muted-foreground">Currently staked</div>
                <div className="mt-4">
                  <div className="text-sm text-muted-foreground">Next Reward</div>
                  <div className="font-medium">In 7 days</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </NetworkBackground>
  );
};

export default Dashboard;
