# Helldivers-Discord-High-Command
Helldivers-Discord-High-Command is a Discord bot built for the 1st Colonial Regiment Discord server to enhance player engagement and stats tracking. The bot uses Google Vision AI and OCR to extract player statistics from Helldivers 2 career page screenshots and provides a robust system for tracking individual and server-wide contributions.


## Features
Service Report Submission: Allows users to submit career page images to track their stats.

Service Records: Displays individual career stats in an embed, alongside server contributions.

Kill Quota Goals: Admins can set and monitor server-wide kill quota goals for Terminid, Automaton, and Illuminate enemies.

Regiment Effort: Provides a summary of all stats submitted to the server, showing combined efforts.

Player Remarks: Admins can leave positive or negative remarks about members, which are tracked in their service records.

Event Threads: Automatically reads through Discord threads and displays event details in a consolidated embed.
## Commands
/submit_service_report: Submit a career page image to track stats for the server.

/service_record: View your career stats and server contributions in a visually rich embed.

/remark_service_record: Admins can leave remarks (positive or negative) about a member, visible in their service record.

/regiment_effort: Displays total stats from all images submitted to the server.

/kill_quota_goals: Admins set the goals for server-wide kill quotas.

/full_service_record: Admin-level service record, displaying detailed stats and player remarks.
## Installation

### Prerequisites
Node.js: Version 16.9.0 or higher
npm: Included with Node.js
MySQL: Database to store player stats and server contributions
Google Vision API: Set up a project on Google Cloud and enable Vision API.
Steps
Clone the repository:
bash
Copy code
git clone https://github.com/your-username/helldivers-discord-high-command.git
cd helldivers-discord-high-command

### Install dependencies:
Copy code

npm install

### Configure environment variables:
Create a .env file in the root directory:

DISCORD_BOT_TOKEN=your_bot_token
MYSQL_HOST=your_host
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_database

GOOGLE_APPLICATION_CREDENTIALS=path_to_your_google_credentials.json

### Run the bot:
Copy code
node src/index.js

## Contact
This bot is developed for the 1st Colonial Regiment Discord Server. If you are interested in adding this bot to your server or have questions, feel free to contact me at:

SG1CSIfan

Discord: [1st Colonial Regiment](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqa2N1QUIyYXo4U3VROGwxTFVGZEpmelV1LUwyQXxBQ3Jtc0trQWFSSkdhdW45ZzJoLVJCT0VodVZjUzlxcW1MdmtYMU5EQ1ppQUlYOFNxaFVsRnh5TUt2aWdMLUpOWnRrNUFnQ1BtSUlGU0hrTUMwOFpfRkN3UHl6STdfNzE2NkxDMG05NUk4cVNOX2E0MWloaGJxVQ&q=https%3A%2F%2Fdiscord.gg%2F3b4xFHWRYF&v=pLf5u8yBO2Q)
