import Link from 'next/link'
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles } from 'lucide-react'
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#ffffff_45%,#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top,#1e293b_0%,#0f172a_45%,#020617_100%)]">
      <section className="container mx-auto px-4 pt-14 pb-20 grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm dark:border-blue-900 dark:bg-slate-900/70 dark:text-blue-200">
            <Sparkles className="h-4 w-4" />
            Kenya&apos;s trusted local marketplace
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Kenya Marketplace
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
            Buy and sell across Kenya with a clean experience, modern UI, and no payment gateway fees.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/register"><Button size="lg">Create Free Account</Button></Link>
            <Link href="/login"><Button size="lg" variant="secondary">Login to Buy or Sell</Button></Link>
            <Link href="/listings"><Button size="lg" variant="outline">Browse as Guest <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You can continue as a guest to browse listings. To buy or sell, create an account or log in.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="rounded-xl border bg-white/80 dark:bg-slate-900/60 p-4">
              <p className="text-2xl font-bold text-blue-600">100%</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Free listing experience</p>
            </div>
            <div className="rounded-xl border bg-white/80 dark:bg-slate-900/60 p-4">
              <p className="text-2xl font-bold text-blue-600">Fast</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Post and discover in minutes</p>
            </div>
            <div className="rounded-xl border bg-white/80 dark:bg-slate-900/60 p-4">
              <p className="text-2xl font-bold text-blue-600">Secure</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Role-based account access</p>
            </div>
            <Link href="/listings"><Button size="lg" variant="outline">Browse Products</Button></Link>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            You can continue as a guest to browse listings. To buy or sell, create an account or log in.
          </p>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl rounded-3xl" />
          <img src="/hero-market.svg" alt="Kenya marketplace hero" className="relative w-full rounded-2xl shadow-2xl border bg-white/60 dark:bg-slate-900/50" />
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl rounded-3xl" />
          <img src="/hero-market.svg" alt="Kenya marketplace hero" className="relative w-full rounded-2xl shadow-2xl border bg-white/60 dark:bg-slate-900/50" />
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl rounded-3xl" />
          <img src="/hero-market.svg" alt="Kenya marketplace hero" className="relative w-full rounded-2xl shadow-2xl border bg-white/60 dark:bg-slate-900/50" />
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Why shoppers and sellers love it</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-blue-100 dark:border-slate-700"><CardHeader><CardTitle className="flex items-center gap-2"><BadgeCheck className="h-5 w-5 text-blue-600" /> Free Listings</CardTitle><CardDescription>No subscriptions required</CardDescription></CardHeader><CardContent>Post as many products as you need and manage them from one dashboard.</CardContent></Card>
          <Card className="border-blue-100 dark:border-slate-700"><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-blue-600" /> Trusted Moderation</CardTitle><CardDescription>Admin review enabled</CardDescription></CardHeader><CardContent>Listings and reports can be reviewed through the admin dashboard controls.</CardContent></Card>
          <Card className="border-blue-100 dark:border-slate-700"><CardHeader><CardTitle className="flex items-center gap-2"><ArrowRight className="h-5 w-5 text-blue-600" /> Fast Discovery</CardTitle><CardDescription>Buyer-focused UX</CardDescription></CardHeader><CardContent>Filter by category, search quickly, and save favorites in one click.</CardContent></Card>
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
