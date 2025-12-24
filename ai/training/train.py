import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader
from sklearn.metrics import confusion_matrix, classification_report
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from PIL import Image

# =========================
# إعداد الجهاز
# =========================
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# =========================
# المسارات
# =========================
DATASET_DIR = "datasets/ham10000"
MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)

# =========================
# التحويلات
# =========================
train_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
])

val_transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
])

# =========================
# Validation + Metrics
# =========================
def validate(model, val_loader, criterion, device, classes):
    model.eval()
    val_loss = 0.0
    all_preds = []
    all_labels = []

    with torch.no_grad():
        for images, labels in val_loader:
            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)
            loss = criterion(outputs, labels)
            val_loss += loss.item()

            _, preds = torch.max(outputs,1)
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())

    avg_loss = val_loss / len(val_loader)
    accuracy = np.mean(np.array(all_preds) == np.array(all_labels))
    cm = confusion_matrix(all_labels, all_preds)
    report = classification_report(all_labels, all_preds, target_names=classes)
    return avg_loss, accuracy, cm, report

# =========================
# Training + Validation
# =========================
def train_model(num_epochs=5, batch_size=32, lr=0.0001):
    train_dataset = datasets.ImageFolder(os.path.join(DATASET_DIR,"train"), transform=train_transform)
    val_dataset = datasets.ImageFolder(os.path.join(DATASET_DIR,"val"), transform=val_transform)
    classes = train_dataset.classes

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=0)

    model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
    model.fc = nn.Linear(model.fc.in_features, len(classes))
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=lr)

    best_val_acc = 0.0

    for epoch in range(num_epochs):
        model.train()
        running_loss = 0.0
        for images, labels in train_loader:
            images = images.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()

        train_loss = running_loss / len(train_loader)
        val_loss, val_acc, cm, report = validate(model, val_loader, criterion, device, classes)

        print(f"\nEpoch [{epoch+1}/{num_epochs}] | Train Loss: {train_loss:.4f} | Val Loss: {val_loss:.4f} | Val Acc: {val_acc:.4f}")
        print("Confusion Matrix:")
        print(cm)
        print("Classification Report:")
        print(report)
        print("-"*50)

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), os.path.join(MODEL_DIR,"best_skin_model.pth"))
            print(f"Best model saved with Val Acc: {best_val_acc:.4f}")

    torch.save(model.state_dict(), os.path.join(MODEL_DIR,"skin_model.pth"))
    print("Final model saved.")

    return model, classes

# =========================
# Confusion Matrix Visualization
# =========================
def plot_confusion_matrix(cm, classes, title="Confusion Matrix"):
    plt.figure(figsize=(8,6))
    sns.heatmap(cm, annot=True, fmt="d", xticklabels=classes, yticklabels=classes, cmap="Blues")
    plt.ylabel("True Label")
    plt.xlabel("Predicted Label")
    plt.title(title)
    plt.show()

# =========================
# Inference على صورة واحدة
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
# Main
# =========================
if __name__ == "__main__":
    model, classes = train_model(num_epochs=5)
    
    # Example: Visualize Confusion Matrix after training
    _, _, cm, _ = validate(model, DataLoader(datasets.ImageFolder(os.path.join(DATASET_DIR,"val"), transform=val_transform), batch_size=32, shuffle=False), nn.CrossEntropyLoss(), device, classes)
    plot_confusion_matrix(cm, classes)

    # Example: Inference
    predict_image(model, classes, "C:/Users/moudd/Desktop/dermAi/ai/datasets/ham10000/val/df/ISIC_0025668.jpg")
