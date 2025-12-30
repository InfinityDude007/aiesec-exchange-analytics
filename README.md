# AIESEC Exchange Analytics Platform

An analytics platform for monitoring and analysing data related to AIESEC exchange programs.
<br>Uses the same endpoints as https://expa.aiesec.org/analytics/graphical
<br><br>
***AIESEC GST 2026.1  - GID Project Manager Application***
<br>*This project was made by Armaan Jhanji as part of the functional questions for the Project Manager Application.*
<br>

## Building Locally

### **Pre-requisites**

- **Node.js** (recommended: v20.x.x or v22.x.x LTS)
- **npm** (recommended: v10.x.x)
- **Python** (recommended: v3.12.x)

> IMPORTANT:
> - Please ensure that you have the above packages in the right versions.
> - Avoid experimental or pre-release versions of Node.js and Python, as some dependencies (e.g., Vite, Uvicorn) may not be fully compatible.


### Setup Steps
Follow the commands below as appropriate for the easiest local setup.

<details>
<summary><strong>macOS</strong></summary>
   
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
    python3.12 -m venv venv
    source ./venv/bin/activate
    pip3.12 install -r requirements.txt
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
</details>

<details>
<summary><strong>Windows</strong></summary>
   
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
    python3.12 -m venv venv
    .\venv\Scripts\Activate.ps1
    pip3.12 install -r requirements.txt
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
    .\venv\Scripts\Activate.ps1
    uvicorn main:server --reload
    ```

4. **Access the app:**  
   - Open [http://localhost:5173](http://localhost:5173) in your browser.
   - Backend runs on: [http://localhost:8000](http://localhost:8000).
   - Visit [http://localhost:8000/docs](http://localhost:8000/docs) for API documentation.
</details>


<br>

## Notes

> IMPORTANT:
> - In case the OAuth flow breaks, please remove the ProtectedRoute wrapper from client/App.jsx, and manually set a localhost cookie with a valid access_token from EXPA.
> - The backend must be running for the OAuth to work. If you run into any errors, ensure localhost:8000 is actually reachable on your machine.
- The repository includes demo-specific environment variables for evaluation purposes only.
- These credentials are scoped and will be revoked after the selection process.
- The platform demo works best in development mode, hence please use the commands above.
- `npx` can be used for quick testing, but local installs are recommended for consistent dependency resolution.

<br>

## Project Structure

```
aiesec-exchange-analytics/
├── client/  # Frontend (React + Vite)
├── server/  # Backend (FastAPI)
└── ...
```
