
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";

const WhatsAppWebView: React.FC = () => {
  const { webViewSession, vpnEnabled, selectedLeadId, getLead } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const selectedLead = selectedLeadId ? getLead(selectedLeadId) : null;

  // Simulate WebView loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col">
      {vpnEnabled && (
        <div className="bg-blue-100 text-blue-800 text-xs text-center py-1">
          VPN Active: Your connection is secure
        </div>
      )}
      
      {selectedLead && (
        <div className="bg-gray-100 p-2 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Chatting with: {selectedLead.name}</p>
            <p className="text-xs text-gray-600">{selectedLead.phone}</p>
          </div>
          <button 
            className="text-xs bg-white px-2 py-1 rounded border border-gray-300"
            onClick={() => window.history.back()}
          >
            Back to Leads
          </button>
        </div>
      )}
      
      <div className="flex-1 flex items-center justify-center bg-gray-50 overflow-hidden">
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading WhatsApp Web...</p>
          </div>
        ) : webViewSession ? (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="bg-[#075E54] text-white p-4">
              <h2 className="text-lg font-semibold">WhatsApp Web</h2>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-6">
                <p className="text-gray-600 mb-4">WhatsApp Web content would appear here</p>
                <p className="text-xs text-gray-500">
                  (This is a simulation - in a real app this would be a WebView displaying web.whatsapp.com)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-6 max-w-sm">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-48 h-48 mx-auto border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <p className="text-gray-500 text-sm">QR Code</p>
                  <p className="text-gray-400 text-xs mt-1">Scan to login</p>
                </div>
              </div>
              <p className="text-gray-700 mb-2">To use WhatsApp on your computer:</p>
              <ol className="text-gray-600 text-sm list-decimal list-inside text-left">
                <li className="mb-1">Open WhatsApp on your phone</li>
                <li className="mb-1">Tap Menu or Settings and select WhatsApp Web</li>
                <li className="mb-1">Point your phone to this screen to capture the code</li>
              </ol>
              
              {/* Simulate login button for demo */}
              <button 
                className="mt-4 bg-[#25D366] text-white px-4 py-2 rounded-md w-full"
                onClick={() => window.location.reload()}
              >
                Simulate Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppWebView;
