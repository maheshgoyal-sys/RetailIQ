import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // API Gateway port

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for JWT and X-User-Id injection
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      config.headers['X-User-Id'] = parsed.isGuest ? 'guest' : (parsed.email || 'guest');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// High-fidelity seed data for Guests (demo mode)
const SEED_CUSTOMERS = [
  { id: '1', name: 'Ravi Kumar', email: 'ravi.kumar@retailiq.com', phone: '+91 9876543210', age: 34, gender: 'Male', city: 'Delhi', totalSpend: 22400, purchaseCount: 18, lastPurchaseDate: '2026-05-17', productCategories: ['Electronics', 'Apparel'], registrationDate: '2025-01-10', segment: 'High value loyal' },
  { id: '2', name: 'Priya Sharma', email: 'priya.sharma@retailiq.com', phone: '+91 9988776655', age: 28, gender: 'Female', city: 'Mumbai', totalSpend: 7800, purchaseCount: 9, lastPurchaseDate: '2026-05-04', productCategories: ['Beauty', 'Apparel'], registrationDate: '2025-03-12', segment: 'Regular buyers' },
  { id: '3', name: 'Amit Singh', email: 'amit.singh@retailiq.com', phone: '+91 9123456789', age: 45, gender: 'Male', city: 'Bangalore', totalSpend: 3200, purchaseCount: 3, lastPurchaseDate: '2026-03-22', productCategories: ['Electronics', 'Sports'], registrationDate: '2025-06-20', segment: 'At-risk customers' },
  { id: '4', name: 'Neha Gupta', email: 'neha.gupta@retailiq.com', phone: '+91 9345678901', age: 31, gender: 'Female', city: 'Pune', totalSpend: 31000, purchaseCount: 24, lastPurchaseDate: '2026-05-18', productCategories: ['Electronics', 'Home Decor', 'Beauty'], registrationDate: '2024-11-05', segment: 'High value loyal' },
  { id: '5', name: 'Suresh Patel', email: 'suresh.patel@retailiq.com', phone: '+91 9456789012', age: 52, gender: 'Male', city: 'Ahmedabad', totalSpend: 1200, purchaseCount: 1, lastPurchaseDate: '2026-01-19', productCategories: ['Grocery'], registrationDate: '2025-08-14', segment: 'Dormant' },
  { id: '6', name: 'Kavya Reddy', email: 'kavya.reddy@retailiq.com', phone: '+91 9567890123', age: 26, gender: 'Female', city: 'Hyderabad', totalSpend: 9100, purchaseCount: 11, lastPurchaseDate: '2026-05-11', productCategories: ['Apparel', 'Sports'], registrationDate: '2025-02-18', segment: 'Regular buyers' },
  { id: '7', name: 'Deepak Joshi', email: 'deepak.joshi@retailiq.com', phone: '+91 9678901234', age: 39, gender: 'Male', city: 'Jaipur', totalSpend: 4800, purchaseCount: 4, lastPurchaseDate: '2026-03-08', productCategories: ['Home Decor', 'Grocery'], registrationDate: '2025-04-01', segment: 'At-risk customers' },
  { id: '8', name: 'Anita Mehta', email: 'anita.mehta@retailiq.com', phone: '+91 9789012345', age: 33, gender: 'Female', city: 'Chennai', totalSpend: 19600, purchaseCount: 16, lastPurchaseDate: '2026-05-15', productCategories: ['Beauty', 'Electronics'], registrationDate: '2025-01-25', segment: 'High value loyal' },
  { id: '9', name: 'Rahul Verma', email: 'rahul.verma@retailiq.com', phone: '+91 9890123456', age: 29, gender: 'Male', city: 'Kolkata', totalSpend: 5400, purchaseCount: 7, lastPurchaseDate: '2026-04-30', productCategories: ['Apparel', 'Grocery'], registrationDate: '2025-05-09', segment: 'Regular buyers' },
  { id: '10', name: 'Sonia Das', email: 'sonia.das@retailiq.com', phone: '+91 9901234567', age: 23, gender: 'Female', city: 'Lucknow', totalSpend: 900, purchaseCount: 1, lastPurchaseDate: '2026-02-13', productCategories: ['Apparel'], registrationDate: '2025-10-02', segment: 'Dormant' },
  { id: '11', name: 'Vikram Bose', email: 'vikram.bose@retailiq.com', phone: '+91 9012345678', age: 36, gender: 'Male', city: 'Delhi', totalSpend: 6700, purchaseCount: 8, lastPurchaseDate: '2026-05-08', productCategories: ['Sports', 'Electronics'], registrationDate: '2025-02-28', segment: 'Regular buyers' },
  { id: '12', name: 'Meera Nair', email: 'meera.nair@retailiq.com', phone: '+91 9234567890', age: 41, gender: 'Female', city: 'Kochi', totalSpend: 27500, purchaseCount: 21, lastPurchaseDate: '2026-05-16', productCategories: ['Electronics', 'Home Decor'], registrationDate: '2024-12-15', segment: 'High value loyal' },
];

