import api from './api';

export const fetchAllVendors = async () => {
  const response = await api.get('/browse/vendors');
  return response.data;
};

export const fetchVendorById = async (id) => {
  const response = await api.get(`/browse/vendors/${id}`);
  return response.data;
};

export const fetchVendorProducts = async (vendorId) => {
  const response = await api.get(`/browse/vendors/${vendorId}/products`);
  return response.data;
};

export const recordVendorInquiry = async (vendorId) => {
  const response = await api.post(`/browse/vendors/${vendorId}/inquire`);
  return response.data;
};

export const fetchAllProducts = async () => {
  const response = await api.get('/browse/products');
  return response.data;
};
