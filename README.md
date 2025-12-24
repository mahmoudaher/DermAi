# 🩺 DermAI - AI-Powered Skin Disease Analysis

AI-based skin disease analysis platform built with Next.js, NestJS, and Python PyTorch.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Python 3.8+ (for AI inference)
- MongoDB (optional - can run without it)

### Installation

```bash
# Install all dependencies
npm install

# Or install separately
npm run install:backend
npm run install:frontend
```

### Running the Application

**Option 1: Using PowerShell script (Recommended for Windows)**

```powershell
.\start.ps1
```

**Option 2: Using npm scripts**

```bash
npm run dev
```

**Option 3: Manual start**

```bash
# Terminal 1: Backend (with MongoDB)
cd backend
npm run start:dev

# Terminal 2: Backend (without MongoDB)
cd backend
$env:NO_DB="true"
npm run start:dev

# Terminal 3: Frontend
cd frontend
npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000

## 📁 Project Structure

```
dermAi/
├── ai/                      # Python AI service
│   ├── run_inference.py     # Main inference script (used by backend)
│   ├── final_model/         # Trained model files
│   ├── training/            # Training scripts and models
│   └── venv/               # Python virtual environment
│
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── inference/       # Inference module (controller, service, schema)
│   │   └── main.ts         # Application entry point
│   └── uploads/            # Uploaded images storage
│
├── frontend/                # Next.js web application
│   ├── app/                 # Next.js app directory
│   │   ├── page.tsx        # Main upload/analysis page
│   │   ├── hastaliklar/    # Diseases information page
│   │   └── farkindalik/    # Awareness page
│   └── public/             # Static assets
│
├── docs/                   # Documentation files
├── scripts/                # Utility scripts
└── start.ps1              # Main startup script
```

## 🔧 Available Commands

### Root Level

- `npm install` - Install all dependencies
- `npm run dev` - Start all services (uses start.ps1)
- `npm run clean` - Clean node_modules and build files

### Backend

- `npm run start:dev` - Start in development mode
- `npm run build` - Build for production
- `npm run start:prod` - Start production server

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## 📚 Documentation

All documentation is available in the `docs/` folder:

- Setup guides
- Troubleshooting
- API documentation
- Testing guides

## 🎯 Features

- **AI-Powered Analysis**: 7-class skin disease classification
- **Real-time Inference**: Fast image analysis using PyTorch
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS
- **Optional Database**: Works with or without MongoDB
- **RESTful API**: Clean NestJS backend architecture

## 🏥 Supported Disease Classes

- **akiec** - Actinic Keratoses
- **bcc** - Basal Cell Carcinoma
- **bkl** - Benign Keratosis
- **df** - Dermatofibroma
- **mel** - Melanoma
- **nv** - Melanocytic Nevi
- **vasc** - Vascular Lesions

## ⚠️ Medical Disclaimer

This tool is for educational and research purposes only. It does not provide medical diagnosis or treatment recommendations. Always consult with qualified healthcare professionals for medical advice.

## 📝 License

UNLICENSED - Private project
