package com.flywire.exercise.controller;

import com.flywire.exercise.model.Employee;
import com.flywire.exercise.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    // 1. GET /api/employees/active - all active employees sorted by last name
    @GetMapping("/active")
    public ResponseEntity<List<Employee>> getAllActiveEmployees() {
        try {
            List<Employee> activeEmployees = employeeService.getAllActiveEmployees();
            return ResponseEntity.ok(activeEmployees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 2. GET /api/employees/{id} - employee by id with direct reports' names
    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeWithDirectReports(@PathVariable int id) {
        try {
            Optional<Map<String, Object>> result = employeeService.getEmployeeWithDirectReports(id);
            if (!result.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Employee with ID " + id + " not found.");
            }
            return ResponseEntity.ok(result.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving employee.");
        }
    }

    // 3. GET /api/employees/hired - employees hired within date range, descending order by hire date
    // Query params: start=MM/dd/yyyy & end=MM/dd/yyyy
    @GetMapping("/hired")
    public ResponseEntity<?> getEmployeesHiredWithin(
            @RequestParam("start") @DateTimeFormat(pattern = "MM/dd/yyyy") Date start,
            @RequestParam("end") @DateTimeFormat(pattern = "MM/dd/yyyy") Date end) {
        try {
            List<Employee> employees = employeeService.getEmployeesHiredWithin(start, end);
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving employees.");
        }
    }

    // 4. POST /api/employees - create new employee
    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody Employee newEmployee) {
        try {
            Employee created = employeeService.createEmployee(newEmployee);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating employee.");
        }
    }

    // 5. PATCH /api/employees/{id}/deactivate - deactivate employee by ID
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateEmployee(@PathVariable int id) {
        try {
            boolean success = employeeService.deactivateEmployee(id);
            if (!success) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found or already inactive.");
            }
            return ResponseEntity.ok("Employee deactivated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deactivating employee.");
        }
    }
}