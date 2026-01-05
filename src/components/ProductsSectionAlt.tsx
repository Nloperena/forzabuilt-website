import React from 'react';

const ProductsSectionAlt = () => {
  const categories = [
    {
      slug: 'bond',
      image: '/images/homepage-heroes/Forza Bond Hero Shot.webp',
      alt: 'Industrial Adhesives'
    },
    {
      slug: 'seal',
      image: '/images/homepage-heroes/Forza Seal Hero Shot.jpg',
      alt: 'Industrial Sealants'
    },
    {
      slug: 'tape',
      image: '/images/homepage-heroes/Forza Tape Hero Shot.webp',
      alt: 'Industrial Tapes'
    },
    {
      slug: 'ruggedred',
      image: '/images/homepage-heroes/Forza-Cleaners-Hero-Shot1.webp',
      alt: 'Industrial Cleaners'
    }
  ];

  return (
    <section className="pt-2 md:pt-3 lg:pt-4 bg-white w-full relative z-20 overflow-x-hidden">
      <div className="w-full bg-white pt-4 md:pt-6 px-4 mx-auto max-w-7xl relative z-10">
        <div className="text-center relative z-10">
          <h2 className="font-regular text-[#2c476e] mb-6 sm:mb-8 leading-tight font-poppins" style={{ fontSize: 'clamp(22px, 0.5rem + 2vw, 44px)' }}>
            Choose a Product Category
          </h2>
        </div>
      </div>
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-full overflow-x-hidden">
        {/* Mobile View */}
        <div className="block md:hidden">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto">
            {categories.map((category) => (
              <a key={category.slug} className="block w-full h-full" href={`/products/${category.slug}`}>
                <div className="aspect-[6/4] rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 group cursor-pointer w-full backdrop-blur-xl bg-white border-0 shadow-lg text-white" style={{ backgroundImage: 'none' }}>
                  <div className="relative w-full h-full overflow-hidden">
                    <img src={category.image} alt={category.alt} className="w-full h-full object-cover transition-opacity duration-500 opacity-100" style={{ objectPosition: 'center center' }} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Desktop View */}
        <div className="sr-only md:not-sr-only md:flex w-full flex-col items-center">
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8 xl:gap-10 w-full max-w-[1000px] lg:max-w-[1100px] xl:max-w-[1200px] mb-3 md:mb-4 mx-auto py-2 sm:py-3 md:py-3 lg:py-4">
            {categories.map((category) => (
              <div key={category.slug} className="block">
                <a className="block w-full h-full" href={`/products/${category.slug}`}>
                  <div className="aspect-[6/4] rounded-xl lg:rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 group cursor-pointer w-full backdrop-blur-xl bg-white border-0 shadow-lg text-white" style={{ backgroundImage: 'none' }}>
                    <div className="relative w-full h-full overflow-hidden">
                      <img src={category.image} alt={category.alt} className="w-full h-full object-cover transition-opacity duration-500 opacity-100" style={{ objectPosition: 'center center' }} />
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Text */}
        <div className="w-full text-center mt-8 pb-12">
          <p className="text-sm md:text-base lg:text-lg font-poppins text-gray-600 font-normal">
            Don't see your product? <a href="/contact" className="text-[#F2611D] hover:text-[#F2611D]/80 font-medium transition-colors hover:underline underline-offset-4">Contact us</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductsSectionAlt;

