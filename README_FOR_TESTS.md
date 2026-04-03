# Task Insights Dashboard - Test Instructions

This file explains how to run the unit tests for the Task Insights Dashboard feature.

## Feature Overview

The Task Insights Dashboard provides a visual interface for analyzing task data, including:
- Task completion percentage
- Task status breakdown (completed, in progress, not started)
- Filtering by team member and status
- Deadline insights (due this week and overdue tasks)

## File Location

All dashboard-related files are located in:

docs/dashboard/

- dashboard.html → Main dashboard UI
- dashboardLogic.js → Core logic functions
- dashboardLogic.test.js → Unit tests

## Test Coverage

The following functionality is tested:
- Completion percentage calculation
- Task status counting
- Filtering by team member
- Filtering by task status
- Due this week logic
- Overdue task detection

## How to Run Tests

1. Install dependencies:
   npm install

2. Run tests:
   npm test

## Expected Result

All tests should pass successfully. You should see output indicating that all test cases are passing.