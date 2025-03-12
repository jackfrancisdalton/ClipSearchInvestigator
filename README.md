# YoutubeTranscriptSearch
Ever find it annoying not being able to find "that video". This script aims to search for key phrases via youtube transcripts to help!

## Set up


## How it works / Overview


## Limitations
- no VPN
- quota limits




# ------------------ NOTES TO SELF

# Clean up
- standardise request/response model
-- have a typescript modelf for response
-- have a generic message response from backend
- ANS:
-- define a generic success responsse type in both typescript and pydantic
-- define a generic ErrorResponse in both with err, message, code and add a global exception handler

- standardise casing:
-- javascript uses camelcase, python uses snake case, standardise this
-- ANS: use pydantic aliases

- ensure all exceptions are handled on backend
-- handle eceptions and returning appropriate message

- ensure all exceptions are handled on frontend 
-- error boundaries

3. update the tab name and mini icon



# To Add
4. add a top bar above the results that allows you to:
-- sort bar by: date of video, number of total matches, number of matches matched (ie term 1,2,3) 
-- total number of results found
-- total number of matches found
-- range of dates the videos are from


# Dev enviornment
- add debug support for react and python
- add testing frameworks as well

## Add support for:
- channel only searching https://developers.google.com/youtube/v3/docs/search/list
- video length filtering
- tracking page token, and load more on request
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

