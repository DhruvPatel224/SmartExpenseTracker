package com.expensetracker.repository;

import com.expensetracker.model.Expense;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExpenseRepository extends MongoRepository<Expense, String> {
    
    // Search expenses by title containing the keyword (case-insensitive)
    List<Expense> findByTitleContainingIgnoreCase(String title);
    
    // Filter expenses by category (case-insensitive)
    List<Expense> findByCategoryIgnoreCase(String category);
    
    // Filter expenses by date range (inclusive)
    @Query("{ 'date' : { '$gte' : ?0, '$lte' : ?1 } }")
    List<Expense> findByDateBetween(java.time.LocalDate startDate, java.time.LocalDate endDate);
}
