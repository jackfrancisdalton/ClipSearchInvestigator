export interface VideoSearchFormErrors {
videoSearchQuery?: string;
// add more video search field errors here as needed
}

export interface TranscriptFilterFormErrors {
matchTerms?: string;
// add additional transcript filter field errors here
}

export interface FormErrors {
videoSearch: VideoSearchFormErrors;
transcriptFilter: TranscriptFilterFormErrors;
}