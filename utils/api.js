const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Get auth token from localStorage
function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

// API request helper
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

// Auth APIs
export const authAPI = {
  register: (userData) => apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
};

// Transaction APIs
export const transactionAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/api/transactions?${params}`);
  },
  
  create: (transactionData) => apiRequest('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  }),
  
  update: (id, transactionData) => apiRequest(`/api/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(transactionData),
  }),
  
  delete: (id) => apiRequest(`/api/transactions/${id}`, {
    method: 'DELETE',
  }),
};

// Stats APIs
export const statsAPI = {
  get: () => apiRequest('/api/stats'),
};

// Analytics APIs
export const analyticsAPI = {
  getMonthly: (year) => apiRequest(`/api/analytics?year=${year}`),
};

// User APIs
export const userAPI = {
  updateSavingsGoal: (percentage) => apiRequest('/api/user/savings-goal', {
    method: 'PUT',
    body: JSON.stringify({ savingsGoalPercentage: percentage }),
  }),
};