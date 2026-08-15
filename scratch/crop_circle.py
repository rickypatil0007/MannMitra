import os
from PIL import Image, ImageChops, ImageDraw

input_path = r"C:\Users\RICKY PATIL\.gemini\antigravity-ide\brain\db5fb3ea-422d-41c9-beed-8e2a984ca9a1\.user_uploaded\media_1786798905257.png"
img = Image.open(input_path).convert("RGBA")

# Remove white background to find bounding box
# We create a white image of the same size to diff against
bg = Image.new("RGBA", img.size, (255,255,255,255))
diff = ImageChops.difference(img, bg)

# Convert diff to grayscale to get a reliable bounding box
diff_gray = diff.convert("L")

# Threshold to ignore slight off-white noise
diff_gray = diff_gray.point(lambda p: p > 10 and 255)
bbox = diff_gray.getbbox()

if bbox:
    img_cropped = img.crop(bbox)
else:
    img_cropped = img

# Force to a perfect square
w, h = img_cropped.size
min_dim = min(w, h)

left = (w - min_dim) / 2
top = (h - min_dim) / 2
right = (w + min_dim) / 2
bottom = (h + min_dim) / 2
img_square = img_cropped.crop((left, top, right, bottom))

# Apply perfect circular mask to cut away outer corners
mask = Image.new("L", (min_dim, min_dim), 0)
draw = ImageDraw.Draw(mask)
draw.ellipse((0, 0, min_dim, min_dim), fill=255)

output = Image.new("RGBA", (min_dim, min_dim), (0,0,0,0))
output.paste(img_square, (0,0), mask=mask)

os.makedirs("src/app", exist_ok=True)
os.makedirs("public", exist_ok=True)

# Save as 512x512
final_icon = output.resize((512, 512), Image.Resampling.LANCZOS)
final_icon.save("src/app/icon.png")
final_icon.save("public/logo.png")

# Save OG image (white background)
og = Image.new("RGBA", (1200, 630), (255, 255, 255, 255))
logo_resized = output.resize((400, 400), Image.Resampling.LANCZOS)
og.paste(logo_resized, (400, 115), mask=logo_resized)
og.convert("RGB").save("src/app/opengraph-image.jpg")

print("Cropped and processed successfully!")
