import React from 'react';

/**
 * TOGGLE HEADER VERSIONS HERE
 * Comment out the one you don't want to use.
 */

// 1. SOLID VERSION (Original images with baked-in branding)
import ProductCategoryFamilyHero_Version from './ProductCategoryFamilyHero_Solid';

// 2. ELEMENTS VERSION (Layered background + floating product elements)
// import ProductCategoryFamilyHero_Version from './ProductCategoryFamilyHero_Elements';

interface ProductCategoryFamilyHeroProps {
  category: 'bond' | 'seal' | 'tape' | 'ruggedred';
  children?: React.ReactNode;
}

const ProductCategoryFamilyHero: React.FC<ProductCategoryFamilyHeroProps> = (props) => {
  return <ProductCategoryFamilyHero_Version {...props} />;
};

export default ProductCategoryFamilyHero;
