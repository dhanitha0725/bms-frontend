import { jwtDecode } from 'jwt-decode';

// Constants for claim URLs
export const CLAIM_NAME_ID = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
export const CLAIM_NAME = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";

export interface DecodedToken {
  [CLAIM_NAME_ID]: string;
  [CLAIM_NAME]: string;
  exp: number;
  iss: string;
  aud: string;
  [claim: string]: string | number;
}

export const decodeToken = (token: string): DecodedToken => {
  return jwtDecode<DecodedToken>(token);
};

// Helper function to check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

// Helper function to get user ID from token
export const getUserId = (token: string): string | null => {
  try {
    const decoded = decodeToken(token);
    return decoded[CLAIM_NAME_ID];
  } catch {
    return null;
  }
};

// Helper function to get username from token
export const getUsername = (token: string): string | null => {
  try {
    const decoded = decodeToken(token);
    return decoded[CLAIM_NAME];
  } catch {
    return null;
  }
};

// Helper function to extract user data from token (used in AuthContext)
export const extractUserFromToken = (token: string): { id: string; username: string } | null => {
  try {
    const decoded = decodeToken(token);
    return {
      id: decoded[CLAIM_NAME_ID],
      username: decoded[CLAIM_NAME],
    };
  } catch {
    return null;
  }
};