Feature: Employees

Scenario: Scenario name
Given the Employee "Steven King" has a salary of 24000
When he gets a 20% raise
Then his new salary is 28800



# ADD A SCENARIO TO CREATE A JOB HISTORY
## "PROCEDURE add_job_history
#     (  p_emp_id          job_history.employee_id%type
#      , p_start_date      job_history.start_date%type
#      , p_end_date        job_history.end_date%type
#      , p_job_id          job_history.job_id%type
#      , p_department_id   job_history.department_id%type
#      )
#   IS
#   BEGIN
#     INSERT INTO job_history (employee_id, start_date, end_date,
#                              job_id, department_id)
#       VALUES(p_emp_id, p_start_date, p_end_date, p_job_id, p_department_id);
# END add_job_history;