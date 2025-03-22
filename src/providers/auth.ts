import { AuthProvider, OnErrorResponse } from "@refinedev/core";
import { API_URL, dataProvider } from "./data";

export const authCredentials = {
  email: "michael.scott@dundermifflin.com",
  password: "demodemo",
};

export const authProvider: AuthProvider = {
  login: async ({ email }) => {
    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email },
          rawQuery: `
            mutation Login($email: String!) {
              login(loginInput: { email: $email }) {
                accessToken
              }
            }
          `,
        },
      });

      localStorage.setItem("access_token", data.login.accessToken);

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      return {
        success: false,
        error: new Error("Invalid email or password"),
      };
    }
  },

  logout: async () => {
    localStorage.removeItem("access_token");
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      return { authenticated: false, redirectTo: "/login" };
    }
    try {
      await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        meta: {
          rawQuery: `
            query Me {
              me {
                name
              }
            }
          `,
        },
      });

      return { authenticated: true };
    } catch {
      return { authenticated: false, redirectTo: "/login" };
    }
  },

  getIdentity: async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return null;

    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        meta: {
          rawQuery: `
            query Me {
              me {
                id
                name
                email
                avatarUrl
              }
            }
          `,
        },
      });

      return data.me;
    } catch {
      return null;
    }
  },
  onError: function (error: any): Promise<OnErrorResponse> {
    throw new Error("Function not implemented.");
  },
};
