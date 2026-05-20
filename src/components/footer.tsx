import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t bg-white/90 dark:bg-gray-900/90 mt-16">
      <div className="container mx-auto px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="font-semibold text-base mb-2">Kenya Marketplace</h3>
          <p className="text-gray-600 dark:text-gray-300">A free platform for buyers and sellers across Kenya.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Marketplace</h4>
          <ul className="space-y-1 text-gray-600 dark:text-gray-300">
            <li><Link href="/listings">Browse listings</Link></li>
            <li><Link href="/seller">Seller dashboard</Link></li>
            <li><Link href="/buyer">Buyer dashboard</Link></li>
            <li><Link href="/support">Support Center</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Account</h4>
          <ul className="space-y-1 text-gray-600 dark:text-gray-300">
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/register">Create account</Link></li>
            <li><Link href="/admin">Admin</Link></li>
            <li><Link href="/forgot-password">Forgot password</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Customer Care</h4>
          <p className="text-gray-600 dark:text-gray-300">Email: support@marketplace.co.ke</p>
          <p className="text-gray-600 dark:text-gray-300">Phone: +254 700 123 456</p>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-gray-500">© 2026 Kenya Marketplace. Free for everyone.</div>
    </footer>
  )
}
