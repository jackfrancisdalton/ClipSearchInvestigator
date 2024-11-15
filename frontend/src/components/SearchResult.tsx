interface Quote {
    text: string;
    timestamp: string;
    link: string;
}

interface Result {
    videoTitle: string;
    quotes: Quote[];
}

function SearchResult({ result }: { result: Result }) {


    return(
        <div className="bg-background-500 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-2xl text-white-100 font-semibold mb-4">{result.videoTitle}</h3>
            <ul className="space-y-2">
                {result.quotes.map((quote) => (
                    <li
                        className="text-sm bg-primary-600 p-2 rounded-lg cursor-pointer"
                        onClick={() => window.open(quote.link, '_blank')}
                    >
                        <strong>"{quote.text}"</strong> - {quote.timestamp}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SearchResult;