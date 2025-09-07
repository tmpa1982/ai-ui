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
        className="btn-primary px-4 py-2 "
      >
        <LogOut size={16} />
        Log Out
      </button>
    </div>
  );
}

export default Header;
