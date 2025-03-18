import { TranscriptSearchResult } from "../../types";

function SearchResult({ result }: { result: TranscriptSearchResult }) {

    return(
        <div className="p-6 transition-shadow shadow-lg bg-background-500 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="overflow-hidden font-semibold text-md text-white-100 whitespace-nowrap overflow-ellipsis" style={{ maxHeight: '1.5em', maxWidth: '13em' }} title={result.videoTitle}>
                        {result.videoTitle}
                    </h3>
                    <p className="text-sm text-gray-400">{result.channelTitle}</p>
                    <p className="text-sm text-gray-400">
                        {new Date(result.publishedAt).toLocaleString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit'
                        })}
                    </p>
                </div>
                <img className="h-24 ml-4 bg-gray-300 rounded-lg w-28" src={result.thumbnailUrl} alt="thumbnial"/>
            </div>
            <ul className="space-y-2">
                {result.matches.map((quote) => (
                    <li
                        key={quote.startTime}
                        className="p-2 text-sm rounded-lg cursor-pointer bg-primary-600"
                        onClick={() => window.open(quote.link, '_blank')}
                    >
                        <strong>"{quote.text}"</strong> - {new Date(quote.startTime * 1000).toISOString().substr(11, 8)}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SearchResult;