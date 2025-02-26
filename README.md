# YoutubeTranscriptSearch
Ever find it annoying not being able to find "that video". This script aims to search for key phrases via youtube transcripts to help!


# TODO:

## While on holiday
- Add scroll to the pop out nav, atm it scrolls the main nav
- update the title and mini icon in the tab
- add aria labels
- Fix the issue with the broken SQL storage of API key
-- improve ui and information on this
-- configure the page for managing this
- improve the error message styling and content

## Add support for:
- channel only searching https://developers.google.com/youtube/v3/docs/search/list
- video length filtering
- tracking page token, and load more on request
- display meaningful error messages and clear results 
- search inclusive vs exclusive of all results (ie (bing or bong) or (bing and bong))
- add filter for terms bar to filter for specific results    
- display full transcript in pop up on click 
- searching but substring or exact match

## Styling
- Make the boxes line up in a way that fills the space instead of a fixed size

# Content to display
- list total number of video and quote results
- list number of quotes per video result
- add quote search filter

# Handling/Validation
- clean up default values/optionals
- add relevant alerts for missing values
- add standard error handling method for api/react integrations

# Testing 
- Add tests to all

# Finally:
- write up read me details and publish release