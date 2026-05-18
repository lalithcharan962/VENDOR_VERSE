import api from './api';

export const fetchVendorProfile = async () => {
  const response = await api.get('/vendors/profile');
  return response.data;
};

export const createVendorProfile = async (payload) => {
  const response = await api.post('/vendors/profile', payload);
  return response.data;
};

export const updateVendorProfile = async (payload) => {
  const response = await api.put('/vendors/profile', payload);
  return response.data;
};

export const fetchVendorReviews = async (vendorId) => {
  const response = await api.get(`/reviews/vendors/${vendorId}`);
  return response.data;
};

export const postVendorReview = async (vendorId, payload) => {
  const response = await api.post(`/reviews/vendors/${vendorId}`, payload);
  return response.data;
};
