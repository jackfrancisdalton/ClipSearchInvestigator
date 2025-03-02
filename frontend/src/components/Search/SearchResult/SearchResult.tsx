import { VideoTranscriptResult } from "../../../types/video";

function SearchResult({ result }: { result: VideoTranscriptResult }) {

    return(
        <div className="bg-background-500 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-md text-white-100 font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis" style={{ maxHeight: '1.5em', maxWidth: '13em' }} title={result.videoTitle}>
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
                <img className="ml-4 w-28 h-24 bg-gray-300 rounded-lg" src={result.thumbnailUrl} alt="thumbnial"/>
            </div>
            <ul className="space-y-2">
                {result.matches.map((quote) => (
                    <li
                        key={quote.startTime}
                        className="text-sm bg-primary-600 p-2 rounded-lg cursor-pointer"
                        onClick={() => window.open(quote.link, '_blank')}
                    >
                        <strong>"{quote.text}"</strong> - {quote.startTime}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SearchResult;