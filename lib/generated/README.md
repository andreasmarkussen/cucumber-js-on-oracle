# Generated Source code

This folder contains files that are automatically generated based on the structure of your Oracle database.

## File creation

|Oracle type | TypeScript type | Status | 
|Procedures | Typescript function in one file pr Procedure| In progress | 
|Packages | Typescript classes| Not started|
|Tables | Typescript Interface?? | Not started|
|Rows | Typescript Interface?? | Not started|


## Handling of these files

It is recommended that you copy these files to source control such as GIT, so that it becomes visible when the interface to your Oracle databases change. 

The files called *.target.ts are manually created files used for testing that the Code Generator works as expected.

The process for changing the code generation are

1. Create or update one of the *.target.ts files
1. Run the tests
1. Change the code generator to match the target files
