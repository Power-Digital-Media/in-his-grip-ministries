import os
import math
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance

img_dir = r'e:\AntiGravity\in-his-grip-ministries\images'
remotion_pub = r'e:\AntiGravity\in-his-grip-remotion\public'
out_dir = r'e:\AntiGravity\in-his-grip-ministries\images'

photo_path = os.path.join(img_dir, '607191935_1809585089791912_7794484343929429084_n_result.webp')
emblem_path = os.path.join(remotion_pub, 'emblem.png')
title_path = os.path.join(r'e:\AntiGravity\in-his-grip-ministries', 'title_clean.png')
min_path = os.path.join(r'e:\AntiGravity\in-his-grip-ministries', 'min_clean.png')

photo = Image.open(photo_path).convert('RGBA')
emblem = Image.open(emblem_path).convert('RGBA')
title = Image.open(title_path).convert('RGBA')
ministries = Image.open(min_path).convert('RGBA')

def get_font(name, size, fallback='arial.ttf'):
    font_paths = [
        os.path.join(r'C:\Windows\Fonts', name),
        os.path.join(r'C:\Windows\Fonts', fallback),
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

font_serif_lg = get_font('georgiab.ttf', 32)
font_serif_md = get_font('georgia.ttf', 23)
font_serif_it = get_font('georgiai.ttf', 21)
font_sans_bold = get_font('segoeuib.ttf', 19, 'arialbd.ttf')
font_sans_med = get_font('segoeui.ttf', 17, 'arial.ttf')
font_sans_sm = get_font('segoeui.ttf', 15, 'arial.ttf')

W, H = 1200, 630

# ==============================================================================
# VARIANT 1: PREMIER SIDE-BY-SIDE SPLIT
# ==============================================================================
def create_variant_1():
    card = Image.new('RGBA', (W, H), (20, 16, 14, 255))
    draw = ImageDraw.Draw(card)

    # Warm dark gradient background
    for y in range(H):
        t = y / H
        r = int(24 + 10 * (1 - t) + 4 * math.sin(t * 3.14))
        g = int(19 + 6 * (1 - t) + 2 * math.sin(t * 3.14))
        b = int(17 + 4 * (1 - t) + 2 * math.sin(t * 3.14))
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

    # Golden ambient glow behind the emblem and left section
    aura = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    aura_draw = ImageDraw.Draw(aura)
    aura_draw.ellipse([40, 30, 480, 450], fill=(212, 162, 76, 40))
    aura_draw.ellipse([100, 70, 400, 370], fill=(232, 197, 118, 50))
    aura = aura.filter(ImageFilter.GaussianBlur(55))
    card = Image.alpha_composite(card, aura)

    # Photo Crop: Full headroom at top (y=0 to y=875), crop excess background on left
    # Connie is centered around x=480, Jeff around x=850
    crop_box = (150, 0, 1169, 875)
    p_cropped = photo.crop(crop_box)

    # Scale to canvas height 630
    target_h = 630
    target_w = int(p_cropped.width * (target_h / p_cropped.height))
    p_scaled = p_cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)

    # Shift photo right so Connie is well outside the gradient
    photo_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    photo_x = W - target_w + 10

    # Narrow alpha mask for feathering only the leftmost edge (before Connie's hair)
    mask = Image.new('L', (target_w, target_h), 255)
    mask_draw = ImageDraw.Draw(mask)
    fade_w = 130
    for x in range(fade_w):
        alpha = int(255 * (x / fade_w)**1.5)
        mask_draw.line([(x, 0), (x, target_h)], fill=alpha)

    # Subtle bottom fade
    fade_h = 45
    for y in range(target_h - fade_h, target_h):
        alpha = int(255 * (1.0 - (y - (target_h - fade_h)) / fade_h))
        for x in range(target_w):
            curr = mask.getpixel((x, y))
            mask.putpixel((x, y), min(curr, alpha))

    photo_layer.paste(p_scaled, (photo_x, 0), mask)
    card = Image.alpha_composite(card, photo_layer)

    # Left Column Layout
    col_x = 55

    # 1. Emblem
    emb_target_h = 92
    emb_target_w = int(emblem.width * (emb_target_h / emblem.height))
    emb_scaled = emblem.resize((emb_target_w, emb_target_h), Image.Resampling.LANCZOS)
    
    # Soft drop shadow
    emb_shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    emb_shadow.paste(emb_scaled, (col_x, 46), emb_scaled)
    shadow_mask = emb_shadow.split()[3].filter(ImageFilter.GaussianBlur(10))
    card.paste((0, 0, 0, 150), (0, 0), shadow_mask)
    card.paste(emb_scaled, (col_x, 44), emb_scaled)

    # 2. Title & Ministries
    title_target_w = 390
    title_target_h = int(title.height * (title_target_w / title.width))
    title_scaled = title.resize((title_target_w, title_target_h), Image.Resampling.LANCZOS)
    card.paste(title_scaled, (col_x, 148), title_scaled)

    min_target_w = 340
    min_target_h = int(ministries.height * (min_target_w / ministries.width))
    min_scaled = ministries.resize((min_target_w, min_target_h), Image.Resampling.LANCZOS)
    card.paste(min_scaled, (col_x, 212), min_scaled)

    # 3. Gold divider line
    draw = ImageDraw.Draw(card)
    draw.line([(col_x, 276), (col_x + 140, 276)], fill=(212, 162, 76, 255), width=3)
    draw.line([(col_x + 140, 276), (col_x + 400, 276)], fill=(212, 162, 76, 90), width=1)

    # 4. Mission Tagline
    tagline_1 = '"Sharing hope to the hurting & broken'
    tagline_2 = 'through the power of the gospel."'
    draw.text((col_x, 300), tagline_1, fill=(254, 252, 249, 245), font=font_serif_md)
    draw.text((col_x + 20, 337), tagline_2, fill=(232, 197, 118, 240), font=font_serif_it)

    # 5. Badges
    badge_bg = (40, 34, 30, 230)
    # Founders badge
    draw.rounded_rectangle([col_x, 415, col_x + 360, 465], radius=10, fill=badge_bg, outline=(212, 162, 76, 140), width=1)
    draw.text((col_x + 16, 429), "Jeff & Connie Johnson", fill=(254, 252, 249, 255), font=font_sans_bold)
    draw.text((col_x + 234, 431), "• Founders", fill=(212, 162, 76, 220), font=font_sans_med)

    # Website badge
    draw.rounded_rectangle([col_x, 482, col_x + 220, 532], radius=10, fill=badge_bg, outline=(212, 162, 76, 140), width=1)
    draw.text((col_x + 18, 496), "in-his-grip.com", fill=(232, 197, 118, 255), font=font_sans_bold)

    # Outer decorative luxury frame
    draw.rectangle([14, 14, W-15, H-15], outline=(212, 162, 76, 85), width=1)
    draw.rectangle([18, 18, W-19, H-19], outline=(212, 162, 76, 35), width=1)

    # Corner accents
    for cx, cy in [(14, 14), (W-15, 14), (14, H-15), (W-15, H-15)]:
        sx = 1 if cx == 14 else -1
        sy = 1 if cy == 14 else -1
        draw.line([(cx, cy), (cx + sx * 26, cy)], fill=(212, 162, 76, 230), width=2)
        draw.line([(cx, cy), (cx, cy + sy * 26)], fill=(212, 162, 76, 230), width=2)

    return card

