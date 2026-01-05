// Image mapping service to map product IDs to available images

export class ImageMappingService {
  /**
   * Maps product IDs to available images
   * This is a fallback when the original imageUrl doesn't exist
   */
  static getImageForProduct(productId: string): string {
    const id = productId.toLowerCase();
    
    // Minimal mapping for truly special cases where ID doesn't match filename
    // and the API might be missing the data.
    const mapping: Record<string, string> = {
      'oa75': 'Industrial/oa23.webp', 
      'm-oa755': 'Marine/m-oa755.webp',
    };
    
    return mapping[id] || `${id}.webp`;
  }



  /**
   * Validates if an image URL exists and returns a fallback if not
   */
  static async validateAndGetImage(imageUrl: string, productId: string): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(imageUrl, { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return imageUrl;
      }
    } catch {
      // Image doesn't exist or request timed out, use fallback
    }
    
    return this.getImageForProduct(productId);
  }

  /**
   * Gets all available product images
   */
  static getAvailableImages(): string[] {
    return [
      '/product-images/t500.webp',
      '/product-images/t461.webp',
      '/product-images/os55.webp',
      '/product-images/os45.webp',
      '/product-images/ic946--ca-compliant-pressure-sensitive-contact-adhesive.webp',
      '/product-images/t970.webp',
      '/product-images/t950.webp',
      '/product-images/t900.webp',
      '/product-images/t715.webp',
      '/product-images/t600.webp',
      '/product-images/t464.webp',
      '/product-images/t350.webp',
      '/product-images/t305.webp',
      '/product-images/t220.webp',
      '/product-images/t215.webp',
      '/product-images/t-t430.webp',
      '/product-images/t-t1420.png',
      '/product-images/t-t1200.webp',
      '/product-images/t-t420.webp',
      '/product-images/t-t415.webp',
      '/product-images/c-t5100.webp',
      '/product-images/c-t731.webp',
      '/product-images/c-t564.webp',
      '/product-images/c-t557.webp',
      '/product-images/c-t553.webp',
      '/product-images/c-t550.webp',
      '/product-images/c-t500.webp',
      '/product-images/os61-adhesive.webp',
      '/product-images/os61.webp',
      '/product-images/os37.webp',
      '/product-images/os35.webp',
      '/product-images/os31.webp',
      '/product-images/os25.webp',
      '/product-images/os20.png',
      '/product-images/os10.webp',
      '/product-images/os2.webp',
      '/product-images/ca2400.png',
      '/product-images/ca1500.webp',
      '/product-images/ca1000.webp',
      '/product-images/oa23.webp',
      '/product-images/oa13.webp',
      '/product-images/oa12.webp',
      '/product-images/81-0389.webp',
      '/product-images/ic947.webp',
      '/product-images/ic932.webp',
      '/product-images/r-t860.webp',
      '/product-images/r-t620.webp',
      '/product-images/r-t600.webp',
      '/product-images/r-os84.webp',
      '/product-images/r-os8.webp',
      '/product-images/r-osa.webp',
      '/product-images/r-a2000.webp',
      '/product-images/r-r820.webp',
      '/product-images/r-c661.webp',
      '/product-images/rc887.webp',
      '/product-images/rc886.webp',
      '/product-images/rc864.webp',
      '/product-images/rc863.webp',
      '/product-images/rc862.webp',
      '/product-images/rc826.webp',
      '/product-images/tac-os75.webp',
      '/product-images/tac-os74.webp',
      '/product-images/tac-r777.webp',
      '/product-images/tac-r750.webp',
      '/product-images/tac850.webp',
      '/product-images/t-os164.webp',
      '/product-images/t-os151.webp',
      '/product-images/t-os150.webp',
      '/product-images/c-os9.webp',
      '/product-images/t-c485.webp',
      '/product-images/t-c225.webp',
      '/product-images/t-c222.webp',
      '/product-images/t-oa177.webp',
      '/product-images/t-oa156.webp',
      '/product-images/t-r785.webp',
      '/product-images/t-r679.webp',
      '/product-images/t-s596.webp',
      '/product-images/t-oa152.webp',
      '/product-images/t-osa155.webp',
      '/product-images/tc467.webp',
      '/product-images/tc466.webp',
      '/product-images/tc456.webp',
      '/product-images/tc454.webp',
      '/product-images/tc453.webp',
      '/product-images/tc452.webp',
      '/product-images/c-w6106.webp',
      '/product-images/c-s538.webp',
      '/product-images/c-oa77.webp',
      '/product-images/c-osa.png',
      '/product-images/c-oa52.webp',
      '/product-images/c-oa5.webp',
      '/product-images/c-r560.webp',
      '/product-images/c-r552.webp',
      '/product-images/c-r329.webp',
      '/product-images/c-os55.webp',
      '/product-images/c-oa98.webp',
      '/product-images/c-c551.webp',
      '/product-images/c-c360.webp',
      '/product-images/cc503-aa.webp',
      '/product-images/cc519.webp'
    ];
  }
}
