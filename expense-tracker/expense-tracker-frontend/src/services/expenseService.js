import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/expenses';

const expenseService = {
  // Fetch all expenses
  getAllExpenses: () => {
    return axios.get(API_BASE_URL);
  },

  // Fetch a single expense by ID
  getExpenseById: (id) => {
    return axios.get(`${API_BASE_URL}/${id}`);
  },

  // Create a new expense
  addExpense: (expense) => {
    return axios.post(API_BASE_URL, expense);
  },

  // Update an existing expense by ID
  updateExpense: (id, expense) => {
    return axios.put(`${API_BASE_URL}/${id}`, expense);
  },

  // Delete an expense by ID
  deleteExpense: (id) => {
    return axios.delete(`${API_BASE_URL}/${id}`);
  },

  // Search expenses by title query parameter
  searchExpensesByTitle: (title) => {
    return axios.get(`${API_BASE_URL}/search`, { params: { title } });
  },

  // Filter expenses by category parameter
  filterExpensesByCategory: (category) => {
    return axios.get(`${API_BASE_URL}/category/${category}`);
  }
};

export default expenseService;
