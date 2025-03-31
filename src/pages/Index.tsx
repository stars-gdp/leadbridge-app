
import { AppProvider } from "@/context/AppContext";
import App from "@/App";

const Index = () => {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
};

export default Index;
