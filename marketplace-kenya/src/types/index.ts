import { ROLES, PACKAGE_TYPES, LISTING_STATUS, PAYMENT_STATUS, NOTIFICATION_TYPES } from '@/lib/constants'

export type UserRole = typeof ROLES[keyof typeof ROLES]
export type PackageType = typeof PACKAGE_TYPES[keyof typeof PACKAGE_TYPES]
export type ListingStatus = typeof LISTING_STATUS[keyof typeof LISTING_STATUS]
export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS]
export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES]

export interface User {
  id: string
  email: string
  role: UserRole
  tenant_id: string
  created_at: string
  updated_at: string
  email_verified?: boolean
  phone?: string
  mfa_enabled?: boolean
}

export interface Buyer extends User {
  role: 'buyer'
  favorites?: string[]
}

export interface Seller extends User {
  role: 'seller'
  business_name?: string
  business_description?: string
  logo_url?: string
  verified?: boolean
  package_type?: PackageType
  listings_count?: number
  subscription_expires_at?: string
}

export interface Admin extends User {
  role: 'admin'
  permissions?: string[]
}

export interface Package {
  id: string
  type: PackageType
  name: string
  price: number
  listings_limit: number
  duration_days: number
  features: string[]
  created_at: string
  updated_at: string
  tenant_id: string
}

export interface Subscription {
  id: string
  seller_id: string
  package_id: string
  package_type: PackageType
  status: 'active' | 'expired' | 'cancelled'
  starts_at: string
  expires_at: string
  payment_id: string
  created_at: string
  updated_at: string
  tenant_id: string
}

export interface Listing {
  id: string
  seller_id: string
  title: string
  description: string
  price: number
  category: string
  location: string
  images: string[]
  status: ListingStatus
  featured: boolean
  views: number
  seo_tags?: string[]
  hashtags?: string[]
  ai_generated?: boolean
  created_at: string
  updated_at: string
  tenant_id: string
}

export interface ListingImage {
  id: string
  listing_id: string
  url: string
  order: number
  created_at: string
  tenant_id: string
}

export interface Payment {
  id: string
  user_id: string
  amount: number
  method: 'mpesa' | 'card' | 'bank'
  status: PaymentStatus
  transaction_id?: string
  phone?: string
  callback_data?: any
  created_at: string
  updated_at: string
  tenant_id: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  listing_id?: string
  content: string
  image_url?: string
  read: boolean
  created_at: string
  updated_at: string
  tenant_id: string
}

export interface Review {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  rating: number
  comment: string
  created_at: string
  updated_at: string
  tenant_id: string
}

export interface Favorite {
  id: string
  buyer_id: string
  listing_id: string
  created_at: string
  tenant_id: string
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  data?: any
  read: boolean
  created_at: string
  tenant_id: string
}

export interface AuditLog {
  id: string
  user_id: string
  action: string
  entity: string
  entity_id: string
  changes?: any
  ip_address?: string
  user_agent?: string
  created_at: string
  tenant_id: string
}

export interface SecurityLog {
  id: string
  user_id?: string
  event_type: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  ip_address?: string
  user_agent?: string
  metadata?: any
  created_at: string
  tenant_id: string
}

export interface Report {
  id: string
  reporter_id: string
  reported_user_id?: string
  reported_listing_id?: string
  reason: string
  description: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  created_at: string
  updated_at: string
  tenant_id: string
}

export interface SupportTicket {
  id: string
  user_id: string
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  responses?: SupportResponse[]
  created_at: string
  updated_at: string
  tenant_id: string
}

export interface SupportResponse {
  id: string
  ticket_id: string
  user_id: string
  message: string
  is_admin: boolean
  created_at: string
}
