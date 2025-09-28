import { useMsal, useAccount } from "@azure/msal-react"
import { apiRequest } from "../msalConfig"

export function useAccessToken() {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const getToken = async () => {
    try {
      const response = await instance.acquireTokenSilent({
        ...apiRequest,
        account: account!,
      })
      return response.accessToken
    } catch {
      const response = await instance.acquireTokenPopup(apiRequest)
      return response.accessToken
    }
  }

  return { getToken }
}
