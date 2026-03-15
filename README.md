# Node.js Dispatch Hub

A structured, SOLID-based Node.js application for managing real-time call handoffs using **Socket.io** and **LiveKit**.

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18 or higher recommended.
- **pnpm**: This project uses pnpm for dependency management.
  ```bash
  npm install -g pnpm
  ```

### 2. Installation
Install the required dependencies:
```bash
pnpm install
```

### 3. Configuration
1. Copy the template environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your **LiveKit** credentials and **Socket** settings:
   - `LIVEKIT_URL`: Your LiveKit server URL.
   - `LIVEKIT_API_KEY`: Your API Key.
   - `LIVEKIT_API_SECRET`: Your API Secret.
   - `SOCKET_SERVER_PORT`: Port to run the server on (default: 3005).

### 4. Running the Server
Start the Dispatch Hub server:
```bash
node server.js
```
The server will be running at `http://localhost:3005`.

---

## 🏗️ Project Architecture

The project is organized into modular components within the `src/` directory:

- **`src/services/LiveKitService.js`**: Handles interactions with the LiveKit Server SDK, including generating Access Tokens for participants.
- **`src/managers/HandoffManager.js`**: A Singleton manager that tracks the in-memory state of active calls and their statuses.
- **`src/controllers/SocketController.js`**: Orchestrates real-time events (`list_of_calls`, `join_call`, `close_call`) and coordinates logic between services and managers.
- **`server.js`**: The main entry point that initializes environment variables and bootstraps the HTTP/Socket server.

---

## 🛠️ Event Logic

- **`list_of_calls`**: Automatically sends the full list of active calls to any client on connection or state change.
- **`join_call`**: 
    - Validates call status to prevent multiple staff members from joining the same call.
    - Updates call status to `in_progress`.
    - Returns a secure LiveKit `AccessToken` upon successful validation.
- **`close_call`**: Removes a call from the system and updates all connected clients.

---

## ⚖️ License
This project is licensed under the Apache-2.0 License.
"# livekit-node-sdk" 
