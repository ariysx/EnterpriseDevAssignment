import axios from "axios"

/**
 * Axios instance
 * This instance is used to make requests to the backend
 * @example
 * ```ts
 * api.get('/items')
 * ```
 */
export const api = axios.create({
  baseURL: "http://localhost:3001",
})
