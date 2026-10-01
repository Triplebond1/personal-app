
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500";

type ApiOptions = RequestInit & {
  token?: string;
};

export default async function api<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { token, headers, ...rest } = options;
console.log("API URL:", `${API_URL}${endpoint}`);
console.log("OPTIONS:", rest);
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,

    credentials: "include",
    
    headers: {
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...headers,
      },

      
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}