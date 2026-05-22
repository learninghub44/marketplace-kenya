"use client"
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Users, Package, AlertTriangle, Ticket, LogOut, RefreshCw, CheckCircle, XCircle, Trash2, UserX, ChevronDown, Search, Shield, TrendingUp, MessageCircle, Eye, Ban, UserCheck, Star, Send, X } from 'lucide-react'
import { getUser, clearAuth, authHeaders } from '@/lib/auth'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-kenya-1.onrender.com'

const Badge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    open: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    closed: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    resolved: 'bg-green-100 text-green-700',
    admin: 'bg-purple-100 text-purple-700', seller: 'bg-blue-100 text-blue-700', buyer: 'bg-gray-100 text-gray-600',
    high: 'bg-red-100 text-red-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-gray-100 text-gray-500',
    banned: 'bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-400',
  }
  return <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${map[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>
}

function Toast({ msg, type, onClose }: any) {
  if (!msg) return null
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-semibold
      ${type === "error" ? "bg-red-600" : "bg-green-600"}`}>
      {msg}
      <button onClick={onClose} className="opacity-70 hover:opacity-100">✕</button>
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [tab, setTab] = useState('pending')
  const [stats, setStats] = useState<any>({})
  const [pendingListings, setPendingListings] = useState<any[]>([])
  const [allListings, setAllListings] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectId, setRejectId] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [listingSearch, setListingSearch] = useState('')
  const [listingFilter, setListingFilter] = useState('all')
  const [banId, setBanId] = useState('')
  const [banReason, setBanReason] = useState('')
  const [ticketId, setTicketId] = useState('')
  const [ticketReply, setTicketReply] = useState('')
  const [replies, setReplies] = useState<any[]>([])
  const [revenue, setRevenue] = useState<any>({})
  const [toast, setToast] = useState({ msg: '', type: 'success' })

  useEffect(() => {
    const u = getUser()
    if (!u || u.role !== 'admin') { router.push('/login'); return }
    setUser(u); fetchAll()
  }, [])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const h = authHeaders()
    try {
      const [s, pl, al, u, t, r, rev] = await Promise.all([
        fetch(`${API}/api/admin/stats`, { headers: h }).then(r => r.json()),
        fetch(`${API}/api/admin/listings?status=pending`, { headers: h }).then(r => r.json()),
        fetch(`${API}/api/admin/listings`, { headers: h }).then(r => r.json()),
        fetch(`${API}/api/admin/users`, { headers: h }).then(r => r.json()),
        fetch(`${API}/api/admin/tickets`, { headers: h }).then(r => r.json()),
        fetch(`${API}/api/admin/reports`, { headers: h }).then(r => r.json()),
        fetch(`${API}/api/admin/revenue`, { headers: h }).then(r => r.json()),
      ])
      if (rev.success) setRevenue(rev.revenue || {})
      if (s.success) setStats(s.stats)
      if (pl.success) setPendingListings(pl.listings || [])
      if (al.success) setAllListings(al.listings || [])
      if (u.success) setUsers(u.users || [])
      if (t.success) setTickets(t.tickets || [])
      if (r.success) setReports(r.reports || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [])

  const approve = async (id: string) => {
    await fetch(`${API}/api/admin/listings/${id}/approve`, { method: 'POST', headers: authHeaders() })
    fetchAll()
  }
  const reject = async (id: string) => {
    await fetch(`${API}/api/admin/listings/${id}/reject`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ reason: rejectReason }) })
    setRejectId(''); setRejectReason(''); fetchAll()
  }
  const deleteListing = async (id: string) => {
    if (!confirm('Permanently delete this listing?')) return
    await fetch(`${API}/api/admin/listings/${id}`, { method: 'DELETE', headers: authHeaders() })
    fetchAll()
  }
  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user and all their data?')) return
    await fetch(`${API}/api/admin/users/${id}`, { method: 'DELETE', headers: authHeaders() })
    fetchAll()
  }
  const changeRole = async (id: string, role: string) => {
    await fetch(`${API}/api/admin/users/${id}/role`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ role }) })
    fetchAll()
  }
  const closeTicket = async (id: string) => {
    await fetch(`${API}/api/admin/tickets/${id}/close`, { method: 'POST', headers: authHeaders() })
    fetchAll()
  }
  const resolveReport = async (id: string) => {
    await fetch(`${API}/api/admin/reports/${id}/resolve`, { method: 'POST', headers: authHeaders() })
    fetchAll()
  }

  const showToast = (msg: string, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000)
  }

  const banUser = async (id: string) => {
    await fetch(`${API}/api/admin/users/${id}/ban`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ reason: banReason }) })
    setBanId(''); setBanReason(''); showToast('User banned'); fetchAll()
  }

  const unbanUser = async (id: string) => {
    await fetch(`${API}/api/admin/users/${id}/unban`, { method: 'POST', headers: authHeaders() })
    showToast('User unbanned'); fetchAll()
  }

  const toggleFeatured = async (id: string, featured: boolean) => {
    await fetch(`${API}/api/admin/listings/${id}/feature`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ featured: !featured }) })
    showToast(!featured ? 'Listing featured ⭐' : 'Feature removed'); fetchAll()
  }

  const loadReplies = async (id: string) => {
    setTicketId(id)
    const r = await fetch(`${API}/api/admin/tickets/${id}/replies`, { headers: authHeaders() }).then(r => r.json())
    if (r.success) setReplies(r.replies || [])
  }

  const sendReply = async (id: string) => {
    if (!ticketReply.trim()) return
    await fetch(`${API}/api/admin/tickets/${id}/reply`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ message: ticketReply }) })
    setTicketReply(''); showToast('Reply sent ✓'); loadReplies(id); fetchAll()
  }

  const filteredUsers = users.filter(u => !userSearch || u.email?.toLowerCase().includes(userSearch.toLowerCase()))
  const filteredListings = allListings.filter(l => {
    const matchSearch = !listingSearch || l.title?.toLowerCase().includes(listingSearch.toLowerCase())
    const matchFilter = listingFilter === 'all' || l.status === listingFilter
    return matchSearch && matchFilter
  })

  const TABS = [
    { key: 'pending', label: 'Pending', count: pendingListings.length, icon: Package },
    { key: 'listings', label: 'All Listings', count: allListings.length, icon: Eye },
    { key: 'users', label: 'Users', count: users.length, icon: Users },
    { key: 'tickets', label: 'Tickets', count: tickets.filter(t => t.status === 'open').length, icon: Ticket },
    { key: 'reports', label: 'Reports', count: reports.filter(r => r.status === 'pending').length, icon: AlertTriangle },
  ]

  return (
    <>
    <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: 'success' })} />
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="bg-gray-900 dark:bg-gray-950 sticky top-0 z-50 shadow">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-orange-400 p-1.5 rounded-lg"><ShoppingBag className="h-4 w-4 text-gray-900" /></div>
            <span className="font-black text-white text-sm">Sokoni<span className="text-orange-400"> Kenya</span></span>
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Shield className="h-3 w-3" />ADMIN</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs hidden sm:block">{user?.email}</span>
            <button onClick={fetchAll} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="Refresh">
              <RefreshCw className="h-4 w-4" />
            </button>
            <Link href="/" className="text-xs text-gray-400 hover:text-white px-2 py-1.5 hover:bg-gray-800 rounded-lg hidden sm:block">Site</Link>
            <button onClick={() => { clearAuth(); router.push('/login') }} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
              <LogOut className="h-3.5 w-3.5" />Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-5 max-w-6xl space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
            { label: 'Listings', value: stats.totalListings, icon: Package, color: 'text-green-500' },
            { label: 'Pending', value: stats.pendingListings, icon: Package, color: 'text-yellow-500' },
            { label: 'Active', value: stats.activeListings, icon: TrendingUp, color: 'text-emerald-500' },
            { label: 'Reports', value: stats.reports, icon: AlertTriangle, color: 'text-red-500' },
            { label: 'Tickets', value: stats.openTickets, icon: Ticket, color: 'text-orange-500' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
              <Icon className={`h-5 w-5 ${color} flex-shrink-0`} />
              <div>
                <p className="text-xl font-black dark:text-white">{loading ? '—' : (value ?? 0)}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto border-b border-gray-100 dark:border-gray-700">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${tab === t.key ? 'border-orange-400 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                <t.icon className="h-4 w-4" />{t.label}
                {t.count > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === t.key ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{t.count}</span>}
              </button>
            ))}
          </div>

          <div className="p-5">
            {loading ? (
              <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
                <RefreshCw className="h-5 w-5 animate-spin" />Loading...
              </div>
            ) : (
              <>
                {/* PENDING LISTINGS */}
                {tab === 'pending' && (
                  <div className="space-y-3">
                    {pendingListings.length === 0
                      ? <div className="text-center py-16"><CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-2" /><p className="text-gray-500 font-semibold">All clear! No pending listings.</p></div>
                      : pendingListings.map(l => (
                        <div key={l.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold dark:text-white truncate">{l.title}</h3>
                              <p className="text-sm text-gray-500 mt-0.5">{l.category} · <span className="text-orange-500 font-semibold">KES {l.price?.toLocaleString()}</span> · {l.location}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{l.description}</p>
                              <p className="text-xs text-gray-400 mt-1">{new Date(l.created_at).toLocaleDateString('en-KE', { dateStyle: 'medium' })}</p>
                            </div>
                          </div>
                          {rejectId === l.id ? (
                            <div className="space-y-2">
                              <input value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                                placeholder="Reason for rejection (optional — will be emailed to seller)" />
                              <div className="flex gap-2">
                                <button onClick={() => reject(l.id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Confirm Reject</button>
                                <button onClick={() => { setRejectId(''); setRejectReason('') }} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2 flex-wrap">
                              <button onClick={() => approve(l.id)} className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"><CheckCircle className="h-4 w-4" />Approve & Notify</button>
                              <button onClick={() => setRejectId(l.id)} className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-2 rounded-lg text-sm font-semibold"><XCircle className="h-4 w-4" />Reject</button>
                            </div>
                          )}
                        </div>
                      ))
                    }
                  </div>
                )}

                {/* ALL LISTINGS */}
                {tab === 'listings' && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input value={listingSearch} onChange={e => setListingSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="Search listings..." />
                    </div>
                    {filteredListings.length === 0
                      ? <p className="text-center py-8 text-gray-400">No listings found</p>
                      : filteredListings.map(l => (
                        <div key={l.id} className="flex items-center gap-3 border border-gray-100 dark:border-gray-700 rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-sm dark:text-white truncate">{l.title}</h3>
                              <Badge status={l.status} />
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{l.category} · KES {l.price?.toLocaleString()} · {l.location}</p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            {l.status === 'pending' && <button onClick={() => approve(l.id)} className="p-2 text-green-500 hover:bg-green-50 rounded-lg" title="Approve"><CheckCircle className="h-4 w-4" /></button>}
                            <button onClick={() => deleteListing(l.id)} className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Delete"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )}

                {/* USERS */}
                {tab === 'users' && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input value={userSearch} onChange={e => setUserSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="Search by email..." />
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                          <tr>
                            {['Email','Role','Phone','Joined','Actions'].map(h => (
                              <th key={h} className="text-left py-3 px-3 font-semibold text-gray-600 dark:text-gray-300 text-xs whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                          {filteredUsers.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                              <td className="py-3 px-3 font-medium dark:text-white text-xs">{u.email}</td>
                              <td className="py-3 px-3"><Badge status={u.role} /></td>
                              <td className="py-3 px-3 text-gray-400 text-xs">{u.phone || '—'}</td>
                              <td className="py-3 px-3 text-gray-400 text-xs whitespace-nowrap">{new Date(u.created_at).toLocaleDateString()}</td>
                              <td className="py-3 px-3">
                                {u.role !== 'admin' ? (
                                  <div className="flex items-center gap-1.5">
                                    <select onChange={e => changeRole(u.id, e.target.value)} value={u.role}
                                      className="text-xs border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-1 py-1 focus:outline-none">
                                      <option value="buyer">buyer</option>
                                      <option value="seller">seller</option>
                                      <option value="admin">admin</option>
                                    </select>
                                    {u.banned
                                      ? <button onClick={() => unbanUser(u.id)} title="Unban" className="p-1.5 rounded text-gray-400 hover:text-green-600"><UserCheck className="h-4 w-4" /></button>
                                      : <button onClick={() => setBanId(u.id)} title="Ban" className="p-1.5 rounded text-gray-400 hover:text-red-500"><Ban className="h-4 w-4" /></button>
                                    }
                                    <button onClick={() => deleteUser(u.id)} className="p-1 text-red-400 hover:bg-red-50 rounded" title="Delete">
                                      <UserX className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                ) : <span className="text-xs text-gray-400">—</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TICKETS */}
                {tab === 'tickets' && (
                  <div className="space-y-3">
                    {tickets.length === 0
                      ? <div className="text-center py-16"><Ticket className="h-12 w-12 text-gray-200 mx-auto mb-2" /><p className="text-gray-500">No tickets yet</p></div>
                      : tickets.map(t => (
                        <div key={t.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-sm dark:text-white">{t.subject}</h3>
                                <Badge status={t.status} /><Badge status={t.priority || 'medium'} />
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{new Date(t.created_at).toLocaleDateString('en-KE', { dateStyle: 'medium' })}</p>
                            </div>
                            {t.status === 'open' && (
                              <button onClick={() => closeTicket(t.id)} className="flex-shrink-0 flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                                <CheckCircle className="h-3.5 w-3.5" />Close
                              </button>
                            )}
                          </div>
                          {t.status === 'open' && (
                            <a href={`https://wa.me/254701059192?text=Re ticket: ${t.subject}`} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2 text-xs text-green-600 font-semibold">
                              <MessageCircle className="h-3 w-3" />Reply via WhatsApp
                            </a>
                          )}
                        </div>
                      ))
                    }
                  </div>
                )}

                {/* REPORTS */}
                {tab === 'reports' && (
                  <div className="space-y-3">
                    {reports.length === 0
                      ? <div className="text-center py-16"><AlertTriangle className="h-12 w-12 text-gray-200 mx-auto mb-2" /><p className="text-gray-500">No reports yet</p></div>
                      : reports.map(r => (
                        <div key={r.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-sm dark:text-white">{r.reason}</h3>
                              <Badge status={r.status} />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{r.description}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
                          </div>
                          {r.status === 'pending' && (
                            <button onClick={() => resolveReport(r.id)} className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">Resolve</button>
                          )}
                        </div>
                      ))
                    }
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  </>
  )
}