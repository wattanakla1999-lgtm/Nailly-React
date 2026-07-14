import axios from "axios"
import type { AxiosRequestConfig, AxiosResponse } from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// cache TTL in milliseconds (2 seconds)
const CACHE_TTL = 2000

// Cache entry type storing the promise and timestamp
interface CacheEntry<T = unknown> {
  promise: Promise<AxiosResponse<T>>
  timestamp: number
}

// Map to store GET request cache
const getCache = new Map<string, CacheEntry<unknown>>()

// Helper to generate a unique cache key based on URL and query parameters
function getCacheKey(url: string, config?: AxiosRequestConfig): string {
  return `${url}?${JSON.stringify(config?.params || {})}`
}

const originalGet = api.get.bind(api) as typeof api.get
const originalPost = api.post.bind(api) as typeof api.post
const originalPut = api.put.bind(api) as typeof api.put
const originalPatch = api.patch.bind(api) as typeof api.patch
const originalDelete = api.delete.bind(api) as typeof api.delete

// Override GET method to cache and deduplicate
api.get = function <T = unknown, R = AxiosResponse<T>, D = unknown>(
  url: string,
  config?: AxiosRequestConfig<D>
): Promise<R> {
  const key = getCacheKey(url, config)
  const now = Date.now()
  const cached = getCache.get(key)

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.promise as Promise<R>
  }

  const promise = originalGet<T, R, D>(url, config)
    .then((response) => {
      return response
    })
    .catch((error) => {
      // If the request fails, remove it from the cache immediately
      getCache.delete(key)
      throw error
    })

  getCache.set(key, { promise: promise as unknown as Promise<AxiosResponse<unknown>>, timestamp: now })
  return promise
}

// Clear GET cache when any write/mutation request is initiated
api.post = function <T = unknown, R = AxiosResponse<T>, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig<D>
): Promise<R> {
  getCache.clear()
  return originalPost<T, R, D>(url, data, config)
}

api.put = function <T = unknown, R = AxiosResponse<T>, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig<D>
): Promise<R> {
  getCache.clear()
  return originalPut<T, R, D>(url, data, config)
}

api.patch = function <T = unknown, R = AxiosResponse<T>, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig<D>
): Promise<R> {
  getCache.clear()
  return originalPatch<T, R, D>(url, data, config)
}

api.delete = function <T = unknown, R = AxiosResponse<T>, D = unknown>(
  url: string,
  config?: AxiosRequestConfig<D>
): Promise<R> {
  getCache.clear()
  return originalDelete<T, R, D>(url, config)
}

export default api

