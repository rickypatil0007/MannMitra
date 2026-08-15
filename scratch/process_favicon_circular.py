import os
from PIL import Image, ImageDraw

input_path = r"C:\Users\RICKY PATIL\.gemini\antigravity-ide\brain\db5fb3ea-422d-41c9-beed-8e2a984ca9a1\.user_uploaded\media_1786798044767.png"
img = Image.open(input_path).convert("RGBA")

# Target size for the favicon
size = 512
circle_img = Image.new("RGBA", (size, size), (255, 255, 255, 0))

# Draw a white circle
draw = ImageDraw.Draw(circle_img)
draw.ellipse((0, 0, size, size), fill=(255, 255, 255, 255))

# Resize the logo to fit nicely inside the circle with padding
padding_factor = 0.70
logo_width, logo_height = img.size

# Determine scale
scale = min((size * padding_factor) / logo_width, (size * padding_factor) / logo_height)
new_w = int(logo_width * scale)
new_h = int(logo_height * scale)

logo_resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

# Paste logo into the center of the white circle
paste_x = (size - new_w) // 2
paste_y = (size - new_h) // 2
circle_img.paste(logo_resized, (paste_x, paste_y), mask=logo_resized)

os.makedirs("src/app", exist_ok=True)
circle_img.save("src/app/icon.png")

print("Circular favicon created successfully!")
