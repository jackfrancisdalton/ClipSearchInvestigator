export type ErrorResponse = {
    error: string;
    message: string;
    code: number;
}

export type ActionResultResponse = {
    success: boolean
    message: string
}

export interface ApiErrorResponse {
    detail: string;
}