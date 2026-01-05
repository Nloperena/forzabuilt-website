# Memory Optimization Plan - ForzaBuilt Website

## Top Memory Consumers & Action Plan

### 1. **Build Output (`dist/` folder) - 1,341.91 MB**
**Current Issue**: Build artifacts committed to repository
**Action Plan**:
- ✅ Add `dist/` to `.gitignore` (if not already)
- Remove `dist/` from git tracking: `git rm -r --cached dist`
- Commit the change
- **Impact**: Saves ~1.3 GB from repository, reduces clone/pull times

---

### 2. **Video Files (`public/videos/`) - ~600+ MB**
**Current Issue**: Large uncompressed/lightly compressed MP4 files
**Top Offenders**:
- `Bald-Ealge-is-My-Hero.mp4` - 59.73 MB
- `Eagle Header Video.mp4` - 54.49 MB
- `Forza Slogan Slam Final 1.mp4` - 45.8 MB
- `Forza Slogan Slam Final 3.mp4` - 41.91 MB
- `Forza Slogan Slam Final 2.mp4` - 41.9 MB
- `Manufactured in America.mp4` - 41.52 MB
- `Moleculesubtle2.mp4` - 40.84 MB
- `Made in America Video 1.mp4` - 37.56 MB

**Action Plan**:
1. **Re-encode videos with better compression**:
   - Use H.264 codec with CRF 23-28 (quality vs size balance)
   - Target: 2-5 MB per video (80-90% reduction)
   - Tool: `ffmpeg -i input.mp4 -c:v libx264 -crf 25 -preset slow -c:a aac -b:a 128k output.mp4`

2. **Convert to WebM format** (better compression):
   - WebM typically 30-50% smaller than MP4
   - Modern browser support is excellent
   - Fallback to MP4 for older browsers

3. **Implement lazy loading**:
   - Only load videos when in viewport
   - Use `<video loading="lazy">` or Intersection Observer

4. **Use video CDN** (long-term):
   - Move videos to Cloudflare Stream, Vimeo, or YouTube
   - Embed via iframe (saves hosting bandwidth)
   - **Impact**: Could save 500-600 MB

5. **Remove duplicate videos**:
   - `Forza Slogan Slam Final.mp4` (8.48 MB) vs numbered versions (45+ MB each)
   - Keep only the compressed version
   - **Impact**: Saves ~120 MB

---

### 3. **Node Modules (`node_modules/`) - 349.46 MB**
**Current Issue**: All dependencies installed
**Action Plan**:
1. **Audit dependencies**:
   - Run `npm audit` to find unused packages
   - Remove unused Radix UI components (if not all are used)
   - Check if all 20+ Radix packages are needed

2. **Use production builds**:
   - Ensure `.gitignore` excludes `node_modules/`
   - Use `npm ci` in production (clean install)

3. **Consider lighter alternatives**:
   - Review if all UI components are used
   - Some Radix components might be replaceable with simpler solutions
   - **Impact**: Could save 50-100 MB if unused packages removed

---

### 4. **PDF Documents (`public/documents/`) - ~50-100 MB estimated**
**Current Issue**: Large PDF files for brochures
**Action Plan**:
1. **Optimize PDFs**:
   - Use `ghostscript` or online tools to compress
   - Target: 50-70% size reduction
   - Command: `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dBATCH -sOutputFile=output.pdf input.pdf`

2. **Convert to web-friendly formats**:
   - Consider using images for brochure covers
   - Use PDF.js for viewing (already in dependencies)
   - Lazy load PDFs

3. **Move to CDN/Storage**:
   - Host PDFs on S3/Cloudflare R2
   - Serve via CDN
   - **Impact**: Saves 30-50 MB from repository

---

### 5. **Static HTML Pages (`public/static-pages/`) - ~10-20 MB estimated**
**Current Issue**: 153 pre-generated HTML files
**Action Plan**:
1. **Remove if redundant**:
   - Astro generates pages dynamically
   - These might be legacy from Vite build
   - Verify if still needed

2. **Compress HTML**:
   - Minify HTML in build process
   - Remove whitespace and comments
   - **Impact**: Saves 5-10 MB

---

### 6. **Image Files (`public/images/`, `public/product-images/`) - ~100-200 MB estimated**
**Current Issue**: Unoptimized images
**Action Plan**:
1. **Convert to WebP format**:
   - 25-35% smaller than PNG/JPG
   - Use `<picture>` element with fallback
   - Astro Image component handles this automatically

2. **Implement responsive images**:
   - Use Astro's `<Image>` component
   - Generate multiple sizes
   - Serve appropriate size per device

3. **Compress existing images**:
   - Use tools like `imagemin` or `squoosh`
   - Target: 60-80% reduction
   - **Impact**: Saves 60-160 MB

---

### 7. **Source Code (`src/`) - 57.9 MB**
**Current Issue**: Relatively small, but can be optimized
**Action Plan**:
1. **Remove unused components**:
   - Audit component usage
   - Delete unused files
   - **Impact**: Saves 5-10 MB

2. **Tree-shake unused code**:
   - Ensure proper imports
   - Use named imports instead of default
   - **Impact**: Smaller bundle sizes

---

## Quick Wins (Do First)

1. ✅ **Add `dist/` to `.gitignore`** - Immediate 1.3 GB savings
2. ✅ **Remove `dist/` from git** - Clean up repository
3. ✅ **Compress top 5 largest videos** - ~200 MB savings
4. ✅ **Remove duplicate videos** - ~120 MB savings
5. ✅ **Optimize PDFs** - ~30-50 MB savings

**Total Quick Win Savings: ~1.7 GB**

---

## Long-term Optimizations

1. **Move videos to CDN** - Best for performance and storage
2. **Implement image optimization pipeline** - Automated during build
3. **Use Git LFS for large files** - If videos must stay in repo
4. **Set up automated compression** - In CI/CD pipeline

---

## Expected Results

- **Current Total**: ~3,069 MB (3 GB)
- **After Quick Wins**: ~1,369 MB (1.4 GB) - **55% reduction**
- **After Full Optimization**: ~800-1,000 MB - **67-74% reduction**

---

## Tools Needed

- `ffmpeg` - Video compression
- `ghostscript` - PDF optimization  
- `imagemin` or `squoosh` - Image optimization
- Git LFS (optional) - For large files in repo


