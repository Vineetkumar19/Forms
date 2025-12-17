Nested Form Builder (React)
Project Overview

This project is a dynamic nested form builder developed using React. It allows users to create questions and sub-questions dynamically, where questions can depend on previous answers. The application demonstrates recursive UI rendering, conditional logic, and structured state management without using any backend or APIs. 

Task 5 - Software Developer Int…

Key Functionality
Dynamic Question Creation

Users can add parent-level questions dynamically. Each question includes a text input and a dropdown to select the question type, either Short Answer or True/False.

Nested Child Questions

For True/False questions, selecting True enables the option to add child questions. Child questions follow the same structure as parent questions and can themselves contain further nested questions, allowing unlimited depth.

Automatic Hierarchical Numbering

All questions are automatically numbered based on their level and position in the hierarchy. The numbering updates dynamically when questions are added or removed, following formats such as Q1, Q1.1, Q1.1.1, and Q2.

Delete Functionality

Each question includes a delete option. Deleting a parent question removes all of its associated child questions, ensuring proper cleanup of nested data.

Form Submission and Review

On submission, the complete set of questions is displayed in a structured hierarchical format within the application. This allows users to review the full question tree without any backend processing. 

Task 5 - Software Developer Int…

Bonus Features
Local Storage Persistence

The form state is saved in the browser’s local storage, allowing users to refresh or revisit the application without losing progress.

Basic Reordering

Users can reorder parent-level questions using drag-and-drop functionality to improve usability and organization.

Technical Scope

The project focuses on front-end development using React, recursive component design, conditional rendering, and client-side state persistence. No server-side logic or database integration is involved.