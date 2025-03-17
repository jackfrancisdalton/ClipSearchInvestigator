# CSI: ClipSearchInvestigator
Ever find it annoying not being able to find "that video". This script aims to search for key phrases via youtube transcripts to help!

## Set up


## How it works / Overview


## Limitations
- no VPN
- quota limits




# ------------------ NOTES TO SELF


# TODO:
- add a check that ensures the youtube api key is valid both frontend and backend
- add place holder before first search
- swap to using reactquery instead of axios
- clean up header bar 
- clean up pop out bar
- clean up setup page
- add error page
- create generic error box

# Clean up
1. ensure all exceptions are handled on backend
-- handle eceptions and returning appropriate message

2. ensure all exceptions are handled on frontend 
-- error boundaries

3. update the tab name and mini icon

4. search term only works on matching a single snippet atm, figure out a way to make it work across snippets

# UI
- Split up the left search into two section
-- specify videos to search for
-- specify terms to find in those videos
- add pretty error message
- add pretty place holder
- add pretty loading result

# Dev enviornment
- add debug support for react and python
- add testing frameworks as well

## Add support for:
- channel only searching https://developers.google.com/youtube/v3/docs/search/list
- video length filtering
- display meaningful error messages and clear results 
- search inclusive vs exclusive of all results (ie (bing or bong) or (bing and bong))
- add filter for terms bar to filter for specific results    
- display full transcript in pop up on click 
- searching but substring or exact match


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


# Future features
- remember last searches and allow for replay
- show statistics on results like most commonon terms, range of pasted dates