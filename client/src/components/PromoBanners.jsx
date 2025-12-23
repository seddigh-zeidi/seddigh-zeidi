import { useState } from 'react';

// Custom SVG Icons
const ChevronLeftIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const PromoBanners = () => {
  const banners = [
    {
      id: 1,
      brand: 'JBL',
      logo: '/images/jbl-logo.png',
      title: 'فروش ویژه',
      subtitle: 'محصولات جی بی ال',
      discount: '۹۰',
      productImage: '/images/jbl-speaker.png',
      backgroundImage: '/images/jbl-bg.jpg',
      bgGradient: 'from-blue-600 via-blue-500 to-blue-400',
    },
    {
      id: 2,
      brand: 'dyson',
      logo: '/images/dyson-logo.png',
      title: 'فروش ویژه',
      subtitle: 'محصولات دایسون',
      discount: '۹۰',
      productImage: '/images/dyson-headphone.png',
      backgroundImage: '/images/dyson-bg.jpg',
      bgGradient: 'from-blue-700 via-blue-600 to-blue-500',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState({});

  const handlePrev = (bannerId) => {
    setCurrentSlide(prev => ({
      ...prev,
      [bannerId]: ((prev[bannerId] || 0) - 1 + 3) % 3
    }));
  };

  const handleNext = (bannerId) => {
    setCurrentSlide(prev => ({
      ...prev,
      [bannerId]: ((prev[bannerId] || 0) + 1) % 3
    }));
  };

  return (
    <section className="py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative overflow-hidden rounded-2xl h-64 md:h-72 group"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-l ${banner.bgGradient}`} />

              {/* Decorative Pattern - Walmart style circles */}
              <div className="absolute top-4 right-4 opacity-20">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="white">
                  <path d="M30 0 L30 25 M30 35 L30 60 M0 30 L25 30 M35 30 L60 30 M8 8 L22 22 M38 38 L52 52 M52 8 L38 22 M22 38 L8 52"
                        stroke="white" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>

              {/* Background Image Overlay (optional) */}
              <div
                className="absolute left-0 top-0 w-1/2 h-full bg-cover bg-center opacity-30"
                style={{ backgroundImage: `url(${banner.backgroundImage})` }}
              />

              {/* Content Container */}
              <div className="relative h-full flex items-center justify-between p-6 z-10">

                {/* Text Content - Right Side */}
                <div className="flex flex-col items-start text-white space-y-3 w-1/2">
                  {/* Brand Logo */}
                  <div className="bg-white px-4 py-2 rounded-lg mb-2">
                    <img
                      src={banner.logo}
                      alt={banner.brand}
                      className="h-6 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <span
                      className="text-red-600 font-bold text-lg hidden"
                      style={{ display: 'none' }}
                    >
                      {banner.brand}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                    {banner.title}
                  </h3>
                  <h4 className="text-xl md:text-2xl font-bold leading-tight">
                    {banner.subtitle}
                  </h4>

                  {/* Discount Badge */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm">فروش ویژه تا</span>
                    <div className="flex items-center bg-red-500 text-white px-3 py-1 rounded-full">
                      <span className="text-lg font-bold">{banner.discount}٪</span>
                    </div>
                    <span className="text-sm">تخفیف</span>
                  </div>
                </div>

                {/* Product Image - Left Side */}
                <div className="w-1/2 flex justify-center items-center">
                  <img
                    src={banner.productImage}
                    alt={banner.subtitle}
                    className="max-h-48 md:max-h-56 object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlDQTNBRiIgZm9udC1zaXplPSIxNCI+dGV4cjwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                <button
                  onClick={() => handlePrev(banner.id)}
                  className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                  aria-label="قبلی"
                >
                  <ChevronRightIcon className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={() => handleNext(banner.id)}
                  className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                  aria-label="بعدی"
                >
                  <ChevronLeftIcon className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 right-4 flex gap-1 z-20">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      (currentSlide[banner.id] || 0) === index
                        ? 'bg-white w-4'
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;
