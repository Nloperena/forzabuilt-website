# SEO Optimization & Launch Checklist - ForzaBuilt Astro Website

## Current SEO Implementation Status

### ✅ **What's Already Implemented**

#### 1. **Meta Tags & Open Graph**
- ✅ Title tags on all pages
- ✅ Meta descriptions on all pages
- ✅ Open Graph tags (og:type, og:url, og:title, og:description, og:image, og:site_name)
- ✅ Twitter Card tags (summary_large_image)
- ✅ Canonical URLs on all pages
- ✅ Robots meta tags (index, follow)

#### 2. **Sitemaps & Robots**
- ✅ XML Sitemap integration (`@astrojs/sitemap`)
- ✅ Sitemap index file
- ✅ Blog sitemap
- ✅ robots.txt file configured
- ✅ All sitemaps referenced in robots.txt

#### 3. **Structured Data (JSON-LD)**
- ✅ Article structured data for blog posts (in `blogStructuredData.json`)
- ✅ Product structured data component (`DynamicMetaTags.tsx`) - but **NOT used on product pages**

#### 4. **Technical SEO**
- ✅ Static Site Generation (SSG) for fast loading
- ✅ Clean URLs (no query parameters in URLs)
- ✅ Mobile-responsive design
- ✅ HTTPS ready (site configured for https://forzabuilt.com)
- ✅ Semantic HTML structure

---

## ❌ **Critical Issues to Fix Before Launch**

### 1. **Missing Default Open Graph Image**
- **Issue:** `public/images/og-default.jpg` is referenced but doesn't exist
- **Impact:** Social media shares will have no preview image for pages without specific OG images
- **Fix Required:**
  - Create `og-default.jpg` (recommended: 1200x630px)
  - Should be ForzaBuilt logo or branded image
  - Optimize file size (<200KB)

### 2. **Product Pages Missing Structured Data**
- **Issue:** Product detail pages (`/products/[...slug].astro`) don't include Product JSON-LD schema
- **Impact:** Google can't understand product information for rich results
- **Current:** Layout.astro has basic meta tags but no structured data
- **Fix Required:** Add Product schema to product pages

### 3. **Missing Favicon Files**
- **Issue:** `favicon.ico` and `favicon.svg` are referenced but missing
- **Impact:** Browser tabs won't show site icon
- **Fix Required:**
  - Create `favicon.ico` (16x16, 32x32, 48x48 sizes)
  - Create `favicon.svg` (vector version)
  - Add to `public/` folder

### 4. **Product Pages Missing OG Images**
- **Issue:** Product pages don't pass ogImage prop, so they use default OG image instead of product-specific images
- **Impact:** Social shares of products won't show product images
- **Fix Required:** 
  - Add `ogImage` prop to Layout component Props interface (currently missing but used in code)
  - Update product pages to pass product imageUrl as ogImage prop
  - Format image URLs correctly (handle blob storage URLs)

---

## 🔧 **Enhancements Recommended**

### 1. **Organization Structured Data**
- **Priority:** High
- **Location:** Homepage (`src/pages/index.astro`)
- **Schema Type:** Organization
- **Benefits:** Google Knowledge Graph, local business info, brand recognition
- **Required Fields:**
  - Name: "ForzaBuilt"
  - URL: "https://forzabuilt.com"
  - Logo: Logo URL
  - Contact information
  - Social profiles (if applicable)

### 2. **Breadcrumb Structured Data**
- **Priority:** Medium
- **Location:** All product and category pages
- **Schema Type:** BreadcrumbList
- **Benefits:** Rich snippets in search results
- **Example Pages:** 
  - Products > Bond > IC932
  - Products > Seal
  - Industries > Marine

### 3. **WebSite Structured Data with SearchAction**
- **Priority:** Medium
- **Location:** Homepage
- **Schema Type:** WebSite with SearchAction
- **Benefits:** Enables Google site search box in results
- **Requires:** Search functionality (if you have one)

### 4. **Product-Specific OG Images**
- **Priority:** High
- **Location:** Product detail pages
- **Current:** Uses default OG image
- **Fix:** Use product imageUrl for ogImage prop in Layout

### 5. **Image Alt Text Audit**
- **Priority:** Medium
- **Action:** Review all images to ensure descriptive alt text
- **Focus Areas:**
  - Product images
  - Industry icons
  - Hero images
  - Logo images

### 6. **Page Speed Optimization**
- **Priority:** High (but partially done)
- **Already Done:**
  - ✅ Static generation
  - ✅ Code splitting
  - ✅ Lazy loading for React components
- **Recommended:**
  - Image optimization (WebP format)
  - Video compression (already in progress)
  - Font optimization (preload critical fonts)

---

## 📋 **Pre-Launch SEO Checklist**

### Must-Have (Before Launch)
- [ ] Create `public/images/og-default.jpg` (1200x630px, <200KB)
- [ ] Create `public/favicon.ico` and `public/favicon.svg`
- [ ] Add Product JSON-LD schema to product detail pages
- [ ] Add Organization JSON-LD schema to homepage
- [ ] Update product pages to use product images for OG tags
- [ ] Verify all canonical URLs are correct
- [ ] Test sitemap.xml is accessible at `/sitemap.xml`
- [ ] Test robots.txt is accessible at `/robots.txt`
- [ ] Verify all pages have unique titles and descriptions
- [ ] Check for duplicate content issues

### Should-Have (Before/After Launch)
- [ ] Add Breadcrumb structured data to product/category pages
- [ ] Audit and optimize image alt text
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Set up Google Analytics (if not already done)
- [ ] Set up Google Tag Manager (if needed)
- [ ] Create XML sitemap for products (if very large, split into multiple)
- [ ] Add hreflang tags (if multilingual)

### Nice-to-Have (Post-Launch)
- [ ] WebSite schema with SearchAction
- [ ] FAQPage schema (if you have FAQ sections)
- [ ] VideoObject schema (for video content)
- [ ] Review schema (if you have customer reviews)
- [ ] LocalBusiness schema (if applicable)

---

## 🔍 **Technical Implementation Details**

### 1. Add Product Structured Data to Product Pages

**File:** `src/pages/products/[...slug].astro`

Add before closing `</Layout>` tag:

```astro
---
// ... existing code ...

// Get product image for OG
const productImageUrl = product?.imageUrl 
  ? (product.imageUrl.startsWith('http') ? product.imageUrl : `https://forzabuilt.com${product.imageUrl}`)
  : '/images/og-default.jpg';
---

<Layout 
  title={`${productName} - ForzaBuilt`}
  description={productDescription}
  canonicalUrl={currentPath}
  ogType="product"
  ogImage={productImageUrl}  <!-- Add this -->
>
  <!-- ... existing content ... -->
  
  <!-- Add Product Structured Data -->
  <script type="application/ld+json" set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "description": productDescription,
    "image": productImageUrl,
    "brand": {
      "@type": "Brand",
      "name": "ForzaBuilt"
    },
    "category": product?.category || "",
    "manufacturer": {
      "@type": "Organization",
      "name": "ForzaBuilt"
    },
    ...(product?.chemistry && {
      "additionalProperty": [{
        "@type": "PropertyValue",
        "name": "Chemistry",
        "value": product.chemistry
      }]
    }),
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "USD",
      "url": `https://forzabuilt.com${currentPath}`
    }
  })} />
