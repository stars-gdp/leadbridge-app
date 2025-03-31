
import React, { useState } from "react";
import { Meeting, MeetingType, MeetingStatus, useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, X, Plus } from "lucide-react";
import { format, isValid, parse } from "date-fns";

interface MeetingSectionProps {
  leadId: string;
}

const MeetingSection: React.FC<MeetingSectionProps> = ({ leadId }) => {
  const { getMeetingsByLead, addMeeting, updateMeeting, deleteMeeting } = useAppContext();
  const meetings = getMeetingsByLead(leadId);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMeetingType, setNewMeetingType] = useState<MeetingType>("BOM");
  const [newMeetingDate, setNewMeetingDate] = useState<Date | undefined>(undefined);

  const getMeetingStatusOptions = (type: MeetingType): MeetingStatus[] => {
    switch (type) {
      case "BOM":
        return ["BOM", "Show", "Not Interested"];
      case "BIT":
        return ["BIT", "Show", "Not Interested"];
      case "PT":
        return ["PT", "Show", "Not Interested"];
      case "WG 1":
      case "WG 2":
      case "WG 3":
        return ["code", "WG 1", "WG 2", "WG 3"];
      default:
        return ["Show", "Not Interested"];
    }
  };

  const handleAddMeeting = () => {
    if (!newMeetingType) return;
    
    const dateString = newMeetingDate 
      ? format(newMeetingDate, "yyyy-MM-dd") 
      : null;
    
    // Default status based on type
    const initialStatus = newMeetingType as MeetingStatus;
    
    addMeeting({
      type: newMeetingType,
      status: initialStatus,
      date: dateString,
      leadId
    });
    
    setShowAddForm(false);
    setNewMeetingType("BOM");
    setNewMeetingDate(undefined);
  };

  const handleUpdateMeetingStatus = (meetingId: string, status: string) => {
    updateMeeting(meetingId, { status: status as MeetingStatus });
  };

  const handleUpdateMeetingDate = (meetingId: string, date: Date | undefined) => {
    const dateString = date ? format(date, "yyyy-MM-dd") : null;
    updateMeeting(meetingId, { date: dateString });
  };

  const handleDeleteMeeting = (meetingId: string) => {
    deleteMeeting(meetingId);
  };

  const formatDateDisplay = (dateString: string | null) => {
    if (!dateString) return "No date set";
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, "MMMM d, yyyy") : "Invalid date";
    } catch (error) {
      return "Invalid date";
    }
  };

  const sortedMeetings = [...meetings].sort((a, b) => {
    // Sort by meeting type priority
    const typePriority: Record<MeetingType, number> = {
      "BOM": 1,
      "BIT": 2,
      "PT": 3,
      "WG 1": 4,
      "WG 2": 5,
      "WG 3": 6
    };
    
    return typePriority[a.type] - typePriority[b.type];
  });

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Meetings</h2>
        {!showAddForm && (
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Meeting
          </Button>
        )}
      </div>
      
      {showAddForm && (
        <div className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Add New Meeting</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              onClick={() => setShowAddForm(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Meeting Type
              </label>
              <Select 
                value={newMeetingType} 
                onValueChange={(value) => setNewMeetingType(value as MeetingType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BOM">BOM (First Meeting)</SelectItem>
                  <SelectItem value="BIT">BIT (Second Meeting)</SelectItem>
                  <SelectItem value="WG 1">WG 1 (Third Meeting)</SelectItem>
                  <SelectItem value="PT">PT (Fourth Meeting)</SelectItem>
                  <SelectItem value="WG 2">WG 2</SelectItem>
                  <SelectItem value="WG 3">WG 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Meeting Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    size="sm"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newMeetingDate ? format(newMeetingDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newMeetingDate}
                    onSelect={setNewMeetingDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <Button 
            size="sm" 
            className="w-full mt-1"
            onClick={handleAddMeeting}
          >
            Add Meeting
          </Button>
        </div>
      )}
      
      {sortedMeetings.length > 0 ? (
        <div className="space-y-2">
          {sortedMeetings.map((meeting) => (
            <div 
              key={meeting.id} 
              className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <div className="text-sm font-medium px-2 py-1 bg-gray-100 rounded">
                    {meeting.type}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <Select 
                    value={meeting.status || "none"} 
                    onValueChange={(value) => handleUpdateMeetingStatus(meeting.id, value)}
                  >
                    <SelectTrigger className="w-full text-sm py-1 h-8">
                      <SelectValue placeholder="Set status" />
                    </SelectTrigger>
                    <SelectContent>
                      {getMeetingStatusOptions(meeting.type).map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal text-sm py-1 h-8"
                        size="sm"
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {meeting.date 
                          ? formatDateDisplay(meeting.date) 
                          : "Set date"
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={meeting.date ? new Date(meeting.date) : undefined}
                        onSelect={(date) => handleUpdateMeetingDate(meeting.id, date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="ml-2 h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteMeeting(meeting.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No meetings scheduled</p>
          <Button 
            size="sm" 
            className="mt-2 bg-blue-500 hover:bg-blue-600"
            onClick={() => setShowAddForm(true)}
          >
            <CalendarIcon className="h-4 w-4 mr-1" />
            Schedule Meeting
          </Button>
        </div>
      )}
    </div>
  );
};

export default MeetingSection;
