
import React, { createContext, useContext, useState, useEffect } from "react";

// Define types
export type LeadTag = "hot" | "new" | "cold";

export type LeadStatus = "contacted" | "qualified" | "negotiation" | "closed" | "lost";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  tag: LeadTag;
  status: LeadStatus;
  lastContactDate: string;
  dateAdded: string; // Added dateAdded field
  notes: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  leadId: string;
  completed: boolean;
}

interface AppContextType {
  leads: Lead[];
  tasks: Task[];
  selectedLeadId: string | null;
  webViewSession: boolean;
  vpnEnabled: boolean;
  addLead: (lead: Omit<Lead, "id">) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  selectLead: (id: string | null) => void;
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  toggleTaskCompletion: (id: string) => void;
  toggleVpn: () => void;
  clearWebViewSession: () => void;
  getLead: (id: string) => Lead | undefined;
  getLeadTasks: (leadId: string) => Task[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample data
const sampleLeads: Lead[] = [
  {
    id: "1",
    name: "John Smith",
    phone: "+1 (555) 123-4567",
    tag: "hot",
    status: "qualified",
    lastContactDate: "2023-09-15",
    dateAdded: "2023-09-01",
    notes: "Interested in premium package. Follow up next week."
  },
  {
    id: "2",
    name: "Emily Johnson",
    phone: "+1 (555) 987-6543",
    tag: "new",
    status: "contacted",
    lastContactDate: "2023-09-18",
    dateAdded: "2023-09-10",
    notes: "First contact made. Scheduled intro call for next Monday."
  },
  {
    id: "3",
    name: "Michael Brown",
    phone: "+1 (555) 456-7890",
    tag: "cold",
    status: "lost",
    lastContactDate: "2023-08-30",
    dateAdded: "2023-08-15",
    notes: "No response after multiple follow-ups."
  },
  {
    id: "4",
    name: "Sarah Wilson",
    phone: "+1 (555) 789-0123",
    tag: "hot",
    status: "negotiation",
    lastContactDate: "2023-09-17",
    dateAdded: "2023-09-05",
    notes: "Discussing contract details. Needs pricing options."
  },
  {
    id: "5",
    name: "David Lee",
    phone: "+1 (555) 234-5678",
    tag: "new",
    status: "contacted",
    lastContactDate: "2023-09-16",
    dateAdded: "2023-09-12",
    notes: "Responded positively to initial outreach."
  }
];

const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Follow up with John about proposal",
    dueDate: "2023-09-25T10:00:00",
    leadId: "1",
    completed: false
  },
  {
    id: "2",
    title: "Schedule intro call with Emily",
    dueDate: "2023-09-26T14:30:00",
    leadId: "2",
    completed: false
  },
  {
    id: "3",
    title: "Send contract to Sarah",
    dueDate: "2023-09-24T09:00:00",
    leadId: "4",
    completed: false
  },
  {
    id: "4",
    title: "Check in with David",
    dueDate: "2023-09-28T11:00:00",
    leadId: "5",
    completed: false
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(sampleLeads);
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [webViewSession, setWebViewSession] = useState(false);
  const [vpnEnabled, setVpnEnabled] = useState(false);

  // Load data from localStorage on initial load
  useEffect(() => {
    const storedLeads = localStorage.getItem('leads');
    const storedTasks = localStorage.getItem('tasks');
    const storedVpnEnabled = localStorage.getItem('vpnEnabled');
    
    if (storedLeads) setLeads(JSON.parse(storedLeads));
    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedVpnEnabled) setVpnEnabled(JSON.parse(storedVpnEnabled));
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('leads', JSON.stringify(leads));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('vpnEnabled', JSON.stringify(vpnEnabled));
  }, [leads, tasks, vpnEnabled]);

  const addLead = (lead: Omit<Lead, "id">) => {
    const newLead = {
      ...lead,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0] // Set current date as dateAdded
    };
    setLeads([...leads, newLead]);
  };

  const updateLead = (id: string, updatedFields: Partial<Lead>) => {
    setLeads(
      leads.map(lead =>
        lead.id === id ? { ...lead, ...updatedFields } : lead
      )
    );
  };

  const selectLead = (id: string | null) => {
    setSelectedLeadId(id);
  };

  const addTask = (task: Omit<Task, "id">) => {
    const newTask = {
      ...task,
      id: Date.now().toString()
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, ...updatedFields } : task
      )
    );
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleVpn = () => {
    setVpnEnabled(!vpnEnabled);
  };

  const clearWebViewSession = () => {
    setWebViewSession(false);
    // In a real app, this would clear cookies and session data
    console.log("WebView session cleared");
  };

  const getLead = (id: string) => {
    return leads.find(lead => lead.id === id);
  };

  const getLeadTasks = (leadId: string) => {
    return tasks.filter(task => task.leadId === leadId);
  };

  return (
    <AppContext.Provider
      value={{
        leads,
        tasks,
        selectedLeadId,
        webViewSession,
        vpnEnabled,
        addLead,
        updateLead,
        selectLead,
        addTask,
        updateTask,
        toggleTaskCompletion,
        toggleVpn,
        clearWebViewSession,
        getLead,
        getLeadTasks
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
