import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SiteFooter } from '@/components/footer'

const categories = [
  { name: 'Electronics', image: '/hero-market.svg' },
  { name: 'Fashion', image: '/hero-market.svg' },
  { name: 'Home & Garden', image: '/hero-market.svg' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <section className="container mx-auto px-4 py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Kenya Marketplace
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
            Buy and sell across Kenya with a clean experience, modern UI, and no payment gateway fees.
          </p>
          <div className="flex gap-4">
            <Link href="/register"><Button size="lg">Create Free Account</Button></Link>
            <Link href="/listings"><Button size="lg" variant="outline">Browse Products</Button></Link>
          </div>
        </div>
        <img src="/hero-market.svg" alt="Kenya marketplace hero" className="w-full rounded-2xl shadow-xl" />
      </section>

      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Everything is free</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card><CardHeader><CardTitle>Free Listings</CardTitle><CardDescription>No subscriptions required</CardDescription></CardHeader><CardContent>Post as many products as you need and manage them from one dashboard.</CardContent></Card>
          <Card><CardHeader><CardTitle>Trusted Moderation</CardTitle><CardDescription>Admin review enabled</CardDescription></CardHeader><CardContent>Listings and reports can be reviewed through the admin dashboard controls.</CardContent></Card>
          <Card><CardHeader><CardTitle>Fast Discovery</CardTitle><CardDescription>Buyer-focused UX</CardDescription></CardHeader><CardContent>Filter by category, search quickly, and save favorites in one click.</CardContent></Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Popular Categories</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.name} className="overflow-hidden">
              <img src={category.image} alt={category.name} className="h-36 w-full object-cover" />
              <CardHeader><CardTitle>{category.name}</CardTitle></CardHeader>
            </Card>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
