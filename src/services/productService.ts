/**
 * Product Service
 * 
 * This service handles product data management including loading, saving,
 * filtering, and export operations.
 */

import { fetchData } from "../lib/utils";
import { ImageMappingService } from './imageMappingService';
import { getBlobImageUrl } from '../utils/blobStorage';
import type { Product } from '@/types/products';
import productsDataFallback from '@/data/productsSimplified.json';

export type ProductsData = {
  metadata: {
    consolidatedAt: string;
    totalProducts: number;
    source: string;
    version: string;
    schema: {
      requiredFields: string[];
      fieldTypes: Record<string, string>;
    };
    [key: string]: any;
  };
  products: Product[];
};

// Check if we are running on the server (during build) or in the browser
const isSSR = typeof window === 'undefined';

// Use our local API proxy to avoid CORS issues in production (browser only)
// During SSR (build), we use the direct Heroku URL because relative URLs don't work in Node fetch
// Note: Using trailing slash to match the API endpoint format
const HEROKU_API_URL = 'https://forza-product-managementsystem-b7c3ff8d3d2d.herokuapp.com/api/products/';
const PRODUCTS_DATA_URL = isSSR ? HEROKU_API_URL : '/api/products';

/**
 * Transforms raw product data from either API or fallback JSON into the Product type
 */

// Simple in-memory cache
let productsCache: Product[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to clear cache (useful for debugging)
export function clearProductsCache() {
  productsCache = null;
  cacheTimestamp = 0;
  console.log('🗑️ Products cache cleared');
}

/**
 * Transforms raw product data from either API or fallback JSON into the Product type
 */
function transformProductData(apiProduct: any): Product {
  // Handle technical data - can be array or object
  let technicalData = {};
  if (apiProduct.technical) {
    if (Array.isArray(apiProduct.technical)) {
      // Technical is an array - convert to object
      technicalData = apiProduct.technical.reduce((acc: any, item: any) => {
        acc[item.property] = item.value;
        return acc;
      }, {});
    } else if (typeof apiProduct.technical === 'object') {
      // Technical is already an object - use as is
      technicalData = apiProduct.technical;
    }
  }

  // Handle sizing - can be array of strings or array of objects
  let sizes: string[] = [];
  if (apiProduct.sizing && Array.isArray(apiProduct.sizing)) {
    sizes = apiProduct.sizing.map((size: any) => 
      typeof size === 'string' ? size : size.size || ''
    );
  }

  // Get industry for image path organization
  const industries = apiProduct.industry ? 
    (Array.isArray(apiProduct.industry) ? apiProduct.industry : [apiProduct.industry]) : 
    ['industrial'];
  
  const normalizedIndustries = industries.map((ind: string) => 
    ind.replace('_industry', '').replace('_', ' ')
  );

  // Map image URL to blob storage
  let imageUrl = undefined;
  const productId = (apiProduct.product_id || apiProduct.id || '').toLowerCase();
  
  // Use the image value directly from the JSON if it exists
  const rawImage = apiProduct.image || apiProduct.imageUrl;
  
  if (rawImage) {
    if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) {
      // If it's a full URL, fix the common typo and use it as-is
      imageUrl = rawImage.replace('product-images-web-optmized', 'product-images-web-optimized');
    } else {
      // If it's a filename or partial path, use the blob storage utility
      imageUrl = getBlobImageUrl(rawImage, normalizedIndustries);
    }
  } else {
    // Only if the JSON provides no image value, fall back to the mapping service
    const mappedImage = ImageMappingService.getImageForProduct(productId);
    if (mappedImage && !mappedImage.includes('placeholder.png')) {
      imageUrl = getBlobImageUrl(mappedImage, normalizedIndustries);
    }
  }




  return {
    id: apiProduct.product_id || apiProduct.id,
    name: apiProduct.full_name || apiProduct.name,
    shortName: apiProduct.name,
    description: apiProduct.description,
    category: apiProduct.brand === 'forza_bond' ? 'BOND' : 
              apiProduct.brand === 'forza_seal' ? 'SEAL' : 
              apiProduct.brand === 'forza_tape' ? 'TAPE' : 
              (apiProduct.category || 'BOND'),
    industry: normalizedIndustries,
    productType: apiProduct.brand || apiProduct.productType,
    chemistry: apiProduct.chemistry,
    technicalData: technicalData,
    applications: Array.isArray(apiProduct.applications) 
      ? apiProduct.applications 
      : apiProduct.applications ? [apiProduct.applications] : [],
    benefits: apiProduct.benefits || [],
    sizes: sizes,
    imageUrl: imageUrl,
    pdfLinks: apiProduct.pdfLinks || [],
    standardTdsLink: apiProduct.standardTdsLink || '',
    hasTdsLink: !!apiProduct.standardTdsLink,
    searchKeywords: apiProduct.searchKeywords || [],
    isActive: apiProduct.published !== undefined ? apiProduct.published : (apiProduct.isActive ?? true),
    createdAt: apiProduct.created_at || apiProduct.createdAt,
    updatedAt: apiProduct.updated_at || apiProduct.updatedAt,
    version: apiProduct.version || 1
  };
}

