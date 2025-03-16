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

export interface VideoSearchFormErrors {
    videoSearchQuery?: string;
    // add more video search field errors here as needed
}

export interface TranscriptFilterErrors {
    matchTerms?: string;
    // add additional transcript filter errors here
}

export interface FormErrors {
    videoSearch: VideoSearchFormErrors;
    transcriptFilter: TranscriptFilterErrors;
}