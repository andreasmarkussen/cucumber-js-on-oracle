Feature: Code Generation of a typesafe TypeScript/PlSQL gateway 

    As a Developer doing Test Automation
    I want to generate the boilerplate code of calling PlSQL
    So that I am sure that it is typesafe and I save large amounts of time

    Further more we want to know, if the PLSQL interface of the functionality have changed. 

    We can detect this by auto generating the TypeScript code, and then do a Git Diff in the ´./lib/generated´ folder. 

    Each procedure gets its own file
    Each package should get its own file (NOT IMPLEMENTED YET)

    Scenario: Simple Procedure with 4 in arguments and no return

        The purpose of the code generator is to generate the Plsql that calls the code,
        using clear text and not using bind variables.

        Given a procedure exists called 'ADD_JOB_HISTORY'
        And the procedure has these arguments
            | argument_name   | data_type |
            | P_EMP_ID        | NUMBER    |
            | P_START_DATE    | DATE      |
            | P_END_DATE      | DATE      |
            | P_JOB_ID        | VARCHAR2  |
            | P_DEPARTMENT_ID | NUMBER    |
        When TypeScript code is generated
        Then code contains these strings in sequence
            | source_code            |
            | _call_ADD_JOB_HISTORY( |
            | P_EMP_ID               |
        And the generated file is similar to './lib/generated/ADD_JOB_HISTORY.target.ts'
