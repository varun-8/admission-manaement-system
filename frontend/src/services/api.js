const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('admission_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: data.message || `Server Error (${res.status}): ${res.statusText}`,
        status: res.status
      };
    }
    return data;
  } catch (err) {
    console.error('API Request Failure:', err);
    return {
      success: false,
      message: err.message || 'Network error occurred. Please check server connection.',
    };
  }
};

export const api = {
  // Auth
  login: async (email, password) => {
    return handleFetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  },

  registerUser: async (userData) => {
    return handleFetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
  },

  getMe: async () => {
    return handleFetch(`${API_BASE_URL}/auth/me`, { headers: getHeaders() });
  },

  // Leads
  getLeads: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return handleFetch(`${API_BASE_URL}/leads?${query}`, { headers: getHeaders() });
  },

  getLeadById: async (id) => {
    return handleFetch(`${API_BASE_URL}/leads/${id}`, { headers: getHeaders() });
  },

  createLead: async (leadData) => {
    return handleFetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(leadData),
    });
  },

  updateLead: async (id, leadData) => {
    return handleFetch(`${API_BASE_URL}/leads/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(leadData),
    });
  },

  assignLead: async (leadId, counsellorId) => {
    return handleFetch(`${API_BASE_URL}/leads/assign`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ leadId, counsellorId }),
    });
  },

  deleteLead: async (id) => {
    return handleFetch(`${API_BASE_URL}/leads/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  // Courses
  getCourses: async () => {
    return handleFetch(`${API_BASE_URL}/courses`, { headers: getHeaders() });
  },

  createCourse: async (courseData) => {
    return handleFetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(courseData),
    });
  },

  deleteCourse: async (id) => {
    return handleFetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  // Counsellors
  getCounsellors: async () => {
    return handleFetch(`${API_BASE_URL}/counsellors`, { headers: getHeaders() });
  },

  getCounsellorPerformance: async () => {
    return handleFetch(`${API_BASE_URL}/counsellors/performance`, { headers: getHeaders() });
  },

  deleteCounsellor: async (id) => {
    return handleFetch(`${API_BASE_URL}/counsellors/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  // Follow-ups
  createFollowUp: async (followUpData) => {
    return handleFetch(`${API_BASE_URL}/followups`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(followUpData),
    });
  },

  // Reports
  getAnalyticsSummary: async () => {
    return handleFetch(`${API_BASE_URL}/reports/summary`, { headers: getHeaders() });
  },
};
