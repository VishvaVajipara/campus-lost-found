import api from './api';

// Each function calls one backend endpoint and returns just the useful data.

export const fetchItems = async (params) => {
  const { data } = await api.get('/items', { params });
  return data; // { items, page, totalPages, totalItems }
};

export const fetchMyItems = async () => {
  const { data } = await api.get('/items/my-items');
  return data.items;
};

export const fetchItemById = async (id) => {
  const { data } = await api.get(`/items/${id}`);
  return data.item;
};

export const createItem = async (itemData) => {
  const { data } = await api.post('/items', itemData);
  return data.item;
};

export const updateItem = async (id, itemData) => {
  const { data } = await api.put(`/items/${id}`, itemData);
  return data.item;
};

export const updateItemStatus = async (id, status) => {
  const { data } = await api.patch(`/items/${id}/status`, { status });
  return data.item;
};

export const deleteItem = async (id) => {
  await api.delete(`/items/${id}`);
};

export const fetchDashboardStats = async () => {
  const { data } = await api.get('/dashboard/stats');
  return data;
};
