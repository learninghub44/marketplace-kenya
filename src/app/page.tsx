import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Kenya Marketplace
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          AI-Powered Multi-Vendor Platform for Kenya. Buy, Sell, and Grow with intelligent features.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </Link>
          <Link href="/listings">
            <Button size="lg" variant="outline">
              Browse Products
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Search</CardTitle>
              <CardDescription>Smart search that understands your needs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Our AI understands natural language, location, and preferences to find exactly what you need.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Secure Payments</CardTitle>
              <CardDescription>M-Pesa integration via PayHero</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Pay securely with M-Pesa STK Push. Fast, reliable, and trusted by millions in Kenya.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Multi-Vendor Support</CardTitle>
              <CardDescription>Thousands of sellers, one platform</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Connect with verified sellers across Kenya. Real-time messaging and secure transactions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Listing Generator</CardTitle>
              <CardDescription>Create perfect listings in seconds</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Let AI generate titles, descriptions, SEO tags, and hashtags for your products.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fraud Detection</CardTitle>
              <CardDescription>AI-powered security monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Advanced AI detects suspicious activity, fake listings, and protects users from scams.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Real-time Messaging</CardTitle>
              <CardDescription>Chat instantly with sellers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Communicate in real-time with buyers and sellers. Share images and negotiate deals.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Seller Packages</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Starter</CardTitle>
              <CardDescription>KES 100/month</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• 10 listings</li>
                <li>• 30 days validity</li>
                <li>• Basic analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-500 border-2">
            <CardHeader>
              <CardTitle>Business</CardTitle>
              <CardDescription>KES 300/month</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• 50 listings</li>
                <li>• Featured products</li>
                <li>• Advanced analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Premium</CardTitle>
              <CardDescription>KES 1000/month</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Unlimited listings</li>
                <li>• AI tools</li>
                <li>• Priority ranking</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; 2026 Kenya Marketplace. Built with Next.js, Supabase, and AI.</p>
      </footer>
    </div>
  )
}
