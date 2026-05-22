import Link from 'next/link'
import { ShoppingBag, Phone, Mail, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-orange-400 p-1.5 rounded-lg flex-shrink-0">
                <ShoppingBag className="h-4 w-4 text-gray-900" />
              </div>
              <span className="font-black text-lg"><span className="text-white">Sokoni</span><span className="text-orange-400"> Kenya</span></span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">Kenya's free marketplace for buyers and sellers across all 47 counties. Buy, sell and connect securely.</p>
            <div className="flex gap-3 mt-4">
              <a href="https://wa.me/254701059192" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 p-2 rounded-lg transition-colors" title="WhatsApp">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="tel:+254701059192" className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors" title="Call us">
                <Phone className="h-4 w-4" />
              </a>
              <a href="mailto:sokonikenya@gmail.com" className="bg-orange-500 hover:bg-orange-600 p-2 rounded-lg transition-colors" title="Email us">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="font-bold mb-3 text-orange-400 text-sm uppercase tracking-wide">Marketplace</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/listings" className="hover:text-white transition-colors flex items-center gap-1.5">Browse Listings</Link></li>
              <li><Link href="/listings?category=Electronics" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link href="/listings?category=Fashion" className="hover:text-white transition-colors">Fashion</Link></li>
              <li><Link href="/listings?category=Vehicles" className="hover:text-white transition-colors">Vehicles</Link></li>
              <li><Link href="/listings?category=Property" className="hover:text-white transition-colors">Property</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-bold mb-3 text-orange-400 text-sm uppercase tracking-wide">Account</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link href="/seller" className="hover:text-white transition-colors">Seller Dashboard</Link></li>
              <li><Link href="/buyer" className="hover:text-white transition-colors">Buyer Dashboard</Link></li>
              <li><Link href="/forgot-password" className="hover:text-white transition-colors">Forgot Password</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-3 text-orange-400 text-sm uppercase tracking-wide">Support & Contact</h4>
            <ul className="space-y-2.5 text-gray-400 text-xs">
              <li><Link href="/support" className="hover:text-white transition-colors font-medium text-sm">Help Center</Link></li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-orange-400 flex-shrink-0" />
                <a href="mailto:sokonikenya@gmail.com" className="hover:text-white transition-colors break-all">sokonikenya@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-orange-400 flex-shrink-0" />
                <a href="tel:+254701059192" className="hover:text-white transition-colors">+254 701 059 192</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                <a href="https://wa.me/254701059192" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp: 0701 059 192</a>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-gray-800 dark:bg-gray-900 rounded-lg text-xs text-gray-400">
              <p className="font-semibold text-white text-xs mb-1">🕒 Support Hours</p>
              <p>Mon–Sat: 8:00am – 8:00pm</p>
              <p>Sun: 10:00am – 4:00pm</p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-8 border-t border-gray-800">
          {[
            { icon: '🔒', label: 'Secure Platform' },
            { icon: '✅', label: 'Verified Sellers' },
            { icon: '📱', label: 'M-Pesa Payments' },
            { icon: '🇰🇪', label: '47 Counties' },
          ].map(b => (
            <div key={b.label} className="flex items-center gap-2 text-xs text-gray-400">
              <span className="text-base">{b.icon}</span>{b.label}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-6 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2026 Sokoni Kenya · Free marketplace for everyone 🇰🇪</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms &amp; Conditions</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/support" className="hover:text-gray-300 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
