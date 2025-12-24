import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

# =========================
# إعداد الجهاز
# =========================
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# =========================
# دالة Inference على صورة واحدة
# =========================
def predict_image(model, classes, image_path):
    model.eval()
    img = Image.open(image_path).convert("RGB")
    transform = transforms.Compose([
        transforms.Resize((224,224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
    ])
    img_tensor = transform(img).unsqueeze(0).to(device)
    with torch.no_grad():
        outputs = model(img_tensor)
        probs = torch.softmax(outputs, dim=1)
        conf, pred = torch.max(probs, 1)
    print(f"Predicted: {classes[pred.item()]} | Confidence: {conf.item():.4f}")

# =========================
# تحميل الموديل
# =========================
classes = ['akiec','bcc','bkl','df','mel','nv','vasc']  # لازم تحدد الكلاسات هنا

model = models.resnet18(weights=None)
model.fc = nn.Linear(model.fc.in_features, len(classes))
model.load_state_dict(torch.load("models/best_skin_model.pth"))
model = model.to(device)
model.eval()

# =========================
# تجربة صورة واحدة
# =========================
predict_image(model, classes, r"C:\Users\moudd\Desktop\dermAi\ai\datasets\ham10000\val\df\ISIC_0025668.jpg")
