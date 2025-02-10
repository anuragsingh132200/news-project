# Local Happenings News Aggregator

## Overview
The **Local Happenings News Aggregator** is a full-stack web application that collects local news submissions via a Google Form, processes them, and publishes them on a simple web-based news feed. This project ensures data validation, duplicate detection, image moderation, and filtering functionality.

## Features
- **Google Form & Sheet Integration**
  - Users submit local news via a Google Form.
  - Responses are stored in a Google Sheet.

- **Processing Submissions**
  - Validation ensures all fields are filled correctly.
  - Duplicate check prevents publishing similar news items.
  - Image moderation using GPT‑4o API to filter out inappropriate images.

- **Publishing News**
  - A dynamic news feed displaying approved submissions.
  - Each news card contains:
    - Title, description, moderated image, city, and topic tags.
    - Publisher's first name and a masked phone number.
    - A bookmark button (stored via local storage).
  - Filters for sorting news by city and topic.

- **Extra Features (Optional Enhancements)**
  - Analytics for tracking news submissions and popular topics.
  - Live updates on the news feed.
  - Advanced bookmarking with user authentication.

## Tech Stack
- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Database:** Google Sheets API (for news storage)
- **APIs:**
  - Google Forms & Sheets API (data collection)
  - GPT-4o API (image moderation)

## Setup Instructions
### 1. Clone the Repository
```bash
 git clone https://github.com/your-username/local-news-aggregator.git
 cd local-news-aggregator
```

### 2. Install Dependencies
```bash
cd news 
npm install
cd ../news-frontend
npm install

```

### 3. Setup Environment Variables
Create a `.env` file and add the following:
```env
OPENAI_API_KEY=<your OPENAI_API_KEY>
SHEET_ID=<your sheet id>
```

### 4. Run the Server
```bash
npm start
```

### 5. Access the Web App
Navigate to: `http://localhost:5173`

## Deployment
To deploy the application, use services like **Vercel**, **Heroku**, or **Render**. Ensure you configure the API keys in the deployment environment.

## Testing & Quality Assurance
- Validate the entire flow from form submission to news publishing.
- Check for duplicate submissions.
- Verify image moderation functionality.
- Ensure filtering and bookmarking work correctly.

## Contribution Guidelines
1. Fork the repository.
2. Create a new branch for your feature/fix.
3. Commit your changes.
4. Push to your forked repository.
5. Submit a pull request.

## License
This project is licensed under the MIT License.

## Contact
For any queries, feel free to reach out via email or GitHub issues.

---
This README provides a complete guide to setting up, running, and contributing to the Local Happenings News Aggregator project.