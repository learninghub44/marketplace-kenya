import Link from 'next/link'
import { ShoppingBag, Phone, Mail, MessageCircle, Shield, CheckCircle, Globe, CreditCard, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-orange-500 p-1.5 rounded-xl flex-shrink-0">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
              <span className="font-black text-xl text-white">Sokoni<span className="text-orange-400">Kenya</span></span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-5">
              Kenya's free marketplace for buyers and sellers. Buy, sell and connect securely — anywhere in Kenya.
            </p>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-4">
              <MapPin className="h-3.5 w-3.5 text-orange-400 flex-shrink-0" />
              Serving all of Kenya
            </div>
            <div className="flex gap-2">
              <a href="https://wa.me/254701059192" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-green-600 hover:bg-green-500 rounded-xl flex items-center justify-center transition-colors" title="WhatsApp">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="tel:+254701059192"
                className="w-9 h-9 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center transition-colors" title="Call us">
                <Phone className="h-4 w-4" />
              </a>
              <a href="mailto:sokonikenya@gmail.com"
                className="w-9 h-9 bg-orange-500 hover:bg-orange-400 rounded-xl flex items-center justify-center transition-colors" title="Email us">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="font-bold mb-4 text-white text-xs uppercase tracking-widest">Marketplace</h4>
            <ul className="space-y-2.5 text-gray-400">
              {[
                { href: '/listings', label: 'All Listings' },
                { href: '/listings?category=Electronics', label: 'Electronics' },
                { href: '/listings?category=Fashion', label: 'Fashion' },
                { href: '/listings?category=Vehicles', label: 'Vehicles' },
                { href: '/listings?category=Property', label: 'Property' },
                { href: '/listings?category=Agriculture', label: 'Agriculture' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-orange-400 transition-colors text-xs">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-bold mb-4 text-white text-xs uppercase tracking-widest">Account</h4>
            <ul className="space-y-2.5 text-gray-400">
              {[
                { href: '/login', label: 'Sign In' },
                { href: '/register', label: 'Create Account' },
                { href: '/seller', label: 'Seller Dashboard' },
                { href: '/buyer', label: 'Buyer Dashboard' },
                { href: '/forgot-password', label: 'Reset Password' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-orange-400 transition-colors text-xs">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4 text-white text-xs uppercase tracking-widest">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="/support" className="hover:text-orange-400 transition-colors text-xs font-semibold text-gray-300">Help Centre</Link>
              </li>
              <li className="flex items-center gap-2 text-xs">
                <Mail className="h-3.5 w-3.5 text-orange-400 flex-shrink-0" />
                <a href="mailto:sokonikenya@gmail.com" className="hover:text-orange-400 transition-colors break-all">sokonikenya@gmail.com</a>
              </li>
              <li className="flex items-center gap-2 text-xs">
                <Phone className="h-3.5 w-3.5 text-orange-400 flex-shrink-0" />
                <a href="tel:+254701059192" className="hover:text-orange-400 transition-colors">+254 701 059 192</a>
              </li>
              <li className="flex items-center gap-2 text-xs">
                <MessageCircle className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                <a href="https://wa.me/254701059192" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">WhatsApp: 0701 059 192</a>
              </li>
            </ul>
            <div className="mt-4 bg-gray-800 rounded-xl p-3 text-xs text-gray-400">
              <p className="font-semibold text-gray-200 mb-1">Support Hours</p>
              <p>Mon–Sat: 8:00 am – 8:00 pm</p>
              <p>Sun: 10:00 am – 4:00 pm</p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-10 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Shield, label: 'Secure Platform' },
              { icon: CheckCircle, label: 'Verified Sellers' },
              { icon: CreditCard, label: 'M-Pesa Payments' },
              { icon: Globe, label: 'Nationwide Delivery' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-xs text-gray-400">
                <div className="w-8 h-8 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-orange-400" />
                </div>
                {label}
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <p>&copy; 2026 Sokoni Kenya &middot; Free marketplace for everyone</p>
            <div className="flex gap-5">
              <Link href="/support" className="hover:text-gray-400 transition-colors">Terms</Link>
              <Link href="/support" className="hover:text-gray-400 transition-colors">Privacy</Link>
              <Link href="/support" className="hover:text-gray-400 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
