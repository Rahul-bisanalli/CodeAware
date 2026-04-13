const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');
const apiBaseUrl = configuredBaseUrl || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  return response.json();
}

export const api = {
  analyzeCode(payload) {
    return request('/analyze', {
      body: JSON.stringify(payload),
      method: 'POST',
    });
  },

  getGithubIssues(query) {
    return request(`/github-issues?query=${encodeURIComponent(query)}`);
  },

  getModels() {
    return request('/models');
  },

  health() {
    return request('/');
  },
};
