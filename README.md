# AIESEC Exchange Analytics Platform

An analytics platform for monitoring and analysing data related to AIESEC exchange programs.
<br>Uses the same endpoints as https://expa.aiesec.org/analytics/graphical
<br><br>
***AIESEC GST 2026.1  - GID Project Manager Application***
<br>*This project was made by Armaan Jhanji as part of the functional questions for the Project Manager Application.*
<br>

## Building Locally

### **Pre-requisites**

- **npm** (recommended: v10.9.x or newer)
- **Python** (recommended: v3.x.x or newer)


### Setup Steps

1. **Clone the repository:**
   
    ```bash
    git clone https://github.com/InfinityDude007/aiesec-exchange-analytics.git
    cd aiesec-exchange-analytics
    ```
2. **Install dependencies:**
    <br>Frontend:
    ```bash
    cd client
    npm install
    ```
    
    <br>Backend:
    ```bash
    cd server
    source ./venv/bin/activate
    pip install requirements.txt
    ```

3. **Start the application:**
    <br>Frontend:
    ```bash
    cd client
    npm run dev
    ```
    
    <br>Backend:
    ```bash
    cd server
    source ./venv/bin/activate
    uvicorn main:server --reload
    ```

4. **Access the app:**  
   Open [http://localhost:5173](http://localhost:5173) in your browser.

<br>

## Notes

- ! IMPORTANT: Incase the OAuth flow breaks, please remove the ProtectedRoute wrapper from client/App.jsx, and manually set a localhost cookie with a valid access_token from EXPA.

- The repo contains the environment variables required for the demo.
- After the selection process has concluded, all variables will be cleared and regenerated.
- The platform demo works best in development mode, hence please use the commands above.
- **npx** can also be used, but is not recommended after testing.

<br>

## Project Structure

```
aiesec-exchange-analytics/
├── client/  # Frontend (React + Vite)
├── server/  # Backend (FastAPI)
└── ...
```
