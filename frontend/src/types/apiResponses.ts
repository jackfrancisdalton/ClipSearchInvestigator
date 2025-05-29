export type ApiActionResultResponse = {
    success: boolean;
    message: string;
};

export interface AppConfigurationResponse {
    isApiKeySet: boolean;
}

export type SetApiKeyRequest = {
    apiKey: string;
};