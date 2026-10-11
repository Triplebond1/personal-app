
import  api  from "../lib/api";

export type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  is_verified: boolean;
  createdAt: string;
  updatedAt: string;
};

type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
};

///////////////////////////////////
// LOGIN
///////////////////////////////////

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
    console.log({
  email,
  password,
});
  return api<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}


//////////////////////////////
// REGISTER
//////////////////////////////

export async function register(
  firstname: string,
  lastname: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return api<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      firstname,
      lastname,
      email,
      password,
    }),
  });
}

///////////////////////////////
// REFRESH SESSION
///////////////////////////////

// export async function refreshSession(
// ): Promise<AuthResponse> {
//   return api<AuthResponse>("/refresh", {
//     method: "GET",
//   });
// }

let refreshPromise: Promise<AuthResponse> | null = null;

export function refreshSession( 
): Promise<AuthResponse> {
  if (!refreshPromise) {
    refreshPromise = api<AuthResponse>("/refresh", {
      method: "GET",
    }).finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}



///////////////////////////////
// LOGOUT
///////////////////////////////

export async function logout(): Promise<void> {
  await api("/logout", {
    method: "GET",
  });
}

export default {
  login,
  register,
  refreshSession,
  logout,
};
