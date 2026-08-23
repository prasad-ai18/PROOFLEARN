import {
  ApiClientOptions,
  ApiErrorDetail,
  ApiErrorResponse,
  HealthResponse,
  MeResponse,
  AILearnRequest,
  AILearnResponse,
  CreatePracticeSessionRequest,
  PracticeSessionResponse,
  SubmitAnswerRequest,
  AnswerEvaluationResponse,
} from "@/types/api";

export class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: Record<string, unknown> | null;

  constructor(status: number, errorDetail: ApiErrorDetail) {
    super(errorDetail.message);
    this.name = "ApiError";
    this.status = status;
    this.code = errorDetail.code;
    this.details = errorDetail.details;
  }
}

/**
 * Returns the configured FastAPI base URL from environment variables.
 */
export function getApiBaseUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000";
  return url.replace(/\/+$/, "");
}

/**
 * Centralized API client for communicating with the FastAPI backend.
 */
export class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || getApiBaseUrl();
  }

  /**
   * Generic request dispatcher with timeout, JSON parsing, and error normalization.
   */
  async request<T>(
    endpoint: string,
    options: ApiClientOptions = {}
  ): Promise<T> {
    const { timeoutMs = 30000, token, headers = {}, ...customConfig } = options;

    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${normalizedEndpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(headers as Record<string, string>),
    };

    // Attach Authorization Bearer token if provided
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...customConfig,
        headers: requestHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-2xx HTTP responses
      if (!response.ok) {
        let errorDetail: ApiErrorDetail = {
          code: `HTTP_${response.status}`,
          message: `Request failed with status code ${response.status}`,
        };

        try {
          const body: ApiErrorResponse = await response.json();
          if (body && body.error) {
            errorDetail = body.error;
          }
        } catch {
          // If response body is not JSON, fallback to status text
          if (response.status === 401) {
            errorDetail = {
              code: "UNAUTHORIZED",
              message: "Your session has expired or authentication is invalid. Please sign in again.",
            };
          } else if (response.status === 403) {
            errorDetail = {
              code: "FORBIDDEN",
              message: "You do not have permission to perform this action.",
            };
          } else if (response.status === 404) {
            errorDetail = {
              code: "NOT_FOUND",
              message: "The requested API resource was not found.",
            };
          } else if (response.status === 409) {
            errorDetail = {
              code: "CONFLICT",
              message: "This item has already been submitted.",
            };
          } else if (response.status >= 500) {
            errorDetail = {
              code: "SERVER_ERROR",
              message: "A backend service error occurred. Please try again later.",
            };
          }
        }

        throw new ApiError(response.status, errorDetail);
      }

      // Parse JSON response
      return (await response.json()) as T;
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof ApiError) {
        throw err;
      }

      if (err instanceof Error && err.name === "AbortError") {
        throw new ApiError(408, {
          code: "REQUEST_TIMEOUT",
          message: "The request timed out while communicating with the backend.",
        });
      }

      throw new ApiError(0, {
        code: "NETWORK_ERROR",
        message: "Unable to connect to the backend service. Please check your connection.",
      });
    }
  }

  // HTTP Method Helpers
  async get<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(endpoint: string, body?: unknown, options: ApiClientOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: unknown, options: ApiClientOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  // Predefined Contract Helpers
  async getHealth(): Promise<HealthResponse> {
    return this.get<HealthResponse>("/api/v1/health");
  }

  async getMe(token: string): Promise<MeResponse> {
    return this.get<MeResponse>("/api/v1/me", { token });
  }

  async learnWithAI(
    payload: AILearnRequest,
    token: string
  ): Promise<AILearnResponse> {
    return this.post<AILearnResponse>("/api/v1/ai/learn", payload, { token });
  }

  // Practice Engine Contract Helpers
  async createPracticeSession(
    payload: CreatePracticeSessionRequest,
    token: string
  ): Promise<PracticeSessionResponse> {
    return this.post<PracticeSessionResponse>("/api/v1/practice/sessions", payload, { token });
  }

  async getPracticeSession(
    sessionId: string,
    token: string
  ): Promise<PracticeSessionResponse> {
    return this.get<PracticeSessionResponse>(`/api/v1/practice/sessions/${sessionId}`, { token });
  }

  async submitPracticeAnswer(
    sessionId: string,
    payload: SubmitAnswerRequest,
    token: string
  ): Promise<AnswerEvaluationResponse> {
    return this.post<AnswerEvaluationResponse>(
      `/api/v1/practice/sessions/${sessionId}/submit`,
      payload,
      { token }
    );
  }
}

export const api = new ApiClient();
