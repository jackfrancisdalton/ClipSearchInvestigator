# CSI: Clip Search Investigator
Ever trying to find "that one video clip" but it's just not showing up in the results? Maybe it's in the middle of a 50 minute video and you spend ages scrubbing for it! 
Well *this app provides you with the answer*!

CSI is a simple web-app that lets you find exactly what you're looking for with a few clicks!
Even better it uses your own Youtube Search API key, and is completely self hosted so the only limits are your API allowance, and no data is tracked against you!

[app-video_UPAmlijW.webm](https://github.com/user-attachments/assets/6dafe8f9-1cca-4b85-b1e5-9109da1339e4)


## How to Install the App
- `git clone` this repository to your machine/server
- Ensure docker and docker compose are installed
- Enter the project root directory and run `docker compose -f docker-compose.yaml -f docker-compose.prod.yaml up --build`
- navigate to localhost: 81 and your app will be there!

> NOTE: if you are already hosting an app on port 81, or simply want to use a different port, you can update the .env file port and rebuild the app.

## Configuring the APP
- When you first open the app, you'll be asked to enter your Youtube Search API key (see further down how to get this)
- Once you've stored your API key you're ready to use the app
- First enter a video search query to determine the videos you want to scan
- Second enter the transcript terms/phrases you want to scan for
- Finally hit search and get your results!
- NOTE: you can add, remove, de-activate your API key at any point by heading to the options page

## Getting your Youtube Search API Key and Checking Your Allowance
You can find your YouTube API key in the Google Developer Console. Follow this <a href="https://developers.google.com/youtube/registering_an_application" className="text-primary-light">guide</a> to get your API key.

To see the limits on the number of requests you can make with the API key you can check them out <a href="https://developers.google.com/youtube/v3/getting-started#quota" className="text-primary-light">here</a>.
Although note you'll need to be logged into your corresponding Google Account.

## Project Structure

| Service            | Description                                                                                                                  |
|--------------------|------------------------------------------------------------------------------------------------------------------------------|
| **reverse-proxy**  | An NGINX reverse proxy that allows all apps to be served over the same host/port                                             |
| **backend**        | FAST API backend that recieves requests from frontend and interacts with Google Youtube Search API and the postgres database |
| **frontend**       | React Vite application handling user interaction and displaying search results                                               |
| **database**       | PostgreSQL database for safely storing API keys. In the future will be used to store favourite clips.                        |



## Application Limitations
### VPN Issues
Youtube Search API does not allow requests to be sent from a machine running a VPN. In this case results will always return with a 500.

### Youtube Search API Quota Limits
Youtube Search API has a free quota by default. This is fairly generious and resets every day, however can result in blocking searches if you exceed your allowance.

# Future Development Features
1. Add a filtering bar at the top of the search results to filter for a specific term if multiple were entered
3. Add saving specific quotes or specific searches in the database
4. Make search result persistant when refreshing/changing page


## Debugging/Maintaining

### Clearing Database
To clear the database take the following steps:
1. `docker compose exec -it database sh`: to access database container
2. `psql -U youtubeSearchUser YoutubeSearchDb`: to connect to pql client 
3. `\dt`: to list tables
4. `SELECT * FROM mytable`; : to select all keys
5. `TRUNCATE table_name`; : to drop all records from a given table

### Update Models
If you update an SQL model and need it reflected right away, you can trigger this by running
`alembic revision --autogenerate -m "Updated models"` inside the backend container to generate new migrations


# ------------------ Authors notes to self (no harm in sharing :) )

# TODO:
1. Clean up TODOs and assess model naming/typing throughout application
2. Clean up fixture scope in backend tests (likely most should be function level)
3. Update favicon to something other than default react one
4. Review and improve README
5. Do testing of auto migration on initial app load to ensure it works correctly across OS
6. Add Github Action CI and associated run tags to READMe
