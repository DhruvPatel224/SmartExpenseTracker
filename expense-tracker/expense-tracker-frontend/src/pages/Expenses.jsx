import React, { useState, useEffect } from 'react';
import expenseService from '../services/expenseService';
import ExpenseTable from '../components/ExpenseTable';

const CATEGORIES = ['Food', 'Shopping', 'Entertainment', 'Bills', 'Travel', 'Others'];

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Initial fetch and fetch when category changes
  useEffect(() => {
    loadExpenses(selectedCategory, searchTerm);
  }, [selectedCategory]);

  // Load expenses helper that directly queries the backend REST endpoints
  const loadExpenses = async (categoryFilter, searchFilter) => {
    try {
      setLoading(true);
      let response;
      if (categoryFilter) {
        response = await expenseService.filterExpensesByCategory(categoryFilter);
      } else if (searchFilter.trim()) {
        response = await expenseService.searchExpensesByTitle(searchFilter);
      } else {
        response = await expenseService.getAllExpenses();
      }
      setExpenses(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Failed to fetch expenses from the backend API.');
    } finally {
      setLoading(false);
    }
  };

  // Submit search query
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSelectedCategory(''); // Reset category when doing a title search
    loadExpenses('', searchTerm);
  };

  // Reset filters
  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    loadExpenses('', '');
  };

  // Handle deletion of an expense
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this expense record?')) {
      try {
        await expenseService.deleteExpense(id);
        setSuccessMessage('Expense record deleted successfully.');
        loadExpenses(selectedCategory, searchTerm); // Refresh list
        
        // Auto dismiss success alert
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Error deleting expense:', err);
        setError('Failed to delete expense record.');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  return (
    <div>
      {/* Title section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">View Expenses</h2>
          <p className="text-muted small mb-0">Search, filter, edit, or delete your logged transactions</p>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm border-0 border-start border-4 border-success" role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-check-circle-fill me-2 fs-5"></i>
            <div>{successMessage}</div>
          </div>
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show shadow-sm border-0 border-start border-4 border-danger" role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* Filter and Search Panel */}
      <div className="card shadow-sm mb-4 bg-white">
        <div className="card-body py-3">
          <div className="row g-3 align-items-center">
            {/* Search Form */}
            <div className="col-lg-6 col-md-5">
              <form onSubmit={handleSearchSubmit} className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="btn btn-primary d-flex align-items-center gap-2">
                  <i className="bi bi-search"></i> Search
                </button>
              </form>
            </div>

            {/* Category Dropdown */}
            <div className="col-lg-4 col-md-4">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => {
                  setSearchTerm(''); // Clear title search when switching to category filter
                  setSelectedCategory(e.target.value);
                }}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div className="col-lg-2 col-md-3">
              <button
                type="button"
                className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleReset}
              >
                <i className="bi bi-arrow-counterclockwise"></i> Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expense List Table */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <ExpenseTable expenses={expenses} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default Expenses;
