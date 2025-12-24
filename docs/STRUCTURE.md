# Project Structure Documentation

## Overview

This document describes the organization and structure of the DermAI project.

## Directory Structure

### `/ai` - Python AI Service

Contains the machine learning model and inference scripts.

**Production Files:**

- `run_inference.py` - Main inference script called by backend
- `final_model/dermAI_final.pth` - Trained model weights
- `venv/` - Python virtual environment

**Training Files (in `training/` subfolder):**

- `train.py` - Model training script
- `prepare_dataset.py` - Dataset preparation
- `save_final_model.py` - Model saving utilities
- `model.py` - Model architecture definition
- `dataset.py` - Dataset handling
- `models/` - Training checkpoints and intermediate models

**Note:** The `datasets/` folder contains the HAM10000 dataset used for training. This is a large folder and can be excluded from version control.

### `/backend` - NestJS API Server

RESTful API server that handles image uploads and coordinates with the AI service.

**Key Files:**

- `src/main.ts` - Application entry point
- `src/app.module.ts` - Root module
- `src/inference/` - Inference module
  - `controller/inference.controller.ts` - API endpoints
  - `service/inference.service.ts` - Business logic
  - `schema/image.schema.ts` - MongoDB schema (optional)

**Build Output:**

- `dist/` - Compiled JavaScript (auto-generated)
- `uploads/` - User-uploaded images

### `/frontend` - Next.js Web Application

Modern React-based user interface.

**Key Files:**

- `app/page.tsx` - Main analysis page
- `app/hastaliklar/page.tsx` - Diseases information page
- `app/farkindalik/page.tsx` - Awareness page
- `app/layout.tsx` - Root layout
- `app/globals.css` - Global styles

**Build Output:**

- `.next/` - Next.js build output (auto-generated)
- `node_modules/` - Dependencies (auto-generated)

### `/docs` - Documentation

All project documentation files.

### `/scripts` - Utility Scripts

Helper scripts for development and maintenance:

- `check-backend.ps1` - Check if backend is running
- `restart-backend.ps1` - Restart backend server
- `test-backend.ps1` - Test backend endpoints
- `start-mongodb.ps1` - Start MongoDB service
- `start-without-mongodb.ps1` - Start backend without MongoDB

### Root Level Files

- `start.ps1` - Main startup script (Windows)
- `Makefile` - Make commands (Unix/Linux)
- `package.json` - Root-level npm scripts
- `README.md` - Main project documentation

## File Organization Principles

1. **Separation of Concerns**: Each major component (AI, backend, frontend) is in its own directory
2. **Production vs Development**: Training/development scripts are separated from production code
3. **Documentation**: All docs consolidated in `docs/` folder
4. **Scripts**: Utility scripts organized in `scripts/` folder
5. **Clean Root**: Root directory contains only essential files

## What Was Removed/Organized

### Removed Files

- Unused backend controllers/services (`app.controller.ts`, `app.service.ts`)
- Unused frontend components (`ResultCard.tsx`, `UploadForm.tsx`)
- Empty directories (`controllers/`, `models/`, `services/`)
- Unused SVG files in `public/`
- Duplicate batch file (`start.bat`)

### Organized Files

- All documentation moved to `docs/`
- Utility scripts moved to `scripts/`
- Training scripts moved to `ai/training/`

## Build Artifacts

The following folders are auto-generated and should be in `.gitignore`:

- `backend/dist/`
- `backend/node_modules/`
- `frontend/.next/`
- `frontend/node_modules/`
- `ai/__pycache__/`
- `ai/venv/` (optional - can be regenerated)

