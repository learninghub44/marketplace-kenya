// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  register: async (email: string, password: string, role: string, phone?: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role, phone }),
    });
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
    });
    return response.json();
  },

  // Listings
  getListings: async (params?: { status?: string; category?: string; search?: string; seller_id?: string }) => {
    const queryString = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_BASE_URL}/api/listings?${queryString}`);
    return response.json();
  },

  getListing: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/listings/${id}`);
    return response.json();
  },

  createListing: async (data: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateListing: async (id: string, data: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/listings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteListing: async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/listings/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  // Favorites
  getFavorites: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  addFavorite: async (listingId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ listing_id: listingId }),
    });
    return response.json();
  },

  removeFavorite: async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/favorites/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  // Messages
  getMessages: async (token: string, params?: { listing_id?: string; other_user_id?: string }) => {
    const queryString = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_BASE_URL}/api/messages?${queryString}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  sendMessage: async (data: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // AI
  generateListing: async (productName: string, category: string, provider: string = 'groq', token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/ai/generate-listing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productName, category, provider }),
    });
    return response.json();
  },

  moderateContent: async (content: string, provider: string = 'groq', token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/ai/moderate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, provider }),
    });
    return response.json();
  },

  smartSearch: async (query: string) => {
    const response = await fetch(`${API_BASE_URL}/api/ai/smart-search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    return response.json();
  },

  detectFraud: async (listingData: any, provider: string = 'groq', token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/ai/detect-fraud`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ listingData, provider }),
    });
    return response.json();
  },

  // Admin
  getAdminStats: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  getAdminListings: async (token: string, status?: string) => {
    const queryString = status ? `?status=${status}` : '';
    const response = await fetch(`${API_BASE_URL}/api/admin/listings${queryString}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  approveListing: async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/listings/${id}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  rejectListing: async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/listings/${id}/reject`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  getReports: async (token: string, status?: string) => {
    const queryString = status ? `?status=${status}` : '';
    const response = await fetch(`${API_BASE_URL}/api/admin/reports${queryString}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  getTickets: async (token: string, status?: string) => {
    const queryString = status ? `?status=${status}` : '';
    const response = await fetch(`${API_BASE_URL}/api/admin/tickets${queryString}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  // Seller
  getSellerProfile: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/seller/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  updateSellerProfile: async (data: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/seller/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getSellerListings: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/seller/listings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  // Notifications
  getNotifications: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  markNotificationsRead: async (notificationIds: string[], read: boolean, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/notifications`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ notification_ids: notificationIds, read }),
    });
    return response.json();
  },
};
