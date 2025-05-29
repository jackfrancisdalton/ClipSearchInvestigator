import React from "react";
import { TranscriptSearchResult } from "../../types/index.js";

const SearchResult: React.FC<{ result: TranscriptSearchResult }> = ({ result }) => {
    return(
        <div className="p-6 transition-shadow shadow-lg bg-background-light hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="overflow-hidden font-semibold text-md text-white-medium whitespace-nowrap overflow-ellipsis" style={{ maxHeight: '1.5em', maxWidth: '13em' }} title={result.videoTitle}>
                        {result.videoTitle}
                    </h3>
                    <p 
                        className="text-sm text-gray-400"
                        data-testid="search-result_channel-title"
                    >
                        {result.channelTitle}
                    </p>
                    <p 
                        className="text-sm text-gray-400"
                        data-testid="search-result_published-at"
                    >
                        {new Date(result.publishedAt).toLocaleString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit'
                        })}
                    </p>
                </div>
                <img 
                    className="h-24 ml-4 bg-gray-300 rounded-lg w-28" 
                    src={result.thumbnailUrl} 
                    alt="thumbnial"
                    data-testid="search-result_thumbnail"
                />
            </div>
            <ul className="space-y-2">
                {result.matches.map((quote) => (
                    <li
                        key={quote.startTime}
                        className="p-2 text-sm rounded-lg cursor-pointer bg-primary-medium hover:bg-primary-dark"
                        onClick={() => window.open(quote.link, '_blank')}
                        data-testid="search-result_quote"
                    >
                        <strong>"{quote.text}"</strong> - {new Date(quote.startTime * 1000).toISOString().slice(11, 19)}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SearchResult;