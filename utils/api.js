"use client"

// api.js
const BASE_URL = ''; // 根据实际情况替换

async function fetchAPI(url, config = {}, noContentType = fasle) {
  
  const fetchConfig = {
    ...config,
    headers: {
      ...config.headers,
    },
  }
  if(!noContentType) {
    fetchConfig['Content-Type'] = 'application/json'
  }
  console.log("fetch config: ", fetchConfig)
  const response = await fetch(`${BASE_URL}${url}`, fetchConfig);

  // 请求后拦截器
  if (!response.ok) {
    // 可以根据需求处理不同的HTTP错误
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

const api = {
  get: (url, config = {}) => fetchAPI(url, { ...config, method: 'GET' }),
  postRaw: (url, body, config = {}) => fetchAPI(url, { ...config, method: 'POST', body: body }, true),
  post: (url, body, config = {}) => fetchAPI(url, { ...config, method: 'POST', body: JSON.stringify(body) }),
  put: (url, body, config = {}) => fetchAPI(url, { ...config, method: 'PUT', body: JSON.stringify(body) }),
  delete: (url, config = {}) => fetchAPI(url, { ...config, method: 'DELETE' }),
  
};

export default api;
