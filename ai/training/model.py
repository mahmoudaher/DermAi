import torch
import torch.nn as nn
from torchvision import models

def get_model(num_classes=7):
    model = models.resnet18(pretrained=True)

    # تجميد الطبقات الأساسية
    for param in model.parameters():
        param.requires_grad = False

    # تعديل آخر طبقة
    model.fc = nn.Linear(model.fc.in_features, num_classes)

    return model
