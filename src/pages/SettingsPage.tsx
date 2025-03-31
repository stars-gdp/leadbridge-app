
import React from "react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Shield, RefreshCw, Info, ChevronRight } from "lucide-react";

const SettingsPage: React.FC = () => {
  const { vpnEnabled, toggleVpn, clearWebViewSession } = useAppContext();
  
  // App version information (simulated)
  const appInfo = {
    version: "1.0.0",
    buildNumber: "202309001",
    developer: "LeadBridge Team"
  };

  return (
    <div className="p-4 pb-20">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Settings</h1>
      
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Connection Settings</CardTitle>
            <CardDescription>Secure your communication with clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <p className="font-medium text-sm">VPN Connection</p>
                  <p className="text-xs text-gray-500">Encrypt your internet traffic</p>
                </div>
              </div>
              <Switch checked={vpnEnabled} onCheckedChange={toggleVpn} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">WhatsApp Web Session</CardTitle>
            <CardDescription>Manage your chat session data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center" 
              onClick={clearWebViewSession}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear Session & Logout
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              This will clear your WhatsApp Web login data and require you to scan the QR code again.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About LeadBridge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Version</p>
              <p className="text-sm">{appInfo.version}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Build</p>
              <p className="text-sm">{appInfo.buildNumber}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Developer</p>
              <p className="text-sm">{appInfo.developer}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="ghost" 
              className="w-full flex items-center justify-between text-blue-500"
            >
              <span className="flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Privacy Policy
              </span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
