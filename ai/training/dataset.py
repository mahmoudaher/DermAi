import os
import pandas as pd
from PIL import Image
from torch.utils.data import Dataset
from torchvision import transforms

class SkinDataset(Dataset):
    def __init__(self, csv_file, img_dir1, img_dir2, transform=None):
        self.data = pd.read_csv(csv_file)
        self.img_dir1 = img_dir1
        self.img_dir2 = img_dir2
        self.transform = transform

        self.label_map = {
            "akiec": 0,
            "bcc": 1,
            "bkl": 2,
            "df": 3,
            "mel": 4,
            "nv": 5,
            "vasc": 6
        }

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        img_name = self.data.iloc[idx]["image_id"] + ".jpg"
        label = self.label_map[self.data.iloc[idx]["dx"]]

        img_path1 = os.path.join(self.img_dir1, img_name)
        img_path2 = os.path.join(self.img_dir2, img_name)

        if os.path.exists(img_path1):
            image = Image.open(img_path1).convert("RGB")
        else:
            image = Image.open(img_path2).convert("RGB")

        if self.transform:
            image = self.transform(image)

        return image, label
