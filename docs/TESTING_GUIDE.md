# DermAI Testing Guide

## 🧪 Step-by-Step Testing Instructions

### Prerequisites Check

#### 1. MongoDB Setup

```bash
# Check if MongoDB is running
# Windows (PowerShell):
Get-Service MongoDB

# Or check if port 27017 is listening:
netstat -an | findstr 27017

# If MongoDB is not running, start it:
# Windows: Start MongoDB service from Services
# Or run: mongod
```

#### 2. Python Environment

```bash
# Navigate to ai directory
cd ai

# Activate virtual environment
# Windows:
.\venv\Scripts\activate

# Verify Python and PyTorch
python --version
python -c "import torch; print(torch.__version__)"

# Test the inference script manually
python run_inference.py "path/to/test/image.jpg"
```

#### 3. Node.js Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## 🔧 Backend Testing

### Step 1: Start MongoDB

Ensure MongoDB is running on `localhost:27017`

### Step 2: Start Backend Server

```bash
cd backend
npm run start:dev
```

**Expected Output:**

```
🚀 Backend server running on http://localhost:3000
```

### Step 3: Test Backend Endpoint (Using curl or Postman)

#### Option A: Using curl (PowerShell)

```powershell
# Test with a sample image
$imagePath = "path\to\your\test\image.jpg"
$uri = "http://localhost:3000/inference/upload"

$form = @{
    image = Get-Item $imagePath
}

Invoke-RestMethod -Uri $uri -Method Post -Form $form
```

#### Option B: Using Postman

1. Open Postman
2. Create new POST request: `http://localhost:3000/inference/upload`
3. Go to Body → form-data
4. Add key `image` (type: File)
5. Select an image file
6. Click Send

**Expected Response:**

```json
{
  "predicted_class": "mel",
  "confidence": 0.975,
  "filename": "1234567890-123456789.jpg",
  "originalname": "test_image.jpg"
}
```

### Step 4: Verify MongoDB Storage

```bash
# Connect to MongoDB
mongosh

# Use database
use dermAI

# Check collections
show collections

# View saved results
db.images.find().pretty()
```

---

## 🎨 Frontend Testing

### Step 1: Start Frontend Server

```bash
cd frontend
npm run dev
```

**Expected Output:**

```
  ▲ Next.js 16.0.7
  - Local:        http://localhost:3001
```

### Step 2: Open Browser

Navigate to: `http://localhost:3001`

### Step 3: Test Upload Flow

1. **Upload Image**

   - Click "Select an image" or drag & drop
   - Choose a skin lesion image (JPG, PNG, etc.)
   - Verify preview appears

2. **Submit**

   - Click "Analyze Image"
   - Watch loading spinner
   - Wait for result (may take 10-30 seconds)

3. **Verify Results**

   - Check uploaded image displays
   - Check predicted disease name
   - Check confidence percentage
   - Verify progress bar

4. **Test Reset**
   - Click "Analyze Another Image"
   - Verify form resets

### Step 4: Test Error Handling

1. **Invalid File Type**

   - Try uploading a .txt file
   - Should show error message

2. **File Too Large**

   - Try uploading image > 10MB
   - Should show error message

3. **No File Selected**
   - Click "Analyze Image" without selecting file
   - Should show error message

---

## 🔗 End-to-End Testing

### Complete Flow Test

1. **Start Services**

   ```bash
   # Terminal 1: MongoDB (if not running as service)
   mongod

   # Terminal 2: Backend
   cd backend
   npm run start:dev

   # Terminal 3: Frontend
   cd frontend
   npm run dev
   ```

2. **Test Complete Workflow**

   - Open `http://localhost:3001`
   - Upload a skin image
   - Wait for prediction
   - Verify result displays correctly
   - Check browser console for errors (F12)
   - Check backend logs for Python execution

3. **Verify Data Flow**
   - Image uploaded → Backend receives it
   - Backend saves to `/uploads` folder
   - Python script executes
   - Result saved to MongoDB
   - Frontend displays result

