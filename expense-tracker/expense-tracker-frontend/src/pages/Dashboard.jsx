import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import expenseService from '../services/expenseService';
import DashboardCard from '../components/DashboardCard';
import ExpenseTable from '../components/ExpenseTable';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch expenses on page load
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseService.getAllExpenses();
      setExpenses(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Could not connect to the backend server. Please verify the Spring Boot service is running.');
    } finally {
      setLoading(false);
    }
  };

  // Handle expense deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.deleteExpense(id);
        fetchExpenses(); // Refresh stats and list
      } catch (err) {
        console.error('Error deleting expense:', err);
        alert('Failed to delete the expense. Please try again.');
      }
    }
  };

  // Calculate analytical statistics
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalTransactions = expenses.length;
  const highestExpense = expenses.length > 0 ? Math.max(...expenses.map((item) => item.amount)) : 0;

  // Format amount to INR currency format
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  // Get 5 most recent expenses based on date order
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div>
      {/* Header section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Financial Dashboard</h2>
          <p className="text-muted small mb-0">Real-time overview of your budget and transaction history</p>
        </div>
        <Link to="/add" className="btn btn-primary d-flex align-items-center gap-2">
          <i className="bi bi-plus-circle-fill"></i> Add New Expense
        </Link>
      </div>

      {/* Backend error notification */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show shadow-sm" role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill fs-5 me-3"></i>
            <div>
              <strong>Connection Error!</strong> {error}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <DashboardCard
                title="Total Spent"
                value={formatCurrency(totalExpenses)}
                icon="bi-cash-stack"
                color="primary"
              />
            </div>
            <div className="col-md-4">
              <DashboardCard
                title="Transactions"
                value={totalTransactions}
                icon="bi-receipt-cutoff"
                color="success"
              />
            </div>
            <div className="col-md-4">
              <DashboardCard
                title="Largest Purchase"
                value={formatCurrency(highestExpense)}
                icon="bi-lightning-charge"
                color="danger"
              />
            </div>
          </div>

          {/* Recent Transaction List */}
          <div className="card shadow-sm">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
              <h5 className="mb-0 fw-bold text-dark">Recent Transactions</h5>
              <Link to="/expenses" className="btn btn-sm btn-outline-primary fw-medium">
                View All <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
            <div className="card-body p-0">
              <ExpenseTable expenses={recentExpenses} onDelete={handleDelete} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
