import api from './api';

export const recipeService = {
  async getRecipes(params = {}) {
    const response = await api.get('/recipes', { params });
    return response.data;
  },

  async getRecipe(id) {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  async createRecipe(formData) {
    const response = await api.post('/recipes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateRecipe(id, formData) {
    const response = await api.put(`/recipes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteRecipe(id) {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  async rateRecipe(id, rating) {
    const response = await api.post(`/recipes/${id}/ratings`, { value: rating });
    return response.data;
  },

  async toggleFavorite(id) {
    const response = await api.post(`/recipes/${id}/favorite`);
    return response.data;
  },

  async getFavorites() {
    const response = await api.get('/favorites/me');
    return response.data;
  },

  async getComments(recipeId) {
    const response = await api.get(`/comments/recipe/${recipeId}`);
    return response.data;
  },

  async addComment(recipeId, text) {
    const response = await api.post(`/comments/recipe/${recipeId}`, { text });
    return response.data;
  }
};