# Video Compression Guide - Optimized Settings for Web Videos

## Problem: Bitrate vs Quality Trade-off

If lowering bitrate to hit target file sizes makes videos choppy, you need a **better optimization strategy** rather than just crushing the bitrate.

---

## ✅ **Better Compression Strategies**

### Strategy 1: Resolution Scaling (Most Effective)

**Instead of crushing bitrate, reduce resolution!**

Web background videos don't need 4K or even 1080p. Here's the approach:

#### Resolution Guidelines by Video Type:

- **Hero/Background Videos (looping):**
  - Desktop: **1920x1080 max** (even 1280x720 often looks great for backgrounds)
  - Mobile: **1280x720 or 960x540** (they're viewed smaller anyway)
  
- **Small Loop Videos (industry cards):**
  - **960x540** or even **854x480** is often sufficient

#### How Resolution Affects File Size:
- **50% resolution = ~75% smaller file size** (at same bitrate)
- Example: 1920x1080 → 1280x720 = 4x fewer pixels = much smaller file

---

### Strategy 2: Use CRF (Constant Rate Factor) Instead of Bitrate Targeting

**CRF gives better quality for file size than bitrate targeting.**

#### Adobe Media Encoder CRF Settings:

Unfortunately, **Adobe Media Encoder doesn't support CRF directly**. You have two options:

**Option A: Use FFmpeg (Recommended for better quality)**
```bash
# For high-quality web videos (recommended)
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k -movflags +faststart output.mp4

# For smaller file sizes (still good quality)
ffmpeg -i input.mp4 -c:v libx264 -crf 25 -preset slow -c:a aac -b:a 128k -movflags +faststart output.mp4

# For aggressive compression (acceptable quality)
ffmpeg -i input.mp4 -c:v libx264 -crf 27 -preset slow -c:a aac -b:a 128k -movflags +faststart output.mp4
```

**CRF Values:**
- **18-20:** Visually lossless (very large files)
- **21-23:** High quality (recommended for web)
- **24-26:** Good quality (good balance)
- **27-28:** Acceptable quality (smaller files)
- **28+:** Noticeable quality loss

**Option B: Use Bitrate Targeting in Media Encoder (with better settings)**

---

### Strategy 3: Optimized Adobe Media Encoder Settings

#### **Recommended Settings for Web Background Videos:**

**Format:** H.264  
**Preset:** Match Source - High Bitrate (then customize)

**Video Settings:**
- **Resolution:** 
  - **Reduce if source > 1920x1080:** Scale to 1920x1080 or 1280x720
  - **For loop videos:** 1280x720 or 960x540 is often enough
- **Frame Rate:** 
  - **Reduce from 30fps → 24fps** if source is 30fps (smaller file, smoother for looping videos)
  - Match source if already 24fps
- **Field Order:** Progressive
- **Aspect:** Square Pixels (1.0)
- **Bitrate Encoding:** **VBR, 2 Pass**
- **Target Bitrate:** 
  - **For 1920x1080:** 4-6 Mbps
  - **For 1280x720:** 2.5-4 Mbps
  - **For 960x540:** 1.5-2.5 Mbps
- **Max Bitrate:** 1.5x Target Bitrate
- **Profile:** **High**
- **Level:** **4.0** (or 4.2 if needed)

**Audio Settings:**
- **Codec:** AAC
- **Bitrate:** **96 kbps** (for background videos, 128kbps is overkill)
- **Sample Rate:** 48 kHz (or match source)
- **Channels:** Stereo (or Mono if no stereo content)

**Advanced Settings:**
- **Key Frame Distance:** **2 seconds** (60 frames at 30fps, 48 frames at 24fps)
- **B-Frames:** 2 (default)
- **Optimize for:** **Web** (if available)
- **Use Maximum Render Quality:** **Unchecked** (slower, minimal quality gain)

---

### Strategy 4: Frame Rate Reduction

**For looping background videos, 24fps often looks better and is smaller:**

- **30fps → 24fps:** ~20% smaller file size
- **24fps is more cinematic** for background videos
- **Still smooth** for looping content
- **Lower bandwidth** for users

**Note:** Don't reduce frame rate for videos with fast motion or action.

---

### Strategy 5: Realistic Target Sizes (Revised)

**Your original targets were too aggressive.** Here are more realistic targets:

| Original Size | Resolution Strategy | Realistic Target | Quality Level |
|--------------|---------------------|------------------|---------------|
| 50+ MB | Scale to 1920x1080, 24fps, 5 Mbps | **8-12 MB** | High |
| 40-50 MB | Scale to 1280x720, 24fps, 3.5 Mbps | **5-8 MB** | High |
| 15-40 MB | Scale to 1280x720, 24fps, 3 Mbps | **3-5 MB** | Good |
| 10-15 MB | Keep resolution or scale to 960x540, 24fps, 2 Mbps | **2-3 MB** | Good |
| <10 MB | Scale to 960x540 if >1280px, 24fps, 1.5 Mbps | **1-2 MB** | Acceptable |

**These targets are 2-3x larger than original but will give MUCH better quality.**

---

## 📐 **Step-by-Step Compression Process**

### For Large Videos (40+ MB):

1. **Check source resolution:**
   - Open video in Media Encoder
   - Note: Width x Height, Frame Rate

2. **Determine target resolution:**
   - If > 1920px wide: Scale to **1920x1080** (or 1280x720 if file still too large)
   - If 1920px or less: Keep original or scale to **1280x720** for smaller files

3. **Reduce frame rate:**
   - If 30fps: Change to **24fps** (better for looping videos)
   - If 60fps: Change to **30fps** or 24fps

4. **Set bitrate based on resolution:**
   - 1920x1080: **5 Mbps target, 7.5 Mbps max**
   - 1280x720: **3.5 Mbps target, 5 Mbps max**
   - 960x540: **2 Mbps target, 3 Mbps max**

5. **Audio:**
   - **96 kbps** (sufficient for background videos)

6. **Export and check:**
   - Check file size
   - Check quality on actual website
   - Adjust if needed

### For Medium Videos (15-40 MB):

1. **Scale to 1280x720** (if source is larger)
2. **24fps** frame rate
3. **3 Mbps target, 4.5 Mbps max** bitrate
4. **96 kbps** audio
5. **Target:** 3-5 MB

### For Small Videos (<15 MB):

1. **Keep resolution** or scale to 960x540 if >1280px
2. **24fps** frame rate  
3. **1.5-2 Mbps target, 2.5-3 Mbps max** bitrate
4. **96 kbps** audio
5. **Target:** 1-2 MB

---

## 🎯 **Example Settings by Video Size**

### Large Video Example (Eagle Header Video - 54 MB):

**Source:** Likely 1920x1080 @ 30fps

**Recommended Settings:**
- **Resolution:** 1920x1080 (or 1280x720 if still too large)
- **Frame Rate:** 24fps
- **Target Bitrate:** 5 Mbps
- **Max Bitrate:** 7.5 Mbps
- **Audio:** 96 kbps AAC
- **Expected Result:** 8-12 MB (good quality)

**Alternative (if still too large):**
- **Resolution:** 1280x720
- **Frame Rate:** 24fps
- **Target Bitrate:** 3.5 Mbps
- **Max Bitrate:** 5 Mbps
- **Expected Result:** 4-6 MB (still good quality)

### Medium Video Example (Product Summary - 16 MB):

**Recommended Settings:**
- **Resolution:** 1280x720
- **Frame Rate:** 24fps
- **Target Bitrate:** 3 Mbps
- **Max Bitrate:** 4.5 Mbps
- **Audio:** 96 kbps AAC
- **Expected Result:** 3-4 MB (good quality)

### Small Loop Video Example (Industry Loops - 12-16 MB):

**Recommended Settings:**
- **Resolution:** 960x540 (often sufficient for small cards)
- **Frame Rate:** 24fps
- **Target Bitrate:** 2 Mbps
- **Max Bitrate:** 3 Mbps
- **Audio:** 96 kbps AAC
- **Expected Result:** 1.5-2.5 MB (good quality)

---

## 🔧 **Advanced: Using FFmpeg (Better Quality)**

**FFmpeg with CRF gives better quality/size ratio than bitrate targeting:**

### Install FFmpeg:
- Windows: Download from https://ffmpeg.org/download.html
- Or use: `winget install ffmpeg` (Windows Package Manager)

### FFmpeg Commands by Video Type:

**High Quality (Recommended):**
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset slow -vf "scale=1920:1080:force_original_aspect_ratio=decrease" -r 24 -c:a aac -b:a 96k -movflags +faststart output.mp4
```

**Good Quality (Smaller):**
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 25 -preset slow -vf "scale=1280:720:force_original_aspect_ratio=decrease" -r 24 -c:a aac -b:a 96k -movflags +faststart output.mp4
```

**Small Loop Videos:**
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 26 -preset slow -vf "scale=960:540:force_original_aspect_ratio=decrease" -r 24 -c:a aac -b:a 96k -movflags +faststart output.mp4
```

**Parameters Explained:**
- `-crf 23`: Quality level (lower = better quality, larger file)
- `-preset slow`: Better compression (slower encoding, smaller files)
- `-vf "scale=..."`: Resolution scaling with aspect ratio preservation
- `-r 24`: Frame rate (24fps)
- `-b:a 96k`: Audio bitrate
- `-movflags +faststart`: Web optimization (allows progressive download)

---

## ✅ **Revised Target Sizes (Realistic)**

Based on better optimization strategies:

| Video | Original | Realistic Target | Strategy |
|-------|----------|------------------|----------|
| Eagle Header Video | 54 MB | **8-12 MB** | 1920x1080 @ 24fps, 5 Mbps |
| Manufactured in America | 42 MB | **6-9 MB** | 1280x720 @ 24fps, 3.5 Mbps |
| Industry Summary Mobile | 27 MB | **4-6 MB** | 1280x720 @ 24fps, 3 Mbps |
| Product Summary | 16 MB | **3-4 MB** | 1280x720 @ 24fps, 3 Mbps |
| Industry Loops | 12-16 MB | **1.5-2.5 MB** | 960x540 @ 24fps, 2 Mbps |
| Small Videos | <10 MB | **1-2 MB** | 960x540 @ 24fps, 1.5 Mbps |

**New Total Target:** ~35-50 MB (instead of 20-30 MB)  
**Still saves:** ~190-210 MB (78-86% reduction)  
**Quality:** Much better, still acceptable for web

---

## 🎬 **Quick Reference: Media Encoder Presets**

### For Background/Hero Videos:

1. **Format:** H.264
2. **Resolution:** Scale to match target (1920x1080 or 1280x720)
3. **Frame Rate:** 24fps
4. **Bitrate:** VBR 2 Pass
   - 1920x1080: 5 Mbps target, 7.5 Mbps max
   - 1280x720: 3.5 Mbps target, 5 Mbps max
   - 960x540: 2 Mbps target, 3 Mbps max
5. **Profile:** High
6. **Level:** 4.0
7. **Audio:** AAC, 96 kbps, 48 kHz
8. **Key Frame:** 2 seconds

### For Small Loop Videos (Industry Cards):

1. **Resolution:** 960x540 (or 854x480)
2. **Frame Rate:** 24fps
3. **Bitrate:** 2 Mbps target, 3 Mbps max
4. **Audio:** 96 kbps AAC
5. **Profile:** High
6. **Level:** 4.0

---

## 💡 **Key Takeaways**

1. **Don't just lower bitrate** - reduce resolution and frame rate instead
2. **24fps is fine** for looping background videos
3. **Web doesn't need 4K** - 1920x1080 max, often 1280x720 is enough
4. **Use FFmpeg with CRF** if possible (better quality/size ratio)
5. **Realistic targets are 2-3x larger** than original aggressive targets
6. **Quality matters** - slightly larger files with good quality > small choppy files
7. **Test on actual website** - what looks good in Media Encoder preview may differ on web

---

## 🧪 **Testing Workflow**

1. **Compress one video** with new settings
2. **Check file size** - is it acceptable?
3. **Check quality** - play it in browser at actual website size
4. **Compare** - is it better than your previous attempts?
5. **Adjust** - if still too large, reduce resolution further
6. **If quality is poor** - increase bitrate or resolution
7. **Document** - note which settings worked best for each video type

---

## ⚠️ **Common Mistakes to Avoid**

1. ❌ **Setting bitrate too low** (causes choppiness)
2. ❌ **Not reducing resolution** (trying to keep full resolution)
3. ❌ **Keeping 30fps** when 24fps is sufficient
4. ❌ **Targeting unrealistic file sizes** (sacrificing quality)
5. ❌ **Using CBR instead of VBR 2-pass** (less efficient)
6. ❌ **Audio bitrate too high** (128kbps is overkill for background videos)
7. ❌ **Not testing on actual website** (preview doesn't match reality)

---

## 📊 **Quality vs File Size Comparison**

**Original Settings (Too Aggressive):**
- 54 MB → 3-5 MB target
- Result: Choppy, poor quality ❌

**New Optimized Settings:**
- 54 MB → 8-12 MB target
- Strategy: Resolution + frame rate + optimized bitrate
- Result: Good quality, acceptable size ✅

**Still achieving 78-86% file size reduction with much better quality!**

---

Last Updated: Based on compression best practices and web video optimization


