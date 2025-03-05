# YoutubeTranscriptSearch
Ever find it annoying not being able to find "that video". This script aims to search for key phrases via youtube transcripts to help!


# TODO:
1. Clean up the SQL SCHema system so that it can 
2. test out to verify that the setting and behaviour of api key works as intended
2. add initial testing system for back end and frontned, but don't write any tests yet
3. update the tab name and mini icon

## Add support for:
- channel only searching https://developers.google.com/youtube/v3/docs/search/list
- video length filtering
- tracking page token, and load more on request
- display meaningful error messages and clear results 
- search inclusive vs exclusive of all results (ie (bing or bong) or (bing and bong))
- add filter for terms bar to filter for specific results    
- display full transcript in pop up on click 
- searching but substring or exact match

# More content that we should display at the top
- list total number of video and quote results
- list number of quotes per video result
- add quote search filter

# Handling/Validation
- clean up default values/optionals
- add relevant alerts for missing values
- add standard error handling method for api/react integrations