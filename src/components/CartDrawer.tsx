'use client'

import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag, Package } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/store/cart'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, total, count } = useCart()

  const savings = items.reduce((sum, item) => {
    const orig = (item as any).original_price
    if (orig && orig > item.price) return sum + (orig - item.price) * item.quantity
    return sum
  }, 0)

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* ── Header ───────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 bg-orange-500">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="h-5 w-5 text-white" />
            <h2 className="font-black text-white text-base">My Cart</h2>
            {count > 0 && (
              <span className="bg-white text-orange-600 text-xs font-black px-2 py-0.5 rounded-full min-w-[22px] text-center">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Items ────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-8">
              <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center">
                <Package className="h-11 w-11 text-orange-300" />
              </div>
              <div>
                <p className="font-black text-gray-800 text-lg">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">
                  Browse our thousands of products and find something you&apos;ll love!
                </p>
              </div>
              <Link
                href="/listings"
                onClick={onClose}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-sm"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <ul>
              {items.map(item => (
                <li key={item.id} className="flex gap-3 px-4 py-3.5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group">
                  {/* Image */}
                  <div className="w-[70px] h-[70px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight pr-1">
                        {item.title}
                      </p>
                      {item.variant && (
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <Tag className="h-2.5 w-2.5" />{item.variant}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty controls */}
                      <div className="flex items-center rounded-lg overflow-hidden border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center bg-gray-50 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-gray-50 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Price + remove */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-gray-900">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Footer / Checkout ─────────────────────────── */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-4 space-y-3 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
            {/* Savings badge */}
            {savings > 0 && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-2 rounded-lg">
                <Tag className="h-3.5 w-3.5 text-green-600" />
                <p className="text-xs text-green-700 font-semibold">
                  You&apos;re saving KES {Math.round(savings).toLocaleString()} on this order!
                </p>
              </div>
            )}

            {/* Summary */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Subtotal ({count} item{count !== 1 ? 's' : ''})</span>
                <span className="font-bold text-gray-800">KES {total.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Delivery</span>
                <span className="text-green-600 font-semibold text-xs">Calculated at checkout</span>
              </div>
              <div className="flex items-center justify-between font-black text-base pt-1 border-t border-gray-100">
                <span className="text-gray-900">Total</span>
                <span className="text-orange-500">KES {total.toLocaleString()}</span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/checkout"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3.5 rounded-xl transition-colors shadow-sm text-sm"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/listings"
              onClick={onClose}
              className="block text-center text-xs text-gray-400 hover:text-orange-500 transition-colors py-1"
            >
              ← Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
