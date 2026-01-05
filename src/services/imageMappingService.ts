// Image mapping service to map product IDs to available images

export class ImageMappingService {
  /**
   * Maps product IDs to available images
   * This is a fallback when the original imageUrl doesn't exist
   */
  static getImageForProduct(productId: string): string {
    const id = productId.toLowerCase();
    
    const mapping: Record<string, string> = {
      // Known production mappings from blob storage
      'ic932': 'Industrial/IC932 Canister.webp',
      'c-os9': 'Construction/C-OS9 Sausage.webp',
      'tac-735r': 'Composites/TAC-735R 22L and Aerosol.webp',
      'os2': 'Industrial/OS2 Cartridge.webp',
      'os10': 'Industrial/OS10 Cartridge.webp',
      'tac-738r': 'Composites/TAC-738R 22L and Aerosol.webp',
      'os20': 'Industrial/OS20 Sausage.webp',
      'tac-739r': 'Composites/TAC-739R 22L and Aerosol.webp',
      'os31': 'Industrial/OS31 Cartridge.webp',
      'os25': 'Industrial/OS25 Cartridge.webp',
      'mc722': 'Marine/MC722 Canister.webp',
      'os35': 'Industrial/OS35 Cartridge.webp',
      'mc723': 'Marine/MC723 Canister and Aerosol.webp',
      'os37': 'Industrial/OS37 Cartridge.webp',
      't305': 'Industrial/T305- Foam Tape.webp',
      'mc724': 'Marine/MC724 Canister and Aerosol.webp',
      'os61': 'Industrial/OS61 Cartridge.webp',
      'mc737': 'Marine/MC737 Canister.webp',
      'c-os55': 'Construction/C-OS55 Sausage.webp',
      't350': 'Industrial/T350- Thermal Break Tape.webp',
      'mc741': 'Marine/MC741 Canister.webp',
      'os24': 'Industrial/OS24 Cartridge.webp',
      'ic933': 'Industrial/IC933 Canister and Aerosol.webp',
      'c-t500': 'Construction/C-T500 Tape.webp',
      'ic946': 'Industrial/IC946 Canister and Aerosol.webp',
      'c130': 'Industrial/C130 Drum.webp',
      't900': 'Industrial/T900 Butyl Tape.webp',
      'c150': 'Industrial/C150 1 gal pail.webp',
      'oa12': 'Industrial/OA12 Cartridge.webp',
      'frp': 'Industrial/FRP 3.5 gal pail.webp',
      'c331': 'Industrial/C331 5 gal Pail.webp',
      '81-0389': 'Industrial/81-0389 5 gal pail.webp',
      's228': 'Industrial/S228 1 gal pail.webp',
      'osa': 'Industrial/OSA tin can.webp',
      't950': 'Industrial/T950 FSK Bonding Tape.webp',
      'oa13': 'Industrial/OA13 Cartridge.webp',
      't970': 'Industrial/T970 Foil Bonding Tape.webp',

      // OA (Adhesive) products
      'oa75': 'Industrial/oa23.webp', 
      'm-oa755': 'Marine/m-oa755.webp',
      
      // OS (Sealant) products
      'os55': 'Industrial/os55.webp',
      'os45': 'Industrial/os45.webp',
      'os61-adhesive': 'Industrial/os61.webp',
      'os25-adhesive': 'Industrial/os25.webp',
      'os20-adhesive': 'Industrial/os20.webp',
      
      // C (Cleaner) products
      'c-os9-cleaner': 'Construction/c-os9.webp',
      'c-oa77': 'Industrial/c-oa77.webp',
      'c-oa52': 'Industrial/c-oa52.webp',
      'c-oa5': 'Industrial/c-oa5.webp',
      'c-oa98': 'Industrial/c-oa98.webp',
      'c-r560': 'Transportation/c-r560.webp',
      'c-r552': 'Transportation/c-r552.webp',
      'c-r329': 'Transportation/c-r329.webp',
      'c-os55-cleaner': 'Construction/c-os55.webp',
      'c-c551': 'Industrial/c-c551.webp',
      'c-c360': 'Construction/c-c360.webp',
      'c-w6106': 'Industrial/c-w6106.webp',
      
      // Other fallbacks
      'ca2400': 'Industrial/ca2400.png',
      'ca1500': 'Industrial/ca1500.webp',
      'ca1000': 'Industrial/ca1000.webp',
      'oa23': 'Industrial/oa23.webp',
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