# ==============================================================================
# VARIANT 2: GOLDEN FRAMED PORTRAIT
# ==============================================================================
def create_variant_2():
    card = Image.new('RGBA', (W, H), (20, 16, 14, 255))
    draw = ImageDraw.Draw(card)

    for y in range(H):
        t = y / H
        r = int(27 + 7 * (1 - t))
        g = int(21 + 4 * (1 - t))
        b = int(18 + 3 * (1 - t))
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

    aura = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    aura_draw = ImageDraw.Draw(aura)
    aura_draw.ellipse([670, 40, 1150, 580], fill=(212, 162, 76, 45))
    aura_draw.ellipse([60, 60, 520, 480], fill=(212, 162, 76, 30))
    aura = aura.filter(ImageFilter.GaussianBlur(60))
    card = Image.alpha_composite(card, aura)

    # Frame on right
    fx1, fy1, fx2, fy2 = 680, 40, 1140, 590
    fw, fh = fx2 - fx1, fy2 - fy1

    # Crop with full headroom
    crop_box = (60, 0, 1140, 920)
    p_cropped = photo.crop(crop_box)
    p_framed = p_cropped.resize((fw, fh), Image.Resampling.LANCZOS)

    # Rounded mask
    fmask = Image.new('L', (fw, fh), 0)
    fmask_draw = ImageDraw.Draw(fmask)
    fmask_draw.rounded_rectangle([0, 0, fw, fh], radius=24, fill=255)

    # Shadow
    fshadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    fshadow_draw = ImageDraw.Draw(fshadow)
    fshadow_draw.rounded_rectangle([fx1, fy1 + 8, fx2, fy2 + 8], radius=24, fill=(0, 0, 0, 180))
    fshadow = fshadow.filter(ImageFilter.GaussianBlur(18))
    card = Image.alpha_composite(card, fshadow)

    card.paste(p_framed, (fx1, fy1), fmask)

    draw = ImageDraw.Draw(card)
    draw.rounded_rectangle([fx1, fy1, fx2, fy2], radius=24, outline=(212, 162, 76, 230), width=3)
    draw.rounded_rectangle([fx1+4, fy1+4, fx2-4, fy2-4], radius=20, outline=(232, 197, 118, 90), width=1)

    # Caption overlay
    caption_h = 56
    cap_layer = Image.new('RGBA', (fw, caption_h), (22, 18, 16, 215))
    card.paste(cap_layer, (fx1, fy2 - caption_h), fmask.crop((0, fh - caption_h, fw, fh)))
    draw.text((fx1 + 50, fy2 - 40), "Jeff & Connie Johnson, Founders", fill=(254, 252, 249, 255), font=font_sans_bold)

    # Left Side Branding Content
    col_x = 65
    emb_target_h = 100
    emb_target_w = int(emblem.width * (emb_target_h / emblem.height))
    emb_scaled = emblem.resize((emb_target_w, emb_target_h), Image.Resampling.LANCZOS)
    card.paste(emb_scaled, (col_x, 48), emb_scaled)

    title_target_w = 440
    title_target_h = int(title.height * (title_target_w / title.width))
    title_scaled = title.resize((title_target_w, title_target_h), Image.Resampling.LANCZOS)
    card.paste(title_scaled, (col_x, 156), title_scaled)

    min_target_w = 380
    min_target_h = int(ministries.height * (min_target_w / ministries.width))
    min_scaled = ministries.resize((min_target_w, min_target_h), Image.Resampling.LANCZOS)
    card.paste(min_scaled, (col_x, 222), min_scaled)

    draw.line([(col_x, 290), (col_x + 160, 290)], fill=(212, 162, 76, 255), width=3)
    draw.line([(col_x + 160, 290), (col_x + 480, 290)], fill=(212, 162, 76, 90), width=1)

    tagline_1 = '"Sharing the hope of Jesus Christ'
    tagline_2 = 'to hurting and broken people."'
    draw.text((col_x, 318), tagline_1, fill=(254, 252, 249, 245), font=font_serif_md)
    draw.text((col_x, 355), tagline_2, fill=(232, 197, 118, 240), font=font_serif_it)

    badge_bg = (40, 34, 30, 230)
    draw.rounded_rectangle([col_x, 450, col_x + 240, 505], radius=10, fill=badge_bg, outline=(212, 162, 76, 160), width=1)
    draw.text((col_x + 22, 467), "in-his-grip.com", fill=(232, 197, 118, 255), font=font_sans_bold)

    draw.rectangle([14, 14, W-15, H-15], outline=(212, 162, 76, 85), width=1)
    draw.rectangle([18, 18, W-19, H-19], outline=(212, 162, 76, 35), width=1)
    for cx, cy in [(14, 14), (W-15, 14), (14, H-15), (W-15, H-15)]:
        sx = 1 if cx == 14 else -1
        sy = 1 if cy == 14 else -1
        draw.line([(cx, cy), (cx + sx * 26, cy)], fill=(212, 162, 76, 230), width=2)
        draw.line([(cx, cy), (cx, cy + sy * 26)], fill=(212, 162, 76, 230), width=2)

    return card

# Generate both
c1 = create_variant_1()
c2 = create_variant_2()

c1.save(os.path.join(out_dir, 'og-preview-split.png'), format='PNG')
c1_rgb = c1.convert('RGB')
c1_rgb.save(os.path.join(out_dir, 'og-image.jpg'), format='JPEG', quality=95)
c1_rgb.save(os.path.join(out_dir, 'og-image.webp'), format='WEBP', quality=95)
c1.save(os.path.join(out_dir, 'og-image.png'), format='PNG')

c2.save(os.path.join(out_dir, 'og-preview-framed.png'), format='PNG')

print("Refined Open Graph images generated successfully!")

