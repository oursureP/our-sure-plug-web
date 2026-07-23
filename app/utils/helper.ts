import { AxiosError } from "axios";

interface FormattedAxiosError {
  status?: number;
  statusText?: string;
  data?: unknown;
  message: unknown;
  response?: string | unknown;
  isAxiosError: boolean;
  url?: string;
  method?: string;
}

export const formatError = (error: AxiosError): FormattedAxiosError => {
  if (error.response) {
    return {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
      message:
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? (error.response.data as { message: unknown }).message
          : undefined,
      isAxiosError: true,
      url: error?.config?.url,
      method: error?.config?.method,
      response: error?.response?.data,
    };
  } else if (error.request) {
    return {
      message: "No response received",
      isAxiosError: true,
      url: error?.config?.url,
      method: error?.config?.method,
    };
  } else {
    return {
      message: error.message,
      isAxiosError: true,
    };
  }
};

export function resolveMessage(message: unknown): string {
  if (Array.isArray(message))
    return String(message[0] ?? "Something went wrong");
  if (typeof message === "string") return message;
  return "Something went wrong. Please try again.";
}
