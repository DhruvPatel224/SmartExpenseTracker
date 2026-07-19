package com.expensetracker.service;

import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    // Add a new expense
    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    // Retrieve all expenses
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    // Retrieve a single expense by ID
    public Expense getExpenseById(String id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
    }

    // Update an existing expense
    public Expense updateExpense(String id, Expense expenseDetails) {
        Expense expense = getExpenseById(id);
        
        expense.setTitle(expenseDetails.getTitle());
        expense.setAmount(expenseDetails.getAmount());
        expense.setCategory(expenseDetails.getCategory());
        expense.setPaymentMethod(expenseDetails.getPaymentMethod());
        expense.setDate(expenseDetails.getDate());
        expense.setDescription(expenseDetails.getDescription());
        
        return expenseRepository.save(expense);
    }

    // Delete an expense by ID
    public void deleteExpense(String id) {
        Expense expense = getExpenseById(id);
        expenseRepository.delete(expense);
    }

    // Search expenses by title
    public List<Expense> searchExpensesByTitle(String title) {
        return expenseRepository.findByTitleContainingIgnoreCase(title);
    }

    // Filter expenses by category
    public List<Expense> filterExpensesByCategory(String category) {
        return expenseRepository.findByCategoryIgnoreCase(category);
    }

    // Filter expenses by date range
    public List<Expense> filterExpensesByDate(java.time.LocalDate startDate, java.time.LocalDate endDate) {
        return expenseRepository.findByDateBetween(startDate, endDate);
    }
}
