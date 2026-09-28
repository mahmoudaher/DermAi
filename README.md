# DermAI

DermAI is an educational full-stack application for image-based skin-lesion
classification. A user uploads a skin image through the Next.js interface; the NestJS
backend sends it to a PyTorch inference script and returns the predicted class and
confidence score. MongoDB can optionally store analysis results.
> **Medical disclaimer:** DermAI is a research and demonstration project. It is not a
> medical device and must not be used to diagnose, treat, or rule out a health condition.
> Always consult a qualified healthcare professional.

## What It Includes

- Responsive Next.js frontend for image upload and result display.
- NestJS REST API with multipart image upload handling.
- ResNet18-based PyTorch inference with seven supported classes.
- Optional MongoDB persistence with a no-database development mode.
- Educational pages describing skin conditions and awareness topics.
- Setup, troubleshooting, testing, and deployment notes in `docs/`.

## Architecture

```text
dermAi/
├── ai/
│   └── training/              # Dataset preparation and training code
├── backend/
│   ├── src/inference/         # Upload controller, inference service, schema
├── frontend/
│   ├── app/                   # Next.js pages and UI components
│   └── public/                # Static assets
├── docs/                      # Setup, deployment, and troubleshooting guides
├── scripts/                   # Windows helper scripts
├── package.json               # Root orchestration commands
└── start.ps1                  # Windows development startup script
``` 


## Supported Classes

The model predicts one of these HAM10000-style classes:

| Code | Class |
| --- | --- |
| `akiec` | Actinic keratoses and intraepithelial carcinoma |
| `bcc` | Basal cell carcinoma |
| `bkl` | Benign keratosis |
| `df` | Dermatofibroma |
| `mel` | Melanoma |
| `nv` | Melanocytic nevi |
| `vasc` | Vascular lesions |

## Requirements

 - Node.js 18 or newer
 - npm
 - Python 3.8 or newer
 - Python packages required by `ai/run_inference.py`: PyTorch, torchvision, and Pillow
 - MongoDB for persistence; optional when running in no-database mode
 - Windows PowerShell for the provided `start.ps1` and helper scripts

## Installation

Install the root, backend, and frontend dependencies:

```powershell
npm install
```

The root command installs both JavaScript applications. Install the Python dependencies
in the environment used by the AI service according to your local PyTorch setup, because
the correct PyTorch package depends on the available CPU or CUDA runtime.

## Run Locally

### Windows startup script

From the repository root:

```powershell
.\start.ps1
```

The script checks MongoDB, starts the NestJS backend, starts the Next.js frontend, and
opens the frontend in a browser. When MongoDB is unavailable, it starts the backend with
`NO_DB=true`; predictions can still run, but results are not persisted.

### Manual startup

Backend:

```powershell
cd backend
npm run start:dev
```

Frontend, in a second terminal:

```powershell
cd frontend
npm run dev
```

To run the backend without MongoDB in PowerShell:

```powershell
$env:NO_DB = "true"
npm run start:dev
```

The development configuration uses port `3000` for the backend and is intended to serve
the frontend on port `3001`. If another local service occupies either port, stop it or
adjust the local development command and frontend API URL accordingly.

## API

The main endpoint accepts an image in a multipart form field named `image`:

```text
POST /inference/upload
Content-Type: multipart/form-data
```

Supported image formats are JPG, JPEG, PNG, GIF, and WEBP. The upload limit is 10 MB.
The response contains the predicted class, confidence, and uploaded file metadata.

## Useful Commands

From the repository root:

| Command | Purpose |
| --- | --- |
| `npm install` | Install backend and frontend dependencies |
| `npm run dev` | Start the Windows development workflow |
| `npm run clean` | Remove JavaScript dependencies and build output |

From `backend/`:

| Command | Purpose |

| --- | --- |
| `npm run start:dev` | Start NestJS in watch mode |
| `npm run build` | Build the backend |
| `npm run test` | Run backend unit tests |
| `npm run test:e2e` | Run end-to-end tests |

From `frontend/`:

| Command | Purpose |

| --- | --- |
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build the frontend |
| `npm run start` | Serve the production build |
| `npm run lint` | Run frontend linting |

## Documentation

The `docs/` directory contains additional guides for setup, MongoDB, troubleshooting,
testing, deployment, and project structure. Start with `docs/QUICK_START.md` or
`docs/README_START.md` when setting up the project for the first time.

## Project Status

This repository is an educational prototype. Model quality, security, privacy, clinical
validity, and production deployment require additional review before real-world use.

## License

Private educational project. No open-source license is currently declared.
<<<<<<< HEAD

=======
# DermAI

