import os
import torch
from torchvision import models
import torch.nn as nn

# =========================
# إعداد الجهاز
# =========================
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# =========================
# مجلد الحفظ
# =========================
FINAL_MODEL_DIR = "final_model"
os.makedirs(FINAL_MODEL_DIR, exist_ok=True)

# =========================
# تحميل الموديل المحفوظ
# =========================
classes = ['akiec','bcc','bkl','df','mel','nv','vasc']

model = models.resnet18(weights=None)
model.fc = nn.Linear(model.fc.in_features, len(classes))
model.load_state_dict(torch.load("models/best_skin_model.pth", map_location=device))
model = model.to(device)
model.eval()

# =========================
# حفظ الموديل النهائي
# =========================
FINAL_MODEL_PATH = os.path.join(FINAL_MODEL_DIR, "dermAI_final.pth")
torch.save(model.state_dict(), FINAL_MODEL_PATH)
print(f"Final production-ready model saved at: {FINAL_MODEL_PATH}")
