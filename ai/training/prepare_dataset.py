import os
import shutil
import pandas as pd
from sklearn.model_selection import train_test_split

# ========= Paths =========
BASE_DIR = "datasets/ham10000"
IMG_DIRS = [
    os.path.join(BASE_DIR, "HAM10000_images_part_1"),
    os.path.join(BASE_DIR, "HAM10000_images_part_2"),
]
CSV_PATH = os.path.join(BASE_DIR, "HAM10000_metadata.csv")
OUTPUT_DIR = BASE_DIR

TRAIN_DIR = os.path.join(OUTPUT_DIR, "train")
VAL_DIR = os.path.join(OUTPUT_DIR, "val")

# ========= Create folders =========
os.makedirs(TRAIN_DIR, exist_ok=True)
os.makedirs(VAL_DIR, exist_ok=True)

# ========= Load CSV =========
df = pd.read_csv(CSV_PATH)

# ========= Train / Val split =========
train_df, val_df = train_test_split(
    df,
    test_size=0.2,
    stratify=df["dx"],
    random_state=42
)

# ========= Helper function =========
def copy_images(dataframe, target_dir):
    for _, row in dataframe.iterrows():
        image_id = row["image_id"]
        label = row["dx"]

        class_dir = os.path.join(target_dir, label)
        os.makedirs(class_dir, exist_ok=True)

        img_name = image_id + ".jpg"
        src_path = None

        for img_dir in IMG_DIRS:
            candidate = os.path.join(img_dir, img_name)
            if os.path.exists(candidate):
                src_path = candidate
                break

        if src_path is None:
            print(f"❌ Image not found: {img_name}")
            continue

        dst_path = os.path.join(class_dir, img_name)
        shutil.copy(src_path, dst_path)

# ========= Copy images =========
print("📦 Copying TRAIN images...")
copy_images(train_df, TRAIN_DIR)

print("📦 Copying VAL images...")
copy_images(val_df, VAL_DIR)

print("✅ Dataset preparation finished!")
