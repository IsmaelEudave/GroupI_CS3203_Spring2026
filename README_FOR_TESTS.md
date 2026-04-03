# Task Insights Dashboard - Test Instructions

This file explains how to run the unit tests for the Task Insights Dashboard feature.

## Clone the Repository

git clone https://github.com/IsmaelEudave/GroupI_CS3203_Spring2026

cd GroupI_CS3203_Spring2026

## Install Dependencies

npm install

## Run Unit Tests

npm test

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

## Unit Test File

docs/dashboard/dashboardLogic.test.js