export const ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  ADMIN: 'admin',
} as const

export const PACKAGE_TYPES = {
  STARTER: 'starter',
  BUSINESS: 'business',
  PREMIUM: 'premium',
} as const

export const PACKAGES = {
  [PACKAGE_TYPES.STARTER]: {
    name: 'Starter',
    price: 100,
    listings: 10,
    duration: 30,
    features: ['10 listings', '30 days validity', 'Basic analytics'],
  },
  [PACKAGE_TYPES.BUSINESS]: {
    name: 'Business',
    price: 300,
    listings: 50,
    duration: 30,
    features: ['50 listings', 'Featured products', 'Advanced analytics'],
  },
  [PACKAGE_TYPES.PREMIUM]: {
    name: 'Premium',
    price: 1000,
    listings: -1, // Unlimited
    duration: 30,
    features: ['Unlimited listings', 'AI tools', 'Priority ranking'],
  },
}

export const LISTING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
} as const

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const

export const NOTIFICATION_TYPES = {
  MESSAGE: 'message',
  ORDER: 'order',
  PAYMENT: 'payment',
  LISTING: 'listing',
  SYSTEM: 'system',
  SECURITY: 'security',
} as const

export const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Vehicles',
  'Sports',
  'Health & Beauty',
  'Business',
  'Education',
  'Services',
  'Other',
]
