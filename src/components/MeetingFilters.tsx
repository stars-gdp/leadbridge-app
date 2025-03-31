
import React from "react";
import { MeetingType, MeetingStatus } from "@/context/AppContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MeetingFiltersProps {
  typeFilter: MeetingType | "";
  statusFilter: MeetingStatus | "";
  onTypeFilterChange: (value: MeetingType | "") => void;
  onStatusFilterChange: (value: MeetingStatus | "") => void;
  onClearFilters: () => void;
}

const MeetingFilters: React.FC<MeetingFiltersProps> = ({
  typeFilter,
  statusFilter,
  onTypeFilterChange,
  onStatusFilterChange,
  onClearFilters,
}) => {
  // Get meeting status options based on selected meeting type
  const getStatusOptions = (type: MeetingType | ""): MeetingStatus[] => {
    if (!type) return ["Show", "Not Interested"];

    switch (type) {
      case "BOM":
        return ["BOM", "Show", "Not Interested"];
      case "BIT":
        return ["BIT", "Show", "Not Interested"];
      case "PT":
        return ["PT", "Show", "Not Interested"];
      case "WG":
        return ["code", "WG 1", "WG 2", "WG 3", "Not Interested"];
      default:
        return ["Show", "Not Interested"];
    }
  };

  const statusOptions = getStatusOptions(typeFilter);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 bg-gray-50 p-3 rounded-lg">
      <div className="flex-1 min-w-[150px]">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Filter by Type
        </label>
        <Select
          value={typeFilter}
          onValueChange={(value) => {
            onTypeFilterChange(value as MeetingType | "");
            // Reset status filter if changing type
            if (statusFilter && !getStatusOptions(value as MeetingType).includes(statusFilter)) {
              onStatusFilterChange("");
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All types</SelectItem>
            <SelectItem value="BOM">BOM (First Meeting)</SelectItem>
            <SelectItem value="BIT">BIT (Second Meeting)</SelectItem>
            <SelectItem value="PT">PT (Third Meeting)</SelectItem>
            <SelectItem value="WG">WG (Workshop)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Filter by Status
        </label>
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusFilterChange(value as MeetingStatus | "")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(typeFilter || statusFilter) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="mt-auto mb-1"
        >
          <X className="h-4 w-4 mr-1" />
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default MeetingFilters;
