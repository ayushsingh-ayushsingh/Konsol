# Konsol - Intelligent Chat Application

Konsol is an intelligent web-based chat application powered by the Google Gemini AI model. It provides a modern, interactive user interface with features like conversation history, dark/light theme toggling, and the potential for advanced AI capabilities like Function Calling and Web Search.

## Features

*   **Intelligent Chat:** Interact with the Google Gemini AI model.
*   **Conversation History:** Your chat history is saved locally in your browser's storage.
*   **Streaming Responses:** Experience real-time AI responses as they are generated.
*   **Responsive Layout:** Adapts to different screen sizes, showing chat and a side panel (placeholder) on desktop, and stacking them on mobile.
*   **Function Calling:** The backend code includes a basic example of function calling, demonstrating the ability for the AI to trigger actions (like creating a file).
*   **Web Search:** The backend is configured to potentially use the Google Search tool if enabled.

## Technologies Used

**Backend:**

*   Node.js
*   Express.js
*   `@google/genai` (Google Gemini API SDK)
*   `cors` for handling Cross-Origin Requests

**Frontend:**

*   React
*   Vite
*   Tailwind CSS
*   Shadcn UI

## Installation

**Prerequisites:**

*   Node.js (v18 or higher recommended)
*   npm or yarn or pnpm package manager
*   A Google Cloud Project with the API enabled.
*   An API Key for the Google Gemini API.

**Steps:**

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ayushsingh-ayushsingh/Konsol.git
    cd Konsol
    ```

2.  **Install Backend Dependencies:**
    Navigate into your backend directory (where your `index.js` and `package.json` are located).
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    Navigate into your frontend directory (where your `package.json` and `src` folder are located).
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Set up Environment Variables:**
    *   In your **backend** directory, create a `.env` file.
    *   Add your Google Gemini API Key to this file:
        ```dotenv
        GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
        ```
    *   Replace `GEMINI_API_KEY` with your actual API key.
    *   **Important:** For the function calling example (`functionCalling.js`), you might also need Google Cloud Application Default Credentials if the API Key is not sufficient for the specific API used by `fs` (though `fs` itself is Node.js built-in, the *context* of the API call might trigger credential checks). However, the primary chat functionality uses the API Key. If you encounter credential errors with function calling, refer to Google Cloud documentation on Application Default Credentials.

## Running the Application

You need to run both the backend and the frontend simultaneously.

1.  **Start the Backend Server:**
    Navigate to your backend directory and run:
    ```bash
    cd backend
    node index.js
    ```
    The backend server should start on port `3000` (or the port specified in your `.env`).

2.  **Start the Frontend Development Server:**
    Navigate to your frontend directory and run:
    ```bash
    cd ../frontend
    npm run dev
    ```
    The frontend development server should start (often on port `5173` with Vite).

3.  **Open in Browser:**
    Open your web browser and go to the address where the frontend development server is running (usually `http://localhost:5173/`).

## Backend Endpoints

*   `GET /`: Basic health check. Returns "Hello World!".
*   `POST /chat`: Accepts a JSON body with a `prompt` string. Processes the prompt using the Gemini AI, adds it to the conversation history, and streams the AI's response back.

---

Crafted with ❤️ by ayushsingh-ayushsingh.