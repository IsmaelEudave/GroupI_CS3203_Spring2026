# Task Insights Dashboard - Test Instructions

This file explains how to run the unit tests for the Task Insights Dashboard feature.

## Step 1 — Clone the Repository

Open a terminal and run the following commands:

git clone https://github.com/IsmaelEudave/GroupI_CS3203_Spring2026

cd GroupI_CS3203_Spring2026

git checkout task-insights-dashboard

## Step 2 — Dependencies

Make sure you have the following installed:

- Node.js (recommended LTS version)
- npm (comes with Node.js)

If Node.js is not installed, download it from:
https://nodejs.org

## Step 3 — Install Dependencies

Run the following command to install required packages:

npm install

## Step 4 — Run Unit Tests

Run the following command:

npm test

After running, you should see output showing that all tests passed.

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

## Notes

- If the terminal says "No tests found", press the "a" key to run all tests.
- If npm is not recognized, reinstall Node.js and restart the terminal.