export type Video = {
    id: string;
    title: string;
    description: string;
    publishedAt: string;
};

export type APIQuote = { 
    text: string; 
    startTime: number, 
    link: string 
};
  
export type Quote = { 
    text: string; 
    startTime: string, 
    link: string 
  };
  
export type VideoTranscriptResult = { 
    videoTitle: string; 
    quotes: Quote[] 
}