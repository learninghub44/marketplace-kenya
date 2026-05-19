"use client"

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

export default function PricingPage() {
  const router = useRouter()

  const handleSubscribe = async (packageType: string) => {
    // Check if user is logged in
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))
    if (!token) {
      router.push('/login')
      return
    }

    // Redirect to payment page
    router.push(`/payment?package=${packageType}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-blue-600">Kenya Marketplace</h1>
          </Link>
          <nav className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Package</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Start selling on Kenya's premier marketplace
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Starter</CardTitle>
              <CardDescription className="text-3xl font-bold">
                {formatCurrency(100)}
                <span className="text-lg font-normal text-gray-500">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  10 listings
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  30 days validity
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Basic analytics
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Email support
                </li>
              </ul>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleSubscribe('starter')}
              >
                Choose Starter
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-500 border-2 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            <CardHeader>
              <CardTitle>Business</CardTitle>
              <CardDescription className="text-3xl font-bold">
                {formatCurrency(300)}
                <span className="text-lg font-normal text-gray-500">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  50 listings
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Featured products
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Priority support
                </li>
              </ul>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => handleSubscribe('business')}
              >
                Choose Business
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Premium</CardTitle>
              <CardDescription className="text-3xl font-bold">
                {formatCurrency(1000)}
                <span className="text-lg font-normal text-gray-500">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Unlimited listings
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  AI tools
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Priority ranking
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Dedicated support
                </li>
              </ul>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleSubscribe('premium')}
              >
                Choose Premium
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Need a custom solution?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Contact us for enterprise pricing and custom integrations
          </p>
          <Link href="/contact">
            <Button variant="outline">Contact Sales</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
