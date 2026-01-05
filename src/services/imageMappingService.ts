// Image mapping service to map product IDs to available images

export class ImageMappingService {
  /**
   * Maps product IDs to available images
   * This is a fallback when the original imageUrl doesn't exist
   */
  static getImageForProduct(productId: string): string {
    const mapping: Record<string, string> = {
      // OA (Adhesive) products
      'oa75': '/product-images/oa23.webp', // Using oa23.png as fallback for OA75
      'm-oa755': '/product-images/oa13.webp', // Using oa13.png as fallback for M-OA755
      
      // OS (Sealant) products
      'os55': '/product-images/os55.webp',
      'os45': '/product-images/os45.webp',
      'os61': '/product-images/os61.webp',
      'os37': '/product-images/os37.webp',
      'os35': '/product-images/os35.webp',
      'os31': '/product-images/os31.webp',
      'os25': '/product-images/os25.webp',
      'os20': '/product-images/os20.png',
      'os10': '/product-images/os10.webp',
      'os2': '/product-images/os2.webp',
      
      // T (Tape) products
      't500': '/product-images/t500.webp',
      't461': '/product-images/t461.webp',
      't970': '/product-images/t970.webp',
      't950': '/product-images/t950.webp',
      't900': '/product-images/t900.webp',
      't715': '/product-images/t715.webp',
      't600': '/product-images/t600.webp',
      't464': '/product-images/t464.webp',
      't350': '/product-images/t350.webp',
      't305': '/product-images/t305.webp',
      't220': '/product-images/t220.webp',
      't215': '/product-images/t215.webp',
      't-t430': '/product-images/t-t430.webp',
      't-t1420': '/product-images/t-t1420.png',
      't-t1200': '/product-images/t-t1200.webp',
      't-t420': '/product-images/t-t420.webp',
      't-t415': '/product-images/t-t415.webp',
      
      // C (Contact Adhesive) products
      'c130': '/product-images/c130.webp',
      'c331': '/product-images/c331.webp',
      'c150': '/product-images/c150.webp',
      
      // C (Cleaner) products
      'c-t5100': '/product-images/c-t5100.webp',
      'c-t731': '/product-images/c-t731.webp',
      'c-t564': '/product-images/c-t564.webp',
      'c-t557': '/product-images/c-t557.webp',
      'c-t553': '/product-images/c-t553.webp',
      'c-t550': '/product-images/c-t550.webp',
      'c-t500': '/product-images/c-t500.webp',
      'c-os9': '/product-images/c-os9.webp',
      'c-oa77': '/product-images/c-oa77.webp',
      'c-oa52': '/product-images/c-oa52.webp',
      'c-oa5': '/product-images/c-oa5.webp',
      'c-oa98': '/product-images/c-oa98.webp',
      'c-r560': '/product-images/c-r560.webp',
      'c-r552': '/product-images/c-r552.webp',
      'c-r329': '/product-images/c-r329.webp',
      'c-os55': '/product-images/c-os55.webp',
      'c-c551': '/product-images/c-c551.webp',
      'c-c360': '/product-images/c-c360.webp',
      'c-w6106': '/product-images/c-w6106.webp',
      'c-s538': '/product-images/c-s538.webp',
      
      // R (RuggedRed) products
      'r-t860': '/product-images/r-t860.webp',
      'r-t620': '/product-images/r-t620.webp',
      'r-t600': '/product-images/r-t600.webp',
      'r-os84': '/product-images/r-os84.webp',
      'r-os8': '/product-images/r-os8.webp',
      'r-osa': '/product-images/r-osa.webp',
      'r-a2000': '/product-images/r-a2000.webp',
      'r-r820': '/product-images/r-r820.webp',
      'r-c661': '/product-images/r-c661.webp',
      
      // RC (RuggedRed Cleaner) products
      'rc887': '/product-images/rc887.webp',
      'rc886': '/product-images/rc886.webp',
      'rc864': '/product-images/rc864.webp',
      'rc863': '/product-images/rc863.webp',
      'rc862': '/product-images/rc862.webp',
      'rc826': '/product-images/rc826.webp',
      
      // TAC (Tape Adhesive) products
      'tac-os75': '/product-images/tac-os75.webp',
      'tac-os74': '/product-images/tac-os74.webp',
      'tac-r777': '/product-images/tac-r777.webp',
      'tac-r750': '/product-images/tac-r750.webp',
      'tac850': '/product-images/tac850.webp',
      
      // T-OS (Tape Sealant) products
      't-os164': '/product-images/t-os164.webp',
      't-os151': '/product-images/t-os151.webp',
      't-os150': '/product-images/t-os150.webp',
      't-oa177': '/product-images/t-oa177.webp',
      't-oa156': '/product-images/t-oa156.webp',
      't-oa152': '/product-images/t-oa152.webp',
      't-osa155': '/product-images/t-osa155.webp',
      
      // T-C (Tape Cleaner) products
      't-c485': '/product-images/t-c485.webp',
      't-c225': '/product-images/t-c225.webp',
      't-c222': '/product-images/t-c222.webp',
      
      // T-R (Tape RuggedRed) products
      't-r785': '/product-images/t-r785.webp',
      't-r679': '/product-images/t-r679.webp',
      't-s596': '/product-images/t-s596.webp',
      
      // TC (Tape Cleaner) products
      'tc467': '/product-images/tc467.webp',
      'tc466': '/product-images/tc466.webp',
      'tc456': '/product-images/tc456.webp',
      'tc454': '/product-images/tc454.webp',
      'tc453': '/product-images/tc453.webp',
      'tc452': '/product-images/tc452.webp',
      
      // CC (Cleaner Cleaner) products
      'cc503-aa': '/product-images/cc503-aa.webp',
      'cc519': '/product-images/cc519.webp',
      
      // Other products
      'ca2400': '/product-images/ca2400.png',
      'ca1500': '/product-images/ca1500.webp',
      'ca1000': '/product-images/ca1000.webp',
      'oa23': '/product-images/oa23.webp',
      'oa13': '/product-images/oa13.webp',
      'oa12': '/product-images/oa12.webp',
      '81-0389': '/product-images/81-0389.webp',
      'ic947': '/product-images/ic947.webp',
      'ic932': '/product-images/ic932.webp',
      'ic946--ca-compliant-pressure-sensitive-contact-adhesive': '/product-images/ic946--ca-compliant-pressure-sensitive-contact-adhesive.webp',
    };
    
    return mapping[productId.toLowerCase()] || '/product-images/placeholder.png';
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
