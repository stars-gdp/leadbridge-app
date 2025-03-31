
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import TaskItem from "@/components/TaskItem";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Plus, Filter } from "lucide-react";

const TasksPage: React.FC = () => {
  const { tasks } = useAppContext();
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);
  
  const filteredTasks = tasks.filter(task => {
    if (filterCompleted === null) return true;
    return task.completed === filterCompleted;
  });

  // Sort tasks - incomplete first, then by due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Sort by completion status first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then sort by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Tasks</h1>
        <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
          <Plus className="h-4 w-4 mr-1" /> Add Task
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center text-sm text-gray-600">
          {sortedTasks.length} {sortedTasks.length === 1 ? 'task' : 'tasks'} found
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setFilterCompleted(null)}>
                All Tasks
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCompleted(false)}>
                Active Tasks
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCompleted(true)}>
                Completed Tasks
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div>
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No tasks found</p>
            <Button 
              size="sm" 
              className="mt-2 bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-1" /> Add your first task
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
