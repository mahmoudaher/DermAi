import sys
import os
import torch
from torchvision import transforms, models
from PIL import Image
import json

script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "final_model", "dermAI_final.pth")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = models.resnet18()
model.fc = torch.nn.Linear(model.fc.in_features, 7)
model.load_state_dict(torch.load(model_path, map_location=device))
model = model.to(device)
model.eval()

classes = ['akiec', 'bcc', 'bkl', 'df', 'mel', 'nv', 'vasc']

image_path = sys.argv[1]
img = Image.open(image_path).convert("RGB")
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])
img_tensor = transform(img).unsqueeze(0).to(device)

with torch.no_grad():
    outputs = model(img_tensor)
    probs = torch.softmax(outputs, dim=1)
    conf, pred = torch.max(probs, 1)

result = {
    "predicted_class": classes[pred.item()],
    "confidence": float(conf.item())
}

print(json.dumps(result))
