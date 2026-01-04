import React from 'react';

const WhyChooseForza = () => {
  const stats = [
    {
      value: '1979',
      label: 'ESTABLISHED',
      description: 'Decades of expertise',
      mobileWidth: '50%',
      desktopHeight: '35%',
      desktopTop: 'calc(65% - 1.5rem)'
    },
    {
      value: '100%',
      label: 'MADE IN USA*',
      description: 'Quality guaranteed',
      mobileWidth: '56.6667%',
      desktopHeight: '55%',
      desktopTop: 'calc(45% - 1.5rem)'
    },
    {
      value: '24hr',
      label: 'SUPPORT RESPONSE',
      description: 'Always here to help',
      mobileWidth: '63.3333%',
      desktopHeight: '75%',
      desktopTop: 'calc(25% - 1.5rem)',
      isLink: true,
      href: '/contact'
    },
    {
      value: '500+',
      label: 'FORMULATIONS',
      description: 'Custom solutions',
      mobileWidth: '70%',
      desktopHeight: '95%',
      desktopTop: 'calc(5% - 1.5rem)'
    }
  ];

  return (
    <section className="relative pt-8 md:pt-16 pb-0 pl-0 pr-4 md:px-4 bg-gradient-to-bl from-[#477197] to-[#2c476e] overflow-hidden text-white isolation-auto border-b-2 border-[#F2611D] border-l-4 md:border-l-0 border-l-[#F2611D]">
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="text-center mb-6 md:mb-10">
          <h2 className="font-normal font-poppins mb-2 md:mb-4 tracking-tight" style={{ fontSize: 'clamp(20px, 0.5rem + 2vw, 40px)', opacity: 1, transform: 'none' }}>
            Why Choose Forza?
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-poppins font-light" style={{ opacity: 1, transform: 'none' }}>
            Performance proof that speaks for itself.
          </p>
        </header>
        <div className="relative pl-0 md:pl-12 pr-4 md:pr-12 pb-4 md:pb-0">
          <div className="flex flex-col md:grid md:grid-cols-4 gap-6 md:gap-6 md:h-[350px] md:relative md:translate-x-[-12.5%] md:translate-x-[-0.75rem]">
            {stats.map((stat, index) => {
              const content = (
                <>
                  {/* Mobile View */}
                  <div className="flex md:hidden flex-col relative min-h-[100px] pl-8">
                    <div className="relative z-10 flex flex-col mb-4" style={{ opacity: 1, transform: 'none' }}>
                      <p className="text-white font-normal font-poppins mb-1 text-[#F2611D]" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
                        {stat.value}
                      </p>
                      <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-1 font-poppins">
                        {stat.label}
                      </h4>
                      <p className="text-white/70 text-xs font-poppins font-light leading-relaxed">
                        {stat.description}
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-0 h-1 bg-[#F2611D] origin-left" style={{ width: stat.mobileWidth, transform: 'none' }}></div>
                    <div className="absolute w-3 h-3 bg-[#F2611D] rounded-full shadow-[0_0_15px_rgba(242,97,29,0.6)]" style={{ left: stat.mobileWidth, bottom: '-4px', transform: 'none' }}></div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:block relative h-full w-full">
                    <div className="absolute bottom-0 left-1/2 w-1 bg-[#F2611D] origin-bottom" style={{ height: stat.desktopHeight, transform: 'translateX(-50%)' }}></div>
                    <div className="absolute left-1/2 w-4 h-4 bg-[#F2611D] rounded-full shadow-[0_0_15px_rgba(242,97,29,0.6)]" style={{ bottom: `calc(${stat.desktopHeight} - 8px)`, transform: 'translateX(-50%)' }}></div>
                    <div className="absolute left-[calc(50%+1rem)] w-full max-w-[220px] flex justify-start z-10 text-left" style={{ top: stat.desktopTop, opacity: 1, transform: 'none' }}>
                      <div className="w-full">
                        <p className="text-white font-normal font-poppins mb-2 text-[#F2611D]" style={{ fontSize: 'clamp(2.625rem, 0.7rem + 3.5vw, 3.15rem)' }}>
                          {stat.value}
                        </p>
                        <h4 className="text-white/80 text-xs md:text-sm font-bold uppercase tracking-wider mb-2 font-poppins">
                          {stat.label}
                        </h4>
                        <p className="text-white/70 text-xs md:text-sm font-poppins font-light leading-relaxed">
                          {stat.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              );

              if (stat.isLink) {
                return (
                  <a key={index} href={stat.href} className="relative w-full md:h-full group block">
                    {content}
                  </a>
                );
              }

              return (
                <div key={index} className="relative w-full md:h-full">
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseForza;
