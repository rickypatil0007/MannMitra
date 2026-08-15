import os
from PIL import Image

input_path = r"C:\Users\RICKY PATIL\.gemini\antigravity-ide\brain\db5fb3ea-422d-41c9-beed-8e2a984ca9a1\.user_uploaded\media_1786798044767.png"
img = Image.open(input_path).convert("RGBA")

os.makedirs("public", exist_ok=True)
os.makedirs("src/app", exist_ok=True)

# 1. Save general logo
img.save("public/logo.png")

# 2. Make a square version for the favicon/app icon
width, height = img.size
max_dim = max(width, height)
square_img = Image.new("RGBA", (max_dim, max_dim), (255, 255, 255, 0))
paste_x = (max_dim - width) // 2
paste_y = (max_dim - height) // 2
square_img.paste(img, (paste_x, paste_y))

square_img.resize((512, 512), Image.Resampling.LANCZOS).save("src/app/icon.png")

# Remove the default Vercel favicon.ico so it doesn't conflict
if os.path.exists("src/app/favicon.ico"):
    os.remove("src/app/favicon.ico")
if os.path.exists("public/favicon.ico"):
    os.remove("public/favicon.ico")

# 3. Create Open Graph image
og = Image.new("RGBA", (1200, 630), (255, 255, 255, 255))
logo_resized = img.copy()
logo_resized.thumbnail((800, 400), Image.Resampling.LANCZOS)
px = (1200 - logo_resized.width) // 2
py = (630 - logo_resized.height) // 2
og.paste(logo_resized, (px, py), mask=logo_resized)
og.convert("RGB").save("src/app/opengraph-image.jpg")

print("Favicon and Open Graph images processed successfully!")
