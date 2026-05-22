import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: 'KES 0',
      period: 'forever',
      highlight: false,
      badge: null,
      features: [
        'Unlimited listings',
        'Browse all categories',
        'Message sellers',
        'M-Pesa payments',
        'Basic seller profile',
        'Email support',
      ],
      cta: 'Get Started Free',
      href: '/register',
    },
    {
      name: 'Pro Seller',
      price: 'KES 500',
      period: 'per month',
      highlight: true,
      badge: 'Most Popular',
      features: [
        'Everything in Free',
        'Priority listing placement',
        'Featured badge on listings',
        'Advanced analytics',
        'Bulk listing upload',
        'Priority customer support',
        'Custom shop page',
        'Promotional tools',
      ],
      cta: 'Start Pro — Coming Soon',
      href: '/register',
    },
    {
      name: 'Business',
      price: 'KES 2,000',
      period: 'per month',
      highlight: false,
      badge: 'For Businesses',
      features: [
        'Everything in Pro',
        'Verified business badge',
        'API access',
        'Multiple team members',
        'Dedicated account manager',
        'Custom domain',
        'Advanced reporting',
        'SLA support',
      ],
      cta: 'Contact Us',
      href: '/support',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-14 text-center">
        <h1 className="text-4xl font-black text-white mb-3">Simple, Transparent Pricing</h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">Start selling for free. Upgrade when you need more visibility and power.</p>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl flex-1">
        {/* Plans */}
        <div className="grid sm:grid-cols-3 gap-5 mb-12">
          {plans.map(plan => (
            <div key={plan.name} className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col ${plan.highlight ? 'ring-2 ring-orange-400 shadow-lg' : ''}`}>
              {plan.badge && (
                <div className={`text-center py-1.5 text-xs font-black ${plan.highlight ? 'bg-orange-400 text-gray-900' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                  {plan.badge}
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-black text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="mt-2 mb-5">
                  <span className="text-3xl font-black text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm ml-1">/{plan.period}</span>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}
                  className={`mt-6 w-full py-3 rounded-xl font-black text-center text-sm flex items-center justify-center gap-2 transition-colors ${plan.highlight ? 'bg-orange-400 hover:bg-orange-500 text-gray-900' : 'border-2 border-gray-200 dark:border-gray-600 hover:border-orange-400 text-gray-700 dark:text-gray-200 hover:text-orange-500'}`}>
                  {plan.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 text-center">Pricing FAQ</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm">
            {[
              { q: 'Is listing really free?', a: 'Yes, 100%. Create an account and start listing your products at zero cost, forever.' },
              { q: 'Do you take commission?', a: 'No commissions, ever. Transactions are between you and the buyer directly.' },
              { q: 'When will Pro plans launch?', a: 'Pro features are coming soon. Sign up free now and we\'ll notify you when Pro launches.' },
              { q: 'How do I get paid?', a: 'Arrange payment directly with buyers. We recommend M-Pesa for instant, secure transactions.' },
            ].map(item => (
              <div key={item.q}>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{item.q}</h4>
                <p className="text-gray-500 dark:text-gray-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