DermAI is an educational full-stack application for image-based skin-lesion
classification. A user uploads a skin image through the Next.js interface; the NestJS
backend sends it to a PyTorch inference script and returns the predicted class and
confidence score. MongoDB can optionally store analysis results.

> **Medical disclaimer:** DermAI is a research and demonstration project. It is not a
> medical device and must not be used to diagnose, treat, or rule out a health condition.
> Always consult a qualified healthcare professional.

## What It Includes

- Responsive Next.js frontend for image upload and result display.
- NestJS REST API with multipart image upload handling.
- ResNet18-based PyTorch inference with seven supported classes.
- Optional MongoDB persistence with a no-database development mode.
- Educational pages describing skin conditions and awareness topics.
- Setup, troubleshooting, testing, and deployment notes in `docs/`.

## Architecture

```text
dermAi/
├── ai/
│   ├── run_inference.py       # Loads the model and predicts one image
│   ├── final_model/           # Saved PyTorch model
│   └── training/              # Dataset preparation and training code
├── backend/
│   ├── src/inference/         # Upload controller, inference service, schema
│   └── uploads/               # Temporary uploaded images
├── frontend/
│   ├── app/                   # Next.js pages and UI components
│   └── public/                # Static assets
├── docs/                      # Setup, deployment, and troubleshooting guides
├── scripts/                   # Windows helper scripts
├── package.json               # Root orchestration commands
└── start.ps1                  # Windows development startup script
```

## Supported Classes

The model predicts one of these HAM10000-style classes:

| Code | Class |
| --- | --- |
| `akiec` | Actinic keratoses and intraepithelial carcinoma |
| `bcc` | Basal cell carcinoma |
| `bkl` | Benign keratosis |
| `df` | Dermatofibroma |
| `mel` | Melanoma |
| `nv` | Melanocytic nevi |
| `vasc` | Vascular lesions |

## Requirements

- Node.js 18 or newer
- npm
- Python 3.8 or newer
- Python packages required by `ai/run_inference.py`: PyTorch, torchvision, and Pillow
- MongoDB for persistence; optional when running in no-database mode
- Windows PowerShell for the provided `start.ps1` and helper scripts

## Installation

Install the root, backend, and frontend dependencies:

```powershell
npm install
```

The root command installs both JavaScript applications. Install the Python dependencies
in the environment used by the AI service according to your local PyTorch setup, because
the correct PyTorch package depends on the available CPU or CUDA runtime.

## Run Locally

### Windows startup script

From the repository root:

```powershell
.\start.ps1
```

The script checks MongoDB, starts the NestJS backend, starts the Next.js frontend, and
opens the frontend in a browser. When MongoDB is unavailable, it starts the backend with
`NO_DB=true`; predictions can still run, but results are not persisted.

### Manual startup

Backend:

```powershell
cd backend
npm run start:dev
```

Frontend, in a second terminal:

```powershell
cd frontend
npm run dev
```

To run the backend without MongoDB in PowerShell:

```powershell
$env:NO_DB = "true"
npm run start:dev
```

The development configuration uses port `3000` for the backend and is intended to serve
the frontend on port `3001`. If another local service occupies either port, stop it or
adjust the local development command and frontend API URL accordingly.

## API

The main endpoint accepts an image in a multipart form field named `image`:

```text
POST /inference/upload
Content-Type: multipart/form-data
```

Supported image formats are JPG, JPEG, PNG, GIF, and WEBP. The upload limit is 10 MB.
The response contains the predicted class, confidence, and uploaded file metadata.

## Useful Commands

From the repository root:

| Command | Purpose |
| --- | --- |
| `npm install` | Install backend and frontend dependencies |
| `npm run dev` | Start the Windows development workflow |
| `npm run clean` | Remove JavaScript dependencies and build output |

From `backend/`:

| Command | Purpose |
| --- | --- |
| `npm run start:dev` | Start NestJS in watch mode |
| `npm run build` | Build the backend |
| `npm run test` | Run backend unit tests |
| `npm run test:e2e` | Run end-to-end tests |

From `frontend/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build the frontend |
| `npm run start` | Serve the production build |
| `npm run lint` | Run frontend linting |

## Documentation

The `docs/` directory contains additional guides for setup, MongoDB, troubleshooting,
testing, deployment, and project structure. Start with `docs/QUICK_START.md` or
`docs/README_START.md` when setting up the project for the first time.

## Project Status

This repository is an educational prototype. Model quality, security, privacy, clinical
validity, and production deployment require additional review before real-world use.

## License

Private educational project. No open-source license is currently declared.
>>>>>>> 84c8eb5 (Improve project documentation)
