# 🚀 Quick Start Guide - Testing DermAI

## Fastest Way to Test Everything

### Step 1: Start MongoDB
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# If not running, start it:
net start MongoDB
```

### Step 2: Start Backend (Terminal 1)
```powershell
cd backend
npm install  # Only needed first time
npm run start:dev
```

**Wait for:** `🚀 Backend server running on http://localhost:3000`

### Step 3: Start Frontend (Terminal 2)
```powershell
cd frontend
npm install  # Only needed first time
npm run dev
```

**Wait for:** `Local: http://localhost:3001`

### Step 4: Test Backend API (Terminal 3 - Optional)
```powershell
# Run the test script
.\test-backend.ps1

# Or test manually with your own image:
.\test-backend.ps1 -ImagePath "path\to\your\image.jpg"
```

### Step 5: Test Frontend
1. Open browser: `http://localhost:3001`
2. Click "Select an image"
3. Choose a skin lesion image
4. Click "Analyze Image"
5. Wait for results (10-30 seconds)

---

## 🧪 Quick Test Checklist

### ✅ Backend Test
- [ ] Backend starts without errors
- [ ] See "🚀 Backend server running" message
- [ ] Test script runs successfully (optional)

### ✅ Frontend Test  
- [ ] Frontend starts without errors
- [ ] Page loads at `http://localhost:3001`
- [ ] Can select and preview image
- [ ] Can submit for analysis
- [ ] Results display correctly

### ✅ Integration Test
- [ ] Upload image through frontend
- [ ] See loading spinner
- [ ] Get prediction result
- [ ] Check backend terminal for Python execution logs
- [ ] Verify result in MongoDB (optional)

---

## 🐛 Common Issues & Quick Fixes

### Backend won't start
```powershell
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Check MongoDB connection
# Ensure MongoDB is running: Get-Service MongoDB
```

### Frontend can't connect to backend
- ✅ Ensure backend is running on port 3000
- ✅ Check browser console (F12) for errors
- ✅ Verify CORS is enabled in `backend/src/main.ts`

### Python script errors
```powershell
# Test Python script directly
cd ai
.\venv\Scripts\activate
python run_inference.py "path\to\test\image.jpg"
```

### No test images?
- Use images from: `ai\datasets\ham10000\train\` or `val\`
- Any skin lesion image from the internet
- The model expects skin lesion images (not regular photos)

---

## 📝 Expected Results

### Successful Upload Response
```json
{
  "predicted_class": "mel",
  "confidence": 0.975,
  "filename": "1234567890-123456789.jpg",
  "originalname": "test.jpg"
}
```

### Disease Classes
- `akiec` - Actinic Keratoses
- `bcc` - Basal Cell Carcinoma  
- `bkl` - Benign Keratosis
- `df` - Dermatofibroma
- `mel` - Melanoma ⚠️
- `nv` - Melanocytic Nevi
- `vasc` - Vascular Lesions

---

## ⏱️ Expected Timings

- **Backend startup**: 2-5 seconds
- **Frontend startup**: 3-10 seconds
- **Image upload**: < 1 second
- **Python inference**: 5-30 seconds (CPU) / 1-5 seconds (GPU)
- **Total response**: 6-32 seconds

---

## 🎯 Success Indicators

✅ **Everything works if:**
1. Backend shows "🚀 Backend server running"
2. Frontend loads at `http://localhost:3001`
3. You can upload an image
4. You get a prediction result
5. No errors in browser console (F12)
6. No errors in backend terminal

---

## 📚 More Details

For comprehensive testing instructions, see: `TESTING_GUIDE.md`

