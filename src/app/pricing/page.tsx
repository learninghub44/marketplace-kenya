import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SiteFooter } from '@/components/footer'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/"><h1 className="text-2xl font-bold text-blue-600">Kenya Marketplace</h1></Link>
          <nav className="flex gap-4">
            <Link href="/login"><Button variant="ghost">Login</Button></Link>
            <Link href="/register"><Button>Get Started</Button></Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Free Plan for Everyone</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">No payment gateway. No monthly charges. Full access.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-blue-500">
            <CardHeader>
              <CardTitle>Marketplace Free</CardTitle>
              <CardDescription className="text-3xl font-bold">KES 0 <span className="text-base font-normal text-gray-500">forever</span></CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li>✓ Unlimited listings</li>
                <li>✓ Buyer and seller dashboards</li>
                <li>✓ Favorites and messaging</li>
                <li>✓ Admin moderation workflow</li>
                <li>✓ AI-assisted listing tools</li>
              </ul>
              <Link href="/register"><Button className="w-full">Start Free</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}
