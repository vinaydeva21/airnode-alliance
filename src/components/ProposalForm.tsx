
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, LucideCalendar } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface ProposalFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (proposal: any) => void;
}

const ProposalForm: React.FC<ProposalFormProps> = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("treasury");
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default 7 days from now
  );
  const [threshold, setThreshold] = useState("51");
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("treasury");
    setEndDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    setThreshold("51");
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category || !endDate) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const newProposal = {
      id: `prop-${Date.now().toString(36)}`,
      title,
      description,
      category,
      endDate,
      threshold: parseInt(threshold),
      status: "Active",
      endTime: "7 days left",
      votesFor: 0,
      votesAgainst: 0,
      abstain: 0,
      totalVotes: 0,
      createdAt: new Date(),
    };
    
    onSubmit(newProposal);
    resetForm();
    onClose();
    
    toast.success("Proposal created", {
      description: "Your proposal has been submitted for voting",
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-card text-white max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Proposal</DialogTitle>
          <DialogDescription className="text-white/70">
            Submit a new proposal for the AirNode Alliance community to vote on.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Proposal Title</Label>
            <Input
              id="title"
              placeholder="Enter a clear, concise title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-ana-darkblue/50 border-ana-purple/30 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide details about your proposal and its benefits"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-ana-darkblue/50 border-ana-purple/30 text-white min-h-[120px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="bg-ana-darkblue/50 border-ana-purple/30 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-ana-darkblue border-ana-purple/30 text-white">
                <SelectItem value="treasury">Treasury Allocation</SelectItem>
                <SelectItem value="governance">Governance Change</SelectItem>
                <SelectItem value="technical">Technical Upgrade</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Voting End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-ana-darkblue/50 border-ana-purple/30 text-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-ana-darkblue border-ana-purple/30">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className="bg-ana-darkblue text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="threshold">Approval Threshold (%)</Label>
              <Input
                id="threshold"
                type="number"
                min="1"
                max="100"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="bg-ana-darkblue/50 border-ana-purple/30 text-white"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="bg-transparent">
              Cancel
            </Button>
            <Button type="submit">Submit Proposal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalForm;
