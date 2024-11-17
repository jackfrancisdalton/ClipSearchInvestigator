from typing import Optional
from fastapi import FastAPI, Query
from app.youtube_search import search_youtube
from app.transcript_utils import search_transcripts
from datetime import date

app = FastAPI()

@app.get("/searchtrans")
async def search(
    query: str = Query(...), 
    terms: str = Query(...), 
    order: str = Query(...),
    published_before: Optional[date] = Query(None),
    published_after: Optional[date] = Query(None),
    max_results: int = Query(10)
):
    terms_list = terms.split(",")
    videos = search_youtube(
        query, 
        order, 
        published_before, 
        published_after,
        max_results
    )

    if not videos:
        return { "error": "No videos found." }
    
    results = await search_transcripts(videos, terms_list)

    if not results:
        return { "error": "No matching transcripts found." }

    response = {}

    for result in results:
        response[result['title']] = []

        for match in result["matches"]:
            start_time = int(match["start"])
            printable_link = f"https://www.youtube.com/watch?v={result['videoId']}&t={start_time}"
            response[result['title']].append({
                "startTime": start_time,
                "text": match['text'],
                "link": printable_link
            })

    return response