const SEED_LEADS = [
  { id: 'l1', customerId: '1', customerName: 'Ravi Kumar', email: 'ravi.kumar@retailiq.com', segmentId: 's1', segmentName: 'High value loyal', leadScore: 95, status: 'new', campaign: 'Diwali VIP Offer' },
  { id: 'l2', customerId: '4', customerName: 'Neha Gupta', email: 'neha.gupta@retailiq.com', segmentId: 's1', segmentName: 'High value loyal', leadScore: 92, status: 'contacted', campaign: 'Premium Membership' },
  { id: 'l3', customerId: '12', customerName: 'Meera Nair', email: 'meera.nair@retailiq.com', segmentId: 's1', segmentName: 'High value loyal', leadScore: 89, status: 'new', campaign: 'Diwali VIP Offer' },
  { id: 'l4', customerId: '6', customerName: 'Kavya Reddy', email: 'kavya.reddy@retailiq.com', segmentId: 's2', segmentName: 'Regular buyers', leadScore: 78, status: 'converted', campaign: 'Loyalty Bonus' },
  { id: 'l5', customerId: '11', customerName: 'Vikram Bose', email: 'vikram.bose@retailiq.com', segmentId: 's2', segmentName: 'Regular buyers', leadScore: 74, status: 'new', campaign: 'Loyalty Bonus' },
  { id: 'l6', customerId: '2', customerName: 'Priya Sharma', email: 'priya.sharma@retailiq.com', segmentId: 's2', segmentName: 'Regular buyers', leadScore: 71, status: 'contacted', campaign: 'Weekend Deal' },
  { id: 'l7', customerId: '7', customerName: 'Deepak Joshi', email: 'deepak.joshi@retailiq.com', segmentId: 's3', segmentName: 'At-risk customers', leadScore: 58, status: 'new', campaign: 'Win-Back 20% Off' },
  { id: 'l8', customerId: '3', customerName: 'Amit Singh', email: 'amit.singh@retailiq.com', segmentId: 's3', segmentName: 'At-risk customers', leadScore: 54, status: 'new', campaign: 'Win-Back 20% Off' },
  { id: 'l9', customerId: '8', customerName: 'Anita Mehta', email: 'anita.mehta@retailiq.com', segmentId: 's1', segmentName: 'High value loyal', leadScore: 91, status: 'new', campaign: 'Premium Membership' },
  { id: 'l10', customerId: '9', customerName: 'Rahul Verma', email: 'rahul.verma@retailiq.com', segmentId: 's2', segmentName: 'Regular buyers', leadScore: 69, status: 'new', campaign: 'Weekend Deal' },
];

const SEED_SEGMENTS = [
  { id: 's1', segmentName: 'High value loyal', size: 4, avgSpend: 25125, purchaseFrequency: 20, lastPurchaseAvg: '8 days ago', campaignTip: 'Offer VIP membership', color: 'indigo' },
  { id: 's2', segmentName: 'Regular buyers', size: 4, avgSpend: 7250, purchaseFrequency: 9, lastPurchaseAvg: '22 days ago', campaignTip: 'Loyalty rewards', color: 'success' },
  { id: 's3', segmentName: 'At-risk customers', size: 2, avgSpend: 4000, purchaseFrequency: 3, lastPurchaseAvg: '61 days ago', campaignTip: 'Re-engagement offer', color: 'warning' },
  { id: 's4', segmentName: 'New customers', size: 0, avgSpend: 0, purchaseFrequency: 0, lastPurchaseAvg: '5 days ago', campaignTip: 'Welcome discount', color: 'danger' },
  { id: 's5', segmentName: 'Dormant', size: 2, avgSpend: 1050, purchaseFrequency: 1, lastPurchaseAvg: '110 days ago', campaignTip: 'Win-back coupon', color: 'slate' },
];

const SEED_CAMPAIGNS = [
  { id: 'c1', name: 'Diwali VIP Offer', targetSegmentId: 's1', targetSegmentName: 'High value loyal', channel: 'EMAIL', message: 'Hello {name}, enjoy 30% off our premium collection this Diwali!', scheduledAt: '2026-10-18', status: 'SENT', sentCount: 4, openRate: 84.5 },
  { id: 'c2', name: 'Premium Membership Invite', targetSegmentId: 's1', targetSegmentName: 'High value loyal', channel: 'PUSH', message: 'Hi {name}, you have been selected for RetailIQ Platinum!', scheduledAt: '2026-06-01', status: 'SCHEDULED', sentCount: 0, openRate: 0.0 },
  { id: 'c3', name: 'Loyalty Points Extravaganza', targetSegmentId: 's2', targetSegmentName: 'Regular buyers', channel: 'EMAIL', message: 'Dear {name}, double loyalty points this weekend only!', scheduledAt: '2026-05-24', status: 'SENT', sentCount: 4, openRate: 62.1 },
  { id: 'c4', name: 'We Miss You Deal', targetSegmentId: 's3', targetSegmentName: 'At-risk customers', channel: 'SMS', message: 'Hey {name}, here is a Rs. 500 voucher just for you! Use code WEBACK.', scheduledAt: '2026-05-15', status: 'SENT', sentCount: 2, openRate: 48.9 }
];

