package com.expensetracker.repository;

import com.expensetracker.model.Expense;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExpenseRepository extends MongoRepository<Expense, String> {
    
    // Search expenses by title containing the keyword (case-insensitive)
    List<Expense> findByTitleContainingIgnoreCase(String title);
    
    // Filter expenses by category (case-insensitive)
    List<Expense> findByCategoryIgnoreCase(String category);
}
