package com.expensetracker.controller;

import com.expensetracker.model.Expense;
import com.expensetracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/expenses")
@Validated
public class ExpenseController {

    private final ExpenseService expenseService;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    // POST /expenses - Create a new expense
    @PostMapping
    public ResponseEntity<Expense> addExpense(@Valid @RequestBody Expense expense) {
        Expense savedExpense = expenseService.addExpense(expense);
        return new ResponseEntity<>(savedExpense, HttpStatus.CREATED);
    }

    // GET /expenses - Retrieve all expenses
    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        List<Expense> expenses = expenseService.getAllExpenses();
        return new ResponseEntity<>(expenses, HttpStatus.OK);
    }

    // GET /expenses/{id} - Retrieve an expense by ID
    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable String id) {
        Expense expense = expenseService.getExpenseById(id);
        return new ResponseEntity<>(expense, HttpStatus.OK);
    }

    // PUT /expenses/{id} - Update an existing expense
    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable String id, @Valid @RequestBody Expense expenseDetails) {
        Expense updatedExpense = expenseService.updateExpense(id, expenseDetails);
        return new ResponseEntity<>(updatedExpense, HttpStatus.OK);
    }

    // DELETE /expenses/{id} - Delete an expense by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable String id) {
        expenseService.deleteExpense(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // GET /expenses/search?title=... - Search expenses by title keyword
    @GetMapping("/search")
    public ResponseEntity<List<Expense>> searchExpensesByTitle(@RequestParam String title) {
        List<Expense> expenses = expenseService.searchExpensesByTitle(title);
        return new ResponseEntity<>(expenses, HttpStatus.OK);
    }

    // GET /expenses/category/{category} - Filter expenses by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Expense>> filterExpensesByCategory(@PathVariable String category) {
        List<Expense> expenses = expenseService.filterExpensesByCategory(category);
        return new ResponseEntity<>(expenses, HttpStatus.OK);
    }
}
