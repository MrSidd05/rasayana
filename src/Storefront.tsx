import { AnchorHTMLAttributes, FormEvent, useEffect, useMemo, useRef, useState } from 'react'

export type StoreProduct = {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  mrp: number
  weight: string
  intensity: number
  palette: string
  packSizes: { label: string; price: number }[]
  snacks: string[]
  ingredients: string | null
  nutrition: string | null
  allergens: string | null
  shelfLife: string | null
  storage: string | null
  image: string
  bottleImage: string
}

type CartItem = StoreProduct & { quantity: number }
type Props = {
  products: StoreProduct[]
  heroImage: { url: string; alt: string; width: number; height: number; productId?: string } | null
  ideas: { id: string; name: string; description: string; votes: number; status: string }[]
  announcements: { id: string; title: string; description: string; dateLabel: string }[]
}

const palette: Record<string, { bg: string; accent: string; label: string }> = {
  chilli: { bg: 'from-[#fb634b] to-[#b91f1f]', accent: '#ffd34f', label: 'HOT + TANGY' },
  ember: { bg: 'from-[#f08b39] to-[#9f321f]', accent: '#ffe0ad', label: 'SMOKY' },
  lemon: { bg: 'from-[#f7d14b] to-[#c2a51e]', accent: '#335834', label: 'BRIGHT' },
  pickle: { bg: 'from-[#9aa63d] to-[#405c2e]', accent: '#f9d95e', label: 'TANGY' },
  crimson: { bg: 'from-[#e43f31] to-[#7d1015]', accent: '#ffca45', label: 'EXTRA HOT' },
  fiesta: { bg: 'from-[#e77432] to-[#b93625]', accent: '#ffe062', label: 'ZESTY' },
  pepper: { bg: 'from-[#e6c842] to-[#817b30]', accent: '#22201e', label: 'CITRUS' },
  coast: { bg: 'from-[#4b8a62] to-[#244936]', accent: '#f2c14d', label: 'AROMATIC' },
}

function Link(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} />
}

