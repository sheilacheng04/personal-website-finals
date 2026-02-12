const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  const response = await fetch(url, config);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

export const api = {
  // Feedback endpoints
  getFeedback: () => request('/feedback'),
  submitFeedback: (data) =>
    request('/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Projects endpoints (for future dynamic content)
  getProjects: () => request('/projects'),

  // Health check
  health: () => request('/health'),
};
