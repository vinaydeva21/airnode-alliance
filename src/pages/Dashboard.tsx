import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import { CircleDollarSign, Clock, User } from "lucide-react";

const Dashboard = () => {
  const userShares = [
    {
      id: "portal-180",
      name: "Portal 180",
      location: "Nairobi, Kenya",
      owned: 50,
      totalShares: 1000,
      value: 2250,
      imageUrl: "/lovable-uploads/944059d9-4b2a-4ce4-a703-1df8d972e858.png",
    },
    {
      id: "portal-360",
      name: "Portal 360",
      location: "Lagos, Nigeria",
      owned: 25,
      totalShares: 1000,
      value: 1500,
      imageUrl: "/lovable-uploads/b43073b7-44b5-4631-b30f-dc3671d1e301.png",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "Reward",
      amount: "$12.50",
      date: "Today, 2:30 PM",
      status: "Completed",
    },
    {
      id: 2,
      type: "Purchase",
      amount: "$1,500.00",
      date: "Yesterday",
      status: "Completed",
    },
    {
      id: 3,
      type: "Vote",
      proposal: "Treasury Expansion",
      date: "3 days ago",
      status: "Completed",
    },
  ];

  return (
    <NetworkBackground>
      {/* <Navbar /> */}

      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-white/70">Welcome back, User</p>
            </div>
            <Button>Claim Rewards</Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-white/70 text-sm font-normal flex items-center gap-2">
                  <CircleDollarSign size={16} className="text-ana-purple" />
                  Total Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">$3,750.00</div>
                <div className="text-sm text-white/50">
                  +5.2% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-white/70 text-sm font-normal flex items-center gap-2">
                  <User size={16} className="text-ana-purple" />
                  Total Shares Owned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">75</div>
                <div className="text-sm text-white/50">Across 2 AirNodes</div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-white/70 text-sm font-normal flex items-center gap-2">
                  <Clock size={16} className="text-ana-purple" />
                  Pending Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">$150.00</div>
                <div className="text-sm text-white/50">
                  Next distribution: 2 days
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="assets" className="mt-8">
            <TabsList className="bg-ana-darkblue/50 border border-ana-purple/20">
              <TabsTrigger value="assets">My Assets</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
              <TabsTrigger value="governance">Governance</TabsTrigger>
            </TabsList>

            {/* Assets Tab */}
            <TabsContent value="assets" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userShares.map((share) => (
                  <Card key={share.id} className="glass-card overflow-hidden">
                    <div className="flex">
                      <div className="w-1/3">
                        <img
                          src={share.imageUrl}
                          alt={share.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-2/3 p-4">
                        <h3 className="font-semibold text-white">
                          {share.name}
                        </h3>
                        <p className="text-sm text-white/70 mb-2">
                          {share.location}
                        </p>

                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white/70">Ownership</span>
                            <span className="text-white">
                              {share.owned}/{share.totalShares}
                            </span>
                          </div>
                          <Progress
                            value={(share.owned / share.totalShares) * 100}
                            className="h-2 bg-ana-darkblue"
                          />
                        </div>

                        <div className="flex justify-between mt-4">
                          <div>
                            <div className="text-sm text-white/70">Value</div>
                            <div className="font-semibold text-white">
                              ${share.value}
                            </div>
                          </div>
                          <Button size="sm">Manage</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex justify-between items-center pb-4 border-b border-ana-purple/10"
                      >
                        <div>
                          <div className="font-medium text-white">
                            {activity.type}
                          </div>
                          <div className="text-sm text-white/70">
                            {activity.amount || activity.proposal}
                          </div>
                          <div className="text-xs text-white/50">
                            {activity.date}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-ana-purple/10 border-ana-purple/20 text-white"
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Placeholders for other tabs */}
            <TabsContent value="rewards" className="mt-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">Rewards History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">
                    Your rewards history and statistics will appear here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="governance" className="mt-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">
                    Governance Participation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">
                    Your voting history and active proposals will appear here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </NetworkBackground>
  );
};

export default Dashboard;
