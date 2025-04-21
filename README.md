# Telegram Mini App with Seamless Authentication

A Telegram Mini App that demonstrates how to implement seamless authentication using Telegram's initData. This application allows you to authenticate users directly through Telegram without requiring additional login steps.

## Features

- Seamless authentication via Telegram Mini App protocol
- Backend validation of Telegram user credentials
- User data storage in PostgreSQL database
- Frontend built with React, TypeScript, and Vite
- Backend powered by Rust with Axum web framework
- Responsive UI with Tailwind CSS

## Project Structure

The project is divided into two main parts:

- **Frontend**: React/TypeScript application that interfaces with the Telegram Mini App API
- **Backend**: Rust server that validates the Telegram authentication and manages user data

## Prerequisites

- Node.js (v16+)
- Rust (latest stable)
- PostgreSQL
- A Telegram bot token

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a `.env` file with the following variables:
   ```
   DATABASE_URL=postgres://username:password@localhost:5432/dbname
   BOT_TOKEN=your_telegram_bot_token
   ```

3. Set up the database:
   ```
   cargo install sqlx-cli
   sqlx database create
   sqlx migrate run
   ```

4. Build and run the server:
   ```
   cargo run
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Create a `.env` file:
   ```
   VITE_API_URL=http://localhost:3000
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. For development with localtunnel (to make your app accessible to Telegram):
   ```
   npm run dev:tunnel
   ```

## Deploying Your App

1. Build the frontend:
   ```
   cd frontend
   npm run build
   ```

2. Build the backend:
   ```
   cd backend
   cargo build --release
   ```

3. Deploy both the frontend and backend to your preferred hosting platform.

4. Set up your Telegram bot with BotFather and configure the Web App URL to point to your deployed frontend.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
