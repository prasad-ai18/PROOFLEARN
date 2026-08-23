/**
 * TypeScript definitions for FastAPI backend responses and API client contracts.
 */

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  environment: string;
}

export interface MeResponse {
  id: string;
  email: string | null;
  authenticated: boolean;
  display_name: string | null;
  avatar_url: string | null;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, unknown> | null;
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
}

export interface ApiClientOptions extends RequestInit {
  timeoutMs?: number;
  token?: string | null;
}
