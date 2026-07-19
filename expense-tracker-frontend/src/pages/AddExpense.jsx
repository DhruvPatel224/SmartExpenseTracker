import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import expenseService from '../services/expenseService';
import ExpenseForm from '../components/ExpenseForm';

function AddExpense() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      setError('');
      setSuccess('');
      await expenseService.addExpense(formData);
      setSuccess('Expense added successfully! Redirecting to expenses list...');
      
      // Navigate to expenses page after showing success message
      setTimeout(() => {
        navigate('/expenses');
      }, 1500);
    } catch (err) {
      console.error('Error adding expense:', err);
      if (err.response && err.response.data) {
        // Handle validation errors or custom exception responses
        if (typeof err.response.data === 'object' && !err.response.data.message) {
          const fieldErrors = Object.entries(err.response.data)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(' | ');
          setError(`Validation Error - ${fieldErrors}`);
        } else {
          setError(err.response.data.message || 'Failed to create expense.');
        }
      } else {
        setError('Server is unreachable. Please try again later.');
      }
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8 col-md-10">
        <div className="card shadow-sm bg-white">
          <div className="card-header bg-white py-3 border-bottom">
            <h4 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
              <i className="bi bi-plus-circle text-primary"></i> Add New Expense
            </h4>
          </div>
          <div className="card-body p-4">
            {/* Status Messages */}
            {success && (
              <div className="alert alert-success border-0 border-start border-4 border-success shadow-sm mb-4" role="alert">
                <div className="d-flex align-items-center">
                  <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                  <div>{success}</div>
                </div>
              </div>
            )}
            {error && (
              <div className="alert alert-danger border-0 border-start border-4 border-danger shadow-sm mb-4" role="alert">
                <div className="d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                  <div>{error}</div>
                </div>
              </div>
            )}

            <ExpenseForm onSubmit={handleSubmit} submitButtonText="Add Expense" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddExpense;
