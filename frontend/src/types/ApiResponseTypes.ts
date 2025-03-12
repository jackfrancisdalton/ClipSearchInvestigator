export type isAppConfiguredResponse = {
    isApiKeySet: boolean 
}

export type SetAPIKeyRequest = {
    apiKey: String
}

export type ActionResultResponse = {
    success: boolean
    message: string
}