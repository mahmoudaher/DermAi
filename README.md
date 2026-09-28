# DermAI

Educational full-stack skin-lesion image classification platform. Users upload an image through Next.js, NestJS forwards it to a PyTorch ResNet18 inference service, and the application returns a predicted class with a confidence score.

> This is a research and demonstration project, not a medical device. Do not use it to diagnose or treat a condition. Consult a qualified healthcare professional.

## Stack

- Next.js, React, and Tailwind CSS
- NestJS REST API with multipart uploads
- Python, PyTorch, and ResNet18 inference
- Optional MongoDB persistence

## Supported Classes

`akiec`, `bcc`, `bkl`, `df`, `mel`, `nv`, and `vasc`.

## Run Locally

```powershell
npm install
.\start.ps1
```

The backend can run without MongoDB using `NO_DB=true`. See `docs/` for setup notes.

## API

`POST /inference/upload` with a multipart field named `image`. JPG, JPEG, PNG, GIF, and WEBP files up to 10 MB are supported.

## Status

Educational prototype requiring security, privacy, clinical validation, and production-readiness review.