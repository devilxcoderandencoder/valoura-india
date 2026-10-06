import { type FormEvent, type ReactNode, useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Brush, ClipboardList, House, Laptop, Menu, Minus, Plus, Search, Shirt, ShoppingBag, ShoppingCart, Smartphone, Sparkles, UserRound, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

const shopCategories = [
  { label: 'For You', icon: Sparkles },
  { label: 'Fashion', icon: Shirt },
  { label: 'Mobiles', icon: Smartphone },
  { label: 'Electronics', icon: Laptop },
  { label: 'Beauty', icon: Brush },
  { label: 'Home', icon: House },
];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('For You');
  const [query, setQuery] = useState('');
  const [bag, setBag] = useState<Record<number, number>>({});
  const [email, setEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Editable sample catalog — replace names, prices and descriptions with approved product data.
  const products = [
    { id: 1, name: 'The Nila carryall', type: 'Everyday objects', price: 2890, art: 'art-bag', mark: 'New shape', categories: ['Fashion'] },
    { id: 2, name: 'Sunday vessel no. 02', type: 'Objects for home', price: 1650, art: 'art-vase', mark: 'A little ritual', categories: ['Home'] },
    { id: 3, name: 'Afterglow scarf', type: 'Wear it your way', price: 2190, art: 'art-scarf', mark: 'Colour study', categories: ['Fashion'] },
    { id: 4, name: 'Soft light table lamp', type: 'Objects for home', price: 4350, art: 'art-lamp', mark: 'Just landed', categories: ['Electronics', 'Home'] },
  ];
  const visibleProducts = activeCategory === 'For You'
    ? products
    : products.filter((product) => product.categories.includes(activeCategory));
  const searchResults = useMemo(() => products.filter((product) => `${product.name} ${product.type}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const itemCount = Object.values(bag).reduce((sum, quantity) => sum + quantity, 0);
  const subtotal = products.reduce((sum, product) => sum + product.price * (bag[product.id] || 0), 0);
  const formatPrice = (value: number) => `₹${value.toLocaleString('en-IN')}`;
  const addToBag = (id: number) => setBag((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
  const changeQuantity = (id: number, change: number) => setBag((current) => {
    const next = { ...current, [id]: (current[id] || 0) + change };
    if (next[id] <= 0) delete next[id];
    return next;
  });
  const closePanels = () => { setMenuOpen(false); setSearchOpen(false); };
  const focusSearch = () => {
    setMenuOpen(false);
    setSearchOpen(true);
    window.requestAnimationFrame(() => document.getElementById('store-search')?.focus());
  };

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewsletterMessage('Add a valid email address to join the list.');
      setSubscribed(false);
      return;
    }
    setSubscribed(true);
    setNewsletterMessage('You’re on the list. We’ll keep this lovely and occasional.');
    setEmail('');
  }

  return (
    <div className="grain min-h-[100dvh] overflow-x-hidden">
      <div className="bg-[#34241f] px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[.17em] text-[#f5f0e7] sm:text-[11px]">
        A little something good, for the everyday
      </div>
      <header className="relative z-30 border-b border-[#d9d0c3] bg-[#f5f0e7]">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-14">
          <button className="flex items-center gap-2 text-[11px] uppercase tracking-[.14em] md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />} <span>{menuOpen ? 'Close' : 'Menu'}</span>
          </button>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#shop" onClick={() => setActiveCategory('For You')} className="nav-link">Shop all</a>
            <a href="#edits" className="nav-link">The edits</a>
            <a href="#story" className="nav-link">Our point of view</a>
          </nav>
          <a href="#" className="absolute left-1/2 -translate-x-1/2" aria-label="Valoura India home" data-testid="link-brand-logo">
            <img src={`${import.meta.env.BASE_URL}valoura-logo.png`} alt="Valoura India" className="h-[58px] w-[129px] object-contain md:h-[76px] md:w-[169px]" data-testid="img-brand-logo" />
          </a>
          <div className="ml-auto flex items-center gap-5">
            <button onClick={() => { if (searchOpen) setSearchOpen(false); else focusSearch(); }} aria-label={searchOpen ? 'Close search suggestions' : 'Search products'} className="hidden items-center gap-2 text-[11px] uppercase tracking-[.13em] sm:flex" data-testid="button-search">
              {searchOpen ? <X size={18} strokeWidth={1.5} /> : <Search size={18} strokeWidth={1.5} />} <span>{searchOpen ? 'Close' : 'Search'}</span>
            </button>
            <button onClick={() => setCartOpen(true)} aria-label={`Open bag, ${itemCount} items`} className="flex items-center gap-2 text-[11px] uppercase tracking-[.13em]" data-testid="button-open-bag">
              <ShoppingBag size={19} strokeWidth={1.5} /><span className="hidden sm:inline">Your bag</span><span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#cf4c32] px-1 text-[10px] text-[#fff8ee]" data-testid="text-bag-count">{itemCount}</span>
            </button>
          </div>
        </div>
        {menuOpen && <nav className="absolute inset-x-0 top-full z-40 border-b border-[#d9d0c3] bg-[#f5f0e7] px-6 py-7 shadow-xl md:hidden" aria-label="Mobile navigation">
          {['Shop all', 'The edits', 'Our point of view'].map((label, index) => <a key={label} href={['#shop', '#edits', '#story'][index]} onClick={() => { closePanels(); if (label === 'Shop all') setActiveCategory('For You'); }} className="flex items-center justify-between border-b border-[#d9d0c3] py-4 font-serif text-2xl">{label}<ArrowUpRight size={18} /></a>)}
          <button onClick={focusSearch} className="mt-5 flex items-center gap-3 text-sm"><Search size={18} /> Search the collection</button>
        </nav>}
      </header>

      <section className="relative z-20 border-b border-[#d9d0c3] bg-[#f5f0e7] px-4 py-3 sm:px-8" aria-label="Product search">
        <div className="relative mx-auto max-w-3xl">
          <form
            role="search"
            onSubmit={(event) => { event.preventDefault(); setSearchOpen(true); }}
            className="flex h-12 items-center gap-3 rounded-xl border border-[#e5ddd2] bg-white px-4 shadow-sm transition-shadow focus-within:shadow-md sm:h-14"
          >
            <Search size={20} strokeWidth={1.7} className="shrink-0 text-[#68564b]" aria-hidden="true" />
            <input
              id="store-search"
              type="search"
              autoComplete="off"
              value={query}
              onFocus={() => setSearchOpen(true)}
              onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); }}
              onKeyDown={(event) => { if (event.key === 'Escape') setSearchOpen(false); }}
              placeholder="Search products, colours and more..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#9c8c7d] sm:text-base"
              aria-label="Search products"
              aria-expanded={searchOpen}
              aria-controls="search-suggestions"
              data-testid="input-search"
            />
            {query && <button type="button" onClick={() => { setQuery(''); setSearchOpen(true); }} aria-label="Clear search" className="shrink-0 text-[10px] uppercase tracking-wider text-[#817268] hover:text-[#34241f]" data-testid="button-clear-search">Clear</button>}
            {searchOpen && <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search suggestions" className="shrink-0 rounded-full p-1 text-[#817268] hover:bg-[#f0e9df] hover:text-[#34241f]" data-testid="button-close-search"><X size={17} /></button>}
          </form>
          {searchOpen && <div id="search-suggestions" className="absolute inset-x-0 top-full z-40 mt-2 max-h-[55vh] overflow-y-auto rounded-xl border border-[#e5ddd2] bg-[#fffdfa] p-4 shadow-xl sm:p-5">
            <p className="mb-2 text-[10px] uppercase tracking-[.18em] text-[#817268]">{query ? `${searchResults.length} things to explore` : 'A few things to start with'}</p>
            {searchResults.length ? searchResults.map((product) => <button key={product.id} onClick={() => { setActiveCategory('For You'); setSearchOpen(false); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex w-full items-center justify-between gap-4 border-b border-[#eee7de] py-3 text-left text-sm last:border-b-0" data-testid={`search-result-${product.id}`}><span>{product.name}</span><span className="shrink-0 text-[#817268]">{formatPrice(product.price)}</span></button>) : <p className="py-3 text-sm text-[#817268]">Nothing here just yet. Try another word.</p>}
          </div>}
        </div>
      </section>

      <nav className="category-scroll border-b border-[#d9d0c3] bg-[#f5f0e7]" aria-label="Shop categories">
        <div className="mx-auto flex max-w-[1440px] snap-x snap-mandatory items-stretch overflow-x-auto px-2 sm:px-8 md:justify-center lg:px-14">
          {shopCategories.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setActiveCategory(label);
                document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
              }}
              aria-pressed={activeCategory === label}
              className={`flex w-[76px] flex-none snap-center flex-col items-center gap-1.5 border-b-2 py-3 text-[#817268] transition-colors hover:text-[#34241f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#cf4c32] md:w-[108px] md:gap-2 md:py-4 ${activeCategory === label ? 'border-[#cf4c32] text-[#34241f]' : 'border-transparent'}`}
              data-testid={`button-category-${label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
              <span className="whitespace-nowrap text-[9px] uppercase tracking-[.08em] sm:text-[10px]">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main>
        <section className="mx-auto grid max-w-[1440px] px-4 pt-4 sm:px-7 sm:pt-7 lg:grid-cols-[.88fr_1.12fr] lg:gap-4">
          <div className="relative flex min-h-[410px] flex-col justify-between overflow-hidden bg-[#e6d9c8] px-7 py-8 sm:min-h-[490px] sm:px-11 sm:py-12 lg:min-h-[630px] lg:px-14 lg:py-14">
            <div className="relative z-10 flex items-center gap-3 text-[10px] uppercase tracking-[.18em] text-[#68564b]"><span className="h-px w-8 bg-[#cf4c32]" /> A considered collection, from India</div>
            <div className="relative z-10 mt-10">
              <p className="mb-3 text-[10px] uppercase tracking-[.18em] text-[#68564b]">For the beautifully ordinary</p>
              <h1 className="serif max-w-[580px] text-[clamp(3.35rem,8vw,7.7rem)] leading-[.91] tracking-[-.065em]">Make room<br />for <em className="font-normal text-[#cf4c32]">wonder.</em></h1>
              <p className="mt-7 max-w-[330px] text-sm leading-6 text-[#63544c] sm:text-base">Little discoveries for how you dress, gather and make a place your own.</p>
              <a href="#shop" onClick={() => setActiveCategory('For You')} className="mt-8 inline-flex items-center gap-3 border-b border-[#34241f] pb-2 text-[11px] uppercase tracking-[.16em] transition-colors hover:border-[#cf4c32] hover:text-[#cf4c32]">Find your new favourite <ArrowRight size={16} /></a>
            </div>
            <div className="relative z-10 mt-10 flex items-end justify-between text-[10px] uppercase tracking-[.15em] text-[#68564b]"><span>Vol. 01 — Little pleasures</span><span>01 / 04</span></div>
            <span aria-hidden="true" className="serif absolute -bottom-12 -right-2 text-[190px] leading-none text-[#d9c4ad] opacity-60 sm:text-[260px]">V</span>
          </div>
          <div className="hero-image relative mt-3 min-h-[350px] overflow-hidden sm:min-h-[480px] lg:mt-0 lg:min-h-[630px]" role="img" aria-label="Editorial still life in a sunlit studio with colour, fabric and sculptural objects">
            <div className="absolute inset-0 bg-gradient-to-t from-[#34241f]/45 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-[#fff9ef] sm:bottom-9 sm:left-9 sm:right-9">
              <p className="serif max-w-[260px] text-3xl leading-[1.04] sm:text-4xl">Good things,<br /><em>found along the way.</em></p>
              <a href="#edits" aria-label="Discover the edits" className="grid h-12 w-12 place-items-center rounded-full border border-white/70 transition-colors hover:bg-white hover:text-[#34241f]"><ArrowDown size={19} /></a>
            </div>
            <span className="absolute right-5 top-5 text-[9px] uppercase tracking-[.19em] text-white">Objects with a point of view</span>
          </div>
        </section>

        <section className="overflow-hidden border-y border-[#d9d0c3] py-5">
          <div className="flex min-w-max animate-[marquee_26s_linear_infinite] items-center gap-8 text-[10px] uppercase tracking-[.19em] text-[#68564b] sm:gap-12 sm:text-[11px]">
            {Array.from({ length: 2 }, (_, index) => <span key={index} className="flex items-center gap-8 sm:gap-12">A good eye for the everyday <i className="h-1.5 w-1.5 rounded-full bg-[#cf4c32]" /> Objects to keep close <i className="h-1.5 w-1.5 rounded-full bg-[#cf4c32]" /> A little colour goes a long way <i className="h-1.5 w-1.5 rounded-full bg-[#cf4c32]" /> Valoura, with love <i className="h-1.5 w-1.5 rounded-full bg-[#cf4c32]" /></span>)}
          </div>
        </section>

        <section id="shop" className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-14">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5 sm:mb-12">
            <div><p className="mb-3 text-[10px] uppercase tracking-[.2em] text-[#cf4c32]">{activeCategory === 'For You' ? 'A few good finds' : `${activeCategory} edit`}</p><h2 className="serif text-4xl tracking-[-.04em] sm:text-6xl">{activeCategory === 'For You' ? 'Meet the new things.' : `Explore ${activeCategory.toLowerCase()}.`}</h2></div>
            <a href="#edits" className="group flex items-center gap-2 border-b border-[#34241f] pb-2 text-[10px] uppercase tracking-[.15em]">See what catches your eye <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></a>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
            {visibleProducts.map((product, index) => <article key={product.id} className="reveal group" style={{ animationDelay: `${index * 90}ms` }} data-testid={`card-product-${product.id}`}>
              <div className={`product-art ${product.art} relative aspect-[.78]`}>
                <span className="absolute left-3 top-3 z-10 bg-[#f5f0e7]/90 px-2.5 py-1.5 text-[9px] uppercase tracking-[.12em] sm:left-4 sm:top-4">{product.mark}</span>
                <button onClick={() => { addToBag(product.id); setCartOpen(true); }} aria-label={`Add ${product.name} to bag`} className="absolute bottom-3 right-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-[#f5f0e7] transition-colors hover:bg-[#cf4c32] hover:text-[#fff8ee] sm:bottom-4 sm:right-4" data-testid={`button-add-${product.id}`}><Plus size={19} strokeWidth={1.5} /></button>
              </div>
              <div className="flex items-start justify-between gap-2 pt-4"><div><p className="text-[9px] uppercase tracking-[.13em] text-[#817268] sm:text-[10px]">{product.type}</p><h3 className="serif mt-1 text-lg leading-tight sm:text-xl">{product.name}</h3></div><span className="pt-4 text-xs sm:text-sm">{formatPrice(product.price)}</span></div>
            </article>)}
            {!visibleProducts.length && <div className="col-span-full border border-[#d9d0c3] px-6 py-12 text-center sm:py-16" data-testid="empty-category">
              <p className="serif text-2xl">This edit is taking shape.</p>
              <p className="mt-2 text-sm text-[#817268]">There are no sample products in this category yet.</p>
              <button onClick={() => setActiveCategory('For You')} className="mt-5 border-b border-[#34241f] pb-1 text-[10px] uppercase tracking-[.15em]" data-testid="button-show-all-products">Explore all finds</button>
            </div>}
          </div>
          <p className="mt-8 text-[10px] text-[#817268]">A small selection to begin with. The collection is always finding its shape.</p>
        </section>

        <section id="edits" className="bg-[#d8e1d5] px-5 py-16 sm:px-8 sm:py-24 lg:px-14">
          <div className="mx-auto grid max-w-[1300px] items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div className="relative min-h-[340px] overflow-hidden bg-[#b9c9b8] sm:min-h-[470px]">
              <div className="absolute -left-5 top-10 h-64 w-64 rounded-full border border-[#526a5a]/40 sm:left-8 sm:h-80 sm:w-80" />
              <div className="absolute left-[23%] top-[14%] h-[70%] w-[53%] rotate-[-9deg] rounded-[48%_48%_7%_7%] bg-[#728774] shadow-[34px_22px_0_-7px_#e2af86]" />
              <span className="serif absolute bottom-4 right-5 text-[90px] leading-none text-[#f5f0e7] sm:bottom-5 sm:right-8 sm:text-[130px]">02</span>
              <span className="absolute left-5 top-5 text-[9px] uppercase tracking-[.2em]">The home edit</span>
            </div>
            <div className="max-w-[510px]">
              <p className="mb-4 text-[10px] uppercase tracking-[.2em] text-[#526a5a]">A room, a mood, a moment</p>
              <h2 className="serif text-[clamp(3rem,6vw,5.7rem)] leading-[.95] tracking-[-.06em]">Make it feel<br /><em className="font-normal">like yours.</em></h2>
              <p className="mt-6 max-w-[380px] text-sm leading-7 text-[#52645a] sm:text-base">The objects we keep close have a way of making a place our own. Start with one that makes you pause.</p>
              <a href="#shop" className="mt-8 inline-flex items-center gap-3 border-b border-[#34241f] pb-2 text-[10px] uppercase tracking-[.16em]">Explore the home edit <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </section>

        <section id="story" className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <div><p className="text-[10px] uppercase tracking-[.2em] text-[#cf4c32]">A note from Valoura</p><span className="serif mt-4 block text-8xl leading-none text-[#d5c3ae]">“</span></div>
            <div><p className="serif max-w-[850px] text-[clamp(2rem,4.2vw,4.3rem)] leading-[1.12] tracking-[-.035em]">The best things are rarely the loudest. They’re the ones you reach for again, the ones that make an ordinary Tuesday feel a little more <em className="font-normal text-[#cf4c32]">your own.</em></p><div className="mt-8 flex items-center gap-3 text-[10px] uppercase tracking-[.16em] text-[#817268]"><span className="h-px w-8 bg-[#cf4c32]" /> A point of view, not a rulebook</div></div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#cf4c32] px-5 py-16 text-[#fff8ee] sm:px-8 sm:py-24 lg:px-14">
          <div className="absolute -right-6 -top-16 select-none font-serif text-[260px] leading-none opacity-[.09] sm:right-20 sm:text-[380px]" aria-hidden="true">V</div>
          <div className="relative mx-auto grid max-w-[1300px] gap-9 lg:grid-cols-[1fr_.8fr] lg:items-end">
            <div><p className="mb-4 text-[10px] uppercase tracking-[.2em] text-[#f0c6ae]">Letters, very occasionally</p><h2 className="serif max-w-[600px] text-[clamp(2.8rem,6vw,6rem)] leading-[.95] tracking-[-.06em]">A little note<br />from <em className="font-normal">us to you.</em></h2></div>
            <form onSubmit={subscribe} className="max-w-[480px]" noValidate>
              <label htmlFor="newsletter-email" className="mb-3 block text-xs text-[#ffded0]">For new finds, little ideas and the occasional note.</label>
              <div className="flex border-b border-[#f0b29b] pb-2">
                <input id="newsletter-email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setNewsletterMessage(''); }} placeholder="Your email address" className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-[#f3baa6]" aria-describedby="newsletter-feedback" data-testid="input-newsletter-email" />
                <button type="submit" aria-label="Join the Valoura mailing list" className="ml-2 inline-flex items-center gap-2 text-[10px] uppercase tracking-[.15em] hover:text-[#34241f]" data-testid="button-newsletter"><span>Count me in</span><ArrowRight size={16} /></button>
              </div>
              <p id="newsletter-feedback" role="status" aria-live="polite" className="mt-3 min-h-5 text-xs text-[#ffded0]">{newsletterMessage || (subscribed ? 'You’re on the list.' : 'No backend is connected; this is a local preview.')}</p>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer-safe-space bg-[#34241f] px-5 py-10 text-[#f5f0e7] sm:px-8 sm:py-14 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col justify-between gap-10 border-b border-[#76645a] pb-10 sm:flex-row sm:items-end">
            <div><a href="#" className="font-serif text-4xl tracking-[-.06em]">valoura<span className="text-[#e27255]">.</span></a><p className="mt-3 text-xs text-[#c9b9a9]">A little wonder for the everyday.</p></div>
            <div className="flex gap-9 text-[10px] uppercase tracking-[.15em]"><a href="#shop" onClick={() => setActiveCategory('For You')} className="hover:text-[#e9a18a]">Shop</a><a href="#story" className="hover:text-[#e9a18a]">Our point of view</a><a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2 hover:text-[#e9a18a]">Back to top <ArrowDown size={13} className="rotate-180" /></a></div>
          </div>
          <div className="flex flex-col justify-between gap-3 pt-5 text-[9px] uppercase tracking-[.14em] text-[#b8a79a] sm:flex-row"><span>Valoura India</span><span>© 2025 Valoura. Here for the little things.</span></div>
        </div>
      </footer>

      <nav className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-30 mx-auto flex max-w-[520px] items-center rounded-full border border-[#e8e0d6] bg-[#fffdfa]/95 p-1.5 shadow-[0_4px_20px_rgba(52,36,31,0.12)] backdrop-blur md:hidden" aria-label="Bottom navigation" data-testid="bottom-navigation">
        <button
          type="button"
          onClick={() => {
            setAccountOpen(false);
            setOrdersOpen(false);
            setCartOpen(false);
            setMenuOpen(false);
            setSearchOpen(false);
            setActiveCategory('For You');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-current={!accountOpen && !ordersOpen && !cartOpen ? 'page' : undefined}
          className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-full text-[10px] transition-colors ${!accountOpen && !ordersOpen && !cartOpen ? 'bg-[#f0e9df] text-[#cf4c32]' : 'text-[#817268] hover:text-[#34241f]'}`}
          data-testid="bottom-nav-home"
        >
          <House size={21} strokeWidth={1.7} aria-hidden="true" />
          <span>Home</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setOrdersOpen(true);
            setAccountOpen(false);
            setCartOpen(false);
            setMenuOpen(false);
            setSearchOpen(false);
          }}
          aria-current={ordersOpen ? 'page' : undefined}
          className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-full text-[10px] transition-colors ${ordersOpen ? 'bg-[#f0e9df] text-[#cf4c32]' : 'text-[#817268] hover:text-[#34241f]'}`}
          data-testid="bottom-nav-orders"
        >
          <ClipboardList size={21} strokeWidth={1.7} aria-hidden="true" />
          <span>Orders</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setAccountOpen(true);
            setOrdersOpen(false);
            setCartOpen(false);
            setMenuOpen(false);
            setSearchOpen(false);
          }}
          aria-current={accountOpen ? 'page' : undefined}
          className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-full text-[10px] transition-colors ${accountOpen ? 'bg-[#f0e9df] text-[#cf4c32]' : 'text-[#817268] hover:text-[#34241f]'}`}
          data-testid="bottom-nav-account"
        >
          <UserRound size={21} strokeWidth={1.7} aria-hidden="true" />
          <span>Account</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setCartOpen(true);
            setAccountOpen(false);
            setOrdersOpen(false);
          }}
          aria-current={cartOpen ? 'page' : undefined}
          aria-label={`Cart, ${itemCount} items`}
          className={`relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-full text-[10px] transition-colors ${cartOpen ? 'bg-[#f0e9df] text-[#cf4c32]' : 'text-[#817268] hover:text-[#34241f]'}`}
          data-testid="bottom-nav-cart"
        >
          <span className="relative">
            <ShoppingCart size={21} strokeWidth={1.7} aria-hidden="true" />
            {itemCount > 0 && <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#cf4c32] px-1 text-[9px] leading-none text-white">{itemCount}</span>}
          </span>
          <span>Cart</span>
        </button>
      </nav>

      {accountOpen && <>
        <button className="fixed inset-0 z-40 bg-[#34241f]/35 md:hidden" aria-label="Close account panel" onClick={() => setAccountOpen(false)} />
        <section className="fixed inset-x-3 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-lg rounded-2xl border border-[#e8e0d6] bg-[#fffdfa] p-6 shadow-2xl md:hidden" role="dialog" aria-modal="true" aria-labelledby="account-panel-title" data-testid="account-panel">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[.16em] text-[#cf4c32]">Your Valoura</p>
              <h2 id="account-panel-title" className="serif mt-2 text-3xl">Account</h2>
            </div>
            <button onClick={() => setAccountOpen(false)} aria-label="Close account panel" className="rounded-full p-2 text-[#817268] hover:bg-[#f0e9df] hover:text-[#34241f]" data-testid="button-close-account"><X size={20} /></button>
          </div>
          <p className="mt-4 text-sm leading-6 text-[#817268]">Account sign-in isn’t available in this preview yet.</p>
        </section>
      </>}

      {ordersOpen && <>
        <button className="fixed inset-0 z-40 bg-[#34241f]/35 md:hidden" aria-label="Close orders panel" onClick={() => setOrdersOpen(false)} />
        <section className="fixed inset-x-3 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-lg rounded-2xl border border-[#e8e0d6] bg-[#fffdfa] p-6 shadow-2xl md:hidden" role="dialog" aria-modal="true" aria-labelledby="orders-panel-title" data-testid="orders-panel">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[.16em] text-[#cf4c32]">Your Valoura</p>
              <h2 id="orders-panel-title" className="serif mt-2 text-3xl">Orders</h2>
            </div>
            <button onClick={() => setOrdersOpen(false)} aria-label="Close orders panel" className="rounded-full p-2 text-[#817268] hover:bg-[#f0e9df] hover:text-[#34241f]" data-testid="button-close-orders"><X size={20} /></button>
          </div>
          <p className="serif mt-5 text-xl">Nothing to track yet.</p>
          <p className="mt-2 text-sm leading-6 text-[#817268]">Checkout isn’t available in this preview, so there are no orders to show.</p>
          <button onClick={() => { setOrdersOpen(false); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }} className="mt-5 border-b border-[#34241f] pb-1 text-[10px] uppercase tracking-[.15em]" data-testid="button-orders-shop">Explore the collection</button>
        </section>
      </>}

      {(cartOpen || (menuOpen && window.innerWidth < 768)) && <button className="fixed inset-0 z-40 cursor-default bg-[#34241f]/35" aria-label="Close overlay" onClick={() => { setCartOpen(false); setMenuOpen(false); }} />}
      <aside className={`fixed right-0 top-0 z-50 flex h-[100dvh] w-full max-w-[470px] flex-col bg-[#f5f0e7] shadow-2xl transition-transform duration-300 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`} aria-label="Shopping bag" aria-hidden={!cartOpen}>
        <div className="flex items-center justify-between border-b border-[#d9d0c3] px-6 py-5"><div><p className="text-[10px] uppercase tracking-[.18em] text-[#817268]">A good start</p><h2 className="serif mt-1 text-2xl">Your bag <span className="text-sm">({itemCount})</span></h2></div><button onClick={() => setCartOpen(false)} aria-label="Close bag" data-testid="button-close-bag"><X size={22} /></button></div>
        {itemCount === 0 ? <div className="flex flex-1 flex-col items-center justify-center px-10 text-center"><div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-[#e9e0d4]"><ShoppingBag size={29} strokeWidth={1.3} /></div><p className="serif text-3xl">Nothing in here yet.</p><p className="mt-3 max-w-[270px] text-sm leading-6 text-[#817268]">Good things are waiting to be found. Take another look around.</p><button onClick={() => setCartOpen(false)} className="mt-7 border-b border-[#34241f] pb-2 text-[10px] uppercase tracking-[.16em]">Keep exploring <ArrowRight size={14} className="ml-2 inline" /></button></div> : <>
          <div className="flex-1 overflow-y-auto px-6">
            {products.filter((product) => bag[product.id]).map((product) => <div key={product.id} className="flex gap-4 border-b border-[#d9d0c3] py-5" data-testid={`cart-item-${product.id}`}>
              <div className={`product-art ${product.art} aspect-square w-24 shrink-0`} />
              <div className="flex min-w-0 flex-1 flex-col justify-between py-1"><div><h3 className="serif text-lg leading-tight">{product.name}</h3><p className="mt-1 text-xs">{formatPrice(product.price)}</p></div><div className="flex items-center justify-between"><div className="flex items-center gap-3 border border-[#d9d0c3] px-2 py-1"><button onClick={() => changeQuantity(product.id, -1)} aria-label={`Decrease ${product.name} quantity`} data-testid={`button-quantity-minus-${product.id}`}><Minus size={13} /></button><span className="min-w-4 text-center text-xs" data-testid={`text-quantity-${product.id}`}>{bag[product.id]}</span><button onClick={() => changeQuantity(product.id, 1)} aria-label={`Increase ${product.name} quantity`} data-testid={`button-quantity-plus-${product.id}`}><Plus size={13} /></button></div><button onClick={() => setBag((current) => { const next = { ...current }; delete next[product.id]; return next; })} className="text-[10px] uppercase tracking-[.1em] text-[#817268] underline underline-offset-4" data-testid={`button-remove-${product.id}`}>Remove</button></div></div>
            </div>)}
          </div>
          <div className="border-t border-[#d9d0c3] px-6 py-5"><div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><p className="mt-2 text-xs leading-5 text-[#817268]">This is a preview bag. Checkout is not available here.</p><button onClick={() => setCartOpen(false)} className="mt-5 flex w-full items-center justify-center gap-2 bg-[#34241f] px-5 py-4 text-[10px] uppercase tracking-[.16em] text-[#f5f0e7] transition-colors hover:bg-[#cf4c32]" data-testid="button-continue-shopping">Keep looking <ArrowRight size={15} /></button></div>
        </>}
      </aside>
    </div>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