</Layout>
```

### 2. Add Organization Schema to Homepage

**File:** `src/pages/index.astro`

Add before closing `</Layout>` tag:

```astro
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ForzaBuilt",
  "url": "https://forzabuilt.com",
  "logo": "https://forzabuilt.com/forza-logo-full.png",
  "description": "ForzaBuilt delivers premium industrial solutions across transportation, marine, construction, and manufacturing. Expert adhesives, sealants, tapes, and cleaning products.",
  "sameAs": [
    // Add social media URLs if applicable
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Sales",
    "email": "contact@forzabuilt.com",  // Update with actual email
    "url": "https://forzabuilt.com/contact"
  }
})} />
```

### 3. Add Breadcrumb Schema to Product Pages

Add to product detail pages:

```astro
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "https://forzabuilt.com"
  }, {
    "@type": "ListItem",
    "position": 2,
    "name": "Products",
    "item": "https://forzabuilt.com/products"
  }, {
    "@type": "ListItem",
    "position": 3,
    "name": product?.category || "Product",
    "item": productCategory ? `https://forzabuilt.com/products/${productCategory}` : "https://forzabuilt.com/products"
  }, {
    "@type": "ListItem",
    "position": 4,
    "name": productName,
    "item": `https://forzabuilt.com${currentPath}`
  }]
})} />
```

---

## 🚀 **Post-Launch Tasks**

### Week 1-2
1. Submit sitemap to Google Search Console
2. Submit sitemap to Bing Webmaster Tools
3. Monitor Google Search Console for indexing issues
4. Check for crawl errors
5. Verify all pages are indexed

### Week 3-4
1. Monitor Core Web Vitals
2. Review search performance reports
3. Check for 404 errors
4. Monitor page load times
5. Review mobile usability issues

### Ongoing
1. Update sitemap when adding new products/blog posts
2. Monitor keyword rankings
3. Track organic traffic growth
4. Review and update meta descriptions quarterly
5. Add structured data for new content types

---

## 📊 **SEO Tools & Verification**

### Before Launch
- [ ] Use Google's Rich Results Test: https://search.google.com/test/rich-results
- [ ] Use Schema Markup Validator: https://validator.schema.org/
- [ ] Use Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- [ ] Use Twitter Card Validator: https://cards-dev.twitter.com/validator
- [ ] Use Lighthouse (Chrome DevTools) for performance audit
- [ ] Test mobile-friendliness: https://search.google.com/test/mobile-friendly

### Post-Launch
- [ ] Set up Google Search Console
- [ ] Set up Bing Webmaster Tools
- [ ] Set up Google Analytics 4
- [ ] Monitor Search Console for errors
- [ ] Track keyword rankings (SEMrush, Ahrefs, or similar)

---

## 📝 **Notes**

### Current Site Configuration
- **Site URL:** https://forzabuilt.com
- **Framework:** Astro (Static Site Generation)
- **Sitemap:** Auto-generated by @astrojs/sitemap
- **Output:** Static HTML (optimal for SEO)

### Key Strengths
1. ✅ Static generation = fast loading = better SEO
2. ✅ Clean URL structure
3. ✅ All pages have proper meta tags
4. ✅ Canonical URLs prevent duplicate content
5. ✅ Blog has structured data

### Areas for Improvement
1. ⚠️ Product pages need structured data
2. ⚠️ Missing default OG image
3. ⚠️ Missing favicons
4. ⚠️ No Organization schema on homepage
5. ⚠️ No breadcrumb schema

---

## 🎯 **Priority Summary**

**Critical (Must Fix Before Launch):**
1. Create og-default.jpg
2. Create favicon files
3. Add Product schema to product pages
4. Use product images for OG tags on product pages

**High Priority (Should Fix Before Launch):**
1. Add Organization schema to homepage
2. Verify all meta descriptions are unique and optimized
3. Test all structured data with validators

**Medium Priority (Can Fix After Launch):**
1. Add breadcrumb schema
2. Image alt text audit
3. Submit to search consoles

**Low Priority (Nice to Have):**
1. WebSite schema with SearchAction
2. FAQPage schema
3. Additional schema types

---

Last Updated: Based on codebase analysis of astro-migration project

