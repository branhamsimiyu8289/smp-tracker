<<<<<<< HEAD

=======
# SMP Tracker

A small browser-based daily check-in app for recording a participant's name,
sleep, water intake, and step count. The app reports whether the participant
reached the 10,000-step goal.

## Project Structure

```text
smp-tracker/
├── smpdailycheckinform.html  # Browser form
├── day39.js                  # Browser API client
├── main.py                   # FastAPI backend
└── README.md                 # Project documentation
```

The request flow is:

```text
smpdailycheckinform.html -> day39.js -> HTTP -> main.py
```

## Requirements

- Python 3.14 or another supported Python 3 version
- FastAPI
- Uvicorn

The workspace virtual environment is located one level above this folder:

```text
../.venv/Scripts/python.exe
```

## Run the App

Open two PowerShell terminals.

In the first terminal, start the API from this folder:

```powershell
cd "C:\Users\owenc\OneDrive\Desktop\AI-Masterclass\week8\smp-tracker"
..\.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000
```

In the second terminal, serve the browser files:

```powershell
cd "C:\Users\owenc\OneDrive\Desktop\AI-Masterclass\week8\smp-tracker"
..\.venv\Scripts\python.exe -m http.server 8080
```

Open the form at:

```text
http://localhost:8080/smpdailycheckinform.html
```

Do not open the HTML with `file://` when testing from another device. Serving
the folder over HTTP ensures that the page and JavaScript load correctly.

## Use From Another Device

The other device must be connected to the same local network. Find the host
computer's IPv4 address, then open this URL on the other device:

```text
http://HOST_IP:8080/smpdailycheckinform.html
```

For example:

```text
http://10.3.27.227:8080/smpdailycheckinform.html
```

The API is configured to listen on all network interfaces. If Windows Firewall
asks for permission, allow Python on private networks. The host computer must
keep both terminal processes running.

## API

### `GET /api/checkins`

Returns all check-ins stored during the current server session.

### `POST /api/checkins`

Accepts JSON in this shape:

```json
{
    "name": "Alex",
    "sleep": 7.5,
    "water": 8,
    "steps": 10500
}
```

The response includes the submitted values and a `hit_goal` field. The goal is
met when `steps` is at least `10000`.

## Data Storage

Check-ins are currently stored in the `checkins` list in memory. They are lost
when the API process stops or restarts. A database can be added later if the
tracker needs persistent records.

## Security Note

The API currently allows cross-origin requests from any origin for local
development. Restrict `allow_origins` before deploying this app outside a
trusted local network.
>>>>>>> afd3315cedad39743e4f448e560474d518dd251c
