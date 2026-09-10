// Single source of truth for the backend URL.
//
// The base URL comes from the env file (client/.env):
//   VITE_API_URL=http://localhost:5000
//
// Usage in any page / component / api file:
//   import { API_URL } from "../api/config";   (adjust relative path)
//   fetch(`${API_URL}/products`, ...)
//   fetch(`${API_URL}/suppliers`, ...)
//
// `API_BASE_URL`  -> e.g. http://localhost:5000 (no trailing slash)
// `API_URL`       -> e.g. http://localhost:5000/api

export const API_BASE_URL = (import.meta.env?.VITE_API_URL).replace(/\/$/, "");

export const API_URL = `${API_BASE_URL}/api`;

export default API_URL;
