
import React from "react";
import { 
  Gem, Split, Users, TrendingUp, BarChart3, ArrowRight, 
  ArrowUpRight, Wallet, Clock, RefreshCcw
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const AdminOverview = () => {
  // Sample stats data - in a real app, this would come from your API or blockchain
  const stats = {
    totalNFTs: 128,
    mintedThisMonth: 12,
    totalFractions: 128000,
    fractionsSold: 82450,
    totalUsers: 3895,
    totalRevenue: 412500,
    averagePrice: 45,
    performance: {
      uptime: 99.7,
      earnings: 2.8,
      roi: 21.6
    },
    recentTransactions: [
      { id: "tx-1", type: "buy", user: "0x1a2...3b4c", amount: 25, time: "10:30 AM" },
      { id: "tx-2", type: "buy", user: "0x4d5...6e7f", amount: 100, time: "09:15 AM" },
      { id: "tx-3", type: "stake", user: "0x8g9...0h1i", amount: 50, time: "Yesterday" },
      { id: "tx-4", type: "buy", user: "0x2j3...4k5l", amount: 75, time: "Yesterday" },
    ]
  };

  // Chart for NFT Sales (simplified representation)
  const chartData = [10, 25, 15, 30, 20, 35, 25, 40, 30, 45, 35, 50];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-ana-darkblue/50 border-gray-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total AirNodes</CardTitle>
            <CardDescription className="text-gray-400">NFTs minted and active</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{stats.totalNFTs}</div>
              <div className="p-2 bg-blue-900/30 rounded-full">
                <Gem className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-green-400 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{stats.mintedThisMonth} this month
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-ana-darkblue/50 border-gray-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Fractions</CardTitle>
            <CardDescription className="text-gray-400">Fractions created / sold</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{stats.totalFractions.toLocaleString()}</div>
              <div className="p-2 bg-purple-900/30 rounded-full">
                <Split className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              {stats.fractionsSold.toLocaleString()} sold ({Math.round(stats.fractionsSold / stats.totalFractions * 100)}%)
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-ana-darkblue/50 border-gray-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Users</CardTitle>
            <CardDescription className="text-gray-400">Platform participants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <div className="p-2 bg-green-900/30 rounded-full">
                <Users className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              Across {stats.totalNFTs} AirNodes
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-ana-darkblue/50 border-gray-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Revenue</CardTitle>
            <CardDescription className="text-gray-400">Platform revenue in USDC</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <div className="p-2 bg-amber-900/30 rounded-full">
                <Wallet className="h-6 w-6 text-amber-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              Avg. ${stats.averagePrice} per fraction
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-ana-darkblue/50 border-gray-700 text-white lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              AirNode Fractions Sales
            </CardTitle>
            <CardDescription className="text-gray-300">
              Sales volume over the last 12 weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {chartData.map((value, index) => (
                <div key={index} className="relative w-full h-full flex flex-col justify-end items-center">
                  <div
                    className="w-full bg-ana-purple/80 hover:bg-ana-purple rounded-t transition-colors"
                    style={{ height: `${(value / 50) * 100}%` }}
                  />
                  <span className="absolute bottom-[-20px] text-xs text-gray-400">W{index + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full text-gray-300 border-gray-700 hover:bg-gray-800">
              View Detailed Analytics
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-ana-darkblue/50 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              Recent Transactions
            </CardTitle>
            <CardDescription className="text-gray-300">
              Latest activity on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      tx.type === 'buy' ? 'bg-green-900/30' : 'bg-blue-900/30'
                    }`}>
                      {tx.type === 'buy' ? (
                        <Wallet className="h-4 w-4 text-green-400" />
                      ) : (
                        <RefreshCcw className="h-4 w-4 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white capitalize">{tx.type}</div>
                      <div className="text-xs text-gray-400">{tx.user}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white">{tx.amount} fractions</div>
                    <div className="text-xs text-gray-400">{tx.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full text-gray-300 border-gray-700 hover:bg-gray-800">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              View All Transactions
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <Card className="bg-ana-darkblue/50 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Gem className="h-4 w-4 mr-2" />
              Mint New AirNode
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Split className="h-4 w-4 mr-2" />
              Manage Fractions
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <ArrowRight className="h-4 w-4 mr-2" />
              View Marketplace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
