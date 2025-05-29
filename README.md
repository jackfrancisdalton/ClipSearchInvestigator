# CSI: ClipSearchInvestigator
Ever find it annoying not being able to find "that video". This script aims to search for key phrases via youtube transcripts to help!

## Setting up
- docker compose up
- run migration (todo: make this)
- navigate to localhost: 80

## Using
- enter api key, it will check everything for you
- enter video search
- enter transcript search
- find results and click
- manage api keys if you want

## Project Structure

| Service            | Description                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| **reverse-proxy**  | Handles API requests, processes YouTube transcripts, and manages the database. |
| **backend**        | User interface for searching and displaying video transcripts.             |
| **frontend**       | Stores video metadata, transcripts, and user preferences.                  |
| **database**       | Connects the frontend with the backend and external services like YouTube. |



## Known Limitations

### VPN Issues

### Youtube Search API Quota Limits


## Maintaining / Debugging

### SQL Database Migrations

### OpenAPI 


## Future Changes
- improved search matching
- improve post search reuslt filtering
- saving previous results



# ------------------ NOTES TO SELF

# TODO Today:
1. update all tests to use data-testid
7. update favicon
9. test the prouduction version of the app works
10. add continous integration to the build process
11. clean up the readme
12. verify that migrations on db work as intended
13. double check for no private data
14. clean up for making public


# Post release features
1. Bar on search page to allow for filtering by match condition
2. faster rendering
3. add saving specific
4. make search results persistant between page swaps


# Maintaining:
## SQL
`alembic revision --autogenerate -m "Updated models"` is run inside the container to generate new migrations when models change

docker compose exec to database then run: 

psql -U youtubeSearchUser YoutubeSearchDb: to connect to pql client 
\dt: to list tables
SELECT * FROM mytable; : to select all keys
TRUNCATE table_name; : to drop all records

# Bugs:
- does not work with VPN
- does not work if video not premiered yet: "Failed to fetch transcripts: \nCould not retrieve a transcript for the video https://www.youtube.com/watch?v=cwish35WV4I! This is most likely caused by:\n\nThe video is unplayable for the following reason: Premieres in 36 hours\n\nIf you are sure that the described cause is not responsible for this error and that a transcript should be retrievable, please create an issue at https://github.com/jdepoix/youtube-transcript-api/issues. Please add which version of youtube_transcript_api you are using and provide the information needed to replicate the error. Also make sure that there are no open issues which already describe your problem!"

