# CSI: ClipSearchInvestigator
Ever find it annoying not being able to find "that video". This script aims to search for key phrases via youtube transcripts to help!

## Set up


## How it works / Overview


## Limitations
- no VPN
- quota limits




# ------------------ NOTES TO SELF

# TODO Today:
2. add a dedicated exception error message box for search page
4. add defined error instead of </...loading> in root layout
5. clean up the options page to look better and give better feedback
6. clean up the pop up on mobile both in terms of behaviour but also how it overlays on top of the app and animates
7. update favicon
8. add testing suite
9. test the prouduction version of the app works
10. add continous integration to the build process
11. clean up the readme
12. verify that migrations on db work as intended
13. double check for no private date
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

# TODO: DELETE THIS FILE
TEMP: existing api key:
API_KEY="AIzaSyCVk0zFQem35Pts83tl2do6PcZJ4RWlKO8"
