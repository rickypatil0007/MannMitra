import os
from PIL import Image, ImageDraw

input_path = r"C:\Users\RICKY PATIL\.gemini\antigravity-ide\brain\db5fb3ea-422d-41c9-beed-8e2a984ca9a1\.user_uploaded\media_1786797753370.png"
img = Image.open(input_path).convert("RGBA")

# Make it a square crop first based on the shortest edge
width, height = img.size
min_dim = min(width, height)
left = (width - min_dim) / 2
top = (height - min_dim) / 2
right = (width + min_dim) / 2
bottom = (height + min_dim) / 2
img = img.crop((left, top, right, bottom))

# Create circular mask
mask = Image.new("L", img.size, 0)
draw = ImageDraw.Draw(mask)
draw.ellipse((0, 0, min_dim, min_dim), fill=255)

# Apply mask
output = Image.new("RGBA", img.size, (0, 0, 0, 0))
output.paste(img, (0, 0), mask=mask)

# Save the files
os.makedirs("public", exist_ok=True)
os.makedirs("src/app", exist_ok=True)
output.save("public/logo.png")
output.save("src/app/icon.png")

# For OG image, standard is 1200x630, paste the logo on a white bg
og = Image.new("RGBA", (1200, 630), (255, 255, 255, 255))
# Scale logo to fit nicely in OG
logo_resized = output.resize((400, 400), Image.Resampling.LANCZOS)
og.paste(logo_resized, (400, 115), mask=logo_resized)
og.convert("RGB").save("src/app/opengraph-image.jpg")

print("Images generated successfully!")
