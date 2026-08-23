import {
  HealthResponse,
  MeResponse,
  AILearnRequest,
  AILearnResponse,
  CreatePracticeSessionRequest,
  PracticeSessionResponse,
  SubmitAnswerRequest,
  AnswerEvaluationResponse,
  CreateProofSessionRequest,
  ProofSessionResponse,
  SubmitProofRequest,
  ProofSubmissionResponse,
  TransferChallenge,
  SubmitTransferRequest,
  TransferSubmissionResponse,
  ApiClientOptions,
  ApiErrorResponse,
} from "@/types/api";

const DEFAULT_TIMEOUT_MS = 15000;
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export class ApiError extends Error {
  public code: string;
  public status: number;
  public details?: Record<string, unknown> | null;

  constructor(
    message: string,
    code = "API_ERROR",
    status = 500,
    details: Record<string, unknown> | null = null
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private async request<T>(
    endpoint: string,
    options: ApiClientOptions = {}
  ): Promise<T> {
    const {
      timeoutMs = DEFAULT_TIMEOUT_MS,
      token,
      headers: customHeaders = {},
      ...fetchOptions
    } = options;

    const url = `${this.baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(customHeaders as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      let data: unknown = null;
      if (isJson) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        let errorCode = "API_ERROR";
        let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
        let details = null;

        if (data && typeof data === "object") {
          const errEnvelope = data as Partial<ApiErrorResponse>;
          if (errEnvelope.error) {
            errorCode = errEnvelope.error.code || errorCode;
            errorMessage = errEnvelope.error.message || errorMessage;
            details = errEnvelope.error.details || null;
          } else if ("detail" in (data as Record<string, unknown>)) {
            const detail = (data as Record<string, unknown>).detail;
            if (typeof detail === "object" && detail !== null) {
              const d = detail as Record<string, unknown>;
              errorCode = String(d.code || errorCode);
              errorMessage = String(d.message || errorMessage);
            } else if (typeof detail === "string") {
              errorMessage = detail;
            }
          }
        }

        throw new ApiError(errorMessage, errorCode, response.status, details);
      }

      return data as T;
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiError(
          "Request timed out. Please try again.",
          "REQUEST_TIMEOUT",
          408
        );
      }

      throw new ApiError(
        error instanceof Error ? error.message : "Network request failed.",
        "NETWORK_ERROR",
        500
      );
    }
  }

  public async get<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  public async post<T>(
    endpoint: string,
    body: unknown,
    options: ApiClientOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  public async getHealth(): Promise<HealthResponse> {
    return this.get<HealthResponse>("/health");
  }

  public async getMe(token: string): Promise<MeResponse> {
    return this.get<MeResponse>("/me", { token });
  }

  public async learnWithAI(
    request: AILearnRequest,
    token: string
  ): Promise<AILearnResponse> {
    return this.post<AILearnResponse>("/ai/learn", request, { token });
  }

  public async createPracticeSession(
    request: CreatePracticeSessionRequest,
    token: string
  ): Promise<PracticeSessionResponse> {
    return this.post<PracticeSessionResponse>("/practice/sessions", request, { token });
  }

  public async getPracticeSession(
    sessionId: string,
    token: string
  ): Promise<PracticeSessionResponse> {
    return this.get<PracticeSessionResponse>(`/practice/sessions/${sessionId}`, { token });
  }

  public async submitPracticeAnswer(
    sessionId: string,
    request: SubmitAnswerRequest,
    token: string
  ): Promise<AnswerEvaluationResponse> {
    return this.post<AnswerEvaluationResponse>(
      `/practice/sessions/${sessionId}/submit`,
      request,
      { token }
    );
  }

  public async createProofSession(
    request: CreateProofSessionRequest,
    token: string
  ): Promise<ProofSessionResponse> {
    return this.post<ProofSessionResponse>("/proof/sessions", request, { token });
  }

  public async getProofSession(
    sessionId: string,
    token: string
  ): Promise<ProofSessionResponse> {
    return this.get<ProofSessionResponse>(`/proof/sessions/${sessionId}`, { token });
  }

  public async submitProof(
    sessionId: string,
    request: SubmitProofRequest,
    token: string
  ): Promise<ProofSubmissionResponse> {
    return this.post<ProofSubmissionResponse>(
      `/proof/sessions/${sessionId}/submit`,
      request,
      { token }
    );
  }

  public async getTransferChallenge(
    sessionId: string,
    token: string
  ): Promise<TransferChallenge> {
    return this.get<TransferChallenge>(`/proof/sessions/${sessionId}/transfer`, { token });
  }

  public async submitTransferChallenge(
    sessionId: string,
    request: SubmitTransferRequest,
    token: string
  ): Promise<TransferSubmissionResponse> {
    return this.post<TransferSubmissionResponse>(
      `/proof/sessions/${sessionId}/transfer`,
      request,
      { token }
    );
  }
}

export const api = new ApiClient(API_BASE_URL);
