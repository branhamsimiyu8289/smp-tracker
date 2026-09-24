# SMP Tracker

A lightweight, browser-based self-mastery tracker for recording daily wellness activities and checking progress toward a 10,000-step goal.

The application provides a simple daily check-in form for a participant's name, sleep, water intake, and steps. A small FastAPI service validates and stores submissions in memory, while the browser client displays whether the step goal was achieved.

> **Current status:** This is a minimal local-network application. Check-ins are held in memory and are cleared whenever the API process stops or restarts.

## Features

- Daily check-in form with participant name, sleep duration, water intake, and step count
- Automatic 10,000-step goal evaluation
- Immediate success, goal-status, and connection feedback in the browser
- JSON API for reading and submitting check-ins
- Local development and same-network access from another device
- No database or build process required

## Application Architecture

```text
┌──────────────────────────┐
│ smpdailycheckinform.html │  Browser UI
└────────────┬─────────────┘
             │ Loads and submits through
             ▼
┌──────────────────────────┐
│ day39.js                 │  Browser API client
└────────────┬─────────────┘
             │ HTTP :8000
             ▼
┌──────────────────────────┐
│ main.py / FastAPI        │  API and in-memory storage
└──────────────────────────┘
```

## Project Structure

```text
smp-tracker/
├── smpdailycheckinform.html  # Browser-based daily check-in form
├── day39.js                  # Front-end API client and form handling
├── main.py                   # FastAPI application and API routes
├── .gitignore                # Local files excluded from Git
└── README.md                 # Project documentation
```

## Requirements

- Python 3.10 or newer recommended
- FastAPI
- Uvicorn
- A modern web browser

The repository does not currently include a `requirements.txt` file, so install the Python dependencies directly or add them to a project-specific dependency file:

```bash
python -m pip install fastapi uvicorn
```

## Installation

Clone the repository and enter the project directory:

```bash
git clone https://github.com/branhamsimiyu8289/smp-tracker.git
cd smp-tracker
```

For a clean local setup, create and activate a virtual environment:

### Windows PowerShell

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install fastapi uvicorn
```

### macOS or Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install fastapi uvicorn
```

## Run Locally

The API and the static web page must be served separately. Start the API in one terminal:

```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Start a static HTTP server in a second terminal from the repository directory:

```bash
python -m http.server 8080
```

Open the application at:

```text
http://127.0.0.1:8080/smpdailycheckinform.html
```

Do not open the HTML file directly with a `file://` URL. Serving it over HTTP ensures that the browser loads the JavaScript client correctly and that requests are sent to the expected API host.

## Access From Another Device

To use the tracker from another device on the same local network:

1. Start the API on all network interfaces:

   ```bash
   python -m uvicorn main:app --host 0.0.0.0 --port 8000
   ```

2. Start the static server so it is reachable on the network:

   ```bash
   python -m http.server 8080 --bind 0.0.0.0
   ```

3. Find the host computer's local IPv4 address.
4. On the other device, open:

   ```text
   http://HOST_IP:8080/smpdailycheckinform.html
   ```

For example:

```text
http://192.168.1.25:8080/smpdailycheckinform.html
```

Both terminal processes must remain running. If the host operating system prompts for firewall access, allow Python on a trusted private network only.

The JavaScript client uses the page's hostname and connects to the API on port `8000`, so the page and API should be accessed through the same host address.

## API Reference

### `GET /api/checkins`

Returns all check-ins stored during the current API process session.

Example response:

```json
[
  {
    "name": "Alex",
    "sleep": 7.5,
    "water": 8,
    "steps": 10500,
    "hit_goal": true
  }
]
```

### `POST /api/checkins`

Adds a check-in. Send JSON with the following fields:

```json
{
  "name": "Alex",
  "sleep": 7.5,
  "water": 8,
  "steps": 10500
}
```

The response contains the stored record and a calculated `hit_goal` field. The goal is considered achieved when `steps` is greater than or equal to `10000`.

Example response:

```json
{
  "success": true,
  "stored": {
    "name": "Alex",
    "sleep": 7.5,
    "water": 8,
    "steps": 10500,
    "hit_goal": true
  }
}
```

FastAPI also provides interactive API documentation while the API is running:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Data and Validation

- Data is stored in the `checkins` list in `main.py`.
- Records are not persisted to disk or a database.
- All records are lost when the API process restarts.
- The API model accepts a string `name`, a numeric `sleep` value, and integer `water` and `steps` values.
- The browser form requires all fields and validates numeric input before submission.
- The step goal is evaluated by the backend, so API clients receive the same result as the browser form.

## Security Considerations

This project is intended for local development and trusted private networks, not production deployment in its current form.

Before exposing it beyond a trusted network:

- Replace `allow_origins=["*"]` with an explicit list of permitted web origins.
- Add authentication and authorization if check-ins contain personal information.
- Add persistent storage with appropriate access controls.
- Validate business rules on the server, including sensible ranges for sleep, water, and steps.
- Run behind HTTPS and a production-ready reverse proxy.
- Avoid exposing Uvicorn's development setup directly to the public internet.
- Review firewall rules and never allow broad inbound access unnecessarily.

## Development Notes

There is currently no automated test suite or CI workflow in the repository. When extending the project, consider adding:

- API tests for successful and invalid check-ins
- Front-end tests for form validation and error states
- A `requirements.txt` or `pyproject.toml` for reproducible dependencies
- Persistent storage and date-based check-in history
- Configuration for the API URL, port, CORS origins, and step goal

## License

No license file is currently included. Add a license before distributing or reusing this project publicly.
