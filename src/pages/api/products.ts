import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  // Try to get query params from the request
  const url = new URL(request.url);
  const includeUnpublished = url.searchParams.get('all') === 'true' || url.searchParams.get('include_unpublished') === 'true';
  
  // Use the exact URL format the user provided (with trailing slash)
  const baseUrl = 'https://forza-product-managementsystem-b7c3ff8d3d2d.herokuapp.com/api/products/';
  
  try {
    let data: any = null;
    let finalUrl = baseUrl;
    
    // Try the base URL with trailing slash first
    // Add cache-buster to the Heroku fetch to bypass any intermediate caching
    const herokuUrl = `${baseUrl}?t=${Date.now()}`;
    let response = await fetch(herokuUrl, {
      headers: {
        'Accept': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache'
      },
      cache: 'no-store'
    });
    
    if (response.ok) {
      data = await response.json();
      
      // Log the response count immediately after fetch
      console.log(`[API Proxy] Direct fetch from Heroku API (${baseUrl}) returned ${Array.isArray(data) ? data.length : 'non-array'} products`);
      
      // If we got fewer than 196 products, try pagination or limit parameters
      if (Array.isArray(data) && data.length < 196) {
        console.log(`[API Proxy] ⚠️ WARNING: Expected 196 products but got ${data.length}. Missing ${196 - data.length} products.`);
        console.log(`[API Proxy] Attempting to fetch all products with pagination/limit parameters...`);
        
        // Try common pagination patterns
        const paginationAttempts = [
          `${baseUrl}?limit=500`,
          `${baseUrl}?limit=1000`,
          `${baseUrl}?per_page=500`,
          `${baseUrl}?per_page=1000`,
          `${baseUrl}?page=1&per_page=500`,
          `${baseUrl}?all=true`,
          `${baseUrl}?published=all`
        ];
        
        for (const pagUrlBase of paginationAttempts) {
          try {
            const pagUrl = `${pagUrlBase}&t=${Date.now()}`;
            const pagResponse = await fetch(pagUrl, {
              headers: {
                'Accept': 'application/json; charset=utf-8',
                'Cache-Control': 'no-cache'
              },
              cache: 'no-store'
            });
            if (pagResponse.ok) {
              const pagData = await pagResponse.json();
              // Handle both array responses and paginated responses with a 'data' or 'products' field
              let products = pagData;
              if (pagData.data && Array.isArray(pagData.data)) {
                products = pagData.data;
              } else if (pagData.products && Array.isArray(pagData.products)) {
                products = pagData.products;
              }
              
              if (Array.isArray(products) && products.length > data.length) {
                console.log(`[API Proxy] ✅ Found ${products.length} products using ${pagUrl}`);
                data = products;
                finalUrl = pagUrl;
                break;
              }
            }
          } catch (e) {
            // Continue to next attempt
            console.log(`[API Proxy] Failed to try ${pagUrl}:`, e);
          }
        }
        
        // Final check
        if (Array.isArray(data) && data.length < 196) {
          console.log(`[API Proxy] ⚠️ Still only got ${data.length} products after trying pagination. The API may have a hard limit or filtering.`);
        }
      } else if (Array.isArray(data) && data.length === 196) {
        console.log(`[API Proxy] ✅ Successfully received all 196 products from Heroku API`);
      } else if (Array.isArray(data) && data.length > 196) {
        console.log(`[API Proxy] ℹ️ Received ${data.length} products (more than expected 196)`);
      }
    } else {
      return new Response(JSON.stringify({ error: `Failed to fetch from Heroku: ${response.statusText}` }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    if (!data) {
      return new Response(JSON.stringify({ error: 'No data received from Heroku API' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Log API response details for debugging
    console.log(`[API Proxy] Received ${Array.isArray(data) ? data.length : 'non-array'} products from Heroku API`);
    console.log(`[API Proxy] Expected 196 products, got ${Array.isArray(data) ? data.length : 0}. Missing: ${196 - (Array.isArray(data) ? data.length : 0)} products`);
    if (Array.isArray(data)) {
      const publishedCount = data.filter((p: any) => p.published === true || p.published === undefined).length;
      const unpublishedCount = data.filter((p: any) => p.published === false).length;
      console.log(`[API Proxy] Published: ${publishedCount}, Unpublished: ${unpublishedCount}`);
      
      // Check for specific product codes (including TAC-OS7)
      const searchCodes = ['TAC-745', 'TAC-OS7', 'TU603', 'TU615', 'TU-OS50', 'TU-OA40', 'TU-OS45', 'TU-800', 'C110', 'IC936', 'IC951', 'IC952', 'IC955NF', 'R190', 'R529', 'OS2 WT', 'OS45', 'OS55', 'T205', 'T226', 'T310', 'T710', 'MC736', 'MC739', 'TC471', 'T-T246', 'TAC-R760', 'TAC-T700', 'C-OA52W', 'A1000', 'A450', 'A465', 'A729', 'C805', 'C830', 'C835', 'H103', 'H117', 'H158', 'H163', 'H164', 'H167', 'H176', 'I1000', 'IC2400', 'OA99', 'W700', 'FC-CAR', 'OA28', 'OA29', 'OA75', 'T103', 'T446', 'T449', 'T454', 'T461', 'T462', 'T465', 'T515', 'T532', 'M-C283', 'M-R478', 'T-R682'];
      const foundInApi = data.filter((p: any) => {
        const productId = ((p.product_id || p.id || '') + '').toUpperCase();
        return searchCodes.some(code => {
          const normalizedCode = code.toUpperCase().replace(/-/g, '');
          const normalizedId = productId.replace(/-/g, '');
          return normalizedId.includes(normalizedCode) || normalizedId === normalizedCode || productId === code.toUpperCase();
        });
      });
      if (foundInApi.length > 0) {
        console.log(`[API Proxy] Found ${foundInApi.length} of searched products in API response:`, foundInApi.map((p: any) => ({ 
          id: p.product_id || p.id, 
          name: p.name || p.full_name, 
          published: p.published 
        })));
      } else {
        console.log(`[API Proxy] ⚠️ None of the searched product codes found in Heroku API response`);
      }
    }
    
    // Log the exact count received from Heroku API
    console.log(`[API Proxy] ✅ Returning ${Array.isArray(data) ? data.length : 0} products to frontend`);
    console.log(`[API Proxy] Response length verification: ${Array.isArray(data) ? data.length : 'not an array'}`);
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Disable caching to ensure fresh data
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error in products API proxy:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};







