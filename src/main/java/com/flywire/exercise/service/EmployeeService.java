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

    // Load the JSON file from the classpath
    private File getDataFile() throws IOException {
        return new ClassPathResource("json/data.json").getFile();
    }

    // Read employees from JSON file
    private List<Employee> readEmployees() throws IOException {
        File file = getDataFile();
        Employee[] employees = objectMapper.readValue(file, Employee[].class);
        return new ArrayList<>(Arrays.asList(employees));
    }

    // Write employees back to JSON file
    private void writeEmployees(List<Employee> employees) throws IOException {
        File file = getDataFile();
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, employees);
    }

    // 1. Get all active employees sorted by last name alphabetically
    public List<Employee> getAllActiveEmployees() throws IOException {
        List<Employee> employees = readEmployees();
        return employees.stream()
                .filter(Employee::isActive)
                .sorted(Comparator.comparing(Employee::getLastName, String.CASE_INSENSITIVE_ORDER))
                .collect(Collectors.toList());
    }

    // 2. Get employee by ID with direct reports' names
    public Optional<Map<String, Object>> getEmployeeWithDirectReports(int id) throws IOException {
        List<Employee> employees = readEmployees();

        Optional<Employee> employeeOpt = employees.stream()
                .filter(emp -> emp.getId() == id)
                .findFirst();

        if (!employeeOpt.isPresent()) {
            return Optional.empty();
        }

        Employee employee = employeeOpt.get();

        List<String> directReportNames = employee.getDirectReports() == null
                ? Collections.emptyList()
                : employees.stream()
                    .filter(emp -> employee.getDirectReports().contains(emp.getId()))
                    .map(Employee::getName)
                    .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("employee", employee);
        result.put("directReportNames", directReportNames);

        return Optional.of(result);
    }

    // 3. Get employees hired within a date range, sorted descending by hire date
    public List<Employee> getEmployeesHiredWithin(Date start, Date end) throws IOException {
        List<Employee> employees = readEmployees();

        return employees.stream()
                .filter(emp -> {
                    Date hireDate = emp.getHireDate();
                    return hireDate != null && !hireDate.before(start) && !hireDate.after(end);
                })
                .sorted((e1, e2) -> e2.getHireDate().compareTo(e1.getHireDate()))
                .collect(Collectors.toList());
    }

    // 4. Create a new employee and save it
    public Employee createEmployee(Employee newEmployee) throws IOException {
        List<Employee> employees = readEmployees();

        // Basic validation: unique ID
        boolean idExists = employees.stream()
                .anyMatch(emp -> emp.getId() == newEmployee.getId());

        if (idExists) {
            throw new IllegalArgumentException("Employee with ID " + newEmployee.getId() + " already exists.");
        }

        employees.add(newEmployee);
        writeEmployees(employees);
        return newEmployee;
    }

    // 5. Deactivate employee by ID
    public boolean deactivateEmployee(int id) throws IOException {
        List<Employee> employees = readEmployees();

        Optional<Employee> employeeOpt = employees.stream()
                .filter(emp -> emp.getId() == id)
                .findFirst();

        if (!employeeOpt.isPresent()) {
            return false;
        }

        Employee employee = employeeOpt.get();

        if (!employee.isActive()) {
            // Already inactive
            return false;
        }

        employee.setActive(false);
        writeEmployees(employees);
        return true;
    }
}