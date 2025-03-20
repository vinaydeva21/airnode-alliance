
import React from "react";
import { 
  FileCheck, ArrowUpRight, Gem, Split, 
  Store, RefreshCcw, CalendarClock, Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ActivityItem = {
  id: string;
  type: "mint" | "fractionalize" | "list" | "update";
  targetId: string;
  targetName: string;
  timestamp: Date;
  performer: string;
  details: string;
};

export const AdminActivityLog = () => {
  // Sample activity log data
  const activities: ActivityItem[] = [
    {
      id: "act-1",
      type: "mint",
      targetId: "portal-180",
      targetName: "Portal 180",
      timestamp: new Date(2024, 2, 20, 10, 30),
      performer: "Admin",
      details: "Minted new AirNode NFT located in Nairobi, Kenya"
    },
    {
      id: "act-2",
      type: "fractionalize",
      targetId: "portal-180",
      targetName: "Portal 180",
      timestamp: new Date(2024, 2, 20, 10, 32),
      performer: "Admin",
      details: "Fractionalized into 1,000 shares"
    },
    {
      id: "act-3",
      type: "list",
      targetId: "portal-180",
      targetName: "Portal 180",
      timestamp: new Date(2024, 2, 20, 10, 35),
      performer: "Admin",
      details: "Listed on marketplace at 45 USDC per fraction"
    },
    {
      id: "act-4",
      type: "mint",
      targetId: "nexus-1",
      targetName: "Nexus I",
      timestamp: new Date(2024, 2, 19, 14, 45),
      performer: "Admin",
      details: "Minted new AirNode NFT located in Addis Ababa, Ethiopia"
    },
    {
      id: "act-5",
      type: "update",
      targetId: "portal-360",
      targetName: "Portal 360",
      timestamp: new Date(2024, 2, 18, 9, 15),
      performer: "Admin",
      details: "Updated performance metrics to reflect 99.8% uptime"
    },
  ];

  // Icon map for different activity types
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "mint":
        return <Gem className="h-4 w-4 text-blue-400" />;
      case "fractionalize":
        return <Split className="h-4 w-4 text-purple-400" />;
      case "list":
        return <Store className="h-4 w-4 text-green-400" />;
      case "update":
        return <RefreshCcw className="h-4 w-4 text-amber-400" />;
      default:
        return <FileCheck className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-ana-darkblue/50 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-blue-400" />
            Activity Log
          </CardTitle>
          <CardDescription className="text-gray-300">
            Recent actions performed on the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Action</TableHead>
                <TableHead className="text-gray-300">Target</TableHead>
                <TableHead className="text-gray-300 hidden md:table-cell">Details</TableHead>
                <TableHead className="text-gray-300">Time</TableHead>
                <TableHead className="text-gray-300 text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id} className="border-gray-700 hover:bg-gray-800/50">
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center gap-2">
                      {getActivityIcon(activity.type)}
                      <span className="capitalize">{activity.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{activity.targetName}</div>
                      <div className="text-sm text-gray-400">{activity.targetId}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-300">{activity.details}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span className="whitespace-nowrap">
                        {activity.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <CalendarClock className="h-3 w-3" />
                      <span>
                        {activity.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="p-1 hover:bg-gray-700 rounded-full transition-colors">
                      <ArrowUpRight className="h-4 w-4 text-gray-400" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
