import Link from 'next/link'
import { Phone, Mail, MessageCircle, ChevronRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-6">
      {/* Newsletter strip */}
      <div className="bg-orange-500 py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="text-white flex-1">
            <p className="font-black text-sm">📧 Get deals in your inbox</p>
            <p className="text-orange-100 text-xs">New listings, offers and updates from Sokoni Kenya</p>
          </div>
          <div className="flex w-full sm:w-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 sm:w-56 px-3 py-2 text-sm rounded-l-full focus:outline-none" />
            <button className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-r-full text-sm transition-colors whitespace-nowrap">Join Now →</button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-orange-500 text-white font-black text-sm px-2 py-1 rounded-lg">SK</div>
            <span className="font-black text-gray-900 dark:text-white">Sokoni<span className="text-orange-500">Kenya</span></span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-4">Kenya's free marketplace for buyers and sellers across all 47 counties.</p>
          <div className="flex gap-2">
            <a href="https://wa.me/254701059192" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"><MessageCircle className="h-4 w-4" /></a>
            <a href="tel:+254701059192" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"><Phone className="h-4 w-4" /></a>
            <a href="mailto:sokonikenya@gmail.com" className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors"><Mail className="h-4 w-4" /></a>
          </div>
        </div>

        {/* Buy */}
        <div>
          <h4 className="font-black text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">For Buyers</h4>
          <ul className="space-y-2 text-gray-500 dark:text-gray-400 text-xs">
            {[['Browse Listings', '/listings'],['Electronics', '/listings?category=Electronics'],['Fashion', '/listings?category=Fashion'],['Vehicles', '/listings?category=Vehicles'],['Property', '/listings?category=Property']].map(([label, href]) => (
              <li key={href}><Link href={href} className="hover:text-orange-500 flex items-center gap-1 transition-colors"><ChevronRight className="h-3 w-3" />{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Sell */}
        <div>
          <h4 className="font-black text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">For Sellers</h4>
          <ul className="space-y-2 text-gray-500 dark:text-gray-400 text-xs">
            {[['Create Account', '/register'],['Seller Dashboard', '/seller'],['Post a Listing', '/seller/listings/create'],['Seller Profile', '/seller/profile'],['Pricing', '/pricing']].map(([label, href]) => (
              <li key={href}><Link href={href} className="hover:text-orange-500 flex items-center gap-1 transition-colors"><ChevronRight className="h-3 w-3" />{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="font-black text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">Help & Contact</h4>
          <ul className="space-y-2 text-gray-500 dark:text-gray-400 text-xs">
            {[['Help Center', '/support'],['Contact Us', '/support'],['Login', '/login'],['Forgot Password', '/forgot-password']].map(([label, href]) => (
              <li key={href}><Link href={href} className="hover:text-orange-500 flex items-center gap-1 transition-colors"><ChevronRight className="h-3 w-3" />{label}</Link></li>
            ))}
          </ul>
          <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
            <p className="font-semibold text-gray-700 dark:text-gray-300">📞 Contact Us</p>
            <a href="tel:+254701059192" className="hover:text-orange-500 block">+254 701 059 192</a>
            <a href="https://wa.me/254701059192" className="hover:text-green-500 block">WhatsApp: 0701 059 192</a>
            <a href="mailto:sokonikenya@gmail.com" className="hover:text-orange-500 block break-all">sokonikenya@gmail.com</a>
            <p className="text-gray-400">Mon–Sat 8am–8pm · Sun 10am–4pm</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>© 2026 Sokoni Kenya · Free marketplace for everyone 🇰🇪</p>
          <div className="flex gap-3">
            <Link href="/support" className="hover:text-orange-500">Terms</Link>
            <Link href="/support" className="hover:text-orange-500">Privacy</Link>
            <Link href="/support" className="hover:text-orange-500">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