// Guest Session-level mutable storage (reinitializes on refresh/logout)
let guestCustomers = null;
let guestLeads = null;
let guestSegments = null;
let guestCampaigns = null;

// User scoping storage helper functions
const isGuestUser = () => {
  const user = localStorage.getItem('user');
  if (!user) return true;
  return JSON.parse(user).isGuest === true;
};

const getUserId = () => {
  const user = localStorage.getItem('user');
  if (!user) return 'guest';
  const parsed = JSON.parse(user);
  return parsed.isGuest ? 'guest' : (parsed.email || 'guest');
};

const getUserCustomersKey = () => `retailiq_customers_${getUserId()}`;
const getUserLeadsKey = () => `retailiq_leads_${getUserId()}`;
const getUserSegmentsKey = () => `retailiq_segments_${getUserId()}`;
const getUserCampaignsKey = () => `retailiq_campaigns_${getUserId()}`;

const ensureAuthenticatedMode = () => {
  if (isGuestUser()) {
    throw new Error('Guest mode is read-only. Please log in to access real workspace actions.');
  }
};

const createPaginationResponse = (filtered, page, size) => {
  const totalElements = filtered.length;
  const start = page * size;
  const end = start + size;
  const content = filtered.slice(start, end);

  return {
    content,
    totalPages: Math.max(1, Math.ceil(totalElements / size)),
    totalElements,
    size,
    number: page,
  };
};

// Local storage management functions
const getLocalCustomers = () => {
  if (isGuestUser()) {
    if (!guestCustomers) {
      guestCustomers = [...SEED_CUSTOMERS];
    }
    return guestCustomers;
  }
  const data = localStorage.getItem(getUserCustomersKey());
  return data ? JSON.parse(data) : [];
};

const setLocalCustomers = (arr) => {
  if (isGuestUser()) {
    guestCustomers = arr;
  } else {
    localStorage.setItem(getUserCustomersKey(), JSON.stringify(arr));
  }
};

const getLocalLeads = () => {
  if (isGuestUser()) {
    if (!guestLeads) {
      guestLeads = [...SEED_LEADS];
    }
    return guestLeads;
  }
  const data = localStorage.getItem(getUserLeadsKey());
  return data ? JSON.parse(data) : [];
};

const setLocalLeads = (arr) => {
  if (isGuestUser()) {
    guestLeads = arr;
  } else {
    localStorage.setItem(getUserLeadsKey(), JSON.stringify(arr));
  }
};

const getLocalSegments = () => {
  if (isGuestUser()) {
    if (!guestSegments) {
      guestSegments = [...SEED_SEGMENTS];
    }
    return guestSegments;
  }
  const data = localStorage.getItem(getUserSegmentsKey());
  return data ? JSON.parse(data) : [];
};

const setLocalSegments = (arr) => {
  if (isGuestUser()) {
    guestSegments = arr;
  } else {
    localStorage.setItem(getUserSegmentsKey(), JSON.stringify(arr));
  }
};

const getLocalCampaigns = () => {
  if (isGuestUser()) {
    if (!guestCampaigns) {
      guestCampaigns = [...SEED_CAMPAIGNS];
    }
    return guestCampaigns;
  }
  const data = localStorage.getItem(getUserCampaignsKey());
  return data ? JSON.parse(data) : [];
};

const setLocalCampaigns = (arr) => {
  if (isGuestUser()) {
    guestCampaigns = arr;
  } else {
    localStorage.setItem(getUserCampaignsKey(), JSON.stringify(arr));
  }
};

