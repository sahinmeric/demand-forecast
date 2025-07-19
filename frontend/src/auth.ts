import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number;
};

export const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    if (Date.now() >= exp * 1000) {
      logout(); // clear expired tokens
      return false;
    }
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    logout(); // clear invalid tokens
    return false;
  }
};

export const getUserRole = (): "user" | "admin" | null => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const { role } = jwtDecode<{ role: "user" | "admin" }>(token);
    return role;
  } catch {
    return null;
  }
};
