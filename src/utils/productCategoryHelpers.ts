// Helper to get product category image from navbar data (desktop)
export const getProductCategoryImage = (category: string): string | null => {
  const categoryLower = category.toLowerCase();
  switch (categoryLower) {
    case 'bond':
      return '/images/product-heroes/Forza Bond Hero Shot Header.webp';
    case 'seal':
      return '/images/product-heroes/Forza Seal Hero Shot.webp';
    case 'tape':
      return '/images/product-heroes/Forza Tape Hero Shot Header.webp';
    case 'ruggedred':
    case 'cleaners':
      return '/images/product-heroes/Forza Cleaners Hero Shot Header.webp';
    default:
      return null;
  }
};

// Helper to get mobile hero image based on category
export const getMobileHeroImage = (category: string): string => {
  const cat = (category || '').toLowerCase();
  switch (cat) {
    case 'bond':
      return '/images/product-heroes/Forza Bond Mobile Header.webp';
    case 'seal':
      return '/images/product-heroes/Forza Seal Mobile Header.webp';
    case 'tape':
      return '/images/product-heroes/Forza Tape Mobile Header.webp';
    case 'ruggedred':
    case 'cleaners':
      return '/images/product-heroes/RuggedRed Mobile Header.webp';
    default:
      return '/images/product-heroes/Forza Bond Mobile Header.webp'; // Default fallback
  }
};

// Helper to get product category title
export const getProductCategoryTitle = (category: string): string => {
  const cat = (category || '').toLowerCase();
  switch (cat) {
    case 'bond':
      return 'Adhesives';
    case 'seal':
      return 'Sealants';
    case 'tape':
      return 'Tapes';
    case 'ruggedred':
    case 'cleaners':
      return 'Cleaners';
    default:
      return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  }
};

// Helper to get product category description
export const getProductCategoryDescription = (category: string): string => {
  const cat = (category || '').toLowerCase();
  switch (cat) {
    case 'bond':
      return 'High-performance adhesive solutions for structural integrity and long-lasting durability.';
    case 'seal':
      return 'Dependable sealing solutions designed to protect, perform, and endure in even the toughest manufacturing environments.';
    case 'tape':
      return 'Versatile tape solutions for secure bonding and sealing in demanding applications.';
    case 'ruggedred':
    case 'cleaners':
      return 'Industrial-grade cleaning solutions for preparing surfaces and maintaining equipment.';
    default:
      return `Explore ForzaBuilt's ${category} products. High-performance industrial solutions for demanding applications.`;
  }
};

