import achaari from './assets/seasonings/achaari.png'
import achaariBottle from './assets/seasonings/achaari-bottle.png'
import curryLemon from './assets/seasonings/curry-lemon.png'
import curryLemonBottle from './assets/seasonings/curry-lemon-bottle.png'
import lemonPepper from './assets/seasonings/lemon-pepper.png'
import lemonPepperBottle from './assets/seasonings/lemon-pepper-bottle.png'
import malabari from './assets/seasonings/malabari.png'
import malabariBottle from './assets/seasonings/malabari-bottle.png'
import mexican from './assets/seasonings/mexican.png'
import mexicanBottle from './assets/seasonings/mexican-bottle.png'
import periPeri from './assets/seasonings/peri-peri.png'
import periPeriBottle from './assets/seasonings/peri-peri-bottle.png'
import tandoori from './assets/seasonings/tandoori.png'
import tandooriBottle from './assets/seasonings/tandoori-bottle.png'
import theekaChaska from './assets/seasonings/theeka-chaska.png'
import theekaChaskaBottle from './assets/seasonings/theeka-chaska-bottle.png'
import Storefront, { StoreProduct } from './Storefront'

const baseProduct = {
  price: 99,
  mrp: 99,
  weight: '50 g',
  packSizes: [{ label: '50 g', price: 99 }],
  snacks: ['Chips', 'Popcorn', 'Nuts', 'Makhana'],
  ingredients: null,
  nutrition: null,
  allergens: null,
  shelfLife: null,
  storage: null,
}

const products: StoreProduct[] = [
  { ...baseProduct, id: 'peri-peri', name: 'Peri Peri', slug: 'peri-peri', description: 'A fiery, tangy sprinkle that turns every crunch into a chatpata craving.', shortDescription: 'Fiery, tangy and made for full-on chatpata cravings.', intensity: 4, palette: 'chilli', image: periPeri, bottleImage: periPeriBottle },
  { ...baseProduct, id: 'tandoori', name: 'Tandoori', slug: 'tandoori', description: 'Smoky dhaba-style swaad for popcorn, makhana, chips and every hearty crunch.', shortDescription: 'Smoky dhaba-style swaad for a hearty crunch.', intensity: 3, palette: 'ember', image: tandoori, bottleImage: tandooriBottle },
  { ...baseProduct, id: 'curry-lemon', name: 'Curry Lemon', slug: 'curry-lemon', description: 'Sunny nimbu zing meets comforting curry warmth for a lively desi twist.', shortDescription: 'Nimbu zing and curry warmth in one lively sprinkle.', intensity: 2, palette: 'lemon', image: curryLemon, bottleImage: curryLemonBottle },
  { ...baseProduct, id: 'achaari', name: 'Achaari', slug: 'achaari', description: 'Tangy, punchy and pickle-inspired—made for the craving that asks for extra chaska.', shortDescription: 'Tangy achaari punch with an extra hit of chaska.', intensity: 4, palette: 'pickle', image: achaari, bottleImage: achaariBottle },
  { ...baseProduct, id: 'theeka-chaska', name: 'Theeka Chaska', slug: 'theeka-chaska', description: 'A bold teekha kick for spice lovers who believe every bite should make some noise.', shortDescription: 'Bold, teekha and impossible to ignore.', intensity: 5, palette: 'crimson', image: theekaChaska, bottleImage: theekaChaskaBottle },
  { ...baseProduct, id: 'mexican', name: 'Mexican', slug: 'mexican', description: 'A fiesta of savoury spice and zesty warmth that brings party energy to the bowl.', shortDescription: 'Zesty fiesta flavour for instant party energy.', intensity: 3, palette: 'fiesta', image: mexican, bottleImage: mexicanBottle },
  { ...baseProduct, id: 'lemon-pepper', name: 'Lemon Pepper', slug: 'lemon-pepper', description: 'Bright citrus and peppery warmth for a clean, zingy flavour that keeps you reaching in.', shortDescription: 'Fresh citrus zing with a peppery finish.', intensity: 2, palette: 'pepper', image: lemonPepper, bottleImage: lemonPepperBottle },
  { ...baseProduct, id: 'malabari', name: 'Malabari', slug: 'malabari', description: 'Aromatic coastal spices bring a warm, layered swaad to every handful.', shortDescription: 'Warm coastal masala with an aromatic finish.', intensity: 3, palette: 'coast', image: malabari, bottleImage: malabariBottle },
]

export default function App() {
  return <Storefront products={products} heroImage={null} ideas={[]} announcements={[]} />
}
