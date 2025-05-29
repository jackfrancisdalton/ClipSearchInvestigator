export interface VideoSearchFormErrors {
    videoSearchQuery?: string;
}

export interface TranscriptFilterFormErrors {
    matchTerms?: string;
}

export interface FormErrors {
    videoSearch: VideoSearchFormErrors;
    transcriptFilter: TranscriptFilterFormErrors;
}