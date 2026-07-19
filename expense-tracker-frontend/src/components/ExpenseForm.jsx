import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['Food', 'Shopping', 'Entertainment', 'Bills', 'Travel', 'Others'];
const PAYMENT_METHODS = ['Cash', 'Card', 'UPI', 'Net Banking'];

function ExpenseForm({ initialData, onSubmit, submitButtonText }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    paymentMethod: '',
    date: '',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Populate form values if initialData is provided (Edit Mode)
  useEffect(() => {
    if (initialData) {
      let formattedDate = '';
      if (initialData.date) {
        if (Array.isArray(initialData.date)) {
          // Standard handle for LocalDate serialized as array: [YYYY, MM, DD]
          const [year, month, day] = initialData.date;
          formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        } else {
          // Handle for ISO Date string: YYYY-MM-DD
          formattedDate = initialData.date.substring(0, 10);
        }
      }
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        category: initialData.category || '',
        paymentMethod: initialData.paymentMethod || '',
        date: formattedDate,
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  // Handle input values change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error message once user types/changes values
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  // Perform form validation
  const validateForm = () => {
    const tempErrors = {};
    if (!formData.title.trim()) tempErrors.title = 'Title is required';
    if (!formData.amount) {
      tempErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      tempErrors.amount = 'Amount must be greater than zero';
    }
    if (!formData.category) tempErrors.category = 'Please choose a category';
    if (!formData.paymentMethod) tempErrors.paymentMethod = 'Please choose a payment method';
    if (!formData.date) tempErrors.date = 'Date is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      {/* Title */}
      <div className="col-12">
        <label htmlFor="title" className="form-label">Title <span className="text-danger">*</span></label>
        <input
          type="text"
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Grocery Shopping"
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>

      {/* Amount */}
      <div className="col-md-6">
        <label htmlFor="amount" className="form-label">Amount (₹) <span className="text-danger">*</span></label>
        <input
          type="number"
          step="0.01"
          className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="e.g., 250.00"
        />
        {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
      </div>

      {/* Date */}
      <div className="col-md-6">
        <label htmlFor="date" className="form-label">Date <span className="text-danger">*</span></label>
        <input
          type="date"
          className={`form-control ${errors.date ? 'is-invalid' : ''}`}
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
        {errors.date && <div className="invalid-feedback">{errors.date}</div>}
      </div>

      {/* Category */}
      <div className="col-md-6">
        <label htmlFor="category" className="form-label">Category <span className="text-danger">*</span></label>
        <select
          className={`form-select ${errors.category ? 'is-invalid' : ''}`}
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Choose category...</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <div className="invalid-feedback">{errors.category}</div>}
      </div>

      {/* Payment Method */}
      <div className="col-md-6">
        <label htmlFor="paymentMethod" className="form-label">Payment Method <span className="text-danger">*</span></label>
        <select
          className={`form-select ${errors.paymentMethod ? 'is-invalid' : ''}`}
          id="paymentMethod"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <option value="">Choose payment method...</option>
          {PAYMENT_METHODS.map((method) => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
        {errors.paymentMethod && <div className="invalid-feedback">{errors.paymentMethod}</div>}
      </div>

      {/* Description */}
      <div className="col-12">
        <label htmlFor="description" className="form-label">Description (Optional)</label>
        <textarea
          className="form-control"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          placeholder="Provide additional details..."
        ></textarea>
      </div>

      {/* Action Buttons */}
      <div className="col-12 mt-4 text-end pt-3 border-top">
        <button 
          type="button" 
          className="btn btn-light me-2 fw-medium border shadow-sm"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-x-lg me-1"></i> Cancel
        </button>
        <button type="submit" className="btn btn-primary fw-medium px-4 shadow-sm">
          <i className="bi bi-check2-circle me-1"></i> {submitButtonText || 'Submit'}
        </button>
      </div>
    </form>
  );
}

export default ExpenseForm;
