import Link from "next/link";

export type FilterOptions = {
  materials: string[];
  finishes: string[];
  colors: string[];
  sizes: string[];
  categories?: { slug: string; name: string }[];
  brands?: { slug: string; name: string }[];
};

export type FilterValues = {
  q?: string;
  category?: string;
  brand?: string;
  size?: string;
  material?: string;
  finish?: string;
  color?: string;
  minPrice?: string;
  maxPrice?: string;
  featured?: string;
  newArrival?: string;
  sort?: string;
};

type Props = {
  options: FilterOptions;
  values: FilterValues;
  basePath?: string;
};

export function ProductFilters({ options, values, basePath = "/products" }: Props) {
  return (
    <form className="filters-panel" method="GET" action={basePath}>
      <div className="filters-grid">
        <div className="filter-group">
          <label htmlFor="q">Search</label>
          <input id="q" name="q" type="search" defaultValue={values.q ?? ""} placeholder="Product name..." />
        </div>

        {options.categories && options.categories.length > 0 && (
          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" defaultValue={values.category ?? ""}>
              <option value="">All Categories</option>
              {options.categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {options.brands && options.brands.length > 0 && (
          <div className="filter-group">
            <label htmlFor="brand">Brand</label>
            <select id="brand" name="brand" defaultValue={values.brand ?? ""}>
              <option value="">All Brands</option>
              {options.brands.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="filter-group">
          <label htmlFor="size">Size</label>
          <select id="size" name="size" defaultValue={values.size ?? ""}>
            <option value="">Any Size</option>
            {options.sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="material">Material</label>
          <select id="material" name="material" defaultValue={values.material ?? ""}>
            <option value="">Any Material</option>
            {options.materials.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="finish">Finish</label>
          <select id="finish" name="finish" defaultValue={values.finish ?? ""}>
            <option value="">Any Finish</option>
            {options.finishes.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="color">Color</label>
          <select id="color" name="color" defaultValue={values.color ?? ""}>
            <option value="">Any Color</option>
            {options.colors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="minPrice">Min Price (₹)</label>
          <input id="minPrice" name="minPrice" type="number" min={0} defaultValue={values.minPrice ?? ""} />
        </div>

        <div className="filter-group">
          <label htmlFor="maxPrice">Max Price (₹)</label>
          <input id="maxPrice" name="maxPrice" type="number" min={0} defaultValue={values.maxPrice ?? ""} />
        </div>

        <div className="filter-group">
          <label htmlFor="featured">Featured</label>
          <select id="featured" name="featured" defaultValue={values.featured ?? ""}>
            <option value="">All</option>
            <option value="1">Featured Only</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="newArrival">New Arrival</label>
          <select id="newArrival" name="newArrival" defaultValue={values.newArrival ?? ""}>
            <option value="">All</option>
            <option value="1">New Arrivals Only</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort">Sort By</label>
          <select id="sort" name="sort" defaultValue={values.sort ?? "newest"}>
            <option value="newest">Newest</option>
            <option value="featured">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      <div className="filter-actions">
        <button type="submit" className="btn-primary">
          Apply Filters
        </button>
        <Link href={basePath} className="btn-secondary">
          Clear
        </Link>
      </div>
    </form>
  );
}