---

## 🐛 Troubleshooting

### Backend Issues

#### Issue: "Cannot connect to MongoDB"

```bash
# Check MongoDB status
Get-Service MongoDB

# Start MongoDB
net start MongoDB

# Or check connection string in app.module.ts
```

#### Issue: "Python script not found"

```bash
# Verify Python script exists
ls ai/run_inference.py

# Check path resolution in inference.service.ts
# Ensure project structure matches expected paths
```

#### Issue: "Model file not found"

```bash
# Verify model exists
ls ai/final_model/dermAI_final.pth

# Check Python script path resolution
```

#### Issue: "Port 3000 already in use"

```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or change port in backend/src/main.ts
```

### Frontend Issues

#### Issue: "Cannot connect to backend"

- Check backend is running on port 3000
- Check CORS settings in `backend/src/main.ts`
- Verify API URL in `frontend/app/page.tsx` is `http://localhost:3000`

#### Issue: "CORS error"

- Ensure backend has CORS enabled
- Check `backend/src/main.ts` for CORS configuration
- Verify frontend port matches CORS origin

#### Issue: "Image not displaying"

- Check browser console for errors
- Verify image path is correct
- Check Next.js Image component configuration

### Python Issues

#### Issue: "PyTorch not found"

```bash
cd ai
.\venv\Scripts\activate
pip install torch torchvision pillow
```

#### Issue: "CUDA errors"

- Script automatically falls back to CPU
- Check `run_inference.py` device configuration
- Verify CUDA is available if using GPU

---

## ✅ Testing Checklist

### Backend

- [ ] MongoDB connection successful
- [ ] Server starts without errors
- [ ] Upload endpoint accepts files
- [ ] Python script executes
- [ ] Results saved to MongoDB
- [ ] Error handling works
- [ ] File cleanup on error

### Frontend

- [ ] Page loads correctly
- [ ] File upload works
- [ ] Preview displays
- [ ] Loading state shows
- [ ] Results display correctly
- [ ] Error messages show
- [ ] Reset functionality works

### Integration

- [ ] End-to-end flow works
- [ ] Data persists in MongoDB
- [ ] Images accessible via `/uploads/`
- [ ] No console errors
- [ ] No network errors

---

## 🧪 Quick Test Script

### Test Backend API (PowerShell)

```powershell
# Save as test-backend.ps1
$testImage = "path\to\test\image.jpg"
if (-not (Test-Path $testImage)) {
    Write-Host "Error: Test image not found at $testImage"
    exit 1
}

$uri = "http://localhost:3000/inference/upload"
$form = @{
    image = Get-Item $testImage
}

try {
    $response = Invoke-RestMethod -Uri $uri -Method Post -Form $form
    Write-Host "Success!" -ForegroundColor Green
    Write-Host "Predicted: $($response.predicted_class)" -ForegroundColor Cyan
    Write-Host "Confidence: $([math]::Round($response.confidence * 100, 2))%" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
```

### Test Python Script Directly

```bash
cd ai
.\venv\Scripts\activate
python run_inference.py "path\to\test\image.jpg"
```

**Expected Output:**

```json
{ "predicted_class": "mel", "confidence": 0.975 }
```

---

## 📊 Performance Testing

### Expected Timings

- **File Upload**: < 1 second
- **Python Inference**: 5-30 seconds (depending on hardware)
- **MongoDB Save**: < 1 second
- **Total Response**: 6-32 seconds

### Load Testing

- Test with multiple images sequentially
- Monitor backend logs for errors
- Check MongoDB for all saved results

---

## 🎯 Success Criteria

✅ **Backend is working if:**

- Server starts without errors
- Upload endpoint returns prediction
- Results appear in MongoDB

✅ **Frontend is working if:**

- Page loads and displays upload form
- Image uploads successfully
- Results display correctly

✅ **System is working if:**

- Complete flow executes without errors
- Predictions are accurate
- Data persists correctly