// Service functions
export async function getAllProducts(forceRefresh: boolean = false): Promise<Product[]> {
  // Return cached data if available and fresh (unless force refresh)
  if (!forceRefresh && productsCache && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    console.log(`🟢 Returning ${productsCache.length} products from cache (use getAllProducts(true) to force refresh)`);
    return productsCache;
  }

  try {
    // Add cache-busting query parameter to ensure fresh data
    const cacheBuster = forceRefresh ? `?t=${Date.now()}` : '';
    console.log('🔵 Fetching products from API proxy...');
    const response = await fetch(`${PRODUCTS_DATA_URL}${cacheBuster}`, {
      headers: {
        'Accept': 'application/json; charset=utf-8',
      },
      cache: forceRefresh ? 'no-store' : 'default'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const apiData = await response.json();
    console.log(`✅ Fetched ${apiData.length} products from API`);
    console.log(`📊 API Response verification: Expected 196, Got ${apiData.length}, Difference: ${196 - apiData.length}`);
    
    // Transform the API data to match your expected format
    const products = apiData.map((apiProduct: any) => transformProductData(apiProduct));
    
    // Debug: Check for specific product codes (including TAC-OS7)
    const searchCodes = ['TAC-745', 'TAC-OS7', 'TU603', 'TU615', 'TU-OS50', 'TU-OA40', 'TU-OS45', 'TU-800', 'C110', 'IC936', 'IC951', 'IC952', 'IC955NF', 'R190', 'R529', 'OS2 WT', 'OS45', 'OS55', 'T205', 'T226', 'T310', 'T710', 'MC736', 'MC739', 'TC471', 'T-T246', 'TAC-R760', 'TAC-T700', 'C-OA52W', 'A1000', 'A450', 'A465', 'A729', 'C805', 'C830', 'C835', 'H103', 'H117', 'H158', 'H163', 'H164', 'H167', 'H176', 'I1000', 'IC2400', 'OA99', 'W700', 'FC-CAR', 'OA28', 'OA29', 'OA75', 'T103', 'T446', 'T449', 'T454', 'T461', 'T462', 'T465', 'T515', 'T532', 'M-C283', 'M-R478', 'T-R682'];
    const foundProducts = products.filter(p => {
      const productId = (p.id || '').toUpperCase();
      return searchCodes.some(code => productId.includes(code.toUpperCase().replace(/-/g, '')) || productId === code.toUpperCase());
    });
    if (foundProducts.length > 0) {
      console.log(`🔍 Found ${foundProducts.length} matching products:`, foundProducts.map(p => ({ id: p.id, name: p.name, isActive: p.isActive, published: (apiData.find((ap: any) => (ap.product_id || ap.id) === p.id)?.published) })));
    } else {
      console.log(`⚠️ None of the searched product codes were found in the API response`);
    }
    
    // Since all products are now published: true in the database, we should show all products
    // Only filter out products that are explicitly marked as inactive
    const activeProducts = products.filter(product => product.isActive !== false);
    const inactiveCount = products.length - activeProducts.length;
    if (inactiveCount > 0) {
      console.log(`📊 Filtered out ${inactiveCount} explicitly inactive products (isActive === false)`);
      console.log(`📊 Active products: ${activeProducts.length} out of ${products.length} total`);
    } else {
      console.log(`✅ All ${products.length} products are active`);
    }
    
    // Update cache
    productsCache = activeProducts;
    cacheTimestamp = Date.now();
    
    return activeProducts;
  } catch (error) {
    console.error('Failed to fetch products from API proxy:', error);
    
    // Try fallback to local JSON file
    console.warn('⚠️ API failed, using local fallback data');
    const rawProducts = (productsDataFallback as any).products || [];
    const products = rawProducts.map((p: any) => transformProductData(p));
    
    return products.filter((p: Product) => p.isActive !== false);
  }

}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    // Check cache first
    if (productsCache) {
      const cached = productsCache.find(p => p.id === id);
      if (cached) return cached;
    }

    const response = await fetch(PRODUCTS_DATA_URL, {
      headers: {
        'Accept': 'application/json; charset=utf-8',
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const apiData = await response.json();
    const apiProduct = apiData.find((p: any) => (p.product_id || p.id) === id);
    
    if (!apiProduct) {
      // Try fallback if not found in API
      const allProducts = await getAllProducts();
      return allProducts.find(p => p.id === id) || null;
    }
    
    return transformProductData(apiProduct);
  } catch (error) {
    console.error('Failed to fetch product by ID:', error);
    // Try fallback as last resort
    const allProducts = await getAllProducts();
    return allProducts.find(p => p.id === id) || null;
  }
}


export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const allProducts = await getAllProducts();
    return allProducts.filter(p => p.category === category);
  } catch (error) {
    console.error('Failed to fetch products by category:', error);
    return [];
  }
}

export async function getProductsByIndustry(industry: string): Promise<Product[]> {
  try {
    const allProducts = await getAllProducts();
    return allProducts.filter(p => p.industry && p.industry.includes(industry));
  } catch (error) {
    console.error('Failed to fetch products by industry:', error);
    return [];
  }
}

export async function getProductsByChemistry(chemistry: string): Promise<Product[]> {
  try {
    const allProducts = await getAllProducts();
    return allProducts.filter(p => p.chemistry === chemistry);
  } catch (error) {
    console.error('Failed to fetch products by chemistry:', error);
    return [];
  }
}

export async function searchProducts(term: string): Promise<Product[]> {
  try {
    const allProducts = await getAllProducts();
    const searchTerm = term.toLowerCase();
    
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.id.toLowerCase().includes(searchTerm) ||
      product.shortName?.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error('Failed to search products:', error);
    return [];
  }
}

export async function getProductsMetadata(): Promise<ProductsData['metadata']> {
  try {
    const allProducts = await getAllProducts();
    return {
      consolidatedAt: new Date().toISOString(),
      totalProducts: allProducts.length,
      source: 'heroku-api',
      version: '1.0',
      schema: {
        requiredFields: ['id', 'name', 'category', 'industry'],
        fieldTypes: {
          id: 'string',
          name: 'string',
          category: 'string',
          industry: 'array'
        }
      }
    };
  } catch (error) {
    console.error('Failed to get products metadata:', error);
    return {
      consolidatedAt: new Date().toISOString(),
      totalProducts: 0,
      source: 'heroku-api',
      version: '1.0',
      schema: {
        requiredFields: [],
        fieldTypes: {}
      }
    };
  }
}

// This would be a real API call in production
export async function saveProduct(product: Product): Promise<Product> {
  console.log('Saving product:', product);
  // Simulate an API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        ...product,
        updatedAt: new Date().toISOString(),
      });
    }, 500);
  });
}

