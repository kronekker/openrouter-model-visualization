

export interface LogMessage {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface SystemMetrics {
  cpuUsage: number;         // percentage (0-100)
  memoryUsage: number;      // percentage (0-100)
  freeMemory: string;       // human readable (e.g. "8.5 GB")
  totalMemory: string;      // human readable (e.g. "16.0 GB")
  uptime: number;           // seconds
  requestCount: number;     // total api requests handled
  serverTime: string;       // ISO string
  port: number;             // active server port
  logs: LogMessage[];       // recent server logs
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface OpenRouterModelArchitecture {
  modality: string;
  input_modalities: string[];
  output_modalities: string[];
  tokenizer: string;
  instruct_type: string | null;
}

export interface OpenRouterModelPricing {
  prompt: string;
  completion: string;
  web_search?: string;
  input_cache_read?: string;
}

export interface OpenRouterModelTopProvider {
  context_length: number;
  max_completion_tokens: number | null;
  is_moderated: boolean;
}

export interface OpenRouterModelLinks {
  details: string;
}

export interface OpenRouterModel {
  id: string;
  canonical_slug: string;
  hugging_face_id?: string;
  name: string;
  created: number;
  description: string;
  context_length: number;
  architecture: OpenRouterModelArchitecture;
  pricing: OpenRouterModelPricing;
  top_provider: OpenRouterModelTopProvider;
  per_request_limits: any;
  supported_parameters: string[];
  default_parameters: any;
  knowledge_cutoff: string;
  expiration_date: string | null;
  links: OpenRouterModelLinks;

  // Computed/processed fields
  outputCost?: number;
  inputCost?: number;
  createdDate?: string;
}

