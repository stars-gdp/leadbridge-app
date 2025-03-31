
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import LeadCard from "@/components/LeadCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const LeadsPage: React.FC = () => {
  const { leads } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredLeads = leads.filter(lead => {
    // Search by name or phone
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      lead.phone.includes(searchQuery);
    
    // Filter by tag if selected
    const matchesTag = filterTag ? lead.tag === filterTag : true;
    
    // Filter by status if selected
    const matchesStatus = filterStatus ? lead.status === filterStatus : true;
    
    return matchesSearch && matchesTag && matchesStatus;
  });

  const handleClearFilters = () => {
    setFilterTag(null);
    setFilterStatus(null);
  };

  return (
    <div className="p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Leads</h1>
        <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
          <Plus className="h-4 w-4 mr-1" /> Add Lead
        </Button>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search leads..."
          className="pl-9 bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center text-sm text-gray-600">
          {filteredLeads.length} {filteredLeads.length === 1 ? 'lead' : 'leads'} found
        </div>
        
        <div className="flex items-center">
          {(filterTag || filterStatus) && (
            <button 
              className="text-blue-500 text-sm mr-2"
              onClick={handleClearFilters}
            >
              Clear filters
            </button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setFilterTag("hot")}>
                  <span className="w-2 h-2 rounded-full bg-lead-hot mr-2"></span>
                  Hot
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterTag("new")}>
                  <span className="w-2 h-2 rounded-full bg-lead-new mr-2"></span>
                  New
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterTag("cold")}>
                  <span className="w-2 h-2 rounded-full bg-lead-cold mr-2"></span>
                  Cold
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setFilterStatus("contacted")}>
                  Contacted
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("qualified")}>
                  Qualified
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("negotiation")}>
                  Negotiation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("closed")}>
                  Closed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("lost")}>
                  Lost
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div>
        {filteredLeads.length > 0 ? (
          filteredLeads.map(lead => (
            <LeadCard key={lead.id} lead={lead} />
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No leads found</p>
            {searchQuery || filterTag || filterStatus ? (
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            ) : (
              <Button 
                size="sm" 
                className="mt-2 bg-blue-500 hover:bg-blue-600"
              >
                <Plus className="h-4 w-4 mr-1" /> Add your first lead
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsPage;