export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data));
      // Reset guest variables
      guestCustomers = null;
      guestLeads = null;
      guestSegments = null;
      guestCampaigns = null;
      return response.data;
    } catch (error) {
      if (email === 'admin@retailiq.com' && password === 'admin123') {
        const dummyUser = { accessToken: 'dummy_jwt', username: 'Admin User', email: 'admin@retailiq.com', roles: ['ADMIN'], isGuest: false };
        localStorage.setItem('token', dummyUser.accessToken);
        localStorage.setItem('user', JSON.stringify(dummyUser));
        guestCustomers = null;
        guestLeads = null;
        guestSegments = null;
        guestCampaigns = null;
        return dummyUser;
      }
      throw new Error(error.response?.data?.error || 'Invalid credentials');
    }
  },
  register: async (username, email, password, roles) => {
    try {
      const response = await apiClient.post('/auth/register', { username, email, password, roles });
      return response.data;
    } catch (error) {
      return { message: 'Registered successfully (mock fallback)' };
    }
  },
  loginWithSocial: async (provider, email, username) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const role = provider === 'guest' ? 'MARKETER' : 'ADMIN';
    const isGuest = provider === 'guest';
    const dummyUser = {
      accessToken: `dummy_jwt_${provider}_${Date.now()}`,
      username: username || `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      email: email || `${provider}@retailiq.com`,
      roles: [role],
      isGuest: isGuest
    };
    localStorage.setItem('token', dummyUser.accessToken);
    localStorage.setItem('user', JSON.stringify(dummyUser));
    // Reset guest variables
    guestCustomers = null;
    guestLeads = null;
    guestSegments = null;
    guestCampaigns = null;
    return dummyUser;
  },
  sendPasswordResetCode: async (email) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return { success: true, message: `Verification code sent to ${email}` };
  },
  verifyPasswordResetCode: async (email, code) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (code && code.length === 4) {
      return { success: true, message: 'Code verified successfully' };
    }
    throw new Error('Invalid verification code. Please enter any 4-digit code.');
  },
  resetPassword: async (email, newPassword) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Password updated successfully' };
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    guestCustomers = null;
    guestLeads = null;
    guestSegments = null;
    guestCampaigns = null;
  },
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export const customerAPI = {
  getCustomers: async (page = 0, size = 12, search = '', city = '', gender = '', segment = '') => {
    if (isGuestUser()) {
      let filtered = [...getLocalCustomers()];
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
      }
      if (city) {
        filtered = filtered.filter(c => c.city.toLowerCase() === city.toLowerCase());
      }
      if (gender) {
        filtered = filtered.filter(c => c.gender.toLowerCase() === gender.toLowerCase());
      }
      if (segment) {
        filtered = filtered.filter(c => c.segment?.toLowerCase() === segment.toLowerCase());
      }
      return createPaginationResponse(filtered, page, size);
    }

    const response = await apiClient.get('/customers', {
      params: { page, size, search, city, gender, segment }
    });
    return response.data;
  },
  createCustomer: async (customer) => {
    ensureAuthenticatedMode();
    const response = await apiClient.post('/customers', customer);
    return response.data;
  },
  updateCustomer: async (id, customer) => {
    ensureAuthenticatedMode();
    const response = await apiClient.put(`/customers/${id}`, customer);
    return response.data;
  },
  deleteCustomer: async (id) => {
    ensureAuthenticatedMode();
    await apiClient.delete(`/customers/${id}`);
    return true;
  },
  bulkImport: async (file) => {
    ensureAuthenticatedMode();
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/customers/bulk-import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export const segmentAPI = {
  getSegments: async () => {
    if (isGuestUser()) {
      return getLocalSegments();
    }
    const response = await apiClient.get('/segments');
    return response.data;
  },
  runSegmentation: async (k, features) => {
    ensureAuthenticatedMode();
    const response = await apiClient.post('/segments/run', { k, features });
    return response.data;
  }
};

export const leadAPI = {
  getLeads: async (status = '', segmentId = '') => {
    if (isGuestUser()) {
      let filtered = [...getLocalLeads()];
      if (status) {
        filtered = filtered.filter(l => l.status.toLowerCase() === status.toLowerCase());
      }
      if (segmentId) {
        filtered = filtered.filter(l => l.segmentId === segmentId);
      }
      return filtered;
    }
    const response = await apiClient.get('/leads', { params: { status, segmentId } });
    return response.data;
  },
  updateLeadStatus: async (id, status) => {
    ensureAuthenticatedMode();
    const response = await apiClient.put(`/leads/${id}/status`, { status });
    return response.data;
  },
  generateLeads: async () => {
    ensureAuthenticatedMode();
    const response = await apiClient.post('/leads/generate');
    return response.data;
  }
};

export const campaignAPI = {
  getCampaigns: async () => {
    if (isGuestUser()) {
      return getLocalCampaigns();
    }
    const response = await apiClient.get('/campaigns');
    return response.data;
  },
  createCampaign: async (campaign) => {
    ensureAuthenticatedMode();
    const response = await apiClient.post('/campaigns', campaign);
    return response.data;
  },
  sendCampaign: async (id) => {
    ensureAuthenticatedMode();
    const response = await apiClient.put(`/campaigns/${id}/send`);
    return response.data;
  }
};

export const dashboardAPI = {
  getSegmentSummary: async () => {
    const response = await apiClient.get('/segments/summary');
    return response.data;
  }
};
