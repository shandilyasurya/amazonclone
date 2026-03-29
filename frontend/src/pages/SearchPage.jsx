import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useGetCategoriesQuery } from '../slices/categoriesApiSlice';
import { useDebounce } from '../hooks/useDebounce';
import ProductCard from '../components/ProductCard';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

const SORT_OPTIONS = [
  { value: '', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Review' },
  { value: 'newest', label: 'Newest Arrivals' },
];

const SkeletonCard = () => (
  <div className="bg-white p-3 animate-pulse flex flex-col gap-2">
    <div className="bg-gray-200 aspect-square rounded" />
    <div className="h-3 bg-gray-200 rounded w-3/4" />
    <div className="h-3 bg-gray-200 rounded w-1/2" />
    <div className="h-6 bg-gray-200 rounded mt-2" />
  </div>
);

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [staRating, setStarRating] = useState(searchParams.get('rating') || '');

  const debouncedMin = useDebounce(minPrice, 400);
  const debouncedMax = useDebounce(maxPrice, 400);

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  const queryParams = {
    ...(search && { search }),
    ...(category && { category }),
    ...(sort && { sort }),
    ...(debouncedMin && { minPrice: debouncedMin }),
    ...(debouncedMax && { maxPrice: debouncedMax }),
    page,
    limit: 20,
  };

  const { data, isLoading, isFetching } = useGetProductsQuery(queryParams);
  const products = data?.data || [];
  const pagination = data?.pagination;

  const setParam = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());
    if (value) {
      params[key] = value;
    } else {
      delete params[key];
    }
    if (key !== 'page') {
      params.page = '1';
    }
    setSearchParams(params);
  };

  const loading = isLoading || isFetching;

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* ── Sidebar ── */}
        <aside className={`md:col-span-3 ${showFilter ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-4 rounded-sm shadow-sm">
            <h2 className="font-bold text-[16px] border-b border-[#DDD] pb-2 mb-3">Filters</h2>

            {/* Category */}
            <div className="mb-4">
              <h3 className="font-bold text-[13px] mb-2">Category</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setParam('category', '')}
                    className={`text-[12px] text-left w-full hover:text-[#C7511F] ${!category ? 'font-bold text-[#C7511F]' : 'text-[#007185]'}`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setParam('category', cat.slug)}
                      className={`text-[12px] text-left w-full hover:text-[#C7511F] ${category === cat.slug ? 'font-bold text-[#C7511F]' : 'text-[#007185]'}`}
                    >
                      {cat.name} ({cat.product_count || 0})
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div className="mb-4 border-t border-[#DDD] pt-3">
              <h3 className="font-bold text-[13px] mb-2">Price</h3>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full border border-[#DDD] rounded px-2 py-1 text-[12px] outline-none focus:border-[#FF9900]"
                />
                <span className="text-gray-500">—</span>
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full border border-[#DDD] rounded px-2 py-1 text-[12px] outline-none focus:border-[#FF9900]"
                />
              </div>
              <button
                onClick={() => {
                  setParam('minPrice', minPrice);
                  setParam('maxPrice', maxPrice);
                }}
                className="mt-2 text-[12px] bg-gray-100 hover:bg-gray-200 border border-[#DDD] px-3 py-1 rounded transition"
              >
                Go
              </button>
            </div>

            {/* Avg Rating */}
            <div className="border-t border-[#DDD] pt-3">
              <h3 className="font-bold text-[13px] mb-2">Avg. Customer Review</h3>
              {[4, 3, 2, 1].map((r) => (
                <button
                  key={r}
                  onClick={() => setParam('minRating', r)}
                  className="flex items-center gap-1 text-[12px] text-[#007185] hover:text-[#C7511F] py-0.5"
                >
                  {'★'.repeat(r)}{'☆'.repeat(4 - r)} & Up
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Results ── */}
        <div className="md:col-span-9">
          {/* Top bar */}
          <div className="bg-white px-4 py-3 rounded-sm shadow-sm mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="md:hidden flex items-center gap-1 text-[13px] border border-[#DDD] px-3 py-1.5 rounded"
              >
                <Filter size={14} /> Filters
              </button>
              <div className="text-[14px] text-gray-700">
                {!loading && (
                  <>
                    <span className="font-bold">{pagination?.total || 0}</span>
                    {search && <> results for <span className="text-[#B12704] font-medium">"{search}"</span></>}
                    {category && <> in <span className="text-[#B12704] font-medium capitalize">{category.replace('-', ' ')}</span></>}
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[13px] text-gray-600">Sort by:</label>
              <select
                value={sort}
                onChange={(e) => setParam('sort', e.target.value)}
                className="border border-[#DDD] rounded px-2 py-1 text-[13px] outline-none focus:border-[#FF9900]"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            {(loading ? [...Array(12)] : products).map((p, i) =>
              loading ? <SkeletonCard key={i} /> : <ProductCard key={p.id} product={p} />
            )}
          </div>

          {/* Empty state */}
          {!loading && products.length === 0 && (
            <div className="bg-white p-10 text-center rounded-sm shadow-sm">
              <p className="text-xl text-gray-500 mb-2">No results found</p>
              <p className="text-[13px] text-gray-400">Try a different search term or clear the filters</p>
              <Link to="/" className="mt-4 inline-block text-[13px] text-[#007185] hover:underline">← Back to Home</Link>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="bg-white p-3 rounded-sm shadow-sm flex items-center justify-center gap-2 flex-wrap">
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setParam('page', i + 1)}
                  className={`w-9 h-9 rounded text-[13px] border transition ${page === i + 1 ? 'bg-[#FF9900] border-[#FF9900] text-white font-bold' : 'border-[#DDD] hover:border-gray-400 text-[#007185]'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
