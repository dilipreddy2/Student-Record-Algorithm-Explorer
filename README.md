# Student Record Algorithm Explorer

## Problem
Finding a student record in a large list can take time. This website compares four searching algorithms that look for the same student using a numeric roll number.

## What the program computes
For a user-entered roll number, the app displays whether a matching student exists, the matching record, the number of comparisons, the search steps, and theoretical time/space complexity.

## Algorithms
1. Linear Search — checks records one by one; worst-case time O(n).
2. Binary Search — searches a roll-number-sorted copy by halving the range; time O(log n).
3. Jump Search — searches a sorted copy using blocks; time O(√n).
4. Interpolation Search — estimates a position from numeric key values; average O(log log n) under suitable uniform-distribution assumptions, worst O(n).

Binary, Jump and Interpolation Search sort a copy of the student list by roll number before searching. Linear Search works on the original list.

## Run locally
Open `index.html` in a browser, or open the folder in VS Code and use Live Server.

## Input validation
- Name and department cannot be blank.
- Roll number must be a unique positive integer.
- Marks must be an integer from 0 through 100.
- Search roll number must be a positive integer.

## Technologies
HTML, CSS and JavaScript. No backend or database is required for this demonstration.
