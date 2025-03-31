
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext, LeadStatus } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { ChevronLeft, MessageCircle, Calendar, Trash } from "lucide-react";
import { format } from "date-fns";
import TaskItem from "@/components/TaskItem";
import MeetingSection from "@/components/MeetingSection";

const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLead, updateLead, getLeadTasks, selectLead } = useAppContext();
  
  const [lead, setLead] = useState(getLead(id || ""));
  const [notes, setNotes] = useState(lead?.notes || "");
  const [status, setStatus] = useState<LeadStatus>(lead?.status || "contacted");
  const tasks = getLeadTasks(id || "");

  useEffect(() => {
    if (!lead) {
      navigate("/");
    }
  }, [lead, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = () => {
    if (lead) {
      updateLead(lead.id, { notes, status });
      // Update local state to reflect changes
      setLead({ ...lead, notes, status });
    }
  };

  const handleOpenChat = () => {
    if (lead) {
      selectLead(lead.id);
      navigate("/chat");
    }
  };

  if (!lead) return null;

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "hot":
        return "bg-lead-hot text-white";
      case "new":
        return "bg-lead-new text-white";
      case "cold":
        return "bg-lead-cold text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="mr-2 p-0 h-8 w-8"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">Lead Details</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{lead.name}</h2>
            <p className="text-gray-600">{lead.phone}</p>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagColor(lead.tag)}`}>
            {lead.tag.charAt(0).toUpperCase() + lead.tag.slice(1)}
          </span>
        </div>
        
        <div className="text-sm text-gray-500 mb-3">
          Last contacted: {formatDate(lead.lastContactDate)}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <Select 
            value={status} 
            onValueChange={(value: string) => setStatus(value as LeadStatus)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="negotiation">Negotiation</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <Textarea
            placeholder="Add notes about this lead..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={handleSave}
            className="flex-1 bg-blue-500 hover:bg-blue-600"
          >
            Save Changes
          </Button>
          <Button 
            onClick={handleOpenChat}
            variant="outline" 
            className="flex items-center"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Chat
          </Button>
        </div>
      </div>
      
      {/* Meetings Section */}
      {id && <MeetingSection leadId={id} />}
      
      {/* Related Tasks */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Tasks</h2>
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs"
          >
            <Calendar className="h-3.5 w-3.5 mr-1" />
            Add Task
          </Button>
        </div>
        
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No tasks for this lead</p>
            <Button 
              size="sm" 
              className="mt-2 bg-blue-500 hover:bg-blue-600"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Create Task
            </Button>
          </div>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Button 
          variant="outline" 
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <Trash className="h-4 w-4 mr-1" />
          Delete Lead
        </Button>
      </div>
    </div>
  );
};

export default LeadDetailPage;
