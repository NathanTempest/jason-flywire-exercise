package com.flywire.exercise.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flywire.exercise.model.Employee;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final List<Employee> employeeList = new ArrayList<>();

    public EmployeeService() {
        try {
            File file = new ClassPathResource("json/data.json").getFile();
            Employee[] employees = objectMapper.readValue(file, Employee[].class);
            employeeList.addAll(Arrays.asList(employees));
        } catch (IOException e) {
            throw new RuntimeException("Failed to load employees from JSON file", e);
        }
    }

    // 1. Get all active employees sorted by last name
    public List<Employee> getAllActiveEmployees() {
        return employeeList.stream()
                .filter(Employee::isActive)
                .sorted(Comparator.comparing(Employee::getLastName, String.CASE_INSENSITIVE_ORDER))
                .collect(Collectors.toList());
    }

    // 2. Get employee with direct reports
    public Optional<Map<String, Object>> getEmployeeWithDirectReports(int id) {
        Optional<Employee> employeeOpt = employeeList.stream()
                .filter(emp -> emp.getId() == id)
                .findFirst();

        if (!employeeOpt.isPresent()) {
            return Optional.empty();
        }

        Employee employee = employeeOpt.get();

        List<String> directReportNames = employee.getDirectReports() == null
                ? Collections.emptyList()
                : employeeList.stream()
                    .filter(emp -> employee.getDirectReports().contains(emp.getId()))
                    .map(Employee::getName)
                    .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("employee", employee);
        result.put("directReportNames", directReportNames);

        return Optional.of(result);
    }

    // 3. Get employees hired in a range
    public List<Employee> getEmployeesHiredWithin(Date start, Date end) {
        return employeeList.stream()
                .filter(emp -> {
                    Date hireDate = emp.getHireDate();
                    return hireDate != null && !hireDate.before(start) && !hireDate.after(end);
                })
                .sorted((e1, e2) -> e2.getHireDate().compareTo(e1.getHireDate()))
                .collect(Collectors.toList());
    }

    // 4. Create new employee (in-memory only)
    public Employee createEmployee(Employee newEmployee) {
        boolean idExists = employeeList.stream()
                .anyMatch(emp -> emp.getId() == newEmployee.getId());

        if (idExists) {
            throw new IllegalArgumentException("Employee with ID " + newEmployee.getId() + " already exists.");
        }

        employeeList.add(newEmployee);
        return newEmployee;
    }

    // 5. Deactivate employee by ID (in-memory only)
    public boolean deactivateEmployee(int id) {
        Optional<Employee> employeeOpt = employeeList.stream()
                .filter(emp -> emp.getId() == id)
                .findFirst();

        if (!employeeOpt.isPresent() || !employeeOpt.get().isActive()) {
            return false;
        }

        employeeOpt.get().setActive(false);
        return true;
    }
}