function Icon({ name, className = 'h-5 w-5' }: { name: 'bag' | 'heart' | 'user' | 'menu' | 'close' | 'arrow' | 'plus' | 'minus' | 'search'; className?: string }) {
  const paths = {
    bag: <><path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    minus: <path d="M5 12h14"/>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  }
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function Canister({ product, hero = false }: { product: StoreProduct; hero?: boolean }) {
  const tone = palette[product.palette] || palette.chilli
  return (
    <div className={`relative mx-auto ${hero ? 'h-72 w-44 md:h-[25rem] md:w-60' : 'h-56 w-36'} spice-float`}>
      <div className={`can-shadow absolute inset-x-2 bottom-2 top-7 overflow-hidden rounded-[2.4rem] bg-gradient-to-br ${tone.bg}`}>
        <div className="absolute inset-x-0 top-0 h-12 rounded-t-[2.4rem] border-b border-white/20 bg-white/10" />
        <div className="absolute inset-x-3 top-[42%] -rotate-3 rounded-xl border border-white/25 bg-[#fffaf0] px-2 py-3 text-center text-[#231f1b] shadow-lg">
          <span className="block text-[9px] font-extrabold tracking-[.18em]">RASAYANA</span>
          <strong className={`font-display mt-1 block leading-none ${hero ? 'text-3xl' : 'text-xl'}`}>{product.name}</strong>
          <span className="mt-2 block text-[8px] font-bold tracking-[.16em]" style={{ color: tone.accent }}>{tone.label}</span>
        </div>
      </div>
      <div className="absolute inset-x-0 top-3 h-10 rounded-full border border-black/10 bg-[#ddd4c5] shadow-md">
        <div className="mx-3 mt-2 h-3 rounded-full bg-white/50" />
      </div>
      <div className="absolute inset-x-8 bottom-0 h-5 rounded-[50%] bg-black/20 blur-md" />
    </div>
  )
}

export default function Storefront({ products, heroImage, ideas, announcements }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [selected, setSelected] = useState<StoreProduct | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<StoreProduct[]>([])
  const [toast, setToast] = useState('')
  const [newsletter, setNewsletter] = useState(false)
  const [ideaSubmitted, setIdeaSubmitted] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)
  const [heroMotion, setHeroMotion] = useState<'idle' | 'sprinkle' | 'shake'>('idle')
  const heroTimer = useRef<number | null>(null)
  const heroProduct = products[heroIndex % Math.max(products.length, 1)]

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem('rasayana-cart') || '[]'))
      setWishlist(JSON.parse(localStorage.getItem('rasayana-wishlist') || '[]'))
    } catch { /* Ignore malformed demo storage. */ }
  }, [])

  useEffect(() => { localStorage.setItem('rasayana-cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { localStorage.setItem('rasayana-wishlist', JSON.stringify(wishlist)) }, [wishlist])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2400)
    return () => window.clearTimeout(timer)
  }, [toast])
  useEffect(() => () => {
    if (heroTimer.current) window.clearTimeout(heroTimer.current)
  }, [])

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const addToCart = (product: StoreProduct) => {
    setCart((current) => current.some((item) => item.id === product.id)
      ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...current, { ...product, quantity: 1 }])
    setToast(`${product.name} added to your bowl`)
  }
  const toggleWishlist = (product: StoreProduct) => {
    setWishlist((current) => current.some((item) => item.id === product.id)
      ? current.filter((item) => item.id !== product.id)
      : [...current, product])
    setToast('Wishlist updated')
  }
  const updateQuantity = (id: string, delta: number) => setCart((current) => current
    .map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
    .filter((item) => item.quantity > 0))

  const submitNewsletter = (event: FormEvent) => {
    event.preventDefault()
    setNewsletter(true)
  }
  const submitIdea = (event: FormEvent) => {
    event.preventDefault()
    setIdeaSubmitted(true)
  }
  const sprinkleHero = () => {
    if (!heroProduct || heroMotion !== 'idle') return
    setHeroMotion('sprinkle')
    heroTimer.current = window.setTimeout(() => setHeroMotion('idle'), 1100)
  }
  const shakeHero = () => {
    if (!products.length || heroMotion !== 'idle') return
    setHeroMotion('shake')
    heroTimer.current = window.setTimeout(() => {
      setHeroIndex((current) => (current + 1) % products.length)
      setHeroMotion('idle')
    }, 700)
  }

  return (
    <main className="overflow-hidden">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-black/10 bg-[#f7f1e7]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[92rem] items-center justify-between px-5 lg:px-10">
          <Link href="#home" className="font-display text-3xl tracking-tight">Rasayana<span className="text-[#d93b2b]">.</span></Link>
          <nav className="hidden items-center gap-7 text-sm font-bold lg:flex">
            <Link href="#home" className="hover:text-[#d93b2b]">Home</Link>
            <Link href="#story" className="hover:text-[#d93b2b]">Founders</Link>
            <Link href="#flavours" className="hover:text-[#d93b2b]">Our Flavours</Link>
            <Link href="#community" className="hover:text-[#d93b2b]">Community</Link>
            <Link href="#contact" className="hover:text-[#d93b2b]">Contact</Link>
          </nav>
          <div className="flex items-center gap-1">
            <button onClick={() => setAuthOpen(true)} aria-label="Open account" className="hidden min-h-11 items-center gap-2 rounded-full px-3 text-sm font-bold hover:bg-black/5 sm:flex"><Icon name="user" /> Login</button>
            <button onClick={() => setWishlistOpen(true)} aria-label={`Open wishlist with ${wishlist.length} items`} className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-black/5"><Icon name="heart" />{wishlist.length > 0 && <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-[#f2bc3a] px-1 text-[10px] font-black">{wishlist.length}</span>}</button>
            <button onClick={() => setCartOpen(true)} aria-label={`Open cart with ${itemCount} items`} className="relative grid h-11 w-11 place-items-center rounded-full bg-[#231f1b] text-white"><Icon name="bag" />{itemCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#d93b2b] px-1 text-[10px] font-black">{itemCount}</span>}</button>
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" className="grid h-11 w-11 place-items-center rounded-full lg:hidden"><Icon name={menuOpen ? 'close' : 'menu'} /></button>
          </div>
        </div>
        {menuOpen && <nav className="border-t border-black/10 bg-[#f7f1e7] p-5 lg:hidden">{['Home', 'Story', 'Flavours', 'Community', 'Contact'].map((item) => <Link key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="block border-b border-black/10 py-4 text-xl font-bold">{item}</Link>)}</nav>}
      </header>

      <section id="home" className="relative min-h-screen bg-[#e7c94d] pt-28">
        <div className="grain absolute inset-0 opacity-50" />
        <div className="absolute -left-24 top-32 h-80 w-80 rounded-full border border-black/10" />
        <div className="absolute right-12 top-28 hidden h-24 w-24 rounded-full border-2 border-dashed border-black/20 lg:block spice-orbit" />
        <div className="relative mx-auto grid min-h-[calc(100vh-7rem)] max-w-[92rem] items-center gap-10 px-5 pb-16 lg:grid-cols-[1.05fr_.95fr] lg:px-10">
          <div className="z-10 max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-black/15 bg-white/40 px-4 py-2 text-xs font-extrabold tracking-[.18em]"><span className="h-2 w-2 rounded-full bg-[#d93b2b]" /> HAR CRAVING KA SWAAD</div>
            <h1 className="font-display text-balance text-6xl leading-[.92] tracking-tight sm:text-7xl lg:text-[6.8rem]">Same Snack.<br />New Mood.<br /><em className="text-[#d93b2b]">Full Swaad.</em></h1>
            <p className="mt-7 max-w-xl text-lg font-medium leading-8">Bored of the same old popcorn, makhana or chips? Start with the snack you trust, sprinkle the flavour you crave and make every bite chatpata—without paying extra for another flavoured packet.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="#flavours" className="group flex min-h-14 items-center gap-3 rounded-full bg-[#231f1b] px-7 text-sm font-extrabold tracking-wide text-white transition hover:-translate-y-1">SHOP THE SWAAD <Icon name="arrow" className="h-5 w-5 transition group-hover:translate-x-1" /></Link>
              <Link href="#story" className="flex min-h-14 items-center rounded-full border-2 border-[#231f1b] px-7 text-sm font-extrabold tracking-wide hover:bg-white/30">DISCOVER OUR STORY</Link>
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[.18em]">Demo catalogue pricing • Final specifications pending verification</p>
          </div>
          <div className="hero-stage relative min-h-[31rem]">
            <div className="hero-bottle-backdrop absolute inset-8 overflow-hidden rounded-[3rem] border border-black/10">
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10" />
              <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10" />
              <div className="grain absolute inset-0 opacity-35" />
            </div>
            {heroProduct && <div className="absolute inset-0">
              <div className={`hero-canister-motion absolute inset-x-8 bottom-5 top-1 flex items-center justify-center ${heroMotion === 'sprinkle' ? 'is-sprinkling' : ''} ${heroMotion === 'shake' ? 'is-shaking' : ''}`}>
                <div key={heroProduct.id} className="hero-product-enter flex h-full w-full items-center justify-center"><img src={heroProduct.bottleImage} alt={`${heroProduct.name} seasoning bottle`} className="hero-bottle-image h-full w-full object-contain" /></div>
              </div>
              {heroMotion === 'sprinkle' && <div className="spice-sprinkle-stream" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <span key={index} />)}</div>}
              <div aria-live="polite" className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#231f1b]/90 px-4 py-2 text-[10px] font-black tracking-[.14em] text-white shadow-lg">FLAVOUR {String(heroIndex + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')} · {heroProduct.name.toUpperCase()}</div>
            </div>}
            <button type="button" onClick={sprinkleHero} disabled={heroMotion !== 'idle'} aria-label={`Sprinkle ${heroProduct?.name || 'seasoning'}`} className="spice-float-delayed absolute left-3 top-14 z-20 rounded-full bg-[#d93b2b] px-5 py-4 text-sm font-black text-white shadow-xl transition hover:scale-110 disabled:cursor-wait">Sprinkle</button>
            <button type="button" onClick={shakeHero} disabled={heroMotion !== 'idle'} aria-label={`Shake the ${heroProduct?.name || 'seasoning'} bottle`} className="spice-float absolute bottom-28 right-0 z-20 rounded-full bg-[#315b43] px-5 py-4 text-sm font-black text-white shadow-xl transition hover:scale-110 disabled:cursor-wait">Shake</button>
          </div>
        </div>
        <div className="overflow-hidden border-y border-black/15 bg-[#231f1b] py-4 text-[#f7f1e7]">
          <div className="marquee flex w-max gap-12 whitespace-nowrap text-sm font-extrabold tracking-[.13em]">{[...Array(2)].flatMap(() => ['SPRINKLE YOUR SWAAD', 'ONE SNACK, MANY MOODS', 'PARTY KA TALKING POINT', 'DIL SE, PET TAK']).map((item, index) => <span key={`${item}-${index}`} className="flex items-center gap-12">{item}<span className="text-[#f2bc3a]">✦</span></span>)}</div>
        </div>
      </section>

      <section id="story" className="bg-[#f7f1e7] px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[92rem]">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-extrabold tracking-[.2em] text-[#d93b2b]">01 / FOUNDERS CORNER</p>
              <h2 className="font-display mt-5 text-5xl leading-none sm:text-7xl">Dil Se.<br /><em>Pet Tak.</em></h2>
            </div>
            <div className="max-w-xl lg:pt-12">
              <p className="text-2xl font-bold leading-snug">Why let one packet choose your taste—or pay extra every time your craving changes?</p>
              <p className="mt-5 leading-7 text-[#756b61]">Buy your favourite snack plain, roast a lighter batch at home or begin with unsalted popcorn, makhana, chips and nuts. Unwrap Rasayana, sprinkle your swaad, shake it well and enjoy any flavour your mood demands. From solo cravings to house parties, one thing stays sabse zyada in charcha: the taste that travels dil se, pet tak.</p>
            </div>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {[1, 2].map((founder) => <article key={founder} className="group grid min-h-80 overflow-hidden rounded-[2rem] border border-black/10 bg-[#fffaf0] sm:grid-cols-[.8fr_1.2fr]">
              <div className="relative grid min-h-64 place-items-center overflow-hidden bg-[#e9dfd0]">
                <div className="h-32 w-32 rounded-full border-4 border-[#fffaf0] bg-[#d7c7b4] shadow-xl" />
                <span className="absolute bottom-5 text-xs font-bold uppercase tracking-[.15em]">Photo placeholder</span>
              </div>
              <div className="flex flex-col justify-between p-7">
                <div><p className="text-xs font-bold uppercase tracking-[.15em] text-[#d93b2b]">Founder {founder}</p><h3 className="font-display mt-3 text-3xl">Name to be added</h3><p className="mt-2 text-sm text-[#756b61]">Designation and verified professional background</p></div>
                <div><p className="mb-5 text-sm leading-6">Founder introduction, relevant experience and expertise will be added after approval.</p><span className="text-sm font-extrabold underline underline-offset-4">LinkedIn profile pending</span></div>
              </div>
            </article>)}
          </div>
        </div>
      </section>

      <section id="flavours" className="bg-[#231f1b] px-5 py-24 text-[#f7f1e7] lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[92rem]">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div><p className="text-xs font-extrabold tracking-[.2em] text-[#f2bc3a]">02 / THE SWAAD SHELF</p><h2 className="font-display mt-5 max-w-3xl text-5xl leading-none sm:text-7xl">Cravings Badlein.<br /><em>Swaad Bhi.</em></h2></div>
            <p className="max-w-sm text-lg text-white/60">One plain snack. Eight chatpata possibilities. Pick, sprinkle, shake and make it yours.</p>
          </div>
          {products.length ? <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => {
              const liked = wishlist.some((item) => item.id === product.id)
              return <article key={product.id} className="group overflow-hidden rounded-[2rem] bg-[#fffaf0] text-[#231f1b] transition duration-500 hover:-translate-y-2">
                <div role="button" tabIndex={0} onClick={() => setSelected(product)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setSelected(product) }} className="relative block w-full cursor-pointer overflow-hidden bg-[#eadfcd] pt-8" aria-label={`View ${product.name}`}>
                  <span className="absolute left-5 top-5 rounded-full bg-white/70 px-3 py-2 text-[10px] font-black tracking-[.12em]">0{index + 1}</span>
                  <button onClick={(event) => { event.stopPropagation(); toggleWishlist(product) }} aria-label={`${liked ? 'Remove' : 'Add'} ${product.name} ${liked ? 'from' : 'to'} wishlist`} className={`absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full ${liked ? 'bg-[#d93b2b] text-white' : 'bg-white/70'}`}><Icon name="heart" /></button>
                  <img src={product.bottleImage} alt={`${product.name} snack seasoning bottle`} className="aspect-[1.19/1] w-full object-contain p-4 transition duration-500 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3"><div><h3 className="font-display text-3xl">{product.name}</h3><p className="mt-2 min-h-10 text-sm leading-5 text-[#756b61]">{product.shortDescription}</p></div><p className="text-lg font-black">₹{product.price}</p></div>
                  <div className="mt-4 flex items-center justify-between text-xs font-bold"><span>{product.weight}</span><span className="flex gap-1" aria-label={`Intensity ${product.intensity} of 5`}>{[1,2,3,4,5].map((level) => <i key={level} className={`h-2 w-2 rounded-full ${level <= product.intensity ? 'bg-[#d93b2b]' : 'bg-black/15'}`} />)}</span></div>
                  <div className="mt-5 grid grid-cols-[1fr_auto] gap-2"><button onClick={() => setSelected(product)} className="min-h-12 rounded-full border border-black/15 px-4 text-xs font-extrabold">VIEW PRODUCT</button><button onClick={() => addToCart(product)} aria-label={`Quick add ${product.name}`} className="grid h-12 w-12 place-items-center rounded-full bg-[#231f1b] text-white transition group-hover:bg-[#d93b2b]"><Icon name="plus" /></button></div>
                </div>
              </article>
            })}
          </div> : <div className="mt-16 rounded-[2rem] border border-white/15 p-12 text-center"><p className="font-display text-3xl">The flavour shelf is being stocked.</p><p className="mt-3 text-white/60">Products added in Payload will appear here automatically.</p></div>}
        </div>
      </section>

      <section className="bg-[#d93b2b] px-5 py-24 text-white lg:px-10">
        <div className="mx-auto max-w-[92rem]">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div><p className="text-xs font-extrabold tracking-[.2em] text-[#ffd9a2]">YOUR SNACK, YOUR SWAAD</p><h2 className="font-display mt-5 text-5xl leading-none sm:text-7xl">Four steps.<br /><em>Endless cravings.</em></h2></div>
            <div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/20 bg-white/20 sm:grid-cols-2">
              {[
                ['01', 'Buy it plain or make your favourite unsalted snack.'],
                ['02', 'Unwrap Rasayana and sprinkle as much swaad as you like.'],
                ['03', 'Mix it, shake it and let every bite get chatpata.'],
                ['04', 'Serve, share and make your gathering the talk of the town.'],
              ].map(([number, text]) => <div key={number} className="min-h-48 bg-[#d93b2b] p-7"><span className="font-display text-5xl text-[#f2bc3a]">{number}</span><p className="mt-7 text-lg font-bold">{text}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="community" className="bg-[#315b43] px-5 py-24 text-white lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[92rem]">
          <div className="text-center"><p className="text-xs font-extrabold tracking-[.2em] text-[#f2bc3a]">03 / COMMUNITY SWAAD LAB</p><h2 className="font-display mx-auto mt-5 max-w-4xl text-5xl leading-none sm:text-7xl">Jo Aap Crave Karein,<br /><em>Woh Hum Banayein.</em></h2><p className="mx-auto mt-6 max-w-2xl text-white/70">Tell us the flavour your tastebuds are asking for. Rally the community—300 votes starts an internal review for Rasayana&apos;s next chatpata creation.</p></div>
          <div className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {(ideas.length ? ideas : [
                { id: 'demo-1', name: 'Nimbu Pudina Pop', description: 'A bright mint and lime direction for summer popcorn.', votes: 185, status: 'published' },
                { id: 'demo-2', name: 'Chettinad Crunch', description: 'A warm, aromatic idea for banana chips and peanuts.', votes: 264, status: 'published' },
              ]).map((idea) => <article key={idea.id} className="rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur">
                <div className="flex items-center justify-between"><span className="rounded-full bg-[#f2bc3a] px-3 py-2 text-[10px] font-black text-[#231f1b]">{idea.status === 'under-review' ? 'UNDER REVIEW' : 'COMMUNITY IDEA'}</span><span className="text-sm font-black">{idea.votes}/300</span></div>
                <h3 className="font-display mt-7 text-3xl">{idea.name}</h3><p className="mt-3 min-h-12 text-sm leading-6 text-white/65">{idea.description}</p>
                <div className="mt-6 h-2 overflow-hidden rounded-full bg-black/20"><div className="h-full rounded-full bg-[#f2bc3a]" style={{ width: `${Math.min(100, (idea.votes / 300) * 100)}%` }} /></div>
                <button onClick={() => setAuthOpen(true)} className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/25 text-sm font-extrabold hover:bg-white/10"><Icon name="heart" /> SUPPORT IDEA</button>
              </article>)}
            </div>
            <form onSubmit={submitIdea} className="rounded-[2rem] bg-[#fffaf0] p-7 text-[#231f1b] sm:p-9">
              <p className="text-xs font-extrabold tracking-[.16em] text-[#d93b2b]">PITCH YOUR FLAVOUR</p><h3 className="font-display mt-3 text-4xl">What should we make next?</h3>
              {ideaSubmitted ? <div className="mt-8 rounded-2xl bg-[#315b43]/10 p-6"><p className="font-bold">Idea saved in demo mode.</p><p className="mt-2 text-sm text-[#756b61]">Sign in will be required before live community submission is enabled.</p></div> : <div className="mt-7 space-y-4">
                <label className="block text-sm font-bold">Flavour name<input required className="mt-2 min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 font-normal" placeholder="e.g. Nimbu Pudina Pop" /></label>
                <label className="block text-sm font-bold">Describe the flavour<textarea required className="mt-2 min-h-28 w-full rounded-xl border border-black/15 bg-white p-4 font-normal" placeholder="What should it taste like?" /></label>
                <label className="block text-sm font-bold">Best snack matches<input className="mt-2 min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 font-normal" placeholder="Popcorn, chips, peanuts..." /></label>
                <button className="min-h-13 w-full rounded-full bg-[#d93b2b] px-6 text-sm font-extrabold text-white">SUBMIT IDEA</button>
              </div>}
            </form>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f1e7] px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[92rem]">
          <div className="grid gap-12 lg:grid-cols-2">
            <div><p className="text-xs font-extrabold tracking-[.2em] text-[#d93b2b]">04 / TASTE TESTED</p><h2 className="font-display mt-5 text-5xl leading-none sm:text-7xl">Snack stories,<br /><em>straight from the bowl.</em></h2></div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['“One bowl of makhana, three different moods—without buying three expensive packets.”', 'Demo review — unverified'],
                ['“Rasayana Peri Peri on popcorn is now the most in-charcha part of movie night.”', 'Demo review — unverified'],
              ].map(([quote, by]) => <blockquote key={quote} className="rounded-[2rem] border border-black/10 bg-[#fffaf0] p-7"><div className="text-[#d93b2b]">★★★★★</div><p className="font-display mt-5 text-2xl leading-snug">{quote}</p><footer className="mt-6 text-xs font-bold uppercase tracking-[.14em] text-[#756b61]">{by}</footer></blockquote>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f2bc3a] px-5 py-24 lg:px-10">
        <div className="mx-auto grid max-w-[92rem] gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div><p className="text-xs font-extrabold tracking-[.2em]">05 / COMING SOON</p><h2 className="font-display mt-5 text-5xl leading-none sm:text-7xl">Stay in the<br /><em>Swaad Loop!</em></h2><p className="mt-6 max-w-md leading-7">Be first to hear about chatpata launches, flavour experiments and the cravings Rasayana is turning into reality.</p></div>
          <div>
            {announcements.length > 0 && <div className="mb-5 grid gap-4 sm:grid-cols-3">{announcements.map((item) => <article key={item.id} className="rounded-2xl bg-[#fffaf0] p-5"><p className="text-xs font-black uppercase tracking-wider text-[#d93b2b]">{item.dateLabel}</p><h3 className="font-display mt-4 text-2xl">{item.title}</h3><p className="mt-2 text-sm text-[#756b61]">{item.description}</p></article>)}</div>}
            <form onSubmit={submitNewsletter} className="rounded-[2rem] bg-[#231f1b] p-7 text-white sm:p-10">
              {newsletter ? <div><p className="font-display text-4xl">You&apos;re on the list.</p><p className="mt-3 text-white/60">Demo confirmation only. Live email delivery will require an approved provider.</p></div> : <><label className="text-sm font-bold" htmlFor="newsletter-email">Email address</label><div className="mt-3 flex flex-col gap-3 sm:flex-row"><input id="newsletter-email" type="email" required className="min-h-14 flex-1 rounded-full border border-white/20 bg-white/10 px-6 text-white placeholder:text-white/40" placeholder="you@example.com" /><button className="min-h-14 rounded-full bg-[#d93b2b] px-7 text-sm font-extrabold">JOIN THE LOOP</button></div><p className="mt-4 text-xs text-white/45">By subscribing, you agree to receive Rasayana updates. Unsubscribe anytime.</p></>}
            </form>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[#f7f1e7] px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-[92rem] gap-14 lg:grid-cols-2">
          <div><p className="text-xs font-extrabold tracking-[.2em] text-[#d93b2b]">06 / SAY HELLO</p><h2 className="font-display mt-5 text-5xl leading-none sm:text-7xl">Let&apos;s talk<br /><em>flavour.</em></h2><div className="mt-10 space-y-4 text-[#756b61]"><p><strong className="text-[#231f1b]">Email</strong><br />Company email to be added</p><p><strong className="text-[#231f1b]">Phone</strong><br />Business number to be added</p><p><strong className="text-[#231f1b]">Address</strong><br />Registered address to be added</p></div><div className="mt-10 grid h-56 place-items-center rounded-[2rem] border border-dashed border-black/20 bg-[#e9dfd0] text-sm font-bold text-[#756b61]">Google Maps location placeholder</div></div>
          <form onSubmit={(event) => { event.preventDefault(); setToast('Message saved in demo mode') }} className="rounded-[2rem] border border-black/10 bg-[#fffaf0] p-7 sm:p-10">
            <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold">Name<input required className="mt-2 min-h-12 w-full rounded-xl border border-black/15 px-4 font-normal" /></label><label className="text-sm font-bold">Email<input type="email" required className="mt-2 min-h-12 w-full rounded-xl border border-black/15 px-4 font-normal" /></label></div>
            <label className="mt-5 block text-sm font-bold">Subject<input required className="mt-2 min-h-12 w-full rounded-xl border border-black/15 px-4 font-normal" /></label>
            <label className="mt-5 block text-sm font-bold">Message<textarea required className="mt-2 min-h-36 w-full rounded-xl border border-black/15 p-4 font-normal" /></label>
            <button className="mt-6 min-h-13 rounded-full bg-[#231f1b] px-8 text-sm font-extrabold text-white">SEND MESSAGE</button>
          </form>
        </div>
      </section>

      <footer className="bg-[#231f1b] px-5 pb-10 pt-20 text-white lg:px-10">
        <div className="mx-auto max-w-[92rem]">
          <div className="grid gap-10 border-b border-white/15 pb-16 md:grid-cols-[1.5fr_1fr_1fr]"><div><p className="font-display text-6xl">Rasayana<span className="text-[#d93b2b]">.</span></p><p className="mt-4 max-w-sm text-white/55">One snack. Endless chatpata possibilities. The swaad you crave, whenever you want it.</p></div><div><p className="mb-4 text-xs font-black tracking-[.16em] text-[#f2bc3a]">EXPLORE</p>{['About Us', 'Our Products', 'Founders', 'Community', 'Contact', 'FAQs'].map((item) => <Link key={item} href="#" className="mb-3 block text-sm text-white/65 hover:text-white">{item}</Link>)}</div><div><p className="mb-4 text-xs font-black tracking-[.16em] text-[#f2bc3a]">ACCOUNT & POLICIES</p>{['My Orders', 'Wishlist', 'Shipping Policy', 'Return Policy', 'Privacy Policy', 'Terms & Conditions'].map((item) => <Link key={item} href={item === 'My Orders' ? '/orders' : item === 'Wishlist' ? '#flavours' : '#'} className="mb-3 block text-sm text-white/65 hover:text-white">{item}</Link>)}</div></div>
          <div className="flex flex-col justify-between gap-3 pt-7 text-xs text-white/40 sm:flex-row"><p>© {new Date().getFullYear()} Rasayana. Company details pending.</p><p>Flavours that travel dil se, pet tak.</p></div>
        </div>
      </footer>

      {toast && <div role="status" className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-[#231f1b] px-6 py-3 text-sm font-bold text-white shadow-2xl">{toast}</div>}

      {(cartOpen || wishlistOpen) && <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm" onClick={() => { setCartOpen(false); setWishlistOpen(false) }}>
        <aside onClick={(event) => event.stopPropagation()} className="absolute bottom-0 right-0 top-0 flex w-full max-w-lg flex-col bg-[#fffaf0] p-6 shadow-2xl sm:p-8">
          <div className="flex items-center justify-between"><div><p className="text-xs font-black tracking-[.16em] text-[#d93b2b]">{cartOpen ? 'YOUR FLAVOUR BAG' : 'SAVED FOR LATER'}</p><h2 className="font-display mt-1 text-4xl">{cartOpen ? `${itemCount} item${itemCount === 1 ? '' : 's'}` : `${wishlist.length} favourite${wishlist.length === 1 ? '' : 's'}`}</h2></div><button onClick={() => { setCartOpen(false); setWishlistOpen(false) }} aria-label="Close panel" className="grid h-11 w-11 place-items-center rounded-full border border-black/15"><Icon name="close" /></button></div>
          <div className="hide-scrollbar mt-8 flex-1 space-y-4 overflow-y-auto">
            {(cartOpen ? cart : wishlist).length === 0 ? <div className="grid h-full place-items-center text-center"><div><div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#eadfcd]"><Icon name={cartOpen ? 'bag' : 'heart'} className="h-10 w-10" /></div><p className="font-display mt-6 text-3xl">Nothing here yet.</p><button onClick={() => { setCartOpen(false); setWishlistOpen(false) }} className="mt-5 rounded-full bg-[#231f1b] px-6 py-3 text-sm font-bold text-white">EXPLORE FLAVOURS</button></div></div> : (cartOpen ? cart : wishlist).map((item) => <div key={item.id} className="flex gap-4 rounded-2xl border border-black/10 bg-white p-4"><div className={`grid h-24 w-20 place-items-center rounded-xl bg-gradient-to-br ${palette[item.palette]?.bg || palette.chilli.bg}`}><span className="font-display -rotate-6 text-center text-sm text-white">{item.name}</span></div><div className="flex flex-1 flex-col justify-between"><div className="flex justify-between gap-3"><div><h3 className="font-bold">{item.name}</h3><p className="text-xs text-[#756b61]">{item.weight}</p></div><p className="font-black">₹{item.price}</p></div>{cartOpen ? <div className="flex items-center justify-between"><div className="flex items-center rounded-full border border-black/15"><button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity" className="grid h-9 w-9 place-items-center"><Icon name="minus" className="h-4 w-4" /></button><span className="w-7 text-center text-sm font-bold">{(item as CartItem).quantity}</span><button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity" className="grid h-9 w-9 place-items-center"><Icon name="plus" className="h-4 w-4" /></button></div><button onClick={() => { toggleWishlist(item); setCart((current) => current.filter((cartItem) => cartItem.id !== item.id)) }} className="text-xs font-bold underline">Move to wishlist</button></div> : <button onClick={() => { addToCart(item); setWishlist((current) => current.filter((wish) => wish.id !== item.id)) }} className="self-start text-xs font-bold underline">Move to cart</button>}</div></div>)}
          </div>
          {cartOpen && cart.length > 0 && <div className="border-t border-black/10 pt-5"><div className="flex justify-between text-lg font-black"><span>Subtotal</span><span>₹{subtotal}</span></div><p className="mt-2 text-xs text-[#756b61]">Delivery and discounts calculated at checkout.</p><Link href="/checkout" className="mt-5 flex min-h-14 items-center justify-center rounded-full bg-[#d93b2b] text-sm font-extrabold text-white">PROCEED TO CHECKOUT</Link></div>}
        </aside>
      </div>}

      {selected && <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 p-3 backdrop-blur-md sm:p-6" onClick={() => setSelected(null)}>
        <div onClick={(event) => event.stopPropagation()} className="mx-auto my-4 grid max-w-6xl overflow-hidden rounded-[2rem] bg-[#fffaf0] lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative grid min-h-[28rem] place-items-center overflow-hidden bg-[#eadfcd] p-8"><button onClick={() => setSelected(null)} aria-label="Close product details" className="absolute left-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full bg-white"><Icon name="close" /></button><img src={selected.bottleImage} alt={`${selected.name} seasoning bottle`} className="h-[26rem] w-full object-contain drop-shadow-2xl" /><span className="absolute bottom-5 left-5 rounded-full bg-white/70 px-4 py-2 text-xs font-bold">Product preview</span></div>
          <div className="p-7 sm:p-10"><p className="text-xs font-extrabold tracking-[.18em] text-[#d93b2b]">{palette[selected.palette]?.label}</p><h2 className="font-display mt-3 text-5xl">{selected.name}</h2><p className="mt-4 text-lg leading-7 text-[#756b61]">{selected.description}</p><div className="mt-6 flex items-end gap-3"><span className="text-3xl font-black">₹{selected.price}</span><span className="pb-1 text-sm text-[#756b61] line-through">₹{selected.mrp}</span><span className="pb-1 text-sm font-bold">{selected.weight}</span></div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">{[['Ingredients', selected.ingredients], ['Nutrition', selected.nutrition], ['Allergens', selected.allergens], ['Shelf life', selected.shelfLife], ['Storage', selected.storage]].map(([label, value]) => <div key={label} className="rounded-xl border border-black/10 p-4"><p className="text-xs font-black uppercase tracking-wider">{label}</p><p className="mt-2 text-sm text-[#756b61]">{value || 'Awaiting verified company information'}</p></div>)}</div>
            <div className="mt-7"><p className="text-xs font-black uppercase tracking-wider">Great with</p><div className="mt-3 flex flex-wrap gap-2">{selected.snacks.map((snack) => <span key={snack} className="rounded-full bg-[#e9dfd0] px-4 py-2 text-xs font-bold">{snack}</span>)}</div></div>
            <div className="mt-7 rounded-2xl bg-[#f2bc3a]/30 p-5"><p className="font-display text-2xl">Make it chatpata</p><p className="mt-2 text-sm leading-6">Start with an unsalted snack, sprinkle Rasayana to match your craving, mix or shake thoroughly, then serve and enjoy your personalised swaad.</p></div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2"><button onClick={() => addToCart(selected)} className="min-h-14 rounded-full bg-[#d93b2b] px-7 text-sm font-extrabold text-white">ADD TO CART</button><button onClick={() => toggleWishlist(selected)} className="min-h-14 rounded-full border-2 border-[#231f1b] px-7 text-sm font-extrabold">ADD TO WISHLIST</button></div>
          </div>
        </div>
      </div>}

      {authOpen && <div className="fixed inset-0 z-[65] grid place-items-center bg-black/60 p-4 backdrop-blur-md" onClick={() => setAuthOpen(false)}>
        <div onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[2rem] bg-[#fffaf0] p-7 sm:p-9"><div className="flex items-center justify-between"><div><p className="text-xs font-black tracking-[.16em] text-[#d93b2b]">CUSTOMER ACCOUNT</p><h2 className="font-display mt-2 text-4xl">Welcome to Rasayana</h2></div><button onClick={() => setAuthOpen(false)} aria-label="Close account modal" className="grid h-11 w-11 place-items-center rounded-full border border-black/15"><Icon name="close" /></button></div><div className="mt-6 rounded-xl bg-[#f2bc3a]/30 p-4 text-sm"><strong>Demo mode:</strong> Secure customer sessions and email verification require the production auth/email configuration. No credentials entered here are transmitted.</div><label className="mt-6 block text-sm font-bold">Email<input type="email" className="mt-2 min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 font-normal" placeholder="you@example.com" /></label><label className="mt-4 block text-sm font-bold">Password<input type="password" className="mt-2 min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 font-normal" placeholder="At least 8 characters" /></label><button onClick={() => setToast('Sign-in is disabled in demo mode')} className="mt-6 min-h-13 w-full rounded-full bg-[#231f1b] text-sm font-extrabold text-white">LOGIN</button><div className="mt-5 flex justify-between text-xs font-bold"><button onClick={() => setToast('Password reset requires a live email provider')} className="underline">Forgot password?</button><button onClick={() => setToast('Sign-up is disabled in demo mode')} className="underline">Create account</button></div></div>
      </div>}
    </main>
  )
}
