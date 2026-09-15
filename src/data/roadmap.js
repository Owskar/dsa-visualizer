// The structure of the full takeUforward-style A2Z DSA sheet: 18 sections,
// each with subsections, each with numbered items (1-474, matching the
// source sheet's own numbering exactly).
//
// NOTE: this file holds ONLY the sheet's structure — no algorithm ever needs
// to be mapped here. An algorithm connects itself to its sheet position by
// declaring `sheetNum` in its own file (see src/data/algorithms/*.js); the
// merge happens automatically below, in ROADMAP.

import { ALGORITHMS } from "./algorithms/index.js";

const ROADMAP_STRUCTURE = [
  {
    id: "learn-the-basics",
    name: "Learn the Basics",
    subsections: [
      {
        name: "Things to Know",
        items: [
          { num: 1, title: "Input Output" },
          { num: 2, title: "C++ Basics" },
          { num: 3, title: "If Else" },
          { num: 4, title: "Switch Case" },
          { num: 5, title: "What are arrays, strings?" },
          { num: 6, title: "For loops" },
          { num: 7, title: "While loops" },
          { num: 8, title: "Functions — Pass by Reference and Value" },
          { num: 9, title: "Theory with examples" },
        ],
      },
      {
        name: "Build-up Logical Thinking",
        items: [
          { num: 10, title: "Easy and Medium" },
          { num: 11, title: "Hard" },
        ],
      },
      {
        name: "Patterns",
        items: [
          { num: 12, title: "Pattern 1" },
          { num: 13, title: "Pattern 2" },
          { num: 14, title: "Pattern 3" },
          { num: 15, title: "Pattern 4" },
          { num: 16, title: "Pattern 5" },
          { num: 17, title: "Pattern 6" },
          { num: 18, title: "Pattern 7" },
          { num: 19, title: "Pattern 8" },
          { num: 20, title: "Pattern 9" },
          { num: 21, title: "Pattern 10" },
          { num: 22, title: "Pattern 11" },
          { num: 23, title: "Pattern 12" },
          { num: 24, title: "Pattern 13" },
          { num: 25, title: "Pattern 14" },
          { num: 26, title: "Pattern 15" },
          { num: 27, title: "Pattern 16" },
          { num: 28, title: "Pattern 17" },
          { num: 29, title: "Pattern 18" },
          { num: 30, title: "Pattern 19" },
          { num: 31, title: "Pattern 20" },
          { num: 32, title: "Pattern 21" },
          { num: 33, title: "Pattern 22" },
        ],
      },
      {
        name: "STL / Java Collections",
        items: [
          { num: 34, title: "STL" },
          { num: 35, title: "Java Collections" },
        ],
      },
      {
        name: "Basic Maths",
        items: [
          { num: 36, title: "Count all Digits of a Number" },
          { num: 37, title: "Reverse a Number" },
          { num: 38, title: "Palindrome Number" },
          { num: 39, title: "GCD of Two Numbers" },
          { num: 40, title: "Check if the Number is Armstrong" },
          { num: 41, title: "Print all Divisors" },
          { num: 42, title: "Check for Prime Number" },
        ],
      },
      {
        name: "Basic Recursion",
        items: [
          { num: 43, title: "Understand recursion by print something N times" },
          { num: 44, title: "Print name N times using recursion" },
          { num: 45, title: "Print 1 to N using Recursion" },
          { num: 46, title: "Print N to 1 using Recursion" },
          { num: 47, title: "Sum of First N Numbers" },
          { num: 48, title: "Factorial of a given number" },
          { num: 49, title: "Reverse an array" },
          { num: 50, title: "Check if String is Palindrome or Not" },
          { num: 51, title: "Fibonacci Number" },
        ],
      },
      {
        name: "Basic Hashing",
        items: [
          { num: 52, title: "Basic Hashing" },
          { num: 53, title: "Counting Frequencies of Array Elements" },
          { num: 54, title: "Highest Occurring Element in an Array" },
        ],
      },
    ],
  },
  {
    id: "sorting-techniques",
    name: "Sorting Techniques",
    subsections: [
      {
        name: null,
        items: [
          { num: 55, title: "Selection Sort" },
          { num: 56, title: "Bubble Sort" },
          { num: 57, title: "Insertion Sorting" },
          { num: 58, title: "Merge Sorting" },
          { num: 59, title: "Recursive Bubble Sort" },
          { num: 60, title: "Recursive Insertion Sort" },
          { num: 61, title: "Quick Sorting" },
        ],
      },
    ],
  },
  {
    id: "arrays",
    name: "Arrays",
    subsections: [
      {
        name: "Easy",
        items: [
          { num: 62, title: "Largest Element" },
          { num: 63, title: "Second Largest Element" },
          { num: 64, title: "Check if the Array is Sorted II" },
          { num: 65, title: "Remove Duplicates from Sorted Array" },
          { num: 66, title: "Left Rotate Array by One" },
          { num: 67, title: "Left Rotate Array by K Places" },
          { num: 68, title: "Move Zeros to End" },
          { num: 69, title: "Linear Search" },
          { num: 70, title: "Union of Two Sorted Arrays" },
          { num: 71, title: "Find Missing Number" },
          { num: 72, title: "Maximum Consecutive Ones" },
          { num: 73, title: "Find the Number that Appears Once, and Other Numbers Twice" },
          { num: 74, title: "Longest Subarray with Given Sum K — Positives" },
          { num: 75, title: "Longest Subarray with Sum K" },
        ],
      },
      {
        name: "Medium",
        items: [
          { num: 76, title: "Two Sum" },
          { num: 77, title: "Sort an Array of 0's, 1's and 2's" },
          { num: 78, title: "Majority Element-I" },
          { num: 79, title: "Kadane's Algorithm" },
          { num: 80, title: "Print Subarray with Maximum Subarray Sum" },
          { num: 81, title: "Stock Buy and Sell" },
          { num: 82, title: "Rearrange Array Elements by Sign" },
          { num: 83, title: "Next Permutation" },
          { num: 84, title: "Leaders in an Array" },
          { num: 85, title: "Longest Consecutive Sequence in an Array" },
          { num: 86, title: "Set Matrix Zeroes" },
          { num: 87, title: "Rotate Matrix by 90 Degrees" },
          { num: 88, title: "Print the Matrix in Spiral Manner" },
          { num: 89, title: "Count Subarrays with Given Sum" },
        ],
      },
      {
        name: "Hard",
        items: [
          { num: 90, title: "Pascal's Triangle I" },
          { num: 91, title: "Majority Element-II" },
          { num: 92, title: "3 Sum" },
          { num: 93, title: "4 Sum" },
          { num: 94, title: "Largest Subarray with Sum 0" },
          { num: 95, title: "Count Subarrays with Given XOR K" },
          { num: 96, title: "Merge Overlapping Subintervals" },
          { num: 97, title: "Merge Two Sorted Arrays Without Extra Space" },
          { num: 98, title: "Find the Repeating and Missing Number" },
          { num: 99, title: "Count Inversions" },
          { num: 100, title: "Reverse Pairs" },
          { num: 101, title: "Maximum Product Subarray in an Array" },
        ],
      },
    ],
  },
  {
    id: "binary-search",
    name: "Binary Search",
    subsections: [
      {
        name: "BS on 1D Arrays",
        items: [
          { num: 102, title: "Search X in Sorted Array" },
          { num: 103, title: "Lower Bound" },
          { num: 104, title: "Upper Bound" },
          { num: 105, title: "Search Insert Position" },
          { num: 106, title: "Floor and Ceil in Sorted Array" },
          { num: 107, title: "First and Last Occurrence" },
          { num: 108, title: "Count Occurrences in a Sorted Array" },
          { num: 109, title: "Search in Rotated Sorted Array-I" },
          { num: 110, title: "Search in Rotated Sorted Array-II" },
          { num: 111, title: "Find Minimum in Rotated Sorted Array" },
          { num: 112, title: "Find Out How Many Times the Array is Rotated" },
          { num: 113, title: "Single Element in a Sorted Array" },
          { num: 114, title: "Find Peak Element" },
        ],
      },
      {
        name: "BS on Answers",
        items: [
          { num: 115, title: "Find Square Root of a Number" },
          { num: 116, title: "Find Nth Root of a Number" },
          { num: 117, title: "Koko Eating Bananas" },
          { num: 118, title: "Minimum Days to Make M Bouquets" },
          { num: 119, title: "Find the Smallest Divisor" },
          { num: 120, title: "Capacity to Ship Packages Within D Days" },
          { num: 121, title: "Kth Missing Positive Number" },
          { num: 122, title: "Aggressive Cows" },
          { num: 123, title: "Book Allocation Problem" },
          { num: 124, title: "Split Array — Largest Sum" },
          { num: 125, title: "Painter's Partition" },
          { num: 126, title: "Minimize Max Distance to Gas Station" },
          { num: 127, title: "Median of 2 Sorted Arrays" },
          { num: 128, title: "Kth Element of 2 Sorted Arrays" },
        ],
      },
      {
        name: "BS on 2D Arrays",
        items: [
          { num: 129, title: "Find Row with Maximum 1's" },
          { num: 130, title: "Search in a 2D Matrix" },
          { num: 131, title: "Search in 2D Matrix-II" },
          { num: 132, title: "Find Peak Element-II" },
          { num: 133, title: "Matrix Median" },
        ],
      },
    ],
  },
  {
    id: "strings-basic-medium",
    name: "Strings — Basic & Medium",
    subsections: [
      {
        name: "Basic / Easy",
        items: [
          { num: 134, title: "Remove Outermost Parentheses" },
          { num: 135, title: "Reverse Words in a Given String / Palindrome Check" },
          { num: 136, title: "Largest Odd Number in a String" },
          { num: 137, title: "Longest Common Prefix" },
          { num: 138, title: "Isomorphic String" },
          { num: 139, title: "Rotate String" },
          { num: 140, title: "Check if Two Strings are Anagram of Each Other" },
        ],
      },
      {
        name: "Medium",
        items: [
          { num: 141, title: "Sort Characters by Frequency" },
          { num: 142, title: "Maximum Nesting Depth of the Parentheses" },
          { num: 143, title: "Roman to Integer" },
          { num: 144, title: "String to Integer — atoi" },
          { num: 145, title: "Count Number of Substrings" },
          { num: 146, title: "Longest Palindromic Substring" },
          { num: 147, title: "Sum of Beauty of All Substrings" },
          { num: 148, title: "Reverse Every Word in a String" },
        ],
      },
    ],
  },
  {
    id: "linked-list",
    name: "Linked List",
    subsections: [
      {
        name: "Singly Linked List",
        items: [
          { num: 149, title: "Introduction to Singly LinkedList" },
          { num: 150, title: "Insertion at the Head of Linked List" },
          { num: 151, title: "Deletion of the Head of LL" },
          { num: 152, title: "Find the Length of the Linked List" },
          { num: 153, title: "Search in Linked List" },
        ],
      },
      {
        name: "Doubly Linked List",
        items: [
          { num: 154, title: "Introduction to Doubly LL" },
          { num: 155, title: "Insert Node Before Head in Doubly Linked List" },
          { num: 156, title: "Delete Head of Doubly Linked List" },
          { num: 157, title: "Reverse a Doubly Linked List" },
        ],
      },
      {
        name: "Medium Problems",
        items: [
          { num: 158, title: "Middle of a LinkedList — Tortoise/Hare Method" },
          { num: 159, title: "Reverse a LinkedList — Iterative" },
          { num: 160, title: "Reverse a LL" },
          { num: 161, title: "Detect a Loop in LL" },
          { num: 162, title: "Find the Starting Point in LL" },
          { num: 163, title: "Length of Loop in LL" },
          { num: 164, title: "Check if LL is Palindrome or Not" },
          { num: 165, title: "Segregate Odd and Even Nodes in Linked List" },
          { num: 166, title: "Remove Nth Node from the Back of the LL" },
          { num: 167, title: "Delete the Middle Node in LL" },
          { num: 168, title: "Sort LL" },
          { num: 169, title: "Sort a Linked List of 0's, 1's and 2's" },
          { num: 170, title: "Find the Intersection Point of Y LL" },
          { num: 171, title: "Add One to a Number Represented by LL" },
          { num: 172, title: "Add Two Numbers in Linked List" },
        ],
      },
      {
        name: "Doubly Linked List",
        items: [
          { num: 173, title: "Delete All Occurrences of a Key in DLL" },
          { num: 174, title: "Find Pairs with Given Sum in Doubly Linked List" },
          { num: 175, title: "Remove Duplicates from Sorted DLL" },
        ],
      },
      {
        name: "Hard",
        items: [
          { num: 176, title: "Reverse LL in Group of Given Size K" },
          { num: 177, title: "Rotate a LL" },
          { num: 178, title: "Flattening of LL" },
          { num: 179, title: "Clone a LL with Random and Next Pointer" },
        ],
      },
    ],
  },
  {
    id: "recursion",
    name: "Recursion",
    subsections: [
      {
        name: "Get a Strong Hold",
        items: [
          { num: 180, title: "Recursive Implementation of atoi()" },
          { num: 181, title: "Pow(x, n)" },
          { num: 182, title: "Count Good Numbers" },
          { num: 183, title: "Sort a Stack Using Recursion" },
          { num: 184, title: "Reverse a Stack" },
        ],
      },
      {
        name: "Subsequences Pattern",
        items: [
          { num: 185, title: "Generate Binary Strings Without Consecutive 1s" },
          { num: 186, title: "Generate Parentheses" },
          { num: 187, title: "Power Set" },
          { num: 188, title: "Learn All Patterns of Subsequences — Theory" },
          { num: 189, title: "Count All Subsequences with Sum K" },
          { num: 190, title: "Check if There Exists a Subsequence with Sum K" },
          { num: 191, title: "Combination Sum" },
          { num: 192, title: "Combination Sum II" },
          { num: 193, title: "Subsets I" },
          { num: 194, title: "Subsets II" },
          { num: 195, title: "Combination Sum III" },
          { num: 196, title: "Letter Combinations of a Phone Number" },
        ],
      },
      {
        name: "Trying Out All Combos / Hard",
        items: [
          { num: 197, title: "Palindrome Partitioning" },
          { num: 198, title: "Word Search" },
          { num: 199, title: "N Queen" },
          { num: 200, title: "Rat in a Maze" },
          { num: 201, title: "Word Break" },
          { num: 202, title: "M Coloring Problem" },
          { num: 203, title: "Sudoku Solver" },
          { num: 204, title: "Expression Add Operators" },
        ],
      },
    ],
  },
  {
    id: "bit-manipulation",
    name: "Bit Manipulation",
    subsections: [
      {
        name: "Learn Bit Manipulation",
        items: [
          { num: 205, title: "Introduction to Bits and Tricks" },
          { num: 206, title: "Check if the i-th Bit is Set or Not" },
          { num: 207, title: "Check if a Number is Odd or Not" },
          { num: 208, title: "Check if a Number is Power of 2 or Not" },
          { num: 209, title: "Count the Number of Set Bits" },
          { num: 210, title: "Set/Unset the Rightmost Unset Bit" },
          { num: 211, title: "Swap Two Numbers" },
          { num: 212, title: "Divide Two Numbers Without Multiplication and Division" },
        ],
      },
      {
        name: "Interview Problems",
        items: [
          { num: 213, title: "Minimum Bit Flips to Convert Number" },
          { num: 214, title: "Single Number-I" },
          { num: 215, title: "Power Set Bit Manipulation" },
          { num: 216, title: "XOR of Numbers in a Given Range" },
          { num: 217, title: "Single Number-III" },
        ],
      },
      {
        name: "Advanced Maths",
        items: [
          { num: 218, title: "Print Prime Factors of a Number" },
          { num: 219, title: "Divisors of a Number" },
          { num: 220, title: "Count Primes in Range L to R" },
          { num: 221, title: "Prime Factorisation of a Number" },
          { num: 222, title: "Pow(x,n)" },
        ],
      },
    ],
  },
  {
    id: "stack-queues",
    name: "Stack & Queues",
    subsections: [
      {
        name: "Learning",
        items: [
          { num: 223, title: "Implement Stack Using Arrays" },
          { num: 224, title: "Implement Queue Using Arrays" },
          { num: 225, title: "Implement Stack Using Queue" },
          { num: 226, title: "Implement Queue Using Stack" },
          { num: 227, title: "Implement Stack Using LinkedList" },
          { num: 228, title: "Implement Queue Using LinkedList" },
          { num: 229, title: "Balanced Parenthesis" },
          { num: 230, title: "Implement Min Stack" },
        ],
      },
      {
        name: "Prefix / Infix / Postfix",
        items: [
          { num: 231, title: "Infix to Postfix Conversion" },
          { num: 232, title: "Prefix to Infix Conversion" },
          { num: 233, title: "Prefix to Postfix Conversion" },
          { num: 234, title: "Postfix to Prefix Conversion" },
          { num: 235, title: "Postfix to Infix Conversion" },
          { num: 236, title: "Infix to Prefix Conversion" },
        ],
      },
      {
        name: "Monotonic Stack / Queue",
        items: [
          { num: 237, title: "Next Greater Element" },
          { num: 238, title: "Next Greater Element-II" },
          { num: 239, title: "Next Smaller Element" },
          { num: 240, title: "Number of Greater Elements to the Right" },
          { num: 241, title: "Trapping Rainwater" },
          { num: 242, title: "Sum of Subarray Minimums" },
          { num: 243, title: "Asteroid Collision" },
          { num: 244, title: "Sum of Subarray Ranges" },
          { num: 245, title: "Remove K Digits" },
          { num: 246, title: "Largest Rectangle in a Histogram" },
          { num: 247, title: "Maximum Rectangles" },
        ],
      },
      {
        name: "Implementation Problems",
        items: [
          { num: 248, title: "Sliding Window Maximum" },
          { num: 249, title: "Stock Span Problem" },
          { num: 250, title: "Celebrity Problem" },
          { num: 251, title: "LRU Cache" },
          { num: 252, title: "LFU Cache" },
        ],
      },
    ],
  },
  {
    id: "sliding-window-two-pointer",
    name: "Sliding Window & Two Pointer",
    subsections: [
      {
        name: "Medium",
        items: [
          { num: 253, title: "Longest Substring Without Repeating Characters" },
          { num: 254, title: "Max Consecutive Ones III" },
          { num: 255, title: "Fruit Into Baskets" },
          { num: 256, title: "Longest Repeating Character Replacement" },
          { num: 257, title: "Binary Subarrays With Sum" },
          { num: 258, title: "Count Number of Nice Subarrays" },
          { num: 259, title: "Number of Substrings Containing All Three Characters" },
          { num: 260, title: "Maximum Points You Can Obtain from Cards" },
        ],
      },
      {
        name: "Hard",
        items: [
          { num: 261, title: "Longest Substring With At Most K Distinct Characters" },
          { num: 262, title: "Subarrays with K Different Integers" },
          { num: 263, title: "Minimum Window Substring" },
          { num: 264, title: "Minimum Window Subsequence" },
        ],
      },
    ],
  },
  {
    id: "heaps",
    name: "Heaps",
    subsections: [
      {
        name: "Learning",
        items: [
          { num: 265, title: "Heaps — Theory" },
          { num: 266, title: "Implement Min Heap" },
          { num: 267, title: "Check if an Array Represents a Min Heap" },
          { num: 268, title: "Convert Min Heap to Max Heap" },
        ],
      },
      {
        name: "Medium",
        items: [
          { num: 269, title: "K-th Largest Element in an Array" },
          { num: 270, title: "Kth Smallest Element in an Array — Priority Queue" },
          { num: 271, title: "Sort K Sorted Array" },
          { num: 272, title: "Merge K Sorted Lists" },
          { num: 273, title: "Replace Elements by Their Rank" },
          { num: 274, title: "Task Scheduler" },
          { num: 275, title: "Hand of Straights" },
        ],
      },
      {
        name: "Hard",
        items: [
          { num: 276, title: "Design Twitter" },
          { num: 277, title: "Minimum Cost to Connect Sticks" },
          { num: 278, title: "Kth Largest Element in a Stream of Running Integers" },
          { num: 279, title: "Maximum Sum Combination" },
          { num: 280, title: "Find Median from Data Stream" },
          { num: 281, title: "Top K Frequent Elements" },
        ],
      },
    ],
  },
  {
    id: "greedy-algorithms",
    name: "Greedy Algorithms",
    subsections: [
      {
        name: "Easy",
        items: [
          { num: 282, title: "Assign Cookies" },
          { num: 283, title: "Fractional Knapsack" },
          { num: 284, title: "Lemonade Change" },
          { num: 285, title: "Valid Parenthesis Checker" },
        ],
      },
      {
        name: "Medium / Hard",
        items: [
          { num: 286, title: "N Meetings in One Room" },
          { num: 287, title: "Jump Game-I" },
          { num: 288, title: "Jump Game-II" },
          { num: 289, title: "Minimum Number of Platforms Required for a Railway" },
          { num: 290, title: "Job Sequencing Problem" },
          { num: 291, title: "Candy" },
          { num: 292, title: "Shortest Job First" },
          { num: 293, title: "Program for Least Recently Used — LRU Page Replacement" },
          { num: 294, title: "Insert Interval" },
          { num: 295, title: "Merge Intervals" },
          { num: 296, title: "Non-overlapping Intervals" },
        ],
      },
    ],
  },
  {
    id: "binary-trees",
    name: "Binary Trees",
    subsections: [
      {
        name: "Traversals",
        items: [
          { num: 297, title: "Introduction to Trees" },
          { num: 298, title: "Binary Tree Representation in Java" },
          { num: 299, title: "Pre, Post, Inorder in One Traversal" },
          { num: 300, title: "Preorder Traversal" },
          { num: 301, title: "Inorder Traversal of Binary Tree" },
          { num: 302, title: "Postorder Traversal" },
          { num: 303, title: "Level Order Traversal" },
          { num: 304, title: "Iterative Preorder Traversal of Binary Tree" },
          { num: 305, title: "Iterative Inorder Traversal of Binary Tree" },
          { num: 306, title: "Post-order Traversal of Binary Tree Using 2 Stacks" },
          { num: 307, title: "Post-order Traversal of Binary Tree Using 1 Stack" },
          { num: 308, title: "Preorder, Inorder, and Postorder Traversal in One Traversal" },
        ],
      },
      {
        name: "Medium",
        items: [
          { num: 309, title: "Maximum Depth in BT" },
          { num: 310, title: "Check for Balanced Binary Tree" },
          { num: 311, title: "Diameter of Binary Tree" },
          { num: 312, title: "Maximum Path Sum" },
          { num: 313, title: "Check if Two Trees are Identical or Not" },
          { num: 314, title: "Zig Zag / Spiral Traversal" },
          { num: 315, title: "Boundary Traversal" },
          { num: 316, title: "Vertical Order Traversal" },
          { num: 317, title: "Top View of BT" },
          { num: 318, title: "Bottom View of BT" },
          { num: 319, title: "Right / Left View of Binary Tree" },
          { num: 320, title: "Symmetric Binary Tree" },
        ],
      },
      {
        name: "Hard",
        items: [
          { num: 321, title: "Print Root to Leaf Path in BT" },
          { num: 322, title: "LCA in BT" },
          { num: 323, title: "Maximum Width of BT" },
          { num: 324, title: "Children Sum Property in Binary Tree" },
          { num: 325, title: "Print All Nodes at a Distance of K in BT" },
          { num: 326, title: "Minimum Time Taken to Burn the BT from a Given Node" },
          { num: 327, title: "Count Total Nodes in a Complete BT" },
          { num: 328, title: "Requirements Needed to Construct a Unique BT" },
          { num: 329, title: "Construct a BT from Preorder and Inorder" },
          { num: 330, title: "Construct the Binary Tree from Postorder and Inorder Traversal" },
          { num: 331, title: "Serialize and De-serialize BT" },
          { num: 332, title: "Morris Preorder Traversal of a Binary Tree" },
          { num: 333, title: "Morris Inorder Traversal of a Binary Tree" },
          { num: 334, title: "Flatten Binary Tree to Linked List" },
        ],
      },
    ],
  },
  {
    id: "binary-search-trees",
    name: "Binary Search Trees",
    subsections: [
      {
        name: "Concepts",
        items: [
          { num: 335, title: "Introduction to BST" },
          { num: 336, title: "Search in a Binary Search Tree" },
          { num: 337, title: "Find Min/Max in BST" },
        ],
      },
      {
        name: "Practice Problems",
        items: [
          { num: 338, title: "Floor and Ceil in a BST" },
          { num: 339, title: "Floor in a Binary Search Tree" },
          { num: 340, title: "Insert a Given Node in BST" },
          { num: 341, title: "Delete a Node in BST" },
          { num: 342, title: "Kth Smallest and Largest Element in BST" },
          { num: 343, title: "Check if a Tree is a BST or Not" },
          { num: 344, title: "LCA in BST" },
          { num: 345, title: "Construct a BST from a Preorder Traversal" },
          { num: 346, title: "Inorder Successor / Predecessor in BST" },
          { num: 347, title: "Merge 2 BST's" },
          { num: 348, title: "Two Sum in BST — Check if There Exists a Pair with Sum K" },
          { num: 349, title: "Correct BST with Two Nodes Swapped" },
          { num: 350, title: "Largest BST in Binary Tree" },
        ],
      },
    ],
  },
  {
    id: "graphs",
    name: "Graphs",
    subsections: [
      {
        name: "Learning",
        items: [
          { num: 351, title: "Introduction to Graph" },
          { num: 352, title: "Graph Representation — C++" },
          { num: 353, title: "Graph Representation — Java" },
          { num: 354, title: "Connected Components" },
          { num: 355, title: "Traversal Techniques" },
          { num: 356, title: "DFS" },
        ],
      },
      {
        name: "BFS / DFS Problems",
        items: [
          { num: 357, title: "Number of Provinces" },
          { num: 358, title: "Connected Components Problem in Matrix" },
          { num: 359, title: "Rotten Oranges" },
          { num: 360, title: "Flood Fill Algorithm" },
          { num: 361, title: "Cycle Detection in Undirected Graph — BFS" },
          { num: 362, title: "Detect a Cycle in an Undirected Graph" },
          { num: 363, title: "Distance of Nearest Cell Having One" },
          { num: 364, title: "Surrounded Regions" },
          { num: 365, title: "Number of Enclaves" },
          { num: 366, title: "Word Ladder I" },
          { num: 367, title: "Word Ladder II" },
          { num: 368, title: "Number of Islands" },
          { num: 369, title: "Bipartite Graph — DFS" },
          { num: 370, title: "Cycle Detection in Directed Graph — DFS" },
        ],
      },
      {
        name: "Topological Sort",
        items: [
          { num: 371, title: "Topo Sort" },
          { num: 372, title: "Topological Sort / Kahn's Algorithm" },
          { num: 373, title: "Detect a Cycle in a Directed Graph" },
          { num: 374, title: "Course Schedule I" },
          { num: 375, title: "Course Schedule II" },
          { num: 376, title: "Find Eventual Safe States" },
          { num: 377, title: "Alien Dictionary" },
        ],
      },
      {
        name: "Shortest Path",
        items: [
          { num: 378, title: "Shortest Path in Undirected Graph with Unit Weights" },
          { num: 379, title: "Shortest Path in DAG" },
          { num: 380, title: "Dijkstra's Algorithm" },
          { num: 381, title: "Why Priority Queue is Used in Dijkstra's Algorithm" },
          { num: 382, title: "Shortest Distance in a Binary Maze" },
          { num: 383, title: "Path with Minimum Effort" },
          { num: 384, title: "Cheapest Flight Within K Stops" },
          { num: 385, title: "Network Delay Time" },
          { num: 386, title: "Number of Ways to Arrive at Destination" },
          { num: 387, title: "Minimum Multiplications to Reach End" },
          { num: 388, title: "Bellman Ford Algorithm" },
          { num: 389, title: "Floyd Warshall Algorithm" },
          { num: 390, title: "Find the City with the Smallest Number of Neighbors" },
        ],
      },
      {
        name: "Minimum Spanning Tree / DSU",
        items: [
          { num: 391, title: "MST Theory" },
          { num: 392, title: "Prim's Algorithm" },
          { num: 393, title: "Disjoint Set" },
          { num: 394, title: "Find the MST Weight" },
          { num: 395, title: "Number of Operations to Make Network Connected" },
          { num: 396, title: "Most Stones Removed with Same Row or Column" },
          { num: 397, title: "Accounts Merge" },
          { num: 398, title: "Number of Islands II" },
          { num: 399, title: "Making a Large Island" },
          { num: 400, title: "Swim in Rising Water" },
        ],
      },
      {
        name: "Other Algorithms",
        items: [
          { num: 401, title: "Bridges in Graph" },
          { num: 402, title: "Articulation Point in Graph" },
          { num: 403, title: "Kosaraju's Algorithm" },
        ],
      },
    ],
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    subsections: [
      {
        name: "Introduction",
        items: [
          { num: 404, title: "Introduction to DP" },
        ],
      },
      {
        name: "1D DP",
        items: [
          { num: 405, title: "Climbing Stairs" },
          { num: 406, title: "Frog Jump" },
          { num: 407, title: "Frog Jump with K Distances" },
          { num: 408, title: "Maximum Sum of Non-Adjacent Elements" },
          { num: 409, title: "House Robber" },
        ],
      },
      {
        name: "2D / 3D DP & Grids",
        items: [
          { num: 410, title: "Ninja's Training" },
          { num: 411, title: "Grid Unique Paths — DP on Grids" },
          { num: 412, title: "Unique Paths II" },
          { num: 413, title: "Minimum Falling Path Sum" },
          { num: 414, title: "Triangle" },
          { num: 415, title: "Ninja and His Friends" },
        ],
      },
      {
        name: "DP on Subsequences",
        items: [
          { num: 416, title: "Subset Sum Equal to Target" },
          { num: 417, title: "Partition Equal Subset Sum" },
          { num: 418, title: "Partition a Set into Two Subsets with Minimum Absolute Sum Difference" },
          { num: 419, title: "Count Subsets with Sum K" },
          { num: 420, title: "Count Partitions with Given Difference" },
          { num: 421, title: "Assign Cookies" },
          { num: 422, title: "Minimum Coins" },
          { num: 423, title: "Target Sum" },
          { num: 424, title: "Coin Change 2" },
          { num: 425, title: "Unbounded Knapsack" },
          { num: 426, title: "Rod Cutting Problem" },
        ],
      },
      {
        name: "DP on Strings",
        items: [
          { num: 427, title: "Longest Common Subsequence" },
          { num: 428, title: "Print Longest Common Subsequence" },
          { num: 429, title: "Longest Common Substring" },
          { num: 430, title: "Longest Palindromic Subsequence" },
          { num: 431, title: "Minimum Insertions to Make String Palindrome" },
          { num: 432, title: "Minimum Insertions or Deletions to Convert String A to B" },
          { num: 433, title: "Shortest Common Supersequence" },
          { num: 434, title: "Distinct Subsequences" },
          { num: 435, title: "Edit Distance" },
          { num: 436, title: "Wildcard Matching" },
        ],
      },
      {
        name: "DP on Stocks",
        items: [
          { num: 437, title: "Best Time to Buy and Sell Stock" },
          { num: 438, title: "Best Time to Buy and Sell Stock II" },
          { num: 439, title: "Best Time to Buy and Sell Stock III" },
          { num: 440, title: "Best Time to Buy and Sell Stock IV" },
          { num: 441, title: "Best Time to Buy and Sell Stock with Cooldown" },
          { num: 442, title: "Best Time to Buy and Sell Stock with Transaction Fees" },
        ],
      },
      {
        name: "DP on LIS",
        items: [
          { num: 443, title: "Longest Increasing Subsequence" },
          { num: 444, title: "Print Longest Increasing Subsequence" },
          { num: 445, title: "Longest Increasing Subsequence — DP-43" },
          { num: 446, title: "Largest Divisible Subset" },
          { num: 447, title: "Longest String Chain" },
          { num: 448, title: "Longest Bitonic Subsequence" },
          { num: 449, title: "Number of Longest Increasing Subsequences" },
        ],
      },
      {
        name: "MCM / Partition DP",
        items: [
          { num: 450, title: "Matrix Chain Multiplication" },
          { num: 451, title: "Matrix Chain Multiplication — Bottom-Up" },
          { num: 452, title: "Minimum Cost to Cut the Stick" },
          { num: 453, title: "Burst Balloons" },
          { num: 454, title: "Different Ways to Evaluate a Boolean Expression" },
          { num: 455, title: "Palindrome Partitioning II" },
          { num: 456, title: "Partition Array for Maximum Sum" },
        ],
      },
      {
        name: "DP on Squares",
        items: [
          { num: 457, title: "Maximum Rectangle Area with All 1's" },
          { num: 458, title: "Count Square Submatrices with All Ones" },
        ],
      },
    ],
  },
  {
    id: "tries",
    name: "Tries",
    subsections: [
      {
        name: null,
        items: [
          { num: 459, title: "Trie Implementation and Operations" },
          { num: 460, title: "Trie Implementation and Advanced Operations" },
          { num: 461, title: "Longest Word with All Prefixes" },
          { num: 462, title: "Number of Distinct Substrings in a String" },
          { num: 463, title: "Bit Prerequisites for TRIE Problems" },
          { num: 464, title: "Maximum XOR of Two Numbers in an Array" },
          { num: 465, title: "Maximum XOR with an Element from an Array" },
        ],
      },
    ],
  },
  {
    id: "strings-hard",
    name: "Strings — Hard",
    subsections: [
      {
        name: null,
        items: [
          { num: 466, title: "Minimum Number of Bracket Reversals to Make an Expression Balanced" },
          { num: 467, title: "Count and Say" },
          { num: 468, title: "Hashing in Strings — Theory" },
          { num: 469, title: "Rabin Karp Algorithm" },
          { num: 470, title: "Z Function" },
          { num: 471, title: "KMP Algorithm / LPS Array" },
          { num: 472, title: "Shortest Palindrome" },
          { num: 473, title: "Longest Happy Prefix" },
          { num: 474, title: "Count Palindromic Subsequences" },
        ],
      },
    ],
  },
];

