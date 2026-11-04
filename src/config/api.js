export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://practica07-backend.onrender.com' 
  : 'http://localhost:3000/api/v1';

export const fetchApi = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error en la petición');
    
    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  }
};