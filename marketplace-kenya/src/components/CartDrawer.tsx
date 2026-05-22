'use client';

import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/store/cart';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, total, count } = useCart();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 z-50 bg-white dark:bg-gray-900 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-orange-500" />
            <h2 className="font-bold text-gray-900 dark:text-white">Cart</h2>
            {count > 0 && (
              <span className="bg-orange-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-9 w-9 text-gray-300 dark:text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-1">Browse products and add items to your cart</p>
              </div>
              <Link
                href="/listings"
                onClick={onClose}
                className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {items.map(item => (
                <li key={item.id} className="flex gap-3 px-4 py-3">
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2 leading-tight">{item.title}</p>
                    <p className="text-sm font-bold text-orange-500 mt-0.5">KES {item.price.toLocaleString()}</p>
                    {item.variant && (
                      <p className="text-xs text-gray-400 mt-0.5">{item.variant}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Subtotal ({count} items)</span>
              <span className="font-black text-lg text-gray-900 dark:text-white">KES {total.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-400">Delivery charges calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full bg-orange-400 hover:bg-orange-500 text-gray-900 font-black py-3 rounded-xl transition-colors"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/listings"
              onClick={onClose}
              className="block text-center text-sm text-gray-500 hover:text-orange-500 transition-colors py-1"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
