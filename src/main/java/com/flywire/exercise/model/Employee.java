package com.flywire.exercise.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

public class Employee {

    private int id;
    private String name;
    private String position;
    private boolean active;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "MM/dd/yyyy")
    @DateTimeFormat(pattern = "MM/dd/yyyy")
    private Date hireDate;

    private List<Integer> directReports;

    public Employee() {
    }

    public Employee(int id, String name, String position, boolean active, Date hireDate, List<Integer> directReports) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.active = active;
        this.hireDate = hireDate;
        this.directReports = directReports;
    }

    // Getters and setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Date getHireDate() {
        return hireDate;
    }

    public void setHireDate(Date hireDate) {
        this.hireDate = hireDate;
    }

    public List<Integer> getDirectReports() {
        return directReports;
    }

    public void setDirectReports(List<Integer> directReports) {
        this.directReports = directReports;
    }

    // Convenience method to get last name for sorting
    public String getLastName() {
        String[] parts = name != null ? name.split(" ") : new String[]{};
        return parts.length > 1 ? parts[parts.length - 1] : name;
    }
}