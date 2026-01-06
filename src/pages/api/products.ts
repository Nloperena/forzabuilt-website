import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const HEROKU_API_URL = 'https://forza-product-managementsystem-b7c3ff8d3d2d.herokuapp.com/api/products';
  
  try {
    const response = await fetch(HEROKU_API_URL, {
      headers: {
        'Accept': 'application/json; charset=utf-8',
      }
    });
    
    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch from Heroku: ${response.statusText}` }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Add cache control if desired
        'Cache-Control': 'public, max-age=300'
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



