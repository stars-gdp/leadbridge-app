
import React from "react";
import { useNavigate } from "react-router-dom";
import { Lead } from "@/context/AppContext";
import { formatDistanceToNow } from "date-fns";
import { Calendar } from "lucide-react";

interface LeadCardProps {
  lead: Lead;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const navigate = useNavigate();

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "contacted":
        return "bg-blue-100 text-blue-800";
      case "qualified":
        return "bg-green-100 text-green-800";
      case "negotiation":
        return "bg-purple-100 text-purple-800";
      case "closed":
        return "bg-emerald-100 text-emerald-800";
      case "lost":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleClick = () => {
    navigate(`/lead/${lead.id}`);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Get the latest meeting if any exists
  const latestMeeting = lead.meetings && lead.meetings.length > 0 
    ? lead.meetings.reduce((latest, meeting) => {
        if (!latest.date) return meeting;
        if (!meeting.date) return latest;
        return new Date(meeting.date) > new Date(latest.date) ? meeting : latest;
      }, lead.meetings[0])
    : null;

  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-4 mb-3 border border-gray-100 active:bg-gray-50 transition-colors"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">{lead.name}</h3>
          <p className="text-gray-600 text-sm">{lead.phone}</p>
          <p className="text-xs text-gray-500 mt-1">Added: {formatDate(lead.dateAdded)}</p>
          
          {latestMeeting && latestMeeting.date && (
            <div className="flex items-center mt-1 text-xs text-blue-600">
              <Calendar className="h-3 w-3 mr-1" />
              <span>
                {latestMeeting.type}: {formatDate(latestMeeting.date)}
              </span>
            </div>
          )}
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagColor(lead.tag)}`}>
          {lead.tag.charAt(0).toUpperCase() + lead.tag.slice(1)}
        </span>
      </div>
      
      <div className="flex justify-between items-center mt-3">
        <span className="text-xs text-gray-500">
          Last contact: {formatDate(lead.lastContactDate)}
        </span>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(lead.status)}`}>
            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
          </span>
          {lead.meetings.length > 0 && (
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
              {lead.meetings.length} {lead.meetings.length === 1 ? "meeting" : "meetings"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
