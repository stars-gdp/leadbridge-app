
import React from "react";
import { Task, useAppContext } from "@/context/AppContext";
import { format, isPast } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTaskCompletion, getLead } = useAppContext();
  const lead = getLead(task.leadId);
  
  const isOverdue = !task.completed && isPast(new Date(task.dueDate));
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy - h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div className={`flex items-start p-4 mb-2 rounded-lg border ${task.completed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200'}`}>
      <Checkbox 
        checked={task.completed}
        className="mt-0.5"
        onCheckedChange={() => toggleTaskCompletion(task.id)}
      />
      
      <div className="ml-3 flex-1">
        <p className={`text-sm font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
          {task.title}
        </p>
        
        <div className="flex justify-between items-center mt-1">
          <p className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
            {formatDate(task.dueDate)}
            {isOverdue && ' (Overdue)'}
          </p>
          
          {lead && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              {lead.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
