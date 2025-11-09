import { useMsal, useAccount } from "@azure/msal-react";
import { LogOut, Mic } from "lucide-react";

interface HeaderProps {
  onNavigateToVoice?: () => void;
}

function Header({ onNavigateToVoice }: HeaderProps) {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  return (
    <div className={`chat-header flex justify-between items-center px-6 py-4 bg-gray-800 border-b border-gray-700`}>
      <div className="text-gray-200 font-medium">
        {account?.name || account?.username || 'User'}
      </div>
      <div className="flex items-center gap-3">
        {onNavigateToVoice && (
          <button
            onClick={onNavigateToVoice}
            className="btn-primary px-4 py-2 flex items-center gap-2 hover:bg-gray-700 rounded transition-colors"
            title="Open Voice Chat"
          >
            <Mic size={16} />
            Voice Chat
          </button>
        )}
        <button
          onClick={handleLogout}
          className="btn-primary px-4 py-2 flex items-center gap-2 hover:bg-gray-700 rounded transition-colors"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Header;
