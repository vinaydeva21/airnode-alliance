"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ActivitySquare,
  Search,
  Filter,
  Package,
  Divide,
  ListPlus,
  Calendar,
} from "lucide-react";

// Mock activity data
const mockActivity = [
  {
    id: "act-1",
    type: "mint",
    timestamp: new Date(2023, 10, 15, 14, 30),
    details: "Portal 180 NFT minted",
    user: "0x1a2...3b4c",
    status: "completed",
  },
  {
    id: "act-2",
    type: "fractionalize",
    timestamp: new Date(2023, 10, 15, 15, 45),
    details: "Portal 180 fractionalized into 1000 shares",
    user: "0x1a2...3b4c",
    status: "completed",
  },
  {
    id: "act-3",
    type: "list",
    timestamp: new Date(2023, 10, 15, 16, 20),
    details: "800 Portal 180 fractions listed at $0.15 each",
    user: "0x1a2...3b4c",
    status: "completed",
  },
  {
    id: "act-4",
    type: "mint",
    timestamp: new Date(2023, 10, 16, 9, 15),
    details: "Portal 360 NFT minted",
    user: "0x1a2...3b4c",
    status: "completed",
  },
  {
    id: "act-5",
    type: "fractionalize",
    timestamp: new Date(2023, 10, 16, 10, 30),
    details: "Portal 360 fractionalized into 1000 shares",
    user: "0x1a2...3b4c",
    status: "completed",
  },
  {
    id: "act-6",
    type: "list",
    timestamp: new Date(2023, 10, 16, 11, 45),
    details: "600 Portal 360 fractions listed at $0.20 each",
    user: "0x1a2...3b4c",
    status: "completed",
  },
  {
    id: "act-7",
    type: "mint",
    timestamp: new Date(2023, 10, 18, 14, 10),
    details: "Nexus I NFT minted",
    user: "0x1a2...3b4c",
    status: "pending",
  },
];

// Activity type icon mapping
const activityIcons: Record<string, React.ReactNode> = {
  mint: <Package className="h-4 w-4" />,
  fractionalize: <Divide className="h-4 w-4" />,
  list: <ListPlus className="h-4 w-4" />,
};

// Activity type color mapping
const activityColors: Record<string, string> = {
  mint: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  fractionalize: "bg-purple-500/20 text-purple-500 border-purple-500/30",
  list: "bg-green-500/20 text-green-500 border-green-500/30",
};

// Status color mapping
const statusColors: Record<string, string> = {
  completed: "bg-green-500/20 text-green-500",
  pending: "bg-yellow-500/20 text-yellow-500",
  failed: "bg-red-500/20 text-red-500",
};

export default function ActivityTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  // Filter activities based on search term and type filter
  const filteredActivity = mockActivity.filter((activity) => {
    const matchesSearch = activity.details
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter ? activity.type === filter : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={filter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(null)}
          >
            All
          </Button>
          <Button
            variant={filter === "mint" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("mint")}
            className="flex items-center gap-1"
          >
            <Package size={16} />
            Mints
          </Button>
          <Button
            variant={filter === "fractionalize" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("fractionalize")}
            className="flex items-center gap-1"
          >
            <Divide size={16} />
            Fractions
          </Button>
          <Button
            variant={filter === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("list")}
            className="flex items-center gap-1"
          >
            <ListPlus size={16} />
            Listings
          </Button>
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-ana-purple/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ActivitySquare className="h-6 w-6 text-ana-purple" />
            Admin Activity Log
          </CardTitle>
          <CardDescription>
            Track all AirNode NFT minting, fractionalization, and marketplace
            listing activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivity.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <ActivitySquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No activities found</p>
              </div>
            ) : (
              filteredActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded-md bg-card/30 border border-ana-purple/10 hover:border-ana-purple/30 transition-colors"
                >
                  <div
                    className={`h-10 w-10 rounded-md flex items-center justify-center ${
                      activityColors[activity.type]
                    }`}
                  >
                    {activityIcons[activity.type]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium truncate">{activity.details}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                          statusColors[activity.status]
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="flex items-center gap-1 mr-4">
                        <Calendar size={14} />
                        {activity.timestamp.toLocaleString()}
                      </span>
                      <span className="truncate">Admin: {activity.user}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {filteredActivity.length > 0 && (
            <div className="mt-6 flex justify-between items-center text-sm text-muted-foreground">
              <span>
                Showing {filteredActivity.length} of {mockActivity.length}{" "}
                activities
              </span>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
