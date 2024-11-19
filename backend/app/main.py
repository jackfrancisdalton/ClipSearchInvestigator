from typing import Optional
from fastapi import FastAPI, Query
from app.schemas import Video
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
    
    transcriptResults = await search_transcripts(videos, terms_list)

    if not transcriptResults:
        return { "error": "No matching transcripts found." }

    response = {
        "results": []
    }

    for transcriptResult in transcriptResults:
        matches = []

        for match in transcriptResult["matches"]:
            start_time = int(match["start"])
            printable_link = f"https://www.youtube.com/watch?v={transcriptResult['videoId']}&t={start_time}"
            matches.append({
                "startTime": start_time,
                "text": match['text'],
                "link": printable_link
            })

        response["results"].append({
            "videoTitle": transcriptResult['title'],
            "description": transcriptResult['description'],
            "channelTitle": transcriptResult['channelTitle'],
            "publishedAt": transcriptResult['publishedAt'],
            "videoId": transcriptResult['videoId'],
            "thumbnailUrl": transcriptResult['thumbnailUrl'],
            "matches": matches
        })

    return response
