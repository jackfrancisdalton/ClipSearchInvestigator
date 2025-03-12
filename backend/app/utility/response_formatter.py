# def format_response(transcriptResults):
#     response = {
#         "results": []
#     }

#     for transcriptResult in transcriptResults:
#         matches = []

#         for match in transcriptResult["matches"]:
#             start_time = int(match["start"])
#             printable_link = f"https://www.youtube.com/watch?v={transcriptResult['videoId']}&t={start_time}"
#             matches.append({
#                 "startTime": start_time,
#                 "text": match['text'],
#                 "link": printable_link
#             })

#         response["results"].append({
#             "videoTitle": transcriptResult['title'],
#             "description": transcriptResult['description'],
#             "channelTitle": transcriptResult['channelTitle'],
#             "publishedAt": transcriptResult['publishedAt'],
#             "videoId": transcriptResult['videoId'],
#             "thumbnailUrl": transcriptResult['thumbnailUrl'],
#             "matches": matches
#         })

#     return response


from app.pydantic_schemas.search_results import Match, SearchResponse, TranscriptResult


def format_response(transcriptResults) -> SearchResponse:
    results = []

    for transcriptResult in transcriptResults:
        matches = []

        for match in transcriptResult["matches"]:
            start_time = int(match["start"])
            printable_link = f"https://www.youtube.com/watch?v={transcriptResult['videoId']}&t={start_time}"
            matches.append(Match(startTime=start_time, text=match['text'], link=printable_link))
        
        results.append(
            TranscriptResult(
                videoTitle=transcriptResult['title'],
                description=transcriptResult['description'],
                channelTitle=transcriptResult['channelTitle'],
                publishedAt=transcriptResult['publishedAt'],
                videoId=transcriptResult['videoId'],
                thumbnailUrl=transcriptResult['thumbnailUrl'],
                matches=matches
            )
        )
    
    return SearchResponse(results=results)