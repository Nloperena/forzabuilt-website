# Product Detail Page Migration Plan

## Issue
Product detail pages like `/products/bond/OA23` are not working in the Astro migration project. The current `[...slug].astro` file:
1. Uses `productLine` instead of `category` in getStaticPaths (productLine is empty)
2. Has a basic HTML template instead of the rich React component from Vite

## Solution
1. Fix `getStaticPaths` to use `category` field (BOND, SEAL, TAPE)
2. Create a React `ProductDetail` component (like `BlogDetail`) that accepts product as prop
3. Update `[...slug].astro` to use the React component

## Current State
- **Vite**: `src/pages/products/[productId].tsx` - Full React component with tabs, related products, etc. (1151 lines)
- **Astro**: `src/pages/products/[...slug].astro` - Basic HTML template (~177 lines)

## Action Items
1. ✅ Fix getStaticPaths to generate `/products/{category}/{productId}` paths
2. Create ProductDetail React component (simplified version first, can expand later)
3. Update [...slug].astro to use ProductDetail component

## Files to Create/Modify
1. `astro-migration/src/components/products/ProductDetail.tsx` (NEW)
2. `astro-migration/src/pages/products/[...slug].astro` (MODIFY)

