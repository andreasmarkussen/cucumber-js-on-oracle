Feature: Employees

This feature is to try out how to verify things in the Oracle Database as a sample project. 

Scenario: Simple SQL - With Select and update
Given the Employee "Steven King" has a salary of 24000
When he gets a 20% raise
Then his new salary is 28800

Scenario: Simple Plsql - With calling a function

Given the Employee "Steven King" has worked 0 places
When he joins Department "IT"
Then he has worked 1 places