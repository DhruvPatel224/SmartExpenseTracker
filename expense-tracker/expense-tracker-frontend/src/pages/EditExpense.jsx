import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import expenseService from '../services/expenseService';
import ExpenseForm from '../components/ExpenseForm';

function EditExpense() {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Load the single expense details on page load
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        setLoading(true);
        const response = await expenseService.getExpenseById(id);
        setExpense(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching expense details:', err);
        setError('Failed to fetch the expense details. The record might not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  // Handle form submission updates
  const handleSubmit = async (formData) => {
    try {
      setError('');
      setSuccess('');
      await expenseService.updateExpense(id, formData);
      setSuccess('Expense updated successfully! Redirecting...');
      
      // Navigate to expenses page after showing success message
      setTimeout(() => {
        navigate('/expenses');
      }, 1500);
    } catch (err) {
      console.error('Error updating expense:', err);
      if (err.response && err.response.data) {
        // Handle validation errors or custom exceptions
        if (typeof err.response.data === 'object' && !err.response.data.message) {
          const fieldErrors = Object.entries(err.response.data)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(' | ');
          setError(`Validation Error - ${fieldErrors}`);
        } else {
          setError(err.response.data.message || 'Failed to update expense.');
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
              <i className="bi bi-pencil-square text-primary"></i> Edit Expense
            </h4>
          </div>
          <div className="card-body p-4">
            {/* Status alerts */}
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

            {loading ? (
              <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : expense ? (
              <ExpenseForm 
                initialData={expense} 
                onSubmit={handleSubmit} 
                submitButtonText="Update Expense" 
              />
            ) : (
              <div className="text-center py-4">
                <p className="text-muted">No expense records found matching this ID.</p>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => navigate('/expenses')}
                >
                  Back to Expenses
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditExpense;
