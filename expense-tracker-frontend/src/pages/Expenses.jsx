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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Initial fetch and fetch when category changes
  useEffect(() => {
    loadExpenses(selectedCategory, searchTerm, startDate, endDate);
  }, [selectedCategory]);

  // Load expenses helper that directly queries the backend REST endpoints
  const loadExpenses = async (categoryFilter, searchFilter, start, end) => {
    try {
      setLoading(true);
      let response;
      if (start && end) {
        response = await expenseService.filterExpensesByDate(start, end);
      } else if (categoryFilter) {
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
    setStartDate('');        // Clear dates
    setEndDate('');
    loadExpenses('', searchTerm, '', '');
  };

  // Submit date filter query
  const handleDateFilterSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date.');
      return;
    }
    setSelectedCategory(''); // Reset category
    setSearchTerm('');        // Clear title search
    loadExpenses('', '', startDate, endDate);
  };

  // Reset filters
  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setStartDate('');
    setEndDate('');
    loadExpenses('', '', '', '');
  };

  // Handle deletion of an expense
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this expense record?')) {
      try {
        await expenseService.deleteExpense(id);
        setSuccessMessage('Expense record deleted successfully.');
        loadExpenses(selectedCategory, searchTerm, startDate, endDate); // Refresh list
        
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
      <div className="card shadow-sm mb-4 bg-white border-0 rounded-3">
        <div className="card-body p-4">
          <div className="row g-3 align-items-end">
            {/* Search Form */}
            <div className="col-lg-4 col-md-6">
              <label className="form-label small fw-semibold text-muted mb-2">Search Transaction</label>
              <form onSubmit={handleSearchSubmit} className="input-group">
                <span className="input-group-text bg-light border-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0 shadow-none text-dark"
                  placeholder="Search by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="btn btn-primary px-3 fw-medium">Search</button>
              </form>
            </div>

            {/* Category Dropdown */}
            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-semibold text-muted mb-2">Filter by Category</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0 text-muted">
                  <i className="bi bi-tag-fill"></i>
                </span>
                <select
                  className="form-select bg-light border-0 shadow-none text-dark"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSearchTerm('');
                    setStartDate('');
                    setEndDate('');
                    setSelectedCategory(e.target.value);
                  }}
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Filters */}
            <div className="col-lg-5 col-md-12">
              <form onSubmit={handleDateFilterSubmit} className="row g-2 align-items-end">
                <div className="col-5">
                  <label className="form-label small fw-semibold text-muted mb-2">Start Date</label>
                  <input
                    type="date"
                    className="form-control bg-light border-0 shadow-none text-dark"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="col-5">
                  <label className="form-label small fw-semibold text-muted mb-2">End Date</label>
                  <input
                    type="date"
                    className="form-control bg-light border-0 shadow-none text-dark"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
                <div className="col-2">
                  <button type="submit" className="btn btn-secondary w-100 d-flex justify-content-center align-items-center" style={{ height: '38px' }} title="Apply Date Filter">
                    <i className="bi bi-funnel-fill"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Reset Filters Section */}
          {(searchTerm || selectedCategory || (startDate && endDate)) && (
            <div className="d-flex justify-content-end mt-3 pt-3 border-top">
              <button
                type="button"
                className="btn btn-link text-decoration-none text-secondary d-flex align-items-center gap-1 p-0 animate-fade-in"
                onClick={handleReset}
              >
                <i className="bi bi-x-circle"></i> Clear Active Filters
              </button>
            </div>
          )}
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