// Build a lookup of sheet-number -> algorithm id from every algorithm's
// self-declared `sheetNum` (a number, or an array of numbers for the rare
// algorithm that covers more than one sheet item).
const NUM_TO_BUILT_ID = new Map();
for (const algo of ALGORITHMS) {
  const nums = Array.isArray(algo.sheetNum) ? algo.sheetNum : [algo.sheetNum];
  for (const n of nums) {
    if (typeof n === "number") NUM_TO_BUILT_ID.set(n, algo.id);
  }
}

// The roadmap structure with `builtId` merged in — this is the one thing
// that connects the static sheet structure above to whatever algorithms
// happen to be built right now. Adding a new algorithm file with a
// `sheetNum` automatically makes its row here link to a full page; nothing
// in this file ever needs to change.
export const ROADMAP = ROADMAP_STRUCTURE.map((sec) => ({
  ...sec,
  subsections: sec.subsections.map((sub) => ({
    ...sub,
    items: sub.items.map((item) => ({ ...item, builtId: NUM_TO_BUILT_ID.get(item.num) || null })),
  })),
}));

export const TOTAL_ITEMS = ROADMAP.reduce((sum, sec) => sum + sec.subsections.reduce((s, sub) => s + sub.items.length, 0), 0);

export function flatItems() {
  const flat = [];
  for (const sec of ROADMAP) {
    for (const sub of sec.subsections) {
      for (const item of sub.items) {
        flat.push({ ...item, sectionName: sec.name, subsectionName: sub.name });
      }
    }
  }
  return flat;
}

// Ordered list of built algorithm ids, in roadmap (sheet) order — used for
// "previous / next" navigation on the algorithm detail page. De-duplicated,
// since a single algorithm can map to more than one sheet item.
export function builtIdsInOrder() {
  const seen = new Set();
  const ordered = [];
  for (const it of flatItems()) {
    if (it.builtId && !seen.has(it.builtId)) {
      seen.add(it.builtId);
      ordered.push(it.builtId);
    }
  }
  return ordered;
}