// This would be a real API call in production
export async function deleteProduct(id: string): Promise<boolean> {
  console.log('Deleting product:', id);
  // Simulate an API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
}

// Export products data from Heroku API
export async function exportProductsData(): Promise<void> {
  try {
    const products = await getAllProducts();
    const jsonStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products-export.json';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  } catch (error) {
    console.error('Failed to export products data:', error);
  }
}

export async function generateProductStats() {
  try {
    const products = await getAllProducts();
    const bondCount = products.filter(p => p.category === "BOND").length;
    const sealCount = products.filter(p => p.category === "SEAL").length;
    const tapeCount = products.filter(p => p.category === "TAPE").length;
    
    const withImage = products.filter(p => !!p.imageUrl).length;
    const withPdf = products.filter(p => p.pdfLinks && p.pdfLinks.length > 0).length;
    
    const industriesMap: Record<string, number> = {};
    const chemistriesMap: Record<string, number> = {};
    
    products.forEach(product => {
      // Count industries
      if (product.industry) {
        product.industry.forEach(ind => {
          industriesMap[ind] = (industriesMap[ind] || 0) + 1;
        });
      }
      
      // Count chemistries
      if (product.chemistry) {
        chemistriesMap[product.chemistry] = (chemistriesMap[product.chemistry] || 0) + 1;
      }
    });
    
    return {
      total: products.length,
      bond: bondCount,
      seal: sealCount,
      tape: tapeCount,
      withImage,
      withPdf,
      industries: Object.entries(industriesMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      chemistries: Object.entries(chemistriesMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
    };
  } catch (error) {
    console.error('Failed to generate product stats:', error);
    return {
      total: 0,
      bond: 0,
      seal: 0,
      tape: 0,
      withImage: 0,
      withPdf: 0,
      industries: [],
      chemistries: [],
    };
  }
}
