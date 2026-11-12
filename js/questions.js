/**
 * SkillTest - Questions Data Bank
 * Features beginner, intermediate, and advanced assessments for:
 * Core Java, SQL, HTML & CSS, and JavaScript.
 * Supports Easy, Medium, and Hard difficulty levels.
 */

const TEST_CATEGORIES = {
    java: {
        id: "java",
        title: "Core Java",
        tagline: "Test your fundamentals, OOP principles, collections, and execution architecture in Java.",
        icon: "☕",
        difficulty: "Beginner",
        durationMinutes: 10,
        passingPercentage: 60,
        badgeColor: "#0284c7",
        difficulties: {
            easy: [
                {
                    id: 1,
                    question: "Who is known as the father of the Java programming language?",
                    options: ["James Gosling", "Bjarne Stroustrup", "Guido van Rossum", "Dennis Ritchie"],
                    correct: 0,
                    explanation: "James Gosling developed Java while working at Sun Microsystems in 1995."
                },
                {
                    id: 2,
                    question: "What is the file extension of a compiled Java bytecode file?",
                    options: [".java", ".class", ".byte", ".exe"],
                    correct: 1,
                    explanation: "Java source files (.java) are compiled by javac into platform-independent bytecode stored in .class files."
                },
                {
                    id: 3,
                    question: "Which component of Java is responsible for running the compiled bytecode?",
                    options: ["JDK", "JVM (Java Virtual Machine)", "JRE Compiler", "JDB (Java Debugger)"],
                    correct: 1,
                    explanation: "The JVM (Java Virtual Machine) executes compiled Java bytecode on the host operating system."
                },
                {
                    id: 4,
                    question: "Which of the following is NOT a primitive data type in Java?",
                    options: ["int", "boolean", "float", "String"],
                    correct: 3,
                    explanation: "String is a class (reference type) in Java, whereas int, boolean, and float are primitive types."
                },
                {
                    id: 5,
                    question: "Which keyword is used to create a new instance of a class in Java?",
                    options: ["new", "create", "alloc", "instanceof"],
                    correct: 0,
                    explanation: "The 'new' keyword dynamically allocates memory at runtime for a new object."
                },
                {
                    id: 6,
                    question: "What is the default value of an uninitialized boolean instance variable in Java?",
                    options: ["true", "false", "null", "0"],
                    correct: 1,
                    explanation: "Instance boolean variables in Java are automatically initialized to false by default."
                },
                {
                    id: 7,
                    question: "What is the correct syntax for the main method entry point in Java?",
                    options: [
                        "public static void main(String[] args)",
                        "public void main(String args[])",
                        "static void main(String[] args)",
                        "public static int main(String[] args)"
                    ],
                    correct: 0,
                    explanation: "The JVM looks for 'public static void main(String[] args)' as the entry point of standalone Java applications."
                },
                {
                    id: 8,
                    question: "Which keyword is used by a class to inherit properties and methods from another class?",
                    options: ["implements", "inherits", "extends", "super"],
                    correct: 2,
                    explanation: "The 'extends' keyword establishes inheritance between a subclass and its superclass."
                },
                {
                    id: 9,
                    question: "Which control loop in Java is guaranteed to execute its code block at least once?",
                    options: ["for loop", "while loop", "do-while loop", "for-each loop"],
                    correct: 2,
                    explanation: "A do-while loop evaluates its exit condition at the bottom, so the body executes at least once."
                },
                {
                    id: 10,
                    question: "Which package is automatically imported into every Java program without an explicit import statement?",
                    options: ["java.util", "java.io", "java.lang", "java.net"],
                    correct: 2,
                    explanation: "java.lang contains core classes such as Object, String, Math, and System and is imported by default."
                }
            ],
            medium: [
                {
                    id: 11,
                    question: "What is method overloading in Java?",
                    options: [
                        "Multiple methods with the same name but different parameters in the same class",
                        "Redefining a superclass method in a subclass with the same signature",
                        "Hiding a private method of another class",
                        "Changing only the return type of a method"
                    ],
                    correct: 0,
                    explanation: "Method overloading allows multiple methods in the same class to share the same name provided their argument lists differ."
                },
                {
                    id: 12,
                    question: "What does the 'final' keyword signify when applied to a Java class?",
                    options: [
                        "The class cannot be instantiated",
                        "The class cannot be subclassed (inherited from)",
                        "All methods in the class are automatically private",
                        "The class can only exist once in memory"
                    ],
                    correct: 1,
                    explanation: "Declaring a class as 'final' prevents other classes from extending it (e.g., java.lang.String)."
                },
                {
                    id: 13,
                    question: "Which statement accurately describes String objects in Java?",
                    options: [
                        "String objects are mutable and can be resized in place",
                        "String objects are immutable; modifying them creates a new object",
                        "String objects are primitive types stored on the CPU stack",
                        "String objects can only contain ASCII characters"
                    ],
                    correct: 1,
                    explanation: "Strings are immutable in Java. Any operation that appears to modify a String actually returns a new String instance."
                },
                {
                    id: 14,
                    question: "What is the primary purpose of the 'super' keyword in Java?",
                    options: [
                        "To refer to the direct superclass members and constructor",
                        "To grant maximum access permissions to a variable",
                        "To mark a method as thread-safe",
                        "To instantiate an interface directly"
                    ],
                    correct: 0,
                    explanation: "'super' is used within a subclass to refer to methods, fields, or the constructor of its immediate superclass."
                },
                {
                    id: 15,
                    question: "Which block in a try-catch structure is always executed, whether an exception occurs or not?",
                    options: ["catch block", "finally block", "throw block", "throws block"],
                    correct: 1,
                    explanation: "The finally block always executes after try and catch blocks, making it ideal for resource cleanup."
                },
                {
                    id: 16,
                    question: "Which of the following is a checked exception in Java?",
                    options: ["NullPointerException", "ArrayIndexOutOfBoundsException", "IOException", "ArithmeticException"],
                    correct: 2,
                    explanation: "IOException is a checked exception that must be declared with 'throws' or caught in a 'try-catch' block."
                },
                {
                    id: 17,
                    question: "How do you obtain the number of elements in a standard Java array named 'scores'?",
                    options: ["scores.length()", "scores.size()", "scores.length", "scores.count"],
                    correct: 2,
                    explanation: "In Java, array length is a final public field, accessed without parentheses as 'scores.length'."
                },
                {
                    id: 18,
                    question: "What is 'autoboxing' in Java?",
                    options: [
                        "Automatic conversion of a primitive type to its corresponding wrapper object",
                        "Automatic garbage collection of unused variables",
                        "Creating GUI windows automatically",
                        "Converting any object into a byte array"
                    ],
                    correct: 0,
                    explanation: "Autoboxing is the automatic conversion the Java compiler makes between primitive types and their wrapper classes (e.g., int to Integer)."
                },
                {
                    id: 19,
                    question: "Can an abstract class in Java have constructor methods?",
                    options: [
                        "Yes, called when a concrete subclass is instantiated",
                        "No, abstract classes can never have constructors",
                        "Only if all methods in the class are abstract",
                        "Only if the constructor is private"
                    ],
                    correct: 0,
                    explanation: "Abstract classes can define constructors, which are invoked by subclass constructors via super() during instantiation."
                },
                {
                    id: 20,
                    question: "Which method is called by the Garbage Collector before reclaiming an object's memory in classic Java?",
                    options: ["destroy()", "finalize()", "clean()", "dispose()"],
                    correct: 1,
                    explanation: "The finalize() method on java.lang.Object is historically invoked by the garbage collector before discarding an object."
                }
            ],
            hard: [
                {
                    id: 21,
                    question: "Where are Java object instances physically allocated at runtime?",
                    options: ["On the Call Stack", "In the Heap memory", "In the CPU Cache", "In the PermGen exclusively"],
                    correct: 1,
                    explanation: "All Java object instances are allocated on the Heap memory, while references and local primitive variables reside on the Stack."
                },
                {
                    id: 22,
                    question: "What is the key difference between HashMap and ConcurrentHashMap?",
                    options: [
                        "ConcurrentHashMap allows concurrent reads and segment/bucket-level writes without locking the whole map",
                        "HashMap is synchronized by default whereas ConcurrentHashMap is not",
                        "ConcurrentHashMap does not allow key values",
                        "HashMap can only store strings"
                    ],
                    correct: 0,
                    explanation: "ConcurrentHashMap achieves thread-safety with high concurrency by using bucket-level locking (CAS and synchronized nodes), unlike full synchronization."
                },
                {
                    id: 23,
                    question: "What does the 'volatile' keyword guarantee in Java multithreading?",
                    options: [
                        "Atomicity of compound operations (e.g., count++)",
                        "Visibility of variable updates across all threads by reading directly from main memory",
                        "Thread sleep duration",
                        "Deadlock prevention"
                    ],
                    correct: 1,
                    explanation: "volatile ensures memory visibility and prevents instruction reordering, guaranteeing reads/writes go directly to shared main memory."
                },
                {
                    id: 24,
                    question: "What happens during Java Generics 'Type Erasure'?",
                    options: [
                        "Type parameters are replaced with their bounds or Object at compile time to maintain bytecode compatibility",
                        "Variables are deleted from memory after execution",
                        "Runtime types are converted into strings",
                        "All primitive types are erased"
                    ],
                    correct: 0,
                    explanation: "Type erasure removes all generic type information during compilation, inserting casts where necessary for backwards compatibility."
                },
                {
                    id: 25,
                    question: "What does calling String.intern() accomplish?",
                    options: [
                        "Puts the string into the String Constant Pool or returns the canonical instance if already present",
                        "Converts the string into integer bytecode",
                        "Translates string encoding to UTF-16",
                        "Encrypts the string"
                    ],
                    correct: 0,
                    explanation: "intern() ensures all identical strings share the exact same memory address inside the String Constant Pool."
                },
                {
                    id: 26,
                    question: "What is a 'fail-fast' iterator in Java Collections?",
                    options: [
                        "An iterator that throws ConcurrentModificationException if the underlying collection is modified during iteration",
                        "An iterator that continues silently despite modifications",
                        "An iterator optimized for network transfers",
                        "An iterator that removes elements immediately"
                    ],
                    correct: 0,
                    explanation: "Fail-fast iterators (such as ArrayList's iterator) detect concurrent structural modifications and immediately throw ConcurrentModificationException."
                },
                {
                    id: 27,
                    question: "How do 'default' methods in Java 8 interfaces solve the multiple inheritance problem of methods?",
                    options: [
                        "Classes must explicitly override conflicting default methods from multiple interfaces",
                        "The compiler randomly picks one interface",
                        "Interfaces cannot have default methods with the same name",
                        "Subclasses crash at runtime"
                    ],
                    correct: 0,
                    explanation: "If a class inherits conflicting default methods from multiple interfaces, the compiler requires the class to explicitly override the method."
                },
                {
                    id: 28,
                    question: "What is the difference between Comparable and Comparator in Java?",
                    options: [
                        "Comparable provides natural ordering via compareTo(); Comparator provides custom ordering via compare()",
                        "Comparator is for numbers only; Comparable is for text",
                        "Comparable cannot be used with Collections.sort()",
                        "They are identical and interchangeable"
                    ],
                    correct: 0,
                    explanation: "Comparable defines single natural ordering on the class itself (compareTo), whereas Comparator allows multiple independent ordering strategies (compare)."
                },
                {
                    id: 29,
                    question: "What is the memory leak risk associated with static inner classes vs non-static inner classes?",
                    options: [
                        "Non-static inner classes hold an implicit reference to their enclosing outer class instance",
                        "Static inner classes consume more CPU cycles",
                        "Non-static inner classes are always stored in Metaspace",
                        "Static inner classes cannot be garbage collected"
                    ],
                    correct: 0,
                    explanation: "A non-static inner class holds an invisible reference to its outer class, which can prevent the outer class from being garbage collected."
                },
                {
                    id: 30,
                    question: "What is a phantom reference in Java (java.lang.ref.PhantomReference)?",
                    options: [
                        "A reference used for post-mortem cleanup after an object has been finalized and before its memory is freed",
                        "A pointer to hardware memory addresses",
                        "A reference that never gets garbage collected",
                        "A weak key inside HashMap"
                    ],
                    correct: 0,
                    explanation: "Phantom references are enqueued only after objects are finalized, providing a safer alternative to finalize() for cleanup tracking."
                }
            ]
        }
    },
    sql: {
        id: "sql",
        title: "SQL",
        tagline: "Test your relational database queries, joins, subqueries, indexes, and transactions.",
        icon: "🗄️",
        difficulty: "Beginner",
        durationMinutes: 10,
        passingPercentage: 60,
        badgeColor: "#0369a1",
        difficulties: {
            easy: [
                {
                    id: 1,
                    question: "What does SQL stand for?",
                    options: ["Structured Query Language", "Simple Question Language", "Sequential Query List", "Standard Quantity Logic"],
                    correct: 0,
                    explanation: "SQL stands for Structured Query Language, the ANSI standard language for relational databases."
                },
                {
                    id: 2,
                    question: "Which SQL command is used to extract data from a database?",
                    options: ["GET", "OPEN", "SELECT", "FETCH"],
                    correct: 2,
                    explanation: "The SELECT statement queries and retrieves records from database tables."
                },
                {
                    id: 3,
                    question: "Which SQL clause filters records based on a specific condition?",
                    options: ["WHERE", "FILTER", "HAVING ONLY", "CHECK"],
                    correct: 0,
                    explanation: "The WHERE clause restricts rows returned to those satisfying the specified condition."
                },
                {
                    id: 4,
                    question: "Which SQL keyword eliminates duplicate rows from a query result?",
                    options: ["UNIQUE", "DISTINCT", "DIFFERENT", "FILTER_DUPLICATES"],
                    correct: 1,
                    explanation: "SELECT DISTINCT returns only unique values, eliminating duplicates from output."
                },
                {
                    id: 5,
                    question: "Which aggregate function returns the total count of rows matching criteria?",
                    options: ["SUM()", "TOTAL()", "COUNT()", "NUM()"],
                    correct: 2,
                    explanation: "COUNT() returns the number of rows matching the query criteria."
                },
                {
                    id: 6,
                    question: "Which clause is used to sort the result-set in SQL?",
                    options: ["SORT BY", "ORDER BY", "GROUP BY", "ARRANGE"],
                    correct: 1,
                    explanation: "ORDER BY sorts the query result in ascending (ASC) or descending (DESC) order."
                },
                {
                    id: 7,
                    question: "Which SQL statement adds new rows into a table?",
                    options: ["ADD RECORD", "INSERT INTO", "NEW ROW", "CREATE ROW"],
                    correct: 1,
                    explanation: "The INSERT INTO statement is used to insert new records into a table."
                },
                {
                    id: 8,
                    question: "Which constraint uniquely identifies each record in a database table?",
                    options: ["FOREIGN KEY", "PRIMARY KEY", "CHECK", "DEFAULT"],
                    correct: 1,
                    explanation: "A PRIMARY KEY uniquely identifies each record and cannot contain NULL values."
                },
                {
                    id: 9,
                    question: "Which SQL statement modifies existing records within a table?",
                    options: ["MODIFY", "UPDATE", "SAVE", "ALTER"],
                    correct: 1,
                    explanation: "The UPDATE statement modifies existing data rows in a table."
                },
                {
                    id: 10,
                    question: "Which command completely removes an entire table and its schema from the database?",
                    options: ["DELETE TABLE", "REMOVE TABLE", "DROP TABLE", "CLEAR TABLE"],
                    correct: 2,
                    explanation: "DROP TABLE deletes the table definition along with all its data, triggers, and constraints."
                }
            ],
            medium: [
                {
                    id: 11,
                    question: "What is the difference between WHERE and HAVING clauses in SQL?",
                    options: [
                        "WHERE filters rows before aggregation; HAVING filters aggregated groups after GROUP BY",
                        "WHERE is only for numbers; HAVING is for strings",
                        "HAVING cannot be used without WHERE",
                        "They are identical in SQL"
                    ],
                    correct: 0,
                    explanation: "WHERE filters rows before any aggregate functions are applied; HAVING filters groups after GROUP BY."
                },
                {
                    id: 12,
                    question: "Which JOIN returns all rows from the left table and matched rows from the right table?",
                    options: ["INNER JOIN", "LEFT JOIN (or LEFT OUTER JOIN)", "RIGHT JOIN", "FULL JOIN"],
                    correct: 1,
                    explanation: "A LEFT JOIN returns all records from the left table and matched records from the right table, filling nulls if no match."
                },
                {
                    id: 13,
                    question: "In a SQL LIKE pattern, which wildcard matches any string of zero or more characters?",
                    options: ["_", "%", "*", "?"],
                    correct: 1,
                    explanation: "% represents zero, one, or multiple characters, while _ represents exactly one character."
                },
                {
                    id: 14,
                    question: "What does the TRUNCATE TABLE command do compared to DELETE FROM table?",
                    options: [
                        "TRUNCATE is a DDL command that quickly resets the table without logging individual row deletions",
                        "TRUNCATE only deletes the last row",
                        "DELETE drops the schema entirely",
                        "TRUNCATE is slower than DELETE"
                    ],
                    correct: 0,
                    explanation: "TRUNCATE is a fast, minimally logged DDL operation that deallocates data pages rather than logging each row deletion."
                },
                {
                    id: 15,
                    question: "Which SQL constraint prevents invalid data from being inserted by enforcing a boolean condition?",
                    options: ["CHECK", "NOT NULL", "UNIQUE", "FOREIGN KEY"],
                    correct: 0,
                    explanation: "The CHECK constraint ensures that values in a column satisfy a specific boolean condition (e.g., age >= 18)."
                },
                {
                    id: 16,
                    question: "What does a FOREIGN KEY constraint ensure?",
                    options: [
                        "Referential integrity between records in two relational tables",
                        "Encryption of sensitive records",
                        "Automatic sorting by foreign column",
                        "Faster cloud backups"
                    ],
                    correct: 0,
                    explanation: "A FOREIGN KEY enforces referential integrity by requiring that a value matches an existing primary key in another table."
                },
                {
                    id: 17,
                    question: "How do you check for missing/unassigned values in a SQL column?",
                    options: ["column = NULL", "column IS NULL", "column == NULL", "column EQUALS NULL"],
                    correct: 1,
                    explanation: "In SQL, NULL signifies unknown value and cannot be compared with '='; you must use 'IS NULL' or 'IS NOT NULL'."
                },
                {
                    id: 18,
                    question: "What is the difference between UNION and UNION ALL?",
                    options: [
                        "UNION removes duplicate rows from the combined result; UNION ALL keeps all duplicates",
                        "UNION is for numbers only; UNION ALL is for text",
                        "UNION ALL is slower than UNION",
                        "UNION sorts descending automatically"
                    ],
                    correct: 0,
                    explanation: "UNION performs a distinct sort to eliminate duplicate rows, while UNION ALL retains all rows and is faster."
                },
                {
                    id: 19,
                    question: "Which clause is used to group rows that have the same values in specified columns?",
                    options: ["CLUSTER BY", "GROUP BY", "CATEGORY BY", "PARTITION BY"],
                    correct: 1,
                    explanation: "GROUP BY summarizes rows with identical values into summary rows (e.g., COUNT by department)."
                },
                {
                    id: 20,
                    question: "What does an INNER JOIN return?",
                    options: [
                        "Only rows that have matching values in both tables",
                        "All rows from both tables unconditionally",
                        "Only unmatched rows",
                        "Only the first 10 rows"
                    ],
                    correct: 0,
                    explanation: "INNER JOIN selects records that have matching values in both tables based on the join predicate."
                }
            ],
            hard: [
                {
                    id: 21,
                    question: "What do the ACID properties in database transaction management stand for?",
                    options: [
                        "Atomicity, Consistency, Isolation, Durability",
                        "Availability, Correctness, Integrity, Distribution",
                        "Access, Concurrency, Indexing, Decoupling",
                        "Association, Control, Idempotence, Division"
                    ],
                    correct: 0,
                    explanation: "ACID guarantees that database transactions are processed reliably: Atomicity, Consistency, Isolation, and Durability."
                },
                {
                    id: 22,
                    question: "What is the key benefit of a database B-Tree index?",
                    options: [
                        "Reduces search complexity from O(N) full table scan to O(log N) tree lookup",
                        "Automatically normalizes database tables",
                        "Encrypts disk tables automatically",
                        "Replaces SQL primary keys"
                    ],
                    correct: 0,
                    explanation: "B-Tree indexes maintain sorted data to provide logarithmic O(log N) lookup, insertion, and range queries."
                },
                {
                    id: 23,
                    question: "What is a 'deadlock' in a relational database?",
                    options: [
                        "A state where two or more transactions each hold locks that the other needs, causing mutual waiting",
                        "A corrupted table index on disk",
                        "A query that runs out of memory",
                        "A network disconnection"
                    ],
                    correct: 0,
                    explanation: "A deadlock occurs when two transactions wait indefinitely for locks held by each other, resolved by the database aborting one."
                },
                {
                    id: 24,
                    question: "What is a Window Function in SQL (e.g., ROW_NUMBER() OVER (...))?",
                    options: [
                        "A function that performs calculations across a set of rows related to the current row without collapsing them into one row",
                        "A function that opens desktop windows in the OS",
                        "A function limited to 10 rows maximum",
                        "A temporary table storage method"
                    ],
                    correct: 0,
                    explanation: "Window functions compute values over partitions of rows while preserving each individual row's identity."
                },
                {
                    id: 25,
                    question: "What is the fundamental difference between 2nd Normal Form (2NF) and 3rd Normal Form (3NF)?",
                    options: [
                        "2NF removes partial key dependencies; 3NF removes transitive dependencies",
                        "2NF is for primary keys only; 3NF is for foreign keys",
                        "2NF requires XML; 3NF requires JSON",
                        "There is no practical difference"
                    ],
                    correct: 0,
                    explanation: "2NF eliminates partial dependencies on a composite key, while 3NF eliminates transitive dependencies between non-key columns."
                },
                {
                    id: 26,
                    question: "What is the difference between a standard View and a Materialized View?",
                    options: [
                        "A standard View is a saved query executed dynamically; a Materialized View stores query results physically on disk",
                        "A Materialized View cannot be queried using SELECT",
                        "Standard Views only work with MySQL",
                        "Materialized Views are stored only in RAM"
                    ],
                    correct: 0,
                    explanation: "Standard views are virtual queries run on demand; materialized views physically persist result sets to optimize read-heavy workloads."
                },
                {
                    id: 27,
                    question: "What transaction isolation level prevents Dirty Reads, Non-Repeatable Reads, and Phantom Reads?",
                    options: ["SERIALIZABLE", "READ COMMITTED", "READ UNCOMMITTED", "REPEATABLE READ"],
                    correct: 0,
                    explanation: "SERIALIZABLE is the strictest isolation level, preventing dirty reads, non-repeatable reads, and phantom reads."
                },
                {
                    id: 28,
                    question: "What does the EXPLAIN ANALYZE command do in modern SQL engines (PostgreSQL/MySQL)?",
                    options: [
                        "Executes the query and outputs the actual execution plan with node costs, scan types, and timing",
                        "Automatically rewrites SQL code",
                        "Deletes slow rows",
                        "Creates missing indexes automatically"
                    ],
                    correct: 0,
                    explanation: "EXPLAIN ANALYZE displays the optimizer's execution plan alongside actual runtime statistics and cost profiles."
                },
                {
                    id: 29,
                    question: "What is a composite clustered index?",
                    options: [
                        "A clustered index that orders physical table rows on disk based on multiple combined columns",
                        "An index stored on an external server",
                        "An index that cannot contain foreign keys",
                        "A temporary index created in memory"
                    ],
                    correct: 0,
                    explanation: "A clustered index determines the physical order of data in the table; a composite clustered index sorts by multiple column keys."
                },
                {
                    id: 30,
                    question: "What is the purpose of the COALESCE() function in SQL?",
                    options: [
                        "Returns the first non-NULL value in a list of arguments",
                        "Combines multiple tables together",
                        "Converts text into uppercase",
                        "Calculates standard deviation"
                    ],
                    correct: 0,
                    explanation: "COALESCE(val1, val2, ...) evaluates arguments in order and returns the first value that is not NULL."
                }
            ]
        }
    },
    html_css: {
        id: "html_css",
        title: "HTML & CSS",
        tagline: "Assess your foundation in web markup, semantic elements, modern CSS layout, Grid, and Flexbox.",
        icon: "🎨",
        difficulty: "Beginner",
        durationMinutes: 10,
        passingPercentage: 60,
        badgeColor: "#0284c7",
        difficulties: {
            easy: [
                {
                    id: 1,
                    question: "What does HTML stand for?",
                    options: ["HyperText Markup Language", "High Tech Modern Language", "Hyperlink and Text Marking Level", "Home Tool Markup Language"],
                    correct: 0,
                    explanation: "HTML stands for HyperText Markup Language, the standard markup language for documents on the Web."
                },
                {
                    id: 2,
                    question: "Which HTML tag is used to create a hyperlink?",
                    options: ["<link>", "<a>", "<href>", "<hyperlink>"],
                    correct: 1,
                    explanation: "The <a> (anchor) tag creates hyperlinks that link to another page or resource."
                },
                {
                    id: 3,
                    question: "Which HTML tag represents the most important (largest) heading?",
                    options: ["<head>", "<h6>", "<h1>", "<heading>"],
                    correct: 2,
                    explanation: "<h1> represents top-level headings, while <h6> represents lowest-level headings."
                },
                {
                    id: 4,
                    question: "What does CSS stand for?",
                    options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Syntax", "Colorful Styling System"],
                    correct: 1,
                    explanation: "CSS stands for Cascading Style Sheets, used to style and layout HTML documents."
                },
                {
                    id: 5,
                    question: "Which CSS property is used to set the text color of an element?",
                    options: ["text-color", "font-color", "color", "text-style"],
                    correct: 2,
                    explanation: "The 'color' property specifies the foreground color of text content."
                },
                {
                    id: 6,
                    question: "Which CSS symbol is used to select an element by its ID attribute?",
                    options: [". (period)", "# (hash/pound)", "@ (at sign)", "* (asterisk)"],
                    correct: 1,
                    explanation: "The '#' symbol targets elements with a specific id attribute (e.g. #header)."
                },
                {
                    id: 7,
                    question: "In the CSS Box Model, which layer sits directly between content and border?",
                    options: ["Margin", "Padding", "Outline", "Gutter"],
                    correct: 1,
                    explanation: "Padding clears an area around the content inside the element's border."
                },
                {
                    id: 8,
                    question: "Which CSS display property activates a modern flexible box layout?",
                    options: ["display: block", "display: inline", "display: flex", "display: table"],
                    correct: 2,
                    explanation: "'display: flex' enables the Flexbox layout model for responsive alignment and distribution."
                },
                {
                    id: 9,
                    question: "Which HTML attribute specifies the image source path in an <img> tag?",
                    options: ["href", "src", "url", "link"],
                    correct: 1,
                    explanation: "The 'src' (source) attribute contains the path to the image file."
                },
                {
                    id: 10,
                    question: "Which CSS property adds transparent space outside an element's border?",
                    options: ["padding", "margin", "spacing", "border-spacing"],
                    correct: 1,
                    explanation: "Margin clears space outside the border of an element."
                }
            ],
            medium: [
                {
                    id: 11,
                    question: "How does 'box-sizing: border-box' change the CSS box model calculation?",
                    options: [
                        "Padding and border are included within the element's specified width and height",
                        "Padding is added outside the element's width",
                        "Borders are hidden automatically",
                        "Margins are subtracted from the width"
                    ],
                    correct: 0,
                    explanation: "border-box ensures that padding and borders do not expand the element beyond its set width."
                },
                {
                    id: 12,
                    question: "What is the difference between relative and absolute positioning in CSS?",
                    options: [
                        "Relative is positioned relative to its normal position; Absolute is positioned relative to its closest positioned ancestor",
                        "Relative removes elements from document flow; Absolute does not",
                        "Absolute positioning only works on tablet devices",
                        "They are identical"
                    ],
                    correct: 0,
                    explanation: "position: relative offsets an element without removing it from flow; position: absolute positions relative to the nearest positioned ancestor."
                },
                {
                    id: 13,
                    question: "What is the semantic difference between <article> and <section> in HTML5?",
                    options: [
                        "<article> represents a self-contained, independently distributable piece of content; <section> groups thematic content",
                        "<section> is only for sidebar menus",
                        "<article> cannot contain headings",
                        "They have no semantic distinction"
                    ],
                    correct: 0,
                    explanation: "<article> is intended for standalone content like blog posts, while <section> groups thematic subsections."
                },
                {
                    id: 14,
                    question: "In CSS Flexbox, what does 'justify-content' control compared to 'align-items'?",
                    options: [
                        "justify-content aligns along the main axis; align-items aligns along the cross axis",
                        "justify-content only works vertically",
                        "align-items only works on mobile devices",
                        "They control the exact same axis"
                    ],
                    correct: 0,
                    explanation: "justify-content aligns items along the primary flex direction; align-items controls alignment across the perpendicular cross axis."
                },
                {
                    id: 15,
                    question: "What unit is 'rem' based on in CSS?",
                    options: [
                        "The font size of the root element (<html>)",
                        "The font size of the immediate parent element",
                        "The device screen height",
                        "The browser viewport width"
                    ],
                    correct: 0,
                    explanation: "'rem' (root em) is relative to the font-size of the root <html> element, unlike 'em' which is relative to the parent."
                },
                {
                    id: 16,
                    question: "Which CSS selector has the highest specificity?",
                    options: ["#main-header", ".nav-item.active", "header nav a", "*"],
                    correct: 0,
                    explanation: "An ID selector (#main-header, specificity 0-1-0-0) beats classes (0-0-1-0) and elements (0-0-0-1)."
                },
                {
                    id: 17,
                    question: "Which CSS property creates a two-dimensional grid layout?",
                    options: ["display: grid", "display: flex", "display: table-row", "display: inline-block"],
                    correct: 0,
                    explanation: "'display: grid' activates CSS Grid layout, allowing control over both rows and columns simultaneously."
                },
                {
                    id: 18,
                    question: "What does the ':nth-child(even)' pseudo-class select?",
                    options: [
                        "Every element that is an even-numbered child of its parent",
                        "Every odd element",
                        "Only the 2nd child",
                        "Elements with even numbers of attributes"
                    ],
                    correct: 0,
                    explanation: ":nth-child(even) targets the 2nd, 4th, 6th, etc., siblings within their parent container."
                },
                {
                    id: 19,
                    question: "What is the purpose of the 'alt' attribute on an <img> tag?",
                    options: [
                        "Provides alternative text for screen readers and when images fail to load",
                        "Styles the image border with alternative colors",
                        "Compresses image bandwidth",
                        "Rotates the image 180 degrees"
                    ],
                    correct: 0,
                    explanation: "The alt attribute is essential for accessibility (screen readers) and displays text if the image fails to download."
                },
                {
                    id: 20,
                    question: "Which CSS media query targets screens with a maximum width of 768px?",
                    options: [
                        "@media (max-width: 768px)",
                        "@screen (width <= 768px)",
                        "@media (width: 768px)",
                        "@responsive (768px)"
                    ],
                    correct: 0,
                    explanation: "@media (max-width: 768px) applies styles only when the viewport width is 768 pixels or less."
                }
            ],
            hard: [
                {
                    id: 21,
                    question: "What creates a new Stacking Context in CSS, affecting z-index behavior?",
                    options: [
                        "position: relative with a z-index other than auto, or opacity < 1, or transform other than none",
                        "Any <div> with a class name",
                        "Only the <body> tag",
                        "Setting display: block"
                    ],
                    correct: 0,
                    explanation: "Stacking contexts are formed by positioned elements with non-auto z-index, opacity < 1, transforms, filters, and other modern CSS properties."
                },
                {
                    id: 22,
                    question: "What is the difference between a browser Reflow (Layout) and Repaint?",
                    options: [
                        "Reflow recalculates element dimensions and positions; Repaint only redraws visual pixels without changing geometry",
                        "Repaint is much slower than Reflow",
                        "Reflow only happens when changing text color",
                        "They are identical browser phases"
                    ],
                    correct: 0,
                    explanation: "Reflow recalculates page geometry and is computationally heavy; Repaint occurs when visual changes (like color) don't affect layout."
                },
                {
                    id: 23,
                    question: "In CSS Grid, what is the difference between 'auto-fit' and 'auto-fill' in repeat()?",
                    options: [
                        "auto-fit collapses empty repeated tracks to 0px; auto-fill preserves empty tracks as distinct columns",
                        "auto-fill cannot be used with minmax()",
                        "auto-fit is only supported in Safari",
                        "They behave identically on mobile"
                    ],
                    correct: 0,
                    explanation: "auto-fit collapses empty tracks so filled items stretch across the space; auto-fill leaves empty tracks intact."
                },
                {
                    id: 24,
                    question: "What does the 'will-change' CSS property signal to the browser engine?",
                    options: [
                        "Hints that an element will undergo specific property changes, allowing GPU layer promotion and performance optimizations",
                        "Triggers a JavaScript event",
                        "Prevents user interaction",
                        "Disables responsive media queries"
                    ],
                    correct: 0,
                    explanation: "will-change gives the browser advanced warning to optimize rendering (e.g., promoting to a hardware composite layer)."
                },
                {
                    id: 25,
                    question: "What does the CSS 'contain: layout paint' property do?",
                    options: [
                        "Isolates an element's subtree from the rest of the DOM so changes inside don't trigger reflows outside",
                        "Hides all overflow text",
                        "Prevents copying text to clipboard",
                        "Disables Flexbox inside"
                    ],
                    correct: 0,
                    explanation: "CSS containment tells the browser that the element's subtree is independent of the rest of the page for layout and paint."
                },
                {
                    id: 26,
                    question: "What is CSS Specificity value for: 'nav#main ul.menu li:first-child a.active'?",
                    options: ["1-2-3 (1 ID, 2 Classes/Pseudos, 3 Elements)", "0-3-2", "2-1-2", "0-1-4"],
                    correct: 0,
                    explanation: "1 ID (#main), 2 classes/pseudos (.menu, :first-child, .active = 3), and 3 elements (nav, ul, li, a = 4). Specificity is 0-1-3-4."
                },
                {
                    id: 27,
                    question: "What is the Shadow DOM in web components?",
                    options: [
                        "A scoped, encapsulated DOM tree attached to an element that isolates internal styling and script selectors",
                        "A 3D drop-shadow effect filter",
                        "A hidden iframe on the page",
                        "A dark-mode rendering canvas"
                    ],
                    correct: 0,
                    explanation: "Shadow DOM provides true DOM and CSS scoping so internal element styles don't leak out and global styles don't leak in."
                },
                {
                    id: 28,
                    question: "What does 'pointer-events: none' accomplish in CSS?",
                    options: [
                        "Makes an element invisible to mouse and touch events, passing clicks through to the underlying element",
                        "Hides the mouse cursor completely",
                        "Disables the mouse wheel",
                        "Prevents keyboard tab focus only"
                    ],
                    correct: 0,
                    explanation: "pointer-events: none causes the element to ignore click, hover, and touch events, allowing interactions to hit elements below it."
                },
                {
                    id: 29,
                    question: "What is the critical rendering path in browser performance?",
                    options: [
                        "The sequence of steps: DOM -> CSSOM -> Render Tree -> Layout -> Paint -> Composite",
                        "The network route from server to DNS",
                        "The JavaScript compiler optimization pipeline",
                        "The browser cache directory structure"
                    ],
                    correct: 0,
                    explanation: "The Critical Rendering Path is the sequence of steps browsers take to convert HTML, CSS, and JS into pixels on screen."
                },
                {
                    id: 30,
                    question: "Why should CSS transitions animate 'transform' and 'opacity' rather than 'top', 'left', or 'width'?",
                    options: [
                        "transform and opacity are handled entirely on the GPU composite thread without triggering CPU layout or repaint",
                        "transform works on older browsers only",
                        "top and left cannot use cubic-bezier timing",
                        "opacity is faster because it deletes elements"
                    ],
                    correct: 0,
                    explanation: "transform and opacity skip the Layout and Paint steps and are composited directly on the GPU, avoiding jank."
                }
            ]
        }
    },
    javascript: {
        id: "javascript",
        title: "JavaScript",
        tagline: "Evaluate your understanding of JS variables, functions, closures, promises, DOM, and async event loop.",
        icon: "⚡",
        difficulty: "Beginner",
        durationMinutes: 10,
        passingPercentage: 60,
        badgeColor: "#0284c7",
        difficulties: {
            easy: [
                {
                    id: 1,
                    question: "Which keyword declares a reassignable, block-scoped variable in modern JavaScript?",
                    options: ["var", "let", "const", "static"],
                    correct: 1,
                    explanation: "'let' declares a block-scoped variable whose value can be reassigned later."
                },
                {
                    id: 2,
                    question: "What does the expression typeof 'SkillTest' evaluate to?",
                    options: ["'text'", "'string'", "'String'", "'char'"],
                    correct: 1,
                    explanation: "The typeof operator returns lowercase 'string' for string values."
                },
                {
                    id: 3,
                    question: "Which built-in method outputs messages to the browser developer console?",
                    options: ["console.log()", "print()", "document.write()", "terminal.print()"],
                    correct: 0,
                    explanation: "console.log() writes text or objects to the web developer console."
                },
                {
                    id: 4,
                    question: "What is the difference between == and === in JavaScript?",
                    options: [
                        "== checks only value with type coercion; === checks both value and type strictly",
                        "== checks both value and type; === checks only value",
                        "They are identical in modern browsers",
                        "=== is only used for strings"
                    ],
                    correct: 0,
                    explanation: "=== (strict equality) tests value and type without coercion, whereas == converts types before comparing."
                },
                {
                    id: 5,
                    question: "Which array method adds one or more elements to the end of an array?",
                    options: ["push()", "pop()", "shift()", "unshift()"],
                    correct: 0,
                    explanation: "array.push() appends one or more items to the end of an array and returns the new length."
                },
                {
                    id: 6,
                    question: "Which DOM method returns the element with the specified ID attribute?",
                    options: ["document.queryId()", "document.getElementById()", "document.findElement()", "document.selectId()"],
                    correct: 1,
                    explanation: "document.getElementById() returns the DOM element matching the specified ID."
                },
                {
                    id: 7,
                    question: "What will the expression Boolean('') (empty string) return in JavaScript?",
                    options: ["true", "false", "undefined", "NaN"],
                    correct: 1,
                    explanation: "An empty string is a falsy value in JavaScript, so Boolean('') returns false."
                },
                {
                    id: 8,
                    question: "Which keyword creates a variable whose reference cannot be reassigned?",
                    options: ["fixed", "immutable", "const", "final"],
                    correct: 2,
                    explanation: "'const' creates an immutable reference to a value that cannot be reassigned."
                },
                {
                    id: 9,
                    question: "What is the output of 10 + '5' in JavaScript?",
                    options: ["15", "'105'", "NaN", "Error"],
                    correct: 1,
                    explanation: "When one operand is a string, the + operator performs string concatenation, resulting in '105'."
                },
                {
                    id: 10,
                    question: "Which method parses a JSON string into a JavaScript object?",
                    options: ["JSON.stringify()", "JSON.parse()", "JSON.toObject()", "JSON.decode()"],
                    correct: 1,
                    explanation: "JSON.parse() converts a valid JSON string into the corresponding JavaScript value or object."
                }
            ],
            medium: [
                {
                    id: 11,
                    question: "What is a 'closure' in JavaScript?",
                    options: [
                        "A function bundled with references to its surrounding lexical environment",
                        "A method that closes the browser window",
                        "An object with no prototype",
                        "A syntax error in a loop"
                    ],
                    correct: 0,
                    explanation: "A closure gives an inner function access to its outer function's scope even after the outer function has finished executing."
                },
                {
                    id: 12,
                    question: "What is the key difference between arrow functions and regular functions regarding 'this'?",
                    options: [
                        "Arrow functions do not bind their own 'this'; they inherit 'this' lexically from the enclosing scope",
                        "Arrow functions have their own dynamic 'this'",
                        "Arrow functions cannot take arguments",
                        "Regular functions cannot return values"
                    ],
                    correct: 0,
                    explanation: "Arrow functions capture the 'this' value of the enclosing execution context, unlike regular functions whose 'this' depends on how they are called."
                },
                {
                    id: 13,
                    question: "What does the Array.prototype.map() method return?",
                    options: [
                        "A new array containing the results of calling a provided function on every element in the calling array",
                        "The original array modified in place",
                        "A boolean indicating if elements match",
                        "A single accumulated number"
                    ],
                    correct: 0,
                    explanation: "map() creates a brand new array populated with the results of calling a provided function on every item in the calling array."
                },
                {
                    id: 14,
                    question: "What is the difference between event bubbling and event capturing in the DOM?",
                    options: [
                        "Capturing propagates from root down to target; Bubbling propagates from target up to the root",
                        "Bubbling only works on touchscreens",
                        "Capturing happens after bubbling",
                        "They only apply to mouse wheel events"
                    ],
                    correct: 0,
                    explanation: "In DOM event propagation, capturing trickles down from the window to the target element, and bubbling then travels back up."
                },
                {
                    id: 15,
                    question: "What does the 'spread' operator (...) do when applied to an array?",
                    options: [
                        "Expands an iterable array into individual elements",
                        "Sorts the array alphabetically",
                        "Reverses the array items",
                        "Deletes all duplicate values"
                    ],
                    correct: 0,
                    explanation: "The spread operator (...) unpacks array elements or object properties into separate items or arguments."
                },
                {
                    id: 16,
                    question: "What is the state of a Promise that has neither fulfilled nor rejected?",
                    options: ["pending", "settled", "resolved", "waiting"],
                    correct: 0,
                    explanation: "A Promise is in the 'pending' state until it either transitions to 'fulfilled' (resolved) or 'rejected'."
                },
                {
                    id: 17,
                    question: "What is the difference between isNaN() and Number.isNaN()?",
                    options: [
                        "isNaN() coerces values to numbers first (e.g. isNaN('abc') is true); Number.isNaN() checks strictly without coercion",
                        "They are completely identical",
                        "Number.isNaN() only works on negative numbers",
                        "isNaN() is for arrays only"
                    ],
                    correct: 0,
                    explanation: "Number.isNaN() does not perform type coercion and only returns true if the argument is actually NaN and of type Number."
                },
                {
                    id: 18,
                    question: "What is the difference between LocalStorage and SessionStorage in web browsers?",
                    options: [
                        "LocalStorage persists data with no expiration; SessionStorage clears data when the page session / tab closes",
                        "SessionStorage has 10x more storage capacity",
                        "LocalStorage is sent to the server on every HTTP request",
                        "SessionStorage is only accessible by server-side Node.js"
                    ],
                    correct: 0,
                    explanation: "LocalStorage maintains stored data across browser restarts, whereas SessionStorage is cleared when the browser tab closes."
                },
                {
                    id: 19,
                    question: "How does destructuring assignment work in JavaScript?",
                    options: [
                        "Unpacks properties from objects or items from arrays into distinct variables using clean syntax",
                        "Destroys variables to free RAM memory",
                        "Deletes object properties automatically",
                        "Serializes objects into XML"
                    ],
                    correct: 0,
                    explanation: "Destructuring (e.g. const { name, age } = user) extracts values from arrays or objects into distinct variables."
                },
                {
                    id: 20,
                    question: "What does Array.prototype.filter() do?",
                    options: [
                        "Creates a new array containing all elements that pass the test implemented by the provided function",
                        "Modifies elements in the array",
                        "Finds the first matching element only",
                        "Sorts the array descending"
                    ],
                    correct: 0,
                    explanation: "filter() creates a shallow copy of a portion of the array with elements that return true in the callback predicate."
                }
            ],
            hard: [
                {
                    id: 21,
                    question: "In the JavaScript Event Loop, what is the execution priority between Microtasks and Macrotasks?",
                    options: [
                        "All pending Microtasks (Promise callbacks, queueMicrotask) are executed completely before the next Macrotask (setTimeout)",
                        "Macrotasks always execute before any Microtasks",
                        "They run concurrently on two separate CPU threads",
                        "Microtasks are executed once every second"
                    ],
                    correct: 0,
                    explanation: "The microtask queue has priority over the macrotask queue. The engine drains all microtasks before picking the next task."
                },
                {
                    id: 22,
                    question: "What is the difference between Function.prototype.call() and Function.prototype.apply()?",
                    options: [
                        "call() accepts arguments individually separated by commas; apply() accepts arguments as an array",
                        "apply() runs asynchronously; call() runs synchronously",
                        "call() cannot change 'this'",
                        "apply() returns a Promise"
                    ],
                    correct: 0,
                    explanation: "Both invoke the function with a given 'this', but call() takes arguments as comma-separated values while apply() takes an array."
                },
                {
                    id: 23,
                    question: "What is the key benefit of WeakMap over standard Map in JavaScript?",
                    options: [
                        "Keys must be objects, and they are weakly held, allowing garbage collection if no other references exist",
                        "WeakMap can store more elements than Map",
                        "WeakMap is thread-safe across web workers",
                        "WeakMap keys can be primitives like strings"
                    ],
                    correct: 0,
                    explanation: "WeakMap holds weak references to its object keys, preventing memory leaks by letting the garbage collector reclaim keys."
                },
                {
                    id: 24,
                    question: "What is 'Debouncing' in JavaScript UI programming?",
                    options: [
                        "Ensuring that a function is not called until a certain amount of idle time has elapsed since its last invocation",
                        "Limiting execution to at most once per fixed time interval",
                        "A method to delete HTML buttons",
                        "Preventing memory leaks in canvas"
                    ],
                    correct: 0,
                    explanation: "Debounce delays invoking a function until after X milliseconds have elapsed since the user last triggered it (e.g. search input)."
                },
                {
                    id: 25,
                    question: "What does the 'structuredClone()' global method do in modern JavaScript?",
                    options: [
                        "Creates a deep clone of a given value using the structured clone algorithm",
                        "Performs a shallow reference copy of an object",
                        "Compiles JavaScript code to WebAssembly",
                        "Converts objects into JSON strings"
                    ],
                    correct: 0,
                    explanation: "structuredClone() creates a deep copy of complex objects, properly handling circular references and nested types."
                },
                {
                    id: 26,
                    question: "How does Prototypal Inheritance work in JavaScript?",
                    options: [
                        "Objects have an internal [[Prototype]] link; property lookups climb the chain until found or null is reached",
                        "Classes are copied into subclasses at compile time",
                        "Prototypes are stored in server database files",
                        "Objects inherit exclusively through Java-style interfaces"
                    ],
                    correct: 0,
                    explanation: "Every JS object has a hidden link to its prototype. If a property isn't found on the object, JS searches up the prototype chain."
                },
                {
                    id: 27,
                    question: "What is a 'Throttling' function used for in DOM event handlers?",
                    options: [
                        "Enforces a maximum number of times a function can be called over a given time interval (e.g. on scroll)",
                        "Cancels events permanently",
                        "Speeds up network requests",
                        "Freezes the user browser tab"
                    ],
                    correct: 0,
                    explanation: "Throttling guarantees that a function executes at most once every N milliseconds (e.g., handling window resize or scroll)."
                },
                {
                    id: 28,
                    question: "What is the difference between 'async/await' and raw Promises?",
                    options: [
                        "async/await is syntactic sugar over Promises, allowing asynchronous code to be written with synchronous-like structure",
                        "async/await blocks the single JS thread completely",
                        "async functions cannot return Promises",
                        "Promises are deprecated in ES2020"
                    ],
                    correct: 0,
                    explanation: "async/await builds on Promises to provide cleaner, more readable synchronous-looking control flow and error handling with try/catch."
                },
                {
                    id: 29,
                    question: "What is a generator function (function*) in JavaScript?",
                    options: [
                        "A function that can be exited and later re-entered, pausing execution with the 'yield' keyword",
                        "A function that generates random numbers only",
                        "A factory function that creates HTML elements",
                        "A function running inside a web worker"
                    ],
                    correct: 0,
                    explanation: "Generator functions produce an iterator object and pause their execution at each 'yield', resuming on next()."
                },
                {
                    id: 30,
                    question: "What happens if an unhandled promise rejection occurs in modern browsers?",
                    options: [
                        "Triggers the 'unhandledrejection' event on the window and logs an error to the developer console",
                        "Crashes the operating system immediately",
                        "Silently restarts the computer",
                        "Deletes LocalStorage automatically"
                    ],
                    correct: 0,
                    explanation: "Unhandled rejections fire an 'unhandledrejection' event on the global window object and log an error in the console."
                }
            ]
        }
    }
};

// Backward-compatible question getter
function getCategoryQuestions(categoryId, difficulty = "easy") {
    const cat = TEST_CATEGORIES[categoryId];
    if (!cat) return [];
    const diff = String(difficulty).toLowerCase();
    if (cat.difficulties && cat.difficulties[diff]) {
        return cat.difficulties[diff];
    }
    // Fallback: easy or first available
    return cat.difficulties ? (cat.difficulties.easy || Object.values(cat.difficulties)[0]) : (cat.questions || []);
}

// Add default .questions alias for direct backward compatibility
Object.keys(TEST_CATEGORIES).forEach(key => {
    const cat = TEST_CATEGORIES[key];
    if (cat.difficulties && !cat.questions) {
        cat.questions = cat.difficulties.easy;
    }
});

// Export to window object for browser access and module.exports for test runners
if (typeof window !== "undefined") {
    window.TEST_CATEGORIES = TEST_CATEGORIES;
    window.getCategoryQuestions = getCategoryQuestions;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { TEST_CATEGORIES, getCategoryQuestions };
}
