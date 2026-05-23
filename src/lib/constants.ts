export const ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  ADMIN: 'admin',
} as const

export const PACKAGE_TYPES = {
  FREE: 'free',
} as const

export const PACKAGES = {
  [PACKAGE_TYPES.FREE]: {
    name: 'Free',
    price: 0,
    listings: -1,
    duration: -1,
    features: ['Unlimited listings', 'AI tools', 'Admin moderation', 'Messaging'],
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
