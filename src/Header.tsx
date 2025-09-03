import { useMsal, useAccount } from "@azure/msal-react";
import { LogOut } from "lucide-react";

function Header() {
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
      <button
        onClick={handleLogout}
        className="px-4 py-2 text-sm text-gray-200 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors flex items-center gap-2"
      >
        <LogOut size={16} />
        Log Out
      </button>
    </div>
  );
}

export default Header;
