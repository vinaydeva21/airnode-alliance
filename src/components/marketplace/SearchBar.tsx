
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import { toast } from "sonner";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(`Searching for "${searchQuery}"`, {
      description: "Filtering marketplace listings..."
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-10 p-6 bg-mono-gray-50 rounded-xl border border-mono-gray-200">
      <div className="relative flex-grow">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-mono-gray-400" size={18} />
        <Input 
          type="text" 
          placeholder="Search AirNodes..." 
          className="pl-12 bg-white border-mono-gray-300 text-mono-gray-900 placeholder:text-mono-gray-400 focus:border-mono-gray-500 rounded-lg h-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px] bg-white border-mono-gray-300 text-mono-gray-900 rounded-lg h-12">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-white border-mono-gray-200 text-mono-gray-900">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="sold-out">Sold Out</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="roi">
          <SelectTrigger className="w-[180px] bg-white border-mono-gray-300 text-mono-gray-900 rounded-lg h-12">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="bg-white border-mono-gray-200 text-mono-gray-900">
            <SelectItem value="roi">Highest ROI</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2 h-12 border-mono-gray-300 text-mono-gray-700 hover:bg-mono-gray-50">
          <Filter size={18} />
          Filters
        </Button>
        <Button type="submit" className="h-12 bg-mono-gray-900 hover:bg-mono-gray-800 text-white">
          Search
        </Button>
      </div>
    </form>
  );
};
