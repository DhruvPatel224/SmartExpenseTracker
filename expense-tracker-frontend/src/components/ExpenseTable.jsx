import React from 'react';
import { Link } from 'react-router-dom';

function ExpenseTable({ expenses, onDelete }) {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  // Get color code for categories
  const getCategoryBadgeColor = (category) => {
    const cat = category ? category.toLowerCase() : '';
    switch (cat) {
      case 'food':
      case 'dining':
        return 'bg-success bg-opacity-10 text-success border border-success-subtle';
      case 'shopping':
        return 'bg-info bg-opacity-10 text-info border border-info-subtle';
      case 'entertainment':
      case 'leisure':
        return 'bg-warning bg-opacity-10 text-warning border border-warning-subtle';
      case 'bills':
      case 'utilities':
        return 'bg-danger bg-opacity-10 text-danger border border-danger-subtle';
      case 'travel':
      case 'transport':
        return 'bg-primary bg-opacity-10 text-primary border border-primary-subtle';
      default:
        return 'bg-secondary bg-opacity-10 text-secondary border border-secondary-subtle';
    }
  };

  // Get icons for payment methods
  const getPaymentMethodIcon = (method) => {
    const m = method ? method.toLowerCase() : '';
    if (m === 'cash') return 'bi-cash-coin text-success';
    if (m === 'card' || m === 'credit card' || m === 'debit card') return 'bi-credit-card text-primary';
    if (m === 'upi' || m === 'net banking') return 'bi-bank text-info';
    return 'bi-wallet2 text-secondary';
  };

  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-5 rounded-3 bg-white fade-in">
        <div className="mb-3 d-inline-flex align-items-center justify-content-center bg-light rounded-circle" style={{ width: '80px', height: '80px' }}>
          <i className="bi bi-receipt text-muted" style={{ fontSize: '2.5rem' }}></i>
        </div>
        <h5 className="fw-bold text-dark">No expenses yet</h5>
        <p className="text-muted mb-4">Start tracking your spending by adding your first expense.</p>
        <Link to="/add" className="btn btn-primary px-4 rounded-pill">
          <i className="bi bi-plus-lg me-1"></i> Add Expense
        </Link>
      </div>
    );
  }

  return (
    <div className="table-responsive fade-in">
      <table className="table table-hover align-middle mb-0">
        <thead className="bg-light">
          <tr>
            <th className="border-0">Title</th>
            <th className="border-0">Amount</th>
            <th className="border-0">Category</th>
            <th className="border-0">Payment Method</th>
            <th className="border-0">Date</th>
            <th className="border-0 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>
                <div className="d-flex flex-column">
                  <span className="fw-semibold text-dark">{expense.title}</span>
                  {expense.description && (
                    <span className="text-muted small text-truncate" style={{ maxWidth: '200px' }} title={expense.description}>
                      {expense.description}
                    </span>
                  )}
                </div>
              </td>
              <td className="fw-bold text-dark">{formatCurrency(expense.amount)}</td>
              <td>
                <span className={`badge ${getCategoryBadgeColor(expense.category)} px-3 py-2`}>
                  {expense.category}
                </span>
              </td>
              <td>
                <span className="d-flex align-items-center text-muted small fw-medium">
                  <i className={`bi ${getPaymentMethodIcon(expense.paymentMethod)} me-2 fs-6`}></i>
                  {expense.paymentMethod}
                </span>
              </td>
              <td>
                <span className="text-muted small fw-medium">
                  {new Date(expense.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </td>
              <td>
                <div className="d-flex justify-content-center gap-2">
                  <Link 
                    to={`/edit/${expense.id}`} 
                    className="btn btn-sm btn-light btn-action text-primary border border-primary-subtle"
                    title="Edit"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Link>
                  <button 
                    onClick={() => onDelete(expense.id)} 
                    className="btn btn-sm btn-light btn-action text-danger border border-danger-subtle"
                    title="Delete"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseTable;
