# Todo Summary Assistant

A powerful application that helps you manage and summarize your tasks efficiently.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Slack Integration Setup](#slack-integration-setup)
- [LLM Configuration](#llm-configuration)
- [Architecture & Design Decisions](#architecture--design-decisions)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 22 or higher)
- [Git](https://git-scm.com/)
- A code editor (e.g., [Visual Studio Code](https://code.visualstudio.com/))

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/ProgrammerAlok/TodoSummaryAssistant
cd TodoSummaryAssistant
```

2. **Install dependencies for both server and client:**

```bash
cd server
npm install
cd ../client
npm install
```

3. **Set up environment variables:**

   **For the client:**

   - Navigate to the client directory
   - Create a new file named `.env`
   - Open the file and add: `VITE_API_URL=http://localhost:8080`
   - Alternatively, copy the contents from `.env.example` if it exists

   **For the server:**

   - Navigate to the server directory
   - Create a new file named `.env`
   - Copy all the keys from `.env.example`
   - Fill in the values for each key with your specific configuration

## Running the Application

### Server

1. **Start the server:**

```bash
cd server
npm start
```

2. The server will be running on `http://localhost:8080`.

### Client

1. **Start the development server:**

```bash
cd client
npm run dev
```

2. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`) to see the application in action.

## Slack Integration Setup

To integrate the Todo Summary Assistant with Slack using webhooks, follow these steps:

1. **Create a Slack App**:

   - Go to [Slack API](https://api.slack.com/apps) and click "Create New App"
   - Choose "From scratch" and name your app "Todo Summary Assistant"
   - Select the workspace where you want to install the app

2. **Set Up Incoming Webhooks**:

   - In the sidebar, click on "Incoming Webhooks"
   - Toggle "Activate Incoming Webhooks" to On
   - Click "Add New Webhook to Workspace"
   - Select the channel where you want the notifications to appear
   - Copy the Webhook URL provided - this is what your application will use to post messages

3. **Configure Your Application**:

   - Add the following to your server's `.env` file:

   ```
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
   ```

4. **Test Webhook Integration**:
   - Use a tool like cURL or Postman to test your webhook:
   ```bash
   curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello from Todo Summary Assistant!"}' YOUR_WEBHOOK_URL
   ```

## LLM Configuration

The Todo Summary Assistant uses Google's Gemini model for task summarization and analysis. Here's how to set it up:

1. **Get Access to Gemini API**:

   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a free Google Cloud account if you don't already have one
   - Generate an API key for Gemini

2. **Configure API Access**:

   - Add your Gemini API key to the server's `.env` file:

   ```
   GEMINI_API_KEY=your-gemini-api-key
   ```

## Architecture & Design Decisions

### Frontend Architecture

- **Framework**: React with TypeScript for type safety
- **State Management**: ContextAPI for global state
- **Styling**: Tailwind CSS for utility-first styling
<!-- - **Component Structure**: Atomic design pattern (atoms, molecules, organisms) -->

### Backend Architecture

- **Framework**: Node.js with Express
- **API Design**: RESTful API with clear endpoints for todo management
- **Authentication**: JWT-based authentication
- **Database**: PostgreSQL for flexible document storage

### LLM Integration

- **Processing Pipeline**: Tasks → Preprocessing → LLM Analysis → Post-processing → Client
<!-- - **Caching Layer**: Redis cache for reducing redundant LLM calls
- **Error Handling**: Graceful fallbacks when LLM services are unavailable -->

### Security Considerations

- Environment variables for sensitive keys
- Input sanitization for all user inputs

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
