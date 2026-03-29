import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useGetCategoriesQuery } from '../slices/categoriesApiSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';

/* ── Hero slides ── */
const HERO_SLIDES = [
  { id: 1, image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1500&q=80', title: 'Up to 40% off Electronics', subtitle: 'Smartphones, Laptops & Headphones', cta: 'Shop Now', link: '/search?category=electronics' },
  { id: 2, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1500&q=80', title: "India's Fashion Destination", subtitle: "Clothing, footwear & accessories for everyone", cta: 'Explore Fashion', link: '/search?category=clothing' },
  { id: 3, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1500&q=80', title: 'Home & Kitchen Essentials', subtitle: 'Upgrade your living space today', cta: 'Shop Home', link: '/search?category=home-kitchen' },
];

/* ── Category image data ── */
const CAT_DATA = {
  electronics:     { imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=220&q=75','https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?w=220&q=75','https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=220&q=75','https://images.unsplash.com/photo-1583394838336-acd977736f90?w=220&q=75'], labels:['Smartphones','Laptops','Smartwatches','Headphones'] },
  books:           { imgs: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=220&q=75','https://images.unsplash.com/photo-1512820790803-83ca734da794?w=220&q=75','https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=220&q=75','https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=220&q=75'], labels:['Fiction','Non-Fiction','Self Help','Academic'] },
  clothing:        { imgs: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=220&q=75','https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=220&q=75','https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=220&q=75','https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=220&q=75'], labels:["Men's Wear","Women's Wear",'Sports Wear','Casual'] },
  'home-kitchen':  { imgs: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=220&q=75','https://images.unsplash.com/photo-1582749759039-91c3d2df3c1b?w=220&q=75','https://images.unsplash.com/photo-1589203690056-00fe2f14fdc8?w=220&q=75','https://images.unsplash.com/photo-1484154218962-a197022b5858?w=220&q=75'], labels:['Cookware','Appliances','Furniture','Decor'] },
  'sports-fitness':{ imgs: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=220&q=75','https://images.unsplash.com/photo-1536922246289-88c42f957773?w=220&q=75','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=220&q=75','https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=220&q=75'], labels:['Gym Equipment','Cycling','Yoga','Running'] },
  beauty:          { imgs: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=220&q=75','https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=220&q=75','https://images.unsplash.com/photo-1571781926291-c34c84c16c76?w=220&q=75','https://images.unsplash.com/photo-1538724369852-ee8b92f3cefe?w=220&q=75'], labels:['Skincare','Makeup','Haircare','Perfume'] },
};
const getFallback = (slug) => ({ imgs: [...Array(4)].map((_,i)=>`https://picsum.photos/seed/${slug}${i}/200`), labels:['Item 1','Item 2','Item 3','Item 4'] });

/* ── Promotional banners to fill grid gaps ── */
const PROMO_BANNERS = [
  { title: "Today's Deals", subtitle: 'Savings across all categories', img: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&q=75', link: '/search?sort=price_asc', bg: '#232F3E', color: '#FF9900' },
  { title: 'Prime Exclusive', subtitle: 'Free fast delivery on millions of items', img: 'https://images.unsplash.com/photo-1553531384-397c80973a0b?w=400&q=75', link: '/search?search=prime', bg: '#003087', color: '#00A8E1' },
];

/* ── Category card ── */
const CategoryCard = ({ cat }) => {
  const d = CAT_DATA[cat.slug] || getFallback(cat.slug);
  return (
    <div className="bg-white p-4 flex flex-col h-full">
      <h3 className="text-[17px] font-bold text-[#0F1111] mb-3 leading-tight">{cat.name}</h3>
      <div className="grid grid-cols-2 gap-2 flex-1">
        {d.imgs.map((img, i) => (
          <Link key={i} to={`/search?category=${cat.slug}`} className="group flex flex-col gap-1">
            <div className="aspect-square overflow-hidden bg-[#f3f3f3]">
              <img src={img} alt={d.labels[i]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${cat.slug}${i}/200`; }} />
            </div>
            <span className="text-[11px] text-[#0F1111] text-center leading-tight line-clamp-1">{d.labels[i]}</span>
          </Link>
        ))}
      </div>
      <Link to={`/search?category=${cat.slug}`} className="mt-3 text-[13px] text-[#007185] hover:text-[#C7511F] hover:underline">
        See all in {cat.name} ›
      </Link>
    </div>
  );
};

/* ── Promo filler card ── */
const PromoCard = ({ banner }) => (
  <Link to={banner.link} className="flex flex-col justify-between overflow-hidden bg-white hover:shadow-md transition-shadow" style={{ background: banner.bg }}>
    <div className="p-5">
      <h3 className="text-[18px] font-bold mb-1" style={{ color: banner.color }}>{banner.title}</h3>
      <p className="text-[13px] text-white/80">{banner.subtitle}</p>
      <span className="inline-block mt-3 text-[12px] bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded transition">
        Shop now ›
      </span>
    </div>
    <img src={banner.img} alt={banner.title} className="w-full h-[155px] object-cover opacity-70"
      onError={(e) => { e.target.style.display = 'none'; }} />
  </Link>
);

/* ── Skeleton card ── */
const SkeletonCard = ({ compact }) => (
  <div className={`bg-white animate-pulse flex flex-col ${compact ? 'w-[190px] flex-shrink-0' : ''}`}>
    <div className={`bg-gray-200 w-full ${compact ? 'h-[160px]' : 'h-[200px]'}`} />
    <div className="p-3 flex flex-col gap-2">
      <div className="h-3 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-5 bg-gray-200 rounded mt-1 w-2/3" />
      {!compact && <div className="h-8 bg-gray-200 rounded-full mt-1" />}
    </div>
  </div>
);

/* ── Horizontal scrollable section with arrow buttons ── */
const ScrollSection = ({ title, viewAllLink, children }) => {
  const ref = useRef(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);

  const check = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scroll = (dir) => { ref.current?.scrollBy({ left: dir * 700, behavior: 'smooth' }); setTimeout(check, 320); };

  return (
    <div className="bg-white mb-3 overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <h2 className="text-[22px] font-bold text-[#0F1111]">{title}</h2>
        {viewAllLink && <Link to={viewAllLink} className="text-[13px] text-[#007185] hover:underline">See all ›</Link>}
      </div>
      <div className="relative group/row">
        {canLeft && (
          <button onClick={() => scroll(-1)} className="absolute left-0 top-0 bottom-0 z-10 w-14 flex items-center justify-start pl-1 bg-gradient-to-r from-white via-white/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity">
            <div className="bg-white shadow border border-gray-200 rounded-full p-1"><ChevronLeft size={22} className="text-gray-600"/></div>
          </button>
        )}
        {canRight && (
          <button onClick={() => scroll(1)} className="absolute right-0 top-0 bottom-0 z-10 w-14 flex items-center justify-end pr-1 bg-gradient-to-l from-white via-white/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity">
            <div className="bg-white shadow border border-gray-200 rounded-full p-1"><ChevronRight size={22} className="text-gray-600"/></div>
          </button>
        )}
        <div ref={ref} onScroll={check} className="flex overflow-x-auto gap-px pb-4 px-5 scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   HOMEPAGE
══════════════════════════════════════ */
const HomePage = () => {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);

  const next = useCallback(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), []);
  const prev = () => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  useEffect(() => { const t = setInterval(next, 5000); return () => clearInterval(t); }, [next]);

  const { data: prodData,  isLoading: loadingProd } = useGetProductsQuery({ limit: 20 });
  const { data: catData,   isLoading: loadingCat  } = useGetCategoriesQuery();

  const products   = prodData?.data  || [];
  const categories = catData?.data   || [];

  /* Split products into two distinct slices so sections don't look identical */
  const bestSellers  = products.slice(0, 8);
  const recommended  = products.slice(0, 20);

  /* Build the category grid rows:
     Row 1 → first 4 categories
     Row 2 → remaining categories + promo cards to fill to 4 cols */
  const row1 = categories.slice(0, 4);
  const row2cats = categories.slice(4);                          // 0–4 cats
  const promoNeeded = Math.max(0, 4 - row2cats.length);        // how many promos to add
  const promos = PROMO_BANNERS.slice(0, promoNeeded);           // only as many as needed

  return (
    <div className="w-full bg-[#EAEDED] pb-10">

      {/* ── HERO CAROUSEL ── */}
      <div className="relative w-full overflow-hidden" style={{ height: 'clamp(200px, 40vw, 500px)' }}>
        {HERO_SLIDES.map((s, i) => (
          <div key={s.id} className={`absolute inset-0 transition-opacity duration-700 ${i === slide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <img src={s.image} alt={s.title} className="w-full h-full object-cover" loading={i === 0 ? 'eager' : 'lazy'}
              onError={(e) => { e.target.style.background = '#232F3E'; }} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
            <div className="absolute top-[15%] md:top-[18%] left-4 md:left-16 max-w-[70%] md:max-w-[55%] z-10">
              <h2 className="text-white text-2xl md:text-4xl lg:text-5xl font-extrabold drop-shadow-lg leading-tight">{s.title}</h2>
              <p className="text-white/90 text-sm md:text-base mt-2 drop-shadow">{s.subtitle}</p>
              <button onClick={() => navigate(s.link)} className="mt-4 bg-[#FF9900] hover:bg-[#e68a00] text-black font-bold px-5 py-2 rounded text-sm md:text-base transition shadow">
                {s.cta}
              </button>
            </div>
          </div>
        ))}

        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow transition">
          <ChevronLeft size={22} className="text-gray-700" />
        </button>
        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow transition">
          <ChevronRight size={22} className="text-gray-700" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className={`h-2 rounded-full transition-all duration-300 ${i === slide ? 'w-5 bg-[#FF9900]' : 'w-2 bg-white/60 hover:bg-white/90'}`} />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#EAEDED] to-transparent pointer-events-none z-10" />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-[1500px] mx-auto px-3 md:px-4 -mt-4 md:-mt-16 relative z-20">

        {/* ── CATEGORY ROW 1 (4 cols, always full) ── */}
        {(loadingCat || row1.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-2 md:mb-3">
            {loadingCat
              ? [...Array(4)].map((_, i) => <div key={i} className="h-[340px] bg-white animate-pulse" />)
              : row1.map((cat) => <CategoryCard key={cat.id} cat={cat} />)
            }
          </div>
        )}

        {/* ── CATEGORY ROW 2 + PROMO CARDS (always 4 cols) ── */}
        {!loadingCat && (row2cats.length > 0 || promos.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-2 md:mb-3">
            {row2cats.map((cat) => <CategoryCard key={cat.id} cat={cat} />)}
            {promos.map((p, i) => <PromoCard key={i} banner={p} />)}
          </div>
        )}

        {/* ── DEAL BANNER (Amazon-style full-width strip) ── */}
        <div className="bg-white mb-3 px-5 py-4 flex items-center gap-4 overflow-hidden">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-[#CC0C39] uppercase tracking-wide mb-0.5">Limited time deal</p>
            <h2 className="text-[20px] font-bold text-[#0F1111] leading-tight">Up to 50% off | Speakers, TVs &amp; Audio</h2>
            <Link to="/search?category=electronics" className="inline-block mt-2 text-[13px] text-[#007185] hover:underline">See all offers ›</Link>
          </div>
          <div className="hidden md:flex gap-3 flex-shrink-0">
            {['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=180&q=70','https://images.unsplash.com/photo-1545454675-3531b543be5d?w=180&q=70','https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=180&q=70','https://images.unsplash.com/photo-1587658975588-0710b7e27b26?w=180&q=70'].map((img, i) => (
              <Link key={i} to="/search?category=electronics">
                <div className="w-[120px] h-[100px] bg-[#f3f3f3] overflow-hidden hover:opacity-90 transition-opacity">
                  <img src={img} alt="" className="w-full h-full object-contain p-2 mix-blend-multiply"
                    onError={(e) => { e.target.style.display='none'; }} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── BEST SELLERS (horizontal scroll with arrows) ── */}
        <ScrollSection title="Best Sellers in Electronics" viewAllLink="/search?sort=rating">
          {loadingProd
            ? [...Array(8)].map((_, i) => <SkeletonCard key={i} compact />)
            : bestSellers.map((p, i) => (
                <div key={p.id} className="flex-shrink-0 w-[190px] border-r border-gray-100 last:border-r-0" style={{ scrollSnapAlign: 'start' }}>
                  <ProductCard product={p} compact showBestSellerBadge={i < 3} />
                </div>
              ))
          }
        </ScrollSection>

        {/* ── SECOND DEAL BANNER ── */}
        <div className="bg-white mb-3 px-5 py-4">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-[20px] font-bold text-[#0F1111]">Starting ₹499 | Fashion for Everyone</h2>
            <Link to="/search?category=clothing" className="text-[13px] text-[#007185] hover:underline ml-auto">See all offers ›</Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
            {['Men','Women','Kids','Ethnic','Western','Sports','Footwear','Accessories'].map((label, i) => {
              const imgs = ['photo-1516762689617-e1cffcef479d','photo-1469334031218-e382a71b716b','photo-1503944583220-79d8926ad5e2','photo-1583391733956-3750e0ff4e8b','photo-1515886657613-9f3515b0c78f','photo-1552674605-db6ffd4facb5','photo-1542291026-7eec264c27ff','photo-1553062407-98eeb64c6a62'];
              return (
                <Link key={label} to={`/search?category=clothing&search=${label.toLowerCase()}`} className="flex flex-col items-center gap-1 group">
                  <div className="w-full aspect-square overflow-hidden rounded-full bg-[#f3f3f3] border-2 border-transparent group-hover:border-[#FF9900] transition-colors">
                    <img src={`https://images.unsplash.com/${imgs[i]}?w=120&q=70`} alt={label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => { e.target.src = `https://picsum.photos/seed/${label}/120`; }} />
                  </div>
                  <span className="text-[12px] text-[#0F1111] text-center font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── RECOMMENDED FOR YOU ── */}
        <div className="bg-white mb-3">
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#EAEDED]">
            <h2 className="text-[22px] font-bold text-[#0F1111]">Recommended for You</h2>
            <Link to="/search" className="text-[13px] text-[#007185] hover:underline">View all products ›</Link>
          </div>

          {/* Tile grid — gap-px gives Amazon's signature divider appearance */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-[#EAEDED]">
            {loadingProd
              ? [...Array(10)].map((_, i) => <div key={i} className="bg-white"><SkeletonCard /></div>)
              : recommended.map((p) => (
                  <div key={p.id} className="bg-white h-full">
                    <ProductCard product={p} />
                  </div>
                ))
            }
          </div>

          <div className="text-center py-4 border-t border-[#EAEDED]">
            <Link to="/search" className="text-[13px] text-[#007185] hover:underline">
              See personalized recommendations ›
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
