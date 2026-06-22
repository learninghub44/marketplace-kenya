"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Users, Package, AlertTriangle, Ticket, LogOut, RefreshCw, CheckCircle, XCircle, Eye, UserX } from 'lucide-react'
import { getToken, getUser, clearAuth, authHeaders } from '@/lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ totalUsers:0, totalSellers:0, totalBuyers:0, totalListings:0, pendingListings:0, activeListings:0, reports:0, openTickets:0 })
  const [pendingListings, setPendingListings] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('pending')
  const [rejectReason, setRejectReason] = useState('')
  const [rejectingId, setRejectingId] = useState('')

  useEffect(() => {
    const u = getUser()
    if (!u || u.role !== 'admin') { router.push('/login'); return }
    setUser(u)
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const h = authHeaders()
      const [s, l, r, t, u] = await Promise.all([
        fetch(`${API_BASE}/api/admin/stats`, { headers: h }),
        fetch(`${API_BASE}/api/admin/listings?status=pending`, { headers: h }),
        fetch(`${API_BASE}/api/admin/reports`, { headers: h }),
        fetch(`${API_BASE}/api/admin/tickets`, { headers: h }),
        fetch(`${API_BASE}/api/admin/users`, { headers: h }),
      ])
      const [sd, ld, rd, td, ud] = await Promise.all([s.json(), l.json(), r.json(), t.json(), u.json()])
      if (sd.success) setStats(sd.stats)
      if (ld.success) setPendingListings(ld.listings || [])
      if (rd.success) setReports(rd.reports || [])
      if (td.success) setTickets(td.tickets || [])
      if (ud.success) setUsers(ud.users || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const approveListing = async (id: string) => {
    await fetch(`${API_BASE}/api/admin/listings/${id}/approve`, { method:'POST', headers: authHeaders() })
    fetchAll()
  }

  const rejectListing = async (id: string) => {
    await fetch(`${API_BASE}/api/admin/listings/${id}/reject`, { method:'POST', headers: authHeaders(), body: JSON.stringify({ reason: rejectReason }) })
    setRejectingId(''); setRejectReason(''); fetchAll()
  }

  const closeTicket = async (id: string) => {
    await fetch(`${API_BASE}/api/admin/tickets/${id}/close`, { method:'POST', headers: authHeaders() })
    fetchAll()
  }

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return
    await fetch(`${API_BASE}/api/admin/users/${id}`, { method:'DELETE', headers: authHeaders() })
    fetchAll()
  }

  const logout = () => { clearAuth(); router.push('/login') }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, sub: `${stats.totalSellers} sellers · ${stats.totalBuyers} buyers`, color: 'bg-blue-500', icon: Users },
    { label: 'Listings', value: stats.totalListings, sub: `${stats.activeListings} active · ${stats.pendingListings} pending`, color: 'bg-green-500', icon: Package },
    { label: 'Reports', value: stats.reports, sub: 'Awaiting review', color: 'bg-red-500', icon: AlertTriangle },
    { label: 'Open Tickets', value: stats.openTickets, sub: 'Support tickets', color: 'bg-orange-500', icon: Ticket },
  ]

  const tabs = [
    { key: 'pending', label: `Pending (${pendingListings.length})` },
    { key: 'reports', label: `Reports (${reports.length})` },
    { key: 'tickets', label: `Tickets (${tickets.length})` },
    { key: 'users', label: `Users (${users.length})` },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-6 w-6 text-orange-400" />
            <div><span className="font-black text-orange-400">Sokoni Kenya</span><span className="ml-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">ADMIN</span></div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchAll} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800"><RefreshCw className="h-4 w-4" /></button>
            <span className="text-gray-300 text-sm hidden sm:block">{user?.email}</span>
            <button onClick={logout} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm">
              <LogOut className="h-4 w-4" />Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, sub, color, icon: Icon }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm p-5 flex items-start gap-4">
              <div className={`${color} p-3 rounded-lg flex-shrink-0`}><Icon className="h-5 w-5 text-white" /></div>
              <div>
                <p className="text-2xl font-black text-gray-900">{loading ? '...' : value}</p>
                <p className="text-sm font-semibold text-gray-700">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto border-b border-gray-100">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${tab === t.key ? 'border-b-2 border-orange-400 text-orange-500' : 'text-gray-500 hover:text-gray-700'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (

              <>
              {/* Pending Listings */}
              {tab === 'pending' && (
                <div className="space-y-3">
                  {pendingListings.length === 0 ? <div className="text-center py-12 text-gray-400"> No pending listings</div> :
                    [...pendingListings].sort((a, b) => (b.ai_flagged === a.ai_flagged ? (b.ai_fraud_score || 0) - (a.ai_fraud_score || 0) : (b.ai_flagged ? 1 : 0) - (a.ai_flagged ? 1 : 0))).map(listing => (
                      <div key={listing.id} className={`border rounded-xl p-4 ${listing.ai_flagged || listing.ai_fraud_score >= 0.5 ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-gray-900">{listing.title}</h3>
                              {listing.ai_flagged && (
                                <span className="flex items-center gap-1 text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                  <AlertTriangle className="h-3 w-3" />Flagged by AI
                                </span>
                              )}
                              {listing.ai_fraud_score >= 0.5 && (
                                <span className="flex items-center gap-1 text-xs font-semibold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                  <AlertTriangle className="h-3 w-3" />Fraud risk {Math.round(listing.ai_fraud_score * 100)}%
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">{listing.category} · KES {listing.price?.toLocaleString()} · {listing.location}</p>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{listing.description}</p>
                            {listing.ai_flag_reason && <p className="text-xs text-red-600 mt-1">AI: {listing.ai_flag_reason}</p>}
                            {listing.ai_fraud_reasons?.length > 0 && <p className="text-xs text-yellow-700 mt-0.5">Risk factors: {listing.ai_fraud_reasons.join(', ')}</p>}
                            <p className="text-xs text-gray-400 mt-1">{new Date(listing.created_at).toLocaleDateString('en-KE', { dateStyle:'medium' })}</p>
                          </div>
                        </div>
                        {rejectingId === listing.id ? (
                          <div className="mt-3 space-y-2">
                            <input value={rejectReason} onChange={e=>setRejectReason(e.target.value)} placeholder="Reason for rejection (optional)" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
                            <div className="flex gap-2">
                              <button onClick={() => rejectListing(listing.id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Confirm Reject</button>
                              <button onClick={() => { setRejectingId(''); setRejectReason('') }} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2 mt-3">
                            <button onClick={() => approveListing(listing.id)} className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                              <CheckCircle className="h-4 w-4" />Approve
                            </button>
                            <button onClick={() => setRejectingId(listing.id)} className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold">
                              <XCircle className="h-4 w-4" />Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  }
                </div>
              )}

              {/* Reports */}
              {tab === 'reports' && (
                <div className="space-y-3">
                  {reports.length === 0 ? <div className="text-center py-12 text-gray-400"> No pending reports</div> :
                    reports.map(report => (
                      <div key={report.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-900">{report.reason}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{report.status}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                        <p className="text-xs text-gray-400 mt-2">{new Date(report.created_at).toLocaleDateString()}</p>
                      </div>
                    ))
                  }
                </div>
              )}

              {/* Support Tickets */}
              {tab === 'tickets' && (
                <div className="space-y-3">
                  {tickets.length === 0 ? <div className="text-center py-12 text-gray-400"> No open tickets</div> :
                    tickets.map(ticket => (
                      <div key={ticket.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-gray-900">{ticket.subject}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${ticket.priority === 'high' ? 'bg-red-100 text-red-700' : ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{ticket.priority}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{ticket.message}</p>
                            <p className="text-xs text-gray-400 mt-2">{new Date(ticket.created_at).toLocaleDateString()}</p>
                          </div>
                          {ticket.status === 'open' && (
                            <button onClick={() => closeTicket(ticket.id)} className="flex-shrink-0 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                              Close
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}

              {/* Users */}
              {tab === 'users' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-2 font-semibold text-gray-600">Email</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-600">Role</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-600">Phone</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-600">Joined</th>
                      <th className="py-3 px-2"></th>
                    </tr></thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-3 px-2 font-medium">{u.email}</td>
                          <td className="py-3 px-2"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${u.role==='admin'?'bg-purple-100 text-purple-700':u.role==='seller'?'bg-blue-100 text-blue-700':'bg-gray-100 text-gray-600'}`}>{u.role}</span></td>
                          <td className="py-3 px-2 text-gray-500">{u.phone || '—'}</td>
                          <td className="py-3 px-2 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                          <td className="py-3 px-2">
                            {u.role !== 'admin' && <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-700 p-1"><UserX className="h-4 w-4" /></button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              </>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <Link href="/listings" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md flex items-center gap-3 transition-shadow">
            <Eye className="h-5 w-5 text-blue-500" /><span className="font-semibold">View Live Listings</span>
          </Link>
          <Link href="/support" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md flex items-center gap-3 transition-shadow">
            <Ticket className="h-5 w-5 text-orange-500" /><span className="font-semibold">Support Center</span>
          </Link>
          <a href="https://wa.me/254701059192" target="_blank" rel="noopener noreferrer" className="bg-green-50 rounded-xl p-4 shadow-sm hover:shadow-md flex items-center gap-3 transition-shadow">
            <span className="text-green-600 font-semibold"> WhatsApp Support</span>
          </a>
        </div>
      </div>
    </div>
  )
}
