import { useState } from 'react';
import { useIsAuthenticated } from "@azure/msal-react";
import Interview from './Interview';
import Login from './Login';
import VoiceChat from './VoiceChat';

type View = 'interview' | 'voice';

function App() {
  const isAuthenticated = useIsAuthenticated();
  const [currentView, setCurrentView] = useState<View>('interview');

  return (
    <div className="app-container h-screen bg-gray-900 text-gray-50">
      {!isAuthenticated ? (
        <Login />
      ) : (
        <>
          {currentView === 'interview' ? (
            <Interview onNavigateToVoice={() => setCurrentView('voice')} />
          ) : (
            <VoiceChat onNavigateToInterview={() => setCurrentView('interview')} />
          )}
        </>
      )}
    </div>
  )
}

export default App
