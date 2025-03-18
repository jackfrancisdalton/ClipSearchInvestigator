export type ApiGenericErrorResponse = {
    error: string;
    message: string;
    code: number;
};

export type ApiActionResultResponse = {
    success: boolean;
    message: string;
};

export interface AppConfigurationResponse {
    isApiKeySet: boolean;
}

export type SetApiKeyRequest = {
    apiKey: string; // using the primitive "string"
};