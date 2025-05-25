export const msalConfig = {
  auth: {
    clientId: "2de2528f-85c0-4f6a-9af2-e853a5e7a4e3",
    authority: "https://login.microsoftonline.com/aa76d384-6e66-4f99-acef-1264b8cef053",
    redirectUri: "/",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["api://6495a485-f811-440c-8e96-39d45f00aeab/user_impersonation"],
};
