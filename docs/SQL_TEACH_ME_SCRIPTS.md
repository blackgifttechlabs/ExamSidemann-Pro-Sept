
### 4.2 WHERE — filtering the rows

- Folder: `public/sounds/sql-lessons/where-clause/`
- 5 clips, roughly 6m 03s of speech
- Exam note shown on screen: WHERE filters rows. Learn the operators: = equals, <> or != not equal, > greater than, < less than, >= and <=. Text in the condition must be in single quotes.

#### `where-clause/what-is-where.mp3` — Why we filter

> type cue: “Watch the third line” · run cue: “Run”

```text
Our table has six students. Imagine it had six thousand. [pause]
Nobody wants six thousand rows on their screen. They want the ones that matter. [pause]
So we add a filter. And the filter word is WHERE. [pause]
WHERE says, only give me the rows where this is true. [pause]
Watch the third line. [pause]
WHERE programme equals, in single quotes, NC IT. [pause]
Notice the quotes again. NC IT is text, so it must be in single quotes. [pause]
And notice we use one equals sign, not two. In SQL, one equals sign asks the question. [pause]
If you have done programming, you must unlearn the double equals here. SQL uses one. [pause]
Run. [pause]
Look at that. [pause]
Four students, and every one of them is doing NC IT. [pause]
Farai in Accounting is not there. Blessing in Marketing is not there. [pause]
The rows did not disappear from the table. They are still safe. WHERE only decided who to show us.
```

```sql
SELECT first_name, surname, programme
FROM students
WHERE programme = 'NC IT';
```

#### `where-clause/comparison-operators.mp3` — The comparison operators

> type cue: “So here” · run cue: “Run”

```text
Equals is only one of the operators. Let me give you the whole set, because the exam uses all of them. [pause]
The equals sign, for is exactly this. [pause]
Greater than, and less than. You know those signs from mathematics. [pause]
Greater than or equal to, which is the greater than sign followed by an equals sign. [pause]
Less than or equal to, the same way. [pause]
And not equal to, which is written as less than followed by greater than. Some systems also accept an exclamation mark and an equals sign. [pause]
Now, the money question. Which students have paid more than one hundred dollars? [pause]
So here we write WHERE fees_paid greater than one hundred. [pause]
And this time, no quotes. One hundred is a number, and we are comparing it as a number. [pause]
If you put quotes around a number, the database compares it as text, and text compares letter by letter. Your answer comes out wrong. [pause]
Run. [pause]
There we are. [pause]
Tanaka, Rudo, Chipo and Kuda have all paid over one hundred. [pause]
Farai, who has paid nothing, and Blessing, who has paid seventy five, are not on the list.
```

```sql
SELECT first_name, surname, fees_paid
FROM students
WHERE fees_paid > 100;
```

#### `where-clause/and-or.mp3` — AND, OR and NOT

> type cue: “Look at the condition” · run cue: “Run”

```text
Now the real world. Real questions have more than one condition. [pause]
The bursar says, give me the NC IT students who have paid more than two hundred dollars. [pause]
That is two conditions in one question, and both must be true. [pause]
When both must be true, we join them with AND. [pause]
Look at the condition. [pause]
WHERE programme equals NC IT, AND fees_paid greater than two hundred. [pause]
See how I put AND on its own line, lined up underneath? Do that. It makes long queries readable. [pause]
Run. [pause]
Three students survived that filter. [pause]
Rudo, Chipo and Kuda. All three are in NC IT, and all three have paid more than two hundred. [pause]
Now look carefully at Rudo. She has paid two hundred point five zero. [pause]
That is more than two hundred, by fifty cents, so she is in. Always check the boundary cases like that one. [pause]
If the question had said two hundred or more, we would have used greater than or equal to instead. [pause]
Now the other two joiners. OR means only one of them needs to be true. [pause]
And NOT reverses a condition. WHERE NOT programme equals NC IT gives you everybody who is not in IT. [pause]
AND is strict. OR is generous. NOT turns it around. That is all three.
```

```sql
SELECT first_name, surname, programme, fees_paid
FROM students
WHERE programme = 'NC IT'
  AND fees_paid > 200;
```

#### `where-clause/or-in-action.mp3` — OR, and why brackets matter

> type cue: “Look at the brackets” · run cue: “Run”

```text
Now I want to show you the trap that catches even good students. [pause]
The question is: give me the Accounting or Marketing students who have paid less than one hundred. [pause]
Look at the brackets I am putting in. [pause]
Open bracket, programme equals NC Accounting OR programme equals NC Marketing, close bracket. [pause]
And then AND fees_paid less than one hundred. [pause]
Why the brackets? Because AND is stronger than OR. The database does AND first, just like multiplication before addition. [pause]
Without the brackets, the computer would read it as: all Accounting students, OR Marketing students who owe money. [pause]
That is a completely different question, and you would lose the mark. [pause]
So when you mix AND and OR in one WHERE, put brackets around the OR part. Every time. [pause]
Run. [pause]
Farai and Blessing. [pause]
Farai is Accounting and has paid nothing. Blessing is Marketing and has paid seventy five. [pause]
Exactly the two people the bursar needs to phone this afternoon.
```

```sql
SELECT first_name, surname, programme, fees_paid
FROM students
WHERE (programme = 'NC Accounting' OR programme = 'NC Marketing')
  AND fees_paid < 100;
```

#### `where-clause/exam-answer.mp3` — How this looks in the exam

> whiteboard: 5 drawings appear during this clip

```text
WHERE questions are where most of the practical marks live, so listen to this part twice. [pause]
The question will be in English. Something like, list the names of students in NC IT who have paid more than two hundred dollars. [pause]
Here is how you translate it, every time, in the same order. [pause]
One. What do they want to see? Names. That is your SELECT line. [pause]
Two. Where does it live? The students table. That is your FROM line. [pause]
Three. Which rows? IT students who paid over two hundred. That is your WHERE line. [pause]
Read the English, underline the nouns for SELECT, and underline the conditions for WHERE. [pause]
Then check the quotes. Text yes, numbers no. [pause]
And if the word or appears in the question together with the word and, reach for your brackets immediately.
```

### 4.3 LIKE, IN, BETWEEN and IS NULL

- Folder: `public/sounds/sql-lessons/like-in-between/`
- 5 clips, roughly 5m 19s of speech
- Exam note shown on screen: LIKE with % matches any number of characters, and _ matches exactly one. IN checks a list. BETWEEN checks a range and includes both ends. IS NULL finds missing data — never write = NULL.

#### `like-in-between/like-percent.mp3` — LIKE and the percent wildcard

> type cue: “So we write LIKE” · run cue: “Run”

```text
Sometimes you do not know the whole value. You only know part of it. [pause]
The office says, find me all the students whose surname starts with M. [pause]
You cannot use equals for that, because equals means exactly this and nothing else. [pause]
So we use LIKE, and we use a wildcard. [pause]
So we write LIKE, and then the pattern in quotes. [pause]
M, followed by the percent sign. [pause]
The percent sign means, any number of characters, and I do not care what they are. [pause]
So M percent means, starts with M, then anything. [pause]
Run. [pause]
Moyo, Mpofu. [pause]
Both surnames start with M, and the rest of the letters did not matter. [pause]
Now learn the three patterns, because the exam will ask for all three. [pause]
M percent means starts with M. [pause]
Percent M means ends with M. [pause]
Percent M percent means contains M anywhere inside. [pause]
Front, back, both sides. Where you put the percent sign is the whole answer.
```

```sql
SELECT first_name, surname
FROM students
WHERE surname LIKE 'M%';
```

#### `like-in-between/like-underscore.mp3` — The underscore wildcard

> type cue: “Look at this pattern” · run cue: “Run”

```text
There is a second wildcard, and it is the one students forget. [pause]
The underscore. And it means exactly one character. Not more, not less. Exactly one. [pause]
Look at this pattern. [pause]
Underscore, u, b, e. [pause]
Read it as: one character I do not know, then u, then b, then e. [pause]
So it will match a four letter surname ending in u b e. [pause]
Run. [pause]
Dube. [pause]
D is the unknown character, and then u b e. [pause]
Ncube did not match. Why not? Count the letters. [pause]
N c u b e is five letters. Our pattern only allowed four. One underscore, one character. [pause]
So remember the difference, and say it out loud. Percent is any amount. Underscore is exactly one.
```

```sql
SELECT first_name, surname
FROM students
WHERE surname LIKE '_ube';
```

#### `like-in-between/in-and-between.mp3` — IN and BETWEEN

> type cue: “The first one uses IN” · run cue: “Run”

```text
Two shortcuts now, and both of them make your queries shorter and easier to read. [pause]
The first one uses IN. [pause]
Remember in the last lesson we wrote programme equals Accounting OR programme equals Marketing? [pause]
That gets very long when there are five programmes. So IN gives you a list instead. [pause]
WHERE programme IN, then the list in brackets, separated by commas. [pause]
It means, is this value one of these? IN is just a tidy OR. [pause]
The second one uses BETWEEN, for ranges. [pause]
WHERE fees_paid BETWEEN one hundred AND four hundred. [pause]
And here is the detail the exam checks. BETWEEN includes both ends. [pause]
Exactly one hundred is included. Exactly four hundred is included. It is not just the numbers in the middle. [pause]
Run. [pause]
The console shows us the last query, so we are looking at the BETWEEN result. [pause]
Tanaka, Rudo and Chipo. One fifty, two hundred point five, and three twenty. All inside the range. [pause]
Kuda paid one thousand two hundred, so he is above the range and he is out.
```

```sql
SELECT first_name, programme, fees_paid
FROM students
WHERE programme IN ('NC Accounting', 'NC Marketing');

SELECT first_name, fees_paid
FROM students
WHERE fees_paid BETWEEN 100 AND 400;
```

#### `like-in-between/is-null.mp3` — IS NULL — finding what is missing

> type cue: “So we write IS NULL” · run cue: “Run”

```text
Now the last one, and this is the one that catches everybody, so pay attention. [pause]
Sometimes you need to find the records where something is missing. [pause]
The registrar says, which students have no date of birth captured? We must phone them. [pause]
Now your instinct will be to write WHERE date_of_birth equals NULL. Do not do it. It will never work. [pause]
Here is why. NULL does not mean a value. NULL means unknown. [pause]
And you cannot ask whether one unknown thing equals another unknown thing. The database cannot answer that. [pause]
So we write IS NULL instead. [pause]
WHERE date_of_birth IS NULL. Two words, no equals sign anywhere. [pause]
Run. [pause]
Memory Mpofu. [pause]
Her record went in without a date of birth, and now we have found her. [pause]
And the opposite is IS NOT NULL, for records where the field was filled in. [pause]
Write this on your hand if you must. Never equals NULL. Always IS NULL.
```

```sql
SELECT first_name, surname, date_of_birth
FROM students
WHERE date_of_birth IS NULL;
```

#### `like-in-between/exam-answer.mp3` — How this looks in the exam

> whiteboard: 3 drawings appear during this clip

```text
Four tools in this lesson, and the exam has a favourite way of asking for each one. [pause]
When the question says starting with, ending with, or containing, they want LIKE and a percent sign. [pause]
When the question lists two or three specific values, IN is the neat answer, but a chain of ORs also gets full marks. [pause]
When the question says between two numbers or between two dates, use BETWEEN, and remember both ends are included. [pause]
And when the question says has not been entered, is missing, or is blank, that is IS NULL. [pause]
One more marker's favourite. State the difference between the percent sign and the underscore in a LIKE clause. [pause]
Answer. The percent sign represents any number of characters, including none. The underscore represents exactly one character. [pause]
Learn that sentence. It is one mark, and it is free.
```

### 4.4 ORDER BY, DISTINCT and LIMIT

- Folder: `public/sounds/sql-lessons/order-limit-distinct/`
- 5 clips, roughly 4m 52s of speech
- Exam note shown on screen: ORDER BY sorts — ASC is smallest first and is the default, DESC is largest first. DISTINCT removes duplicate values. LIMIT restricts how many rows come back.

#### `order-limit-distinct/order-by.mp3` — ORDER BY — putting it in order

> type cue: “So we add ORDER BY” · run cue: “Run”

```text
Look at the answers we have been getting. They come out in whatever order the database feels like. [pause]
That is fine for us, but it is not fine for a class list on the notice board. [pause]
A class list must be alphabetical. So we sort it. [pause]
So we add ORDER BY at the bottom of the query. [pause]
ORDER BY surname ASC. [pause]
A S C is short for ascending, which means going up. A to Z for text, smallest to largest for numbers. [pause]
Run. [pause]
Now look at that. A proper class list. [pause]
Banda, Dube, Moyo, Ncube, Sibanda, Zhou. Straight down the alphabet. [pause]
And a small point that saves you writing. ASC is the default. [pause]
If you write ORDER BY surname and say nothing else, you still get ascending. But write it anyway, so the marker can see you know it.
```

```sql
SELECT first_name, surname
FROM students
ORDER BY surname ASC;
```

#### `order-limit-distinct/order-desc.mp3` — DESC — biggest first

> type cue: “So DESC” · run cue: “Run”

```text
Now turn it upside down. [pause]
The bursar does not want alphabetical. She wants to see who has paid the most, at the top. [pause]
So DESC, short for descending, which means going down. [pause]
ORDER BY fees_paid DESC. Largest amount first. [pause]
Run. [pause]
Kuda at the top, with one thousand two hundred and fifty. [pause]
And right at the bottom, Farai, with zero. He has paid nothing. [pause]
See how much that one word tells you? The whole story of the fees, in one glance. [pause]
And you can sort by more than one column. ORDER BY programme ASC, comma, surname ASC. [pause]
That groups them by programme, and inside each programme it puts them in alphabetical order. Very useful for real reports.
```

```sql
SELECT first_name, surname, fees_paid
FROM students
ORDER BY fees_paid DESC;
```

#### `order-limit-distinct/distinct.mp3` — DISTINCT — one of each

> type cue: “So we add DISTINCT” · run cue: “Run”

```text
Here is a real question from the registry. What programmes do we actually run? [pause]
Now if I just say SELECT programme FROM students, what do I get? [pause]
I get NC IT four times, because four students are doing it. That is a mess. [pause]
I want each programme listed once. So we add DISTINCT. [pause]
SELECT DISTINCT programme FROM students. [pause]
DISTINCT goes right after SELECT, before the column name. Not at the end. [pause]
Run. [pause]
Three rows. [pause]
NC IT, NC Accounting, NC Marketing. Each one exactly once. [pause]
That is our programme list, and we got it out of the student data without keeping a separate list anywhere.
```

```sql
SELECT DISTINCT programme
FROM students;
```

#### `order-limit-distinct/limit.mp3` — LIMIT — just the top few

> type cue: “Look at the last line” · run cue: “Run”

```text
Last one for this chapter, and it is the one that makes top ten lists. [pause]
The principal says, show me the three students who have paid the most. [pause]
Notice you need two things there. You need the order, and you need to cut it off after three. [pause]
So look at the last line. [pause]
First ORDER BY fees_paid DESC, so the biggest is at the top. [pause]
Then LIMIT three, which says stop after three rows. [pause]
And the order matters. LIMIT must come last, after ORDER BY. Always at the very bottom. [pause]
Because if you cut first and sort afterwards, you get three random students in a neat order. Wrong answer. [pause]
Run. [pause]
Exactly three. [pause]
Kuda, Chipo, Rudo. The three biggest payers in the college. [pause]
One note for the exam. LIMIT is the MySQL word, and MySQL is what we use, so LIMIT is correct for you. [pause]
But in Microsoft SQL Server the same job is done by SELECT TOP three. If a question mentions SQL Server, use TOP.
```

```sql
SELECT first_name, surname, fees_paid
FROM students
ORDER BY fees_paid DESC
LIMIT 3;
```

#### `order-limit-distinct/exam-answer.mp3` — How this looks in the exam

> whiteboard: 5 drawings appear during this clip

```text
Let us put the whole SELECT together now, because the order of the clauses is a mark on its own. [pause]
SELECT, then FROM, then WHERE, then GROUP BY, then HAVING, then ORDER BY, then LIMIT. [pause]
Say it again with me. SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT. [pause]
We have not done GROUP BY and HAVING yet. They are waiting for you in Chapter Seven. [pause]
But the order never changes, in any query, in any exam, anywhere in the world. [pause]
If you write ORDER BY before WHERE, the query fails, and it fails for a reason the marker can see instantly. [pause]
So when a question is long and you feel panic coming, write the seven words down the side of your page first. [pause]
Then fill in the ones you need and cross out the ones you do not. You will never write them in the wrong order again.
```

## Chapter 5 — Changing and Removing Data

_UPDATE and DELETE — the two commands that can destroy a database in one keystroke._

### 5.1 UPDATE — changing what is already there

- Folder: `public/sounds/sql-lessons/update-rows/`
- 5 clips, roughly 5m 51s of speech
- Exam note shown on screen: UPDATE table_name SET column = value WHERE condition; The WHERE clause is not optional in practice — without it every row in the table is changed.

#### `update-rows/why-update.mp3` — Data does not stand still

> type cue: “Let us see our five” · run cue: “Run”

```text
Everything we have done so far has been adding and looking. [pause]
But data does not stand still. Students pay more fees. People get married and change their surname. Somebody transfers to another programme. [pause]
So we need a command that changes a record that is already sitting in the table. [pause]
That command is UPDATE, and it is powerful, and it is dangerous. I will show you both sides. [pause]
Let us see our five students first, so we know what we are starting with. [pause]
Run. [pause]
Good. Now keep your eye on Tanaka Moyo. [pause]
He has paid one hundred and fifty dollars. Remember that number. One five zero.
```

```sql
SELECT * FROM students;
```

#### `update-rows/update-one.mp3` — Changing one record

> type cue: “Watch the three lines” · run cue: “Run”

```text
Tanaka has come to the office and paid another hundred dollars. So his total is now two hundred and fifty. [pause]
Watch the three lines of this command, because every UPDATE has exactly these three parts. [pause]
Line one. UPDATE students. Which table am I changing? [pause]
Line two. SET fees_paid equals two hundred and fifty. What am I changing it to? [pause]
Line three. WHERE student_id equals one. Who am I changing it for? [pause]
Which table, what change, and for whom. Three questions, three lines. Never forget the third one. [pause]
And notice I used student_id in the WHERE, not the name. [pause]
Why? Because student_id is the primary key, so I know for certain it can only be one person. [pause]
If I had said WHERE first_name equals Tanaka, and there were two Tanakas in the college, I would have changed them both. [pause]
Always target the primary key when you are changing one person. Always. [pause]
Run. [pause]
Look at Tanaka's row. [pause]
One fifty has become two fifty. His payment is recorded. [pause]
And look at everybody else. Rudo, Farai, Chipo, Blessing. Not one of them moved. [pause]
That is the WHERE doing its job. It protected the other four.
```

```sql
UPDATE students
SET fees_paid = 250.00
WHERE student_id = 1;

SELECT * FROM students;
```

#### `update-rows/update-many.mp3` — Updating a whole group, with arithmetic

> type cue: “Look at the SET line” · run cue: “Run”

```text
Now something clever, and this is a favourite exam question. [pause]
The college gives every IT student a fifty dollar bursary credit. [pause]
Now, I cannot write SET fees_paid equals fifty, because that would wipe out what they have already paid. [pause]
I want to add fifty to whatever is already there. Everybody's total is different. [pause]
So look at the SET line. [pause]
SET fees_paid equals fees_paid plus fifty. [pause]
Read that slowly. The new fees_paid equals the old fees_paid, plus fifty. [pause]
The column appears on both sides of the equals sign. That is not a mistake. That is exactly how you do arithmetic in SQL. [pause]
And the WHERE says programme equals NC IT, so it happens to a group, not to one person. [pause]
Run. [pause]
Now look down the fees column. [pause]
Tanaka went from two fifty to three hundred. Rudo from two hundred fifty to two fifty point five zero. Chipo from three twenty to three seventy. [pause]
Three students changed, all in one command, each one keeping their own starting amount. [pause]
And Farai in Accounting and Blessing in Marketing did not get the bursary, because they were not in the WHERE. [pause]
You can do the same with minus, with times, and with divide. SET price equals price times one point one five adds fifteen percent.
```

```sql
UPDATE students
SET fees_paid = fees_paid + 50
WHERE programme = 'NC IT';

SELECT * FROM students;
```

#### `update-rows/missing-where.mp3` — The mistake that ends careers

> type cue: “Look at the editor” · not executed (MySQL-only)

```text
Now I must show you something, and I want you to feel a little bit afraid of it. That fear will protect you. [pause]
Look at the editor. [pause]
UPDATE students, SET programme equals NC IT. And then nothing. No WHERE. [pause]
I have commented it out with dashes so that it cannot run. I am not going to run this. [pause]
But understand what it would do. [pause]
With no WHERE clause, the database does not ask who. It assumes you mean everybody. [pause]
Every single student in the college would suddenly be doing NC IT. Farai in Accounting. Blessing in Marketing. All of them. [pause]
Five students here. But in a real college database, that is eight thousand records, destroyed in one keystroke. [pause]
And there is no undo. Only a backup can save you, and only if somebody made one. [pause]
So here is the habit I want you to build from today, and never break. [pause]
When you write UPDATE, type the WHERE clause first, before you type the SET. [pause]
Write the WHERE first. Then go back and fill in the SET. That way it is impossible to forget it. [pause]
Professionals do this. Now you know why.
```

```sql
-- DO NOT RUN THIS ON A REAL DATABASE.
-- There is no WHERE clause, so it hits every single row.

-- UPDATE students
-- SET programme = 'NC IT';
```

#### `update-rows/exam-answer.mp3` — How this looks in the exam

> whiteboard: 4 drawings appear during this clip

```text
The exam question sounds like this. Write an SQL statement to change the fees paid by student number one to two hundred and fifty dollars. [pause]
Your answer, three lines. [pause]
UPDATE students. SET fees_paid equals two fifty. WHERE student_id equals one. Semicolon. [pause]
And then there is a theory question that comes up again and again. [pause]
What is the effect of omitting the WHERE clause in an UPDATE statement? [pause]
Answer. All the records in the table will be updated, not just the intended ones. [pause]
One sentence, one mark, and now you will never forget it, because you have seen what it does. [pause]
Which table, what change, for whom. Three lines, every time.
```

### 5.2 DELETE, TRUNCATE and DROP

- Folder: `public/sounds/sql-lessons/delete-rows/`
- 5 clips, roughly 5m 49s of speech
- Exam note shown on screen: DELETE removes rows and can be filtered with WHERE. TRUNCATE removes all rows but keeps the empty table. DROP removes the table itself. This comparison is asked almost every year.

#### `delete-rows/delete-one.mp3` — DELETE with a WHERE

> type cue: “The command is short” · run cue: “Run”

```text
Farai has left the college. He is not coming back, and the registrar says remove his record. [pause]
The command is short, and that is exactly what makes it dangerous. [pause]
DELETE FROM students, WHERE student_id equals three. [pause]
Notice something. There is no list of columns anywhere. [pause]
That is because DELETE always removes the entire row. You cannot delete just one field. [pause]
If you want to empty one field, that is not DELETE, that is UPDATE, setting it to NULL. Different job, different command. [pause]
Run. [pause]
Farai is gone. [pause]
Four students left. Tanaka, Rudo, Chipo, Blessing. [pause]
And notice the student numbers. One, two, four, five. There is a hole where three used to be. [pause]
That is correct behaviour, and it is important. The database will never reuse number three. [pause]
Because if it did, some old record somewhere pointing at student three would suddenly be pointing at a completely different person. [pause]
So the gap is not a bug. The gap is the database protecting your history.
```

```sql
DELETE FROM students
WHERE student_id = 3;

SELECT * FROM students;
```

#### `delete-rows/delete-group.mp3` — Deleting a group

> type cue: “Same command” · run cue: “Run”

```text
DELETE takes any condition, exactly like SELECT does. [pause]
Same command, different WHERE. [pause]
DELETE FROM students WHERE fees_paid equals zero. [pause]
That means, remove every student who has not paid a single cent. [pause]
Run. [pause]
Look at that. Nothing was removed. [pause]
Still four students, exactly as before. [pause]
And that is a good lesson in itself. The only student with zero was Farai, and we already deleted him. [pause]
So the condition matched nobody, and the database did nothing at all. It did not complain, and it did not break. [pause]
A DELETE that matches nothing is not an error. It is just a quiet no.
```

```sql
DELETE FROM students
WHERE fees_paid = 0;

SELECT * FROM students;
```

#### `delete-rows/delete-all-vs-truncate.mp3` — DELETE all rows, and TRUNCATE

> type cue: “Watch what I build” · run cue: “Run”

```text
Now, what if you want to empty a whole table, but keep the table itself? [pause]
There are two ways, and the exam wants you to know the difference. [pause]
The first way is DELETE FROM table_name, with no WHERE at all. That removes every row, one by one. [pause]
The second way is TRUNCATE TABLE table_name. That empties the whole table in one action. [pause]
Watch what I build here, so we do not touch our students. [pause]
A small table called temp_log, with two entries in it. Then I truncate it. Then I look at it. [pause]
Run. [pause]
Look at the result. The table is there, but it is empty. [pause]
The columns are still standing. log_id and message. But both entries are gone. [pause]
Now the exam difference, and write this down. [pause]
DELETE is DML. It removes rows one at a time, it can have a WHERE, and it can often be rolled back. [pause]
TRUNCATE is DDL. It removes all rows at once, it cannot have a WHERE, it is faster, and it resets the auto-increment counter back to one. [pause]
DELETE picks. TRUNCATE empties. That is the shortest way to remember it.
```

```sql
CREATE TABLE temp_log (
  log_id INT PRIMARY KEY,
  message VARCHAR(60)
);

INSERT INTO temp_log VALUES (1, 'first entry'), (2, 'second entry');

TRUNCATE TABLE temp_log;

SELECT * FROM temp_log;
```

#### `delete-rows/the-big-three.mp3` — DELETE versus TRUNCATE versus DROP

> type cue: “So watch” · run cue: “Run”

```text
And now the third one, which we met in Chapter Two. DROP. [pause]
Our temp_log table is empty, but it is still standing there taking up space. Let us remove the table itself. [pause]
So watch. DROP TABLE temp_log. [pause]
And SHOW TABLES underneath, so we can see the proof. [pause]
Run. [pause]
Look at the list. [pause]
temp_log is not there any more. The table itself has stopped existing. [pause]
students is still there, safe, with our four learners inside. [pause]
Now here is the picture I want you to carry into the exam. Think of a filing cabinet drawer. [pause]
DELETE takes out the files you point at, and leaves the rest. [pause]
TRUNCATE empties the whole drawer, but the drawer is still in the cabinet. [pause]
DROP takes the drawer out of the cabinet and throws the drawer away. [pause]
Point at files. Empty the drawer. Throw the drawer away. Three commands, three pictures.
```

```sql
DROP TABLE temp_log;

SHOW TABLES;
```

#### `delete-rows/exam-answer.mp3` — How this looks in the exam

> whiteboard: 4 drawings appear during this clip

```text
This comparison is asked so often that I want you to be able to write it in your sleep. [pause]
The question. Distinguish between DELETE, TRUNCATE and DROP. [pause]
DELETE. A DML command that removes selected records from a table, using a WHERE clause. The table structure remains. [pause]
TRUNCATE. A DDL command that removes all records from a table at once. The table structure remains, and the auto-increment counter is reset. [pause]
DROP. A DDL command that removes the entire table, including its structure and all its data. [pause]
Notice that each answer has two parts. What it removes, and what is left behind. [pause]
What it removes, and what is left behind. That is what the marker is looking for. [pause]
And one last thing before we leave this chapter, and it is the most important thing I will say all day. [pause]
Before you run any UPDATE or any DELETE on a real system, run it as a SELECT first. [pause]
Take your WHERE clause, put SELECT star FROM in front of it, and look at exactly which rows come back. [pause]
If those are the right rows, then change the word SELECT star FROM to DELETE FROM, and run it. [pause]
Test with SELECT, then destroy with DELETE. That one habit will protect you for your whole career.
```

## Chapter 6 — Joining Tables Together

_Foreign keys and JOINs — how two tables become one answer._

### 6.1 Foreign keys — linking two tables

- Folder: `public/sounds/sql-lessons/foreign-key/`
- 4 clips, roughly 4m 31s of speech
- Exam note shown on screen: A foreign key is a field in one table that refers to the primary key of another table. It enforces referential integrity — you cannot record a child row that points at a parent that does not exist.

#### `foreign-key/one-table-is-not-enough.mp3` — Why one big table fails

> whiteboard: 5 drawings appear during this clip

```text
Up to now we have had one table. Students. And it worked perfectly. [pause]
Now the college says, we also need to know which courses each student is taking. [pause]
Your first instinct will be to add columns. course_one, course_two, course_three. [pause]
Please do not. Let me explain why that idea fails. [pause]
First, how many columns do you make? What happens when a student takes a fourth course? [pause]
Second, if the course name Database Concepts is typed into four thousand student rows, and the college renames the course, you must fix four thousand rows. [pause]
Third, somebody will type Database Concepts, somebody else will type Databse Concepts with a spelling mistake, and now your reports are wrong forever. [pause]
That repeating of the same information is called data redundancy, and it is the enemy. Learn that phrase. [pause]
So we do it the proper way. Each kind of thing gets its own table. [pause]
Students in a students table. Courses in a courses table. And then we link them.
```

#### `foreign-key/two-tables.mp3` — The parent table

> type cue: “So first” · run cue: “Run”

```text
So first, a table for the courses themselves. [pause]
course_id as the primary key, the course name, and the lecturer who teaches it. [pause]
And I am putting three courses in. Database Concepts, Programming Concepts, and Computer Networking. [pause]
Notice each course is written once. Once, in the whole database. [pause]
If the college renames Database Concepts tomorrow, I change one row, and every report in the college is instantly correct. [pause]
Run. [pause]
Three courses. [pause]
Course one, two and three. Remember those numbers, because we are about to use them.
```

```sql
CREATE TABLE courses (
  course_id INT PRIMARY KEY,
  course_name VARCHAR(60),
  lecturer VARCHAR(50)
);

INSERT INTO courses VALUES
  (1, 'Database Concepts', 'Mr Chirwa'),
  (2, 'Programming Concepts', 'Ms Sibanda'),
  (3, 'Computer Networking', 'Mr Dziva');

SELECT * FROM courses;
```

#### `foreign-key/the-foreign-key.mp3` — The child table and the foreign key

> type cue: “Now look at the last line” · run cue: “Run”

```text
Now the clever part. We need a third table to record who is doing what. [pause]
We call it enrolments. And it holds almost nothing. Just numbers. [pause]
Now look at the last line inside the brackets. [pause]
FOREIGN KEY, open bracket, course_id, close bracket, REFERENCES courses, open bracket, course_id, close bracket. [pause]
Read that in English. The course_id in this table refers to the course_id in the courses table. [pause]
That is a foreign key. Say the definition with me. [pause]
A foreign key is a field in one table that refers to the primary key of another table. [pause]
The courses table is the parent. The enrolments table is the child. The child points at the parent. [pause]
And now the database will refuse to accept an enrolment for course number nine, because there is no course number nine. [pause]
That protection has a name, and it is examinable. Referential integrity. Write it down. [pause]
Now look at the rows I am inserting. One and one. One and two. Two and one. Three and three. [pause]
Run. [pause]
Look at that table. [pause]
Just numbers. No names anywhere. And yet all the information is in there. [pause]
Student one is doing course one and course two. Student two is doing course one. Student three is doing course three. [pause]
Tanaka is doing Databases and Programming. Rudo is doing Databases. Chipo is doing Networking. [pause]
But nobody wants to read numbers like that. In the next lesson we turn these numbers back into names.
```

```sql
CREATE TABLE enrolments (
  enrolment_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  course_id INT,
  FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

INSERT INTO enrolments (student_id, course_id) VALUES
  (1, 1),
  (1, 2),
  (2, 1),
  (3, 3);

SELECT * FROM enrolments;
```

#### `foreign-key/exam-answer.mp3` — How this looks in the exam

> whiteboard: 4 drawings appear during this clip

```text
Three definitions come out of this lesson, and they are worth easy marks. [pause]
One. What is a foreign key? A field in one table that refers to the primary key of another table, used to link the two tables. [pause]
Two. What is referential integrity? A rule ensuring that a foreign key value must always refer to an existing record in the related table. [pause]
Three. What is data redundancy? The unnecessary repetition of the same data in a database, which wastes space and can lead to inconsistency. [pause]
And a practical question will say, write a statement to create the enrolments table with a foreign key referencing courses. [pause]
The line they want to see is FOREIGN KEY, brackets, the column, REFERENCES, the other table, brackets, its primary key. [pause]
Learn the shape of that line. FOREIGN KEY here, REFERENCES there.
```

### 6.2 INNER JOIN — turning numbers back into names

- Folder: `public/sounds/sql-lessons/inner-join/`
- 5 clips, roughly 6m 25s of speech
- Exam note shown on screen: SELECT columns FROM tableA INNER JOIN tableB ON tableA.key = tableB.key; The ON clause says which columns must match. Prefix each column with its table name when both tables have a column of that name.

#### `inner-join/the-problem.mp3` — The problem we are solving

> type cue: “Look at it again” · run cue: “Run”

```text
I have put our three tables back, exactly as we left them. Students, courses, and enrolments. [pause]
Look at the enrolments table again. [pause]
Run. [pause]
Numbers. [pause]
One and one. One and two. Two and one. Three and three. [pause]
The data is perfect. But if I print this and put it on the notice board, nobody knows what it means. [pause]
The names are in the students table. The course names are in the courses table. And the link is here. [pause]
So we need a way to read all three tables in one question. That is a JOIN.
```

```sql
SELECT * FROM enrolments;
```

#### `inner-join/first-join.mp3` — Your first JOIN

> type cue: “Watch these four lines” · run cue: “Run”

```text
Let us start with two tables only, students and enrolments, and add the third one afterwards. [pause]
Watch these four lines carefully. This is the shape of every join you will ever write. [pause]
Line one. SELECT, and the columns I want. And look how I write them. [pause]
students dot first_name. enrolments dot course_id. Table name, dot, column name. [pause]
Why the dot? Because both tables have a column called student_id, and the database must know which one you mean. [pause]
Line two. FROM students. That is my first table. [pause]
Line three. INNER JOIN enrolments. That is my second table. [pause]
Line four, and this is the heart of it. ON students dot student_id equals enrolments dot student_id. [pause]
The ON clause is the matching rule. It says, a row from here belongs with a row from there when these two numbers are the same. [pause]
That is the whole idea of a join. Find the rows that match, and put them side by side. [pause]
Run. [pause]
Now look at that. [pause]
Tanaka appears twice, with course one and course two, because he is doing two courses. [pause]
Rudo has course one. Chipo has course three. [pause]
The names came from one table, the course numbers came from another, and they arrived in one answer. [pause]
And notice Blessing is not there at all. She is not enrolled in anything, so there was nothing to match her with. [pause]
Remember that. INNER JOIN only shows rows that have a match on both sides.
```

```sql
SELECT students.first_name, students.surname, enrolments.course_id
FROM students
INNER JOIN enrolments
  ON students.student_id = enrolments.student_id;
```

#### `inner-join/three-table-join.mp3` — Joining three tables

> type cue: “So I add two more lines” · run cue: “Run”

```text
We are half way. We have names and course numbers. Now let us turn those numbers into course names. [pause]
The course names live in the courses table, so we join that one on as well. [pause]
So I add two more lines. Another INNER JOIN, and another ON. [pause]
INNER JOIN courses, ON enrolments dot course_id equals courses dot course_id. [pause]
And now in the SELECT line I can ask for courses dot course_name and courses dot lecturer. [pause]
See the chain? Students link to enrolments. Enrolments link to courses. [pause]
The enrolments table is the bridge in the middle. It touches both sides. [pause]
That middle table has a name in the exam. It is called a junction table, or a link table. [pause]
Run. [pause]
Now that. That is a report. [pause]
Tanaka Moyo, Database Concepts, Mr Chirwa. [pause]
Tanaka Moyo, Programming Concepts, Ms Sibanda. [pause]
Rudo Ncube, Database Concepts. Chipo Banda, Computer Networking. [pause]
Not one number on the screen. Every single thing is in words, and the principal can read it. [pause]
And remember, that came out of three separate tables that each store their information only once. [pause]
That is what a relational database is. That is the whole reason it is called relational.
```

```sql
SELECT students.first_name, students.surname, courses.course_name, courses.lecturer
FROM students
INNER JOIN enrolments
  ON students.student_id = enrolments.student_id
INNER JOIN courses
  ON enrolments.course_id = courses.course_id;
```

#### `inner-join/table-aliases.mp3` — Short names for long queries

> type cue: “Look at the FROM line” · run cue: “Run”

```text
That last query was correct, but look how long it was. students dot this, enrolments dot that, over and over. [pause]
So we give each table a short nickname, just for this query. [pause]
Look at the FROM line. [pause]
FROM students s. Just a letter after the table name. That s now means students for the rest of the query. [pause]
INNER JOIN enrolments e. INNER JOIN courses c. [pause]
And now everywhere I write s dot first_name, c dot course_name. Much shorter, much easier to read. [pause]
This is the same alias idea we met with AS in Chapter Four, but for tables instead of columns. [pause]
You can also write FROM students AS s, with the word AS. Both are correct. [pause]
And I have added ORDER BY at the bottom, to sort it by surname, because a join is still just a SELECT. [pause]
Run. [pause]
Exactly the same report, sorted alphabetically. [pause]
Banda, Moyo, Moyo, Ncube. Same data, half the typing. [pause]
In the exam, use aliases the moment you join three tables. It saves time and it saves mistakes.
```

```sql
SELECT s.first_name, s.surname, c.course_name
FROM students s
INNER JOIN enrolments e
  ON s.student_id = e.student_id
INNER JOIN courses c
  ON e.course_id = c.course_id
ORDER BY s.surname;
```

#### `inner-join/exam-answer.mp3` — How this looks in the exam

> whiteboard: 4 drawings appear during this clip

```text
Join questions carry big marks, and they are also where students freeze. So let me give you a recipe. [pause]
Step one. Read the question and write down which pieces of information they want. [pause]
Step two. For each piece, write down which table it lives in. Name, students. Course name, courses. [pause]
Step three. Ask, is there a table in the middle that links them? Usually yes. [pause]
Step four. Write FROM the first table, then INNER JOIN each other table, each one with its own ON. [pause]
Step five. Every ON is always primary key equals foreign key. Every single time. [pause]
Primary key equals foreign key. If you remember nothing else about joins, remember that. [pause]
And the definition question. What is a join? A join combines rows from two or more tables based on a related column between them. [pause]
One more warning. If you forget the ON clause completely, you do not get an error. You get every row matched with every row. [pause]
Four students times four enrolments is sixteen rows of nonsense. That is called a Cartesian product, and it is worth knowing the name.
```

### 6.3 LEFT JOIN — including the ones with nothing

- Folder: `public/sounds/sql-lessons/left-join/`
- 4 clips, roughly 3m 51s of speech
- Exam note shown on screen: INNER JOIN returns only matching rows. LEFT JOIN returns all rows from the left table, and NULL where the right table has no match.

#### `left-join/the-missing-student.mp3` — Who did the INNER JOIN hide?

> type cue: “Run our inner join” · run cue: “Run it”

```text
In the last lesson I said something quickly, and now I want to slow down on it, because it matters. [pause]
I said Blessing was not in our results, because she is not enrolled in anything. [pause]
Run our inner join again and look for her. [pause]
Run it. [pause]
Tanaka twice, Rudo, Chipo. [pause]
No Blessing. She has vanished from the report. [pause]
Now think about that from the college's point of view. [pause]
Blessing is the one student who has registered but has not chosen any courses. [pause]
She is the exact person the registrar needs to phone. And our report is hiding her. [pause]
The INNER JOIN threw her away, because she had no match on the other side. [pause]
So sometimes the rows that are missing are the most important rows of all.
```

```sql
SELECT s.first_name, s.surname, e.course_id
FROM students s
INNER JOIN enrolments e
  ON s.student_id = e.student_id;
```

#### `left-join/the-left-join.mp3` — LEFT JOIN keeps everybody

> type cue: “One word changes” · run cue: “Run”

```text
So we change one word. One single word. [pause]
One word changes. INNER becomes LEFT. [pause]
LEFT JOIN. Everything else in the query stays exactly the same. [pause]
And here is what LEFT means. The left table is the one in the FROM line. In our case, students. [pause]
LEFT JOIN says, give me every row from the left table, no matter what. [pause]
If there is a match on the right, show it. If there is no match, show NULL. [pause]
Run. [pause]
There she is. [pause]
Blessing Sibanda, and her course_id is empty. That empty space is NULL. [pause]
Nobody was thrown away this time. All four students are accounted for. [pause]
And that NULL is not a mistake. That NULL is the answer. It is telling us she has no enrolment.
```

```sql
SELECT s.first_name, s.surname, e.course_id
FROM students s
LEFT JOIN enrolments e
  ON s.student_id = e.student_id;
```

#### `left-join/finding-the-gaps.mp3` — Using the NULL to find the gaps

> type cue: “So we add a WHERE” · run cue: “Run”

```text
Now we finish the job properly. [pause]
The registrar did not ask for all the students. She asked for the ones with no courses. [pause]
And we know that those students, and only those students, have a NULL in the course column. [pause]
So we add a WHERE, using what we learned in Chapter Four. [pause]
WHERE e dot course_id IS NULL. [pause]
And remember the rule from that lesson. Never equals NULL. Always IS NULL. [pause]
Run. [pause]
One row. Blessing Sibanda. [pause]
That is the phone list. One name, and it is exactly the right name. [pause]
Look at what you just did. You used a LEFT JOIN to find something that is not there. [pause]
Students with no courses. Courses with no students. Customers who have never ordered. [pause]
That pattern, LEFT JOIN plus IS NULL, is one of the most useful things in this whole course. Keep it.
```

```sql
SELECT s.first_name, s.surname
FROM students s
LEFT JOIN enrolments e
  ON s.student_id = e.student_id
WHERE e.course_id IS NULL;
```

#### `left-join/exam-answer.mp3` — How this looks in the exam

> whiteboard: 3 drawings appear during this clip

```text
The exam asks this one directly. Distinguish between an INNER JOIN and a LEFT JOIN. [pause]
INNER JOIN returns only the records that have matching values in both tables. [pause]
LEFT JOIN returns all the records from the left table, together with the matching records from the right table. Where there is no match, NULL is returned. [pause]
Two sentences. Learn them as they are. [pause]
You should also be able to name the others, even if you never use them. [pause]
RIGHT JOIN is the mirror image. All the rows from the right table. [pause]
And FULL OUTER JOIN keeps everything from both sides. MySQL does not support it directly, and that itself is sometimes a question. [pause]
But when a question uses the words all students, including those who, or even if they have none, that is your signal. [pause]
Those words mean LEFT JOIN. Every time.
```

## Chapter 7 — Summarising Data

_Counting, totalling and averaging — turning thousands of rows into one useful number._

### 7.1 COUNT, SUM, AVG, MIN and MAX

- Folder: `public/sounds/sql-lessons/aggregate-functions/`
- 5 clips, roughly 6m 13s of speech
- Exam note shown on screen: COUNT counts rows, SUM adds a column, AVG averages it, MIN finds the smallest and MAX the largest. They are called aggregate functions because they work on a whole group of rows at once.

#### `aggregate-functions/why-aggregate.mp3` — One number instead of a thousand rows

> type cue: “So we write COUNT” · run cue: “Run”

```text
Everything we have done so far has given us rows. Lists of students, lists of courses. [pause]
But the principal does not want a list. She wants a number. [pause]
How many students do we have? What is the total fees collected? What is the average? [pause]
For that we use aggregate functions. Aggregate simply means, work out one answer for a whole group. [pause]
The first one is COUNT. So we write COUNT, and then star in brackets. [pause]
COUNT star means, count the rows, all of them. [pause]
And I am giving it an alias, AS number_of_students, so the heading is readable. [pause]
Always give an aggregate an alias. Without one the heading is ugly and the marker cannot tell what you calculated. [pause]
Run. [pause]
Look at that. [pause]
One row. One column. The number six. [pause]
Six students. It did not show me the students. It counted them and gave me the answer. [pause]
That is the big idea of this chapter. Many rows go in, one number comes out.
```

```sql
SELECT COUNT(*) AS number_of_students
FROM students;
```

#### `aggregate-functions/sum-and-avg.mp3` — SUM and AVG

> type cue: “Watch the two functions” · run cue: “Run”

```text
Now the bursar's two questions. How much money have we collected, and what is the average payment? [pause]
Watch the two functions. [pause]
SUM, brackets, fees_paid. That adds up every value in that column. [pause]
AVG, brackets, fees_paid. That works out the average. [pause]
And notice, this time I do not put a star inside the brackets. I put a column name. [pause]
That is an important difference. You can count rows, but you cannot add up rows. You add up a column. [pause]
So COUNT takes a star. SUM and AVG must be given a numeric column. [pause]
And notice I asked for two functions in one SELECT, separated by a comma. That is allowed, and it is efficient. [pause]
Run. [pause]
There are the bursar's numbers. [pause]
Two thousand two hundred and forty six dollars and fifty cents, collected in total. [pause]
And the average is about three hundred and seventy four dollars per student. [pause]
Now, one thing about AVG that the exam likes to test. [pause]
AVG ignores NULL values completely. It does not count them as zero. It leaves them out of the calculation altogether. [pause]
So if some students had no fee record at all, the average would be worked out on the others only. Remember that.
```

```sql
SELECT SUM(fees_paid) AS money_collected,
       AVG(fees_paid) AS average_payment
FROM students;
```

#### `aggregate-functions/min-and-max.mp3` — MIN and MAX

> type cue: “So MIN and MAX” · run cue: “Run”

```text
Two more, and then you have all five. [pause]
MIN gives you the smallest value in a column. MAX gives you the largest. [pause]
So MIN and MAX, each with the column in brackets. [pause]
And I am putting COUNT in the same query, so you can see how they sit together. [pause]
Run. [pause]
Look at the row. [pause]
The smallest payment is zero. That is Farai, who has paid nothing. [pause]
The largest is one thousand two hundred and fifty dollars and seventy five cents. That is Kuda. [pause]
And six students in the college. [pause]
Now here is a trap, and I have seen it catch many students, so listen. [pause]
You might think, let me add first_name to that SELECT, so I can see who paid the most. [pause]
Do not do it. A plain name is one row, but MAX is one answer for the whole table. They do not fit together. [pause]
The right way to find who paid the most is the one we learned in Chapter Four. [pause]
ORDER BY fees_paid DESC, LIMIT one. Sort them and take the top one. [pause]
MIN and MAX give you the value. ORDER BY and LIMIT give you the person.
```

```sql
SELECT MIN(fees_paid) AS smallest_payment,
       MAX(fees_paid) AS largest_payment,
       COUNT(*) AS number_of_students
FROM students;
```

#### `aggregate-functions/count-with-where.mp3` — Aggregates with a WHERE

> type cue: “So we just add WHERE” · run cue: “Run”

```text
One more thing before the next lesson, and it is simpler than you expect. [pause]
An aggregate is still a SELECT. So everything you already know still works. [pause]
How many students are in NC IT, and how much have they paid between them? [pause]
So we just add WHERE, exactly as before. [pause]
COUNT star, SUM of fees_paid, FROM students, WHERE programme equals NC IT. [pause]
The WHERE runs first. It picks the rows. Then the aggregate works on whatever survived. [pause]
Filter first, then count. That is the order, and it never changes. [pause]
Run. [pause]
Four IT students. [pause]
And two thousand one hundred and seventy one dollars and twenty five cents between them. [pause]
Now, that is useful. But what if the principal wants that for every programme, not just IT? [pause]
Do we write the query three times, once for each programme? No. That is the next lesson.
```

```sql
SELECT COUNT(*) AS it_students,
       SUM(fees_paid) AS it_money
FROM students
WHERE programme = 'NC IT';
```

#### `aggregate-functions/exam-answer.mp3` — How this looks in the exam

> whiteboard: 4 drawings appear during this clip

```text
Aggregate questions are short and they are free marks if you have practised them. [pause]
First, know the definition. An aggregate function performs a calculation on a set of values and returns a single value. [pause]
Then know the five, and what each one takes. [pause]
COUNT star counts rows. SUM of a column adds them. AVG of a column averages them. MIN and MAX find the extremes. [pause]
Watch out for the English in the question, because it tells you which one they want. [pause]
How many means COUNT. Total means SUM. Average or mean means AVG. Highest or most means MAX. Lowest, cheapest or least means MIN. [pause]
And always, always give it an alias with AS. It costs you three seconds and it makes your answer look professional. [pause]
One last one they like. What is the difference between COUNT star and COUNT of a column name? [pause]
COUNT star counts all the rows. COUNT of a column counts only the rows where that column is not NULL.
```

### 7.2 GROUP BY and HAVING

- Folder: `public/sounds/sql-lessons/group-by/`
- 5 clips, roughly 6m 43s of speech
- Exam note shown on screen: GROUP BY splits rows into groups and applies the aggregate to each group. HAVING filters those groups. WHERE filters rows before grouping; HAVING filters groups after. That difference is the exam question.

#### `group-by/the-idea.mp3` — One answer per group

> type cue: “Look at the last line” · run cue: “Run”

```text
In the last lesson we counted the whole college, and we counted IT on its own. [pause]
But the principal wants a breakdown. How many in each programme, all on one page. [pause]
Now, we could write the query three times and change the WHERE each time. But that is slow, and if a new programme starts you would miss it. [pause]
So instead we tell the database to split the rows into piles, and count each pile. [pause]
Look at the last line. [pause]
GROUP BY programme. [pause]
Picture what that does. It takes all seven students and puts them into piles, one pile per programme. [pause]
The IT pile. The Accounting pile. The Marketing pile. [pause]
And then COUNT star runs once inside each pile, not once for the whole table. [pause]
Run. [pause]
There is the breakdown. [pause]
NC IT, four learners. NC Accounting, two. NC Marketing, one. [pause]
Three rows, one for each pile. And it added up to seven, which is everybody. [pause]
Now look at the SELECT line again, because there is a rule hiding in it. [pause]
I asked for programme, and I asked for COUNT star. Nothing else. [pause]
The rule is this. Anything in your SELECT that is not inside an aggregate function must also be in the GROUP BY. [pause]
You cannot ask for first_name here. Which of the four IT names would it show you? The question makes no sense. [pause]
So: grouped column, and aggregates. That is all that may go in the SELECT.
```

```sql
SELECT programme, COUNT(*) AS learners
FROM students
GROUP BY programme;
```

#### `group-by/group-with-sum.mp3` — More than one number per group

> type cue: “Watch how much” · run cue: “Run”

```text
Now we can build a real management report, and it takes almost no extra effort. [pause]
Watch how much information I get from six lines. [pause]
The programme, the number of learners, the money collected, and the average payment. [pause]
All grouped by programme, and then sorted by money, biggest first. [pause]
And look where the ORDER BY is. Right at the bottom, after the GROUP BY. [pause]
That is the order we recited in Chapter Four. SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT. [pause]
Run. [pause]
Now look at that. That is a report a principal would actually use. [pause]
NC IT is at the top with four learners and over two thousand dollars. [pause]
NC Accounting has two learners and four hundred and eighty dollars. [pause]
And NC Marketing, one learner and seventy five dollars. [pause]
Look at the average column too. It tells a different story from the total. [pause]
A programme can collect a lot of money simply because it has many students. The average shows you how each individual is doing. [pause]
That is the difference between data and information. We had data. Now we have information.
```

```sql
SELECT programme,
       COUNT(*) AS learners,
       SUM(fees_paid) AS money_collected,
       AVG(fees_paid) AS average_payment
FROM students
GROUP BY programme
ORDER BY money_collected DESC;
```

#### `group-by/having.mp3` — HAVING — filtering the groups

> type cue: “So we use HAVING” · run cue: “Run”

```text
Now the last piece of SQL in this course, and it is the one students find confusing. Let me make it simple. [pause]
The principal says, only show me the programmes that have more than one learner. [pause]
Now your instinct will be to reach for WHERE. And WHERE will not work here. Let me explain why. [pause]
WHERE runs before the grouping. At that moment there are no groups yet, and there is no count yet. [pause]
You cannot filter on a count that has not been calculated. The database has not done the counting when WHERE runs. [pause]
So we need a filter that runs afterwards, once the piles have been counted. [pause]
So we use HAVING. [pause]
HAVING COUNT star greater than one. [pause]
HAVING is the WHERE clause for groups. That is the sentence to remember. [pause]
And it sits after the GROUP BY, never before it. [pause]
Run. [pause]
Two rows now. [pause]
NC IT with four, and NC Accounting with two. [pause]
NC Marketing had only one learner, so its whole group was thrown out of the answer. [pause]
Notice what got filtered. Not a student. A whole group. [pause]
WHERE throws away rows. HAVING throws away groups. That is the whole difference.
```

```sql
SELECT programme, COUNT(*) AS learners
FROM students
GROUP BY programme
HAVING COUNT(*) > 1;
```

#### `group-by/where-and-having.mp3` — Using WHERE and HAVING together

> type cue: “Read it from the top” · run cue: “Run”

```text
And now let us put them both in one query, because that is where it finally clicks. [pause]
The question is: which programmes have more than one learner who has actually paid something? [pause]
Read it from the top with me, line by line. [pause]
WHERE fees_paid greater than zero. That runs first, and it throws away Farai, who has paid nothing. [pause]
GROUP BY programme. That runs second, and it puts the survivors into piles. [pause]
HAVING COUNT star greater than one. That runs third, and it throws away any pile that is too small. [pause]
Filter the rows. Make the piles. Filter the piles. Three steps, in that order, every time. [pause]
Run. [pause]
One row. NC IT, four paying learners. [pause]
Accounting lost Farai to the WHERE, so it only had one paying learner left, and then HAVING removed the whole group. [pause]
Marketing only ever had one, so it was removed too. [pause]
One query answered a question that would take you an hour with a calculator and a printed list. [pause]
That is what SQL is for.
```

```sql
SELECT programme, COUNT(*) AS paying_learners
FROM students
WHERE fees_paid > 0
GROUP BY programme
HAVING COUNT(*) > 1;
```

#### `group-by/exam-answer.mp3` — How this looks in the exam

> whiteboard: 3 drawings appear during this clip

```text
This is one of the most reliable questions on the paper, so let us nail it. [pause]
The question. Differentiate between the WHERE clause and the HAVING clause. [pause]
Answer. WHERE filters individual records before they are grouped, and it cannot be used with aggregate functions. [pause]
HAVING filters groups after the grouping has taken place, and it is used with aggregate functions. [pause]
Before and after. Rows and groups. Those two contrasts are the marks. [pause]
And in a practical question, when you see the words for each, or per, that is your GROUP BY signal. [pause]
The number of students for each programme. Total sales per branch. Average mark per subject. All GROUP BY. [pause]
And when you see only those groups with, or where the count is more than, that is HAVING. [pause]
For each means GROUP BY. Only those groups means HAVING. Two phrases, two clauses.
```

## Chapter 8 — Views, Users and Exam Technique

_Saving a query as a virtual table, controlling who may see what, and how to answer an SQL paper._

### 8.1 Views — saving a query as a virtual table

- Folder: `public/sounds/sql-lessons/views/`
- 5 clips, roughly 5m 47s of speech
- Exam note shown on screen: A view is a virtual table based on the result of a SELECT statement. It stores the query, not the data, so it is always up to date.

#### `views/what-is-a-view.mp3` — The query everybody keeps asking for

> whiteboard: 5 drawings appear during this clip

```text
Let me describe a problem you will meet in your first job. [pause]
You write a beautiful query. Three tables joined, a WHERE clause, sorted properly. It took you twenty minutes. [pause]
The next morning, the accounts clerk needs the same list. So you write it again for her. [pause]
The following week, the registrar needs it. And the head of department. And somebody in the library. [pause]
Now you have five copies of that query floating around the college, and one of them has a typing mistake in it. [pause]
The answer to this is a view. [pause]
A view is a saved query with a name on it. You write it once, and then everybody just uses the name. [pause]
And here is the definition for your exam. A view is a virtual table based on the result of a SELECT statement. [pause]
Say virtual. That word carries a mark, because it tells the marker you understand the next part. [pause]
A view does not store any data. It stores the question, not the answer. [pause]
So every single time somebody opens the view, the query runs again, on the data as it is at that moment. [pause]
A view is never out of date. That is the whole beauty of it.
```

#### `views/create-view.mp3` — CREATE VIEW

> type cue: “So watch the first line” · run cue: “Run”

```text
The command is CREATE VIEW, and it is easier than you expect, because you already know the hard part. [pause]
So watch the first line. [pause]
CREATE VIEW paid_up_students AS. [pause]
That word AS is doing the joining. It says, this name means the query that follows. [pause]
And then underneath it, an ordinary SELECT. Nothing special at all. [pause]
The students who have paid more than one hundred dollars. [pause]
That is the pattern for every view you will ever write. CREATE VIEW, a name, AS, and then any SELECT. [pause]
Run. [pause]
Now look. It says it succeeded, but there is no list of students. [pause]
And that is exactly right. We have not asked a question yet. We have only saved one. [pause]
The view is now sitting in the database with a name, waiting for somebody to use it.
```

```sql
CREATE VIEW paid_up_students AS
SELECT first_name, surname, programme, fees_paid
FROM students
WHERE fees_paid > 100;
```

#### `views/query-the-view.mp3` — Using the view

> type cue: “Watch this” · run cue: “Run”

```text
Now here is the part that makes it worth it. [pause]
Watch this. One line. [pause]
SELECT star FROM paid_up_students. [pause]
Look at that. I am treating it exactly like a table. Same command, same shape, no difference. [pause]
Run. [pause]
And there is the list. [pause]
Tanaka, Rudo and Chipo. The three who have paid more than one hundred. [pause]
Now think about the accounts clerk. She does not need to know about the WHERE clause. [pause]
She does not need to know which table it comes from. She just types the name and gets her list. [pause]
And if a student pays tomorrow morning, she will appear in this view automatically, with nobody changing anything. [pause]
Because the view stores the question, not the answer. Remember that. [pause]
You can also put a WHERE on top of a view, or an ORDER BY, exactly as you would with a table. It behaves like a table in every way.
```

```sql
SELECT * FROM paid_up_students;
```

#### `views/view-uses-and-drop.mp3` — Why views matter, and how to remove one

> type cue: “And to remove one” · run cue: “Run”

```text
Before we drop it, let me give you the three reasons views exist, because the exam asks for them. [pause]
One. Simplicity. A complicated join becomes a simple name that anybody can use. [pause]
Two. Security. And this is the big one. [pause]
You can give a clerk access to a view that shows only names and programmes, and no fees at all. [pause]
She can do her work, and she can never see the money column, because it is not in the view. [pause]
Three. Consistency. Everybody in the college is using the same definition of a paid up student. One definition, one truth. [pause]
And to remove one, it is DROP VIEW. [pause]
DROP VIEW paid_up_students. And SHOW TABLES underneath, to see what is left. [pause]
Run. [pause]
The view is gone. [pause]
But look carefully. Our students table is still there, with all five students inside it. [pause]
Nothing was lost, and I want you to understand why that is guaranteed. [pause]
Dropping a view only throws away a saved question. The data was never inside the view in the first place.
```

```sql
DROP VIEW paid_up_students;

SHOW TABLES;
```

#### `views/exam-answer.mp3` — How this looks in the exam

> whiteboard: 4 drawings appear during this clip

```text
Views come up as both a theory question and a practical one. [pause]
The theory. Define a view and state two advantages of using views. [pause]
A view is a virtual table whose contents are defined by a SELECT statement. It does not store data itself. [pause]
Advantage one, it simplifies complex queries for the end user. Advantage two, it improves security by hiding columns the user should not see. [pause]
The practical. Create a view called something, showing certain fields, for certain records. [pause]
CREATE VIEW, the name, AS, then the SELECT with its WHERE. Semicolon at the very end, not after the view name. [pause]
And one they slip in to catch you. Does a view store data? [pause]
No. A view stores the SELECT statement, and it runs it fresh each time the view is accessed. [pause]
No, it stores the query. Nine words, one mark.
```

### 8.2 Users, GRANT and REVOKE

- Folder: `public/sounds/sql-lessons/users-and-grants/`
- 5 clips, roughly 6m 41s of speech
- Exam note shown on screen: GRANT gives privileges, REVOKE takes them away. Both are DCL. Know the privilege names: SELECT, INSERT, UPDATE, DELETE and ALL PRIVILEGES.

#### `users-and-grants/why-security.mp3` — Not everybody may touch everything

> whiteboard: 4 drawings appear during this clip

```text
Before we write any commands, let me set the scene, because this chapter is really about trust. [pause]
In a college database, who should be able to change a student's final mark? [pause]
Not the librarian. Not the accounts clerk. Not the student. Only the examinations officer. [pause]
But all of those people need to open the same database every day to do their jobs. [pause]
So the database must be able to tell them apart. Every person gets their own username and password. [pause]
And then each username is given only the powers it needs. Nothing more. [pause]
That idea has a name, and it is worth knowing. The principle of least privilege. [pause]
Give every user the smallest set of permissions that still lets them do their job. [pause]
The family of commands for this is DCL, Data Control Language, which we met all the way back in Chapter One. [pause]
Now, I must tell you honestly: none of these commands will run in this practice console. [pause]
This console is a small database living inside your browser. It has no logins and no passwords, so there is nobody to grant anything to. [pause]
On a real MySQL server, in XAMPP or at work, they all work exactly as I am about to show you. [pause]
So for these next steps, read the code, copy it into your notes, and understand every word. They are examinable.
```

#### `users-and-grants/create-user.mp3` — CREATE USER

> type cue: “Look at the editor” · not executed (MySQL-only)

```text
First we make the user exist. Look at the editor. [pause]
CREATE USER, then the username in single quotes, then the at sign, then localhost in single quotes. [pause]
Now what is that at localhost part? It confuses everybody the first time. [pause]
It says where this person is allowed to connect from. localhost means, only from this same machine. [pause]
So even if somebody in another country steals the password, they cannot use it, because they are not sitting at that machine. [pause]
That is a real security control, and it is the kind of detail that earns you extra marks. [pause]
Then IDENTIFIED BY, and the password in single quotes. [pause]
Notice the password is written in plain text in the command, but MySQL stores it scrambled. It is never kept as plain text on the disk. [pause]
Now, at this moment, the accounts clerk exists. She has a username and a password. [pause]
But she can do absolutely nothing. She can log in and stare at an empty screen. [pause]
Creating a user gives them zero powers. Every single power must be given deliberately. That is by design.
```

```sql
-- Runs on a real MySQL server, not in this practice console.

CREATE USER 'accounts_clerk'@'localhost'
IDENTIFIED BY 'StrongPass123';
```

#### `users-and-grants/grant.mp3` — GRANT — giving permission

> type cue: “Read the first one” · not executed (MySQL-only)

```text
Now we give her the powers she needs. The command is GRANT. [pause]
And the shape is always the same. GRANT what, ON where, TO whom. [pause]
What, where, whom. Three words, and you can write any GRANT statement in the exam. [pause]
Read the first one with me. [pause]
GRANT SELECT, INSERT. Those are the what. She may look at records, and she may add records. [pause]
ON college_db dot students. That is the where. Only that one table, in that one database. [pause]
TO accounts_clerk at localhost. That is the whom. [pause]
And notice what she did not get. No UPDATE, and no DELETE. [pause]
So she can register a new student, and she can look up any student, but she can never change or remove a record. [pause]
That is the principle of least privilege, written in one line of SQL. [pause]
Now look at the second statement, for the head of department. [pause]
GRANT ALL PRIVILEGES ON college_db dot star. [pause]
ALL PRIVILEGES means every power. And the star after the database name means every table in that database. [pause]
So the head of department can do anything, to anything, inside college_db. [pause]
Be careful with that one. Give ALL PRIVILEGES to as few people as possible. [pause]
The privileges you must be able to name are SELECT, INSERT, UPDATE, DELETE, and ALL PRIVILEGES.
```

```sql
-- Runs on a real MySQL server, not in this practice console.

GRANT SELECT, INSERT ON college_db.students
TO 'accounts_clerk'@'localhost';

GRANT ALL PRIVILEGES ON college_db.*
TO 'hod'@'localhost';
```

#### `users-and-grants/revoke.mp3` — REVOKE — taking it back

> type cue: “Look at the shape” · not executed (MySQL-only)

```text
And when somebody changes job, or leaves, you must be able to take the powers back. [pause]
That command is REVOKE, and it is GRANT in reverse. [pause]
Look at the shape. [pause]
REVOKE what, ON where, FROM whom. [pause]
And there is the one difference to watch. GRANT uses the word TO. REVOKE uses the word FROM. [pause]
GRANT to. REVOKE from. Students lose marks by mixing those two little words, so say it a few times. [pause]
Here we are taking away her INSERT permission. She may still look, but she may no longer add new students. [pause]
And notice her SELECT permission is untouched. REVOKE only removes exactly what you name. [pause]
At the bottom I have written DROP USER as a comment. [pause]
That removes the account altogether, and you would use it the day somebody leaves the college for good. [pause]
Revoke when their duties change. Drop the user when the person leaves.
```

```sql
-- Runs on a real MySQL server, not in this practice console.

REVOKE INSERT ON college_db.students
FROM 'accounts_clerk'@'localhost';

-- And to remove the account completely:
-- DROP USER 'accounts_clerk'@'localhost';
```

#### `users-and-grants/exam-answer.mp3` — How this looks in the exam

> whiteboard: 4 drawings appear during this clip

```text
DCL questions are short, they are predictable, and most students throw the marks away by not revising them. Not you. [pause]
First. State two DCL commands and explain their use. [pause]
GRANT gives specified privileges on a database object to a user. REVOKE withdraws privileges that were previously granted. [pause]
Second. Write a statement to allow the user clerk to view records in the students table. [pause]
GRANT SELECT ON college_db dot students TO clerk at localhost, semicolon. [pause]
Third, and this one is a favourite. State three ways of securing a database. [pause]
One, creating individual user accounts with strong passwords. Two, granting only the minimum privileges each user needs. Three, using views to hide sensitive columns. [pause]
And you can add a fourth if you want the extra mark. Taking regular backups, so the data can be restored after a failure or an attack. [pause]
Remember the shapes. GRANT what, ON where, TO whom. REVOKE what, ON where, FROM whom.
```

### 8.3 How to answer an SQL exam paper

- Folder: `public/sounds/sql-lessons/exam-technique/`
- 4 clips, roughly 5m 08s of speech
- Exam note shown on screen: Read the question twice. Underline what they want to see and the conditions. Then write the clauses in the fixed order: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT.

#### `exam-technique/read-the-question.mp3` — Translating English into SQL

> whiteboard: 4 drawings appear during this clip

```text
You know the commands now. Every one of them. So this last lesson is not about SQL. It is about the exam room. [pause]
Because the paper does not say, write a SELECT with a WHERE. It says something in English, and you must translate it. [pause]
So here is the method. Four steps, and I want you to use them on every single question. [pause]
Step one. Read the question twice. Twice, not once. The second reading is where you catch the word not, or the word each. [pause]
Step two. Underline what they want to see. Names? Totals? Everything? That becomes your SELECT line. [pause]
Step three. Underline the conditions. The words who, whose, with, more than, starting with. Those become your WHERE line. [pause]
Step four. Look for the signal words that point at a clause. [pause]
For each, or per, means GROUP BY. Sorted, or in order of, means ORDER BY. [pause]
Top three, or first five, means ORDER BY plus LIMIT. Including those who have none means LEFT JOIN. [pause]
Underline. Translate. Then write. Never start writing before you have underlined.
```

#### `exam-technique/worked-example.mp3` — A worked example, out loud

> type cue: “Now I write it” · run cue: “Run”

```text
Let me do one out loud, exactly as I want you to do it in the exam. [pause]
The question. List the names and amounts paid by NC IT students who have paid more than two hundred dollars, showing the highest payers first. [pause]
Now I talk to myself. What do they want to see? Names, and amounts paid. So first_name, surname, fees_paid. [pause]
Where does it live? The students table. [pause]
What are the conditions? NC IT, and more than two hundred. Two conditions, both must be true, so AND. [pause]
And any signal words? Yes. Highest first. That is ORDER BY, descending. [pause]
Now I write it, in the fixed order. [pause]
SELECT, FROM, WHERE, ORDER BY. No GROUP BY needed, no LIMIT needed. [pause]
Then I check my three things. Text in quotes, numbers bare. Semicolon at the end. Column names spelled correctly. [pause]
Run. [pause]
And there is the answer. [pause]
Kuda, Chipo, Rudo. In IT, all over two hundred, biggest first. [pause]
Notice I never once panicked, and I never once guessed. I just translated, phrase by phrase.
```

```sql
SELECT first_name, surname, fees_paid
FROM students
WHERE programme = 'NC IT'
  AND fees_paid > 200
ORDER BY fees_paid DESC;
```

#### `exam-technique/common-mistakes.mp3` — The mistakes that cost real marks

> whiteboard: 4 drawings appear during this clip

```text
Now let me save you some marks. These are the mistakes I see every year, in that order of frequency. [pause]
Number one. The missing semicolon. It costs a mark and it takes one second to fix. Go back and check every answer for it. [pause]
Number two. Quotes on numbers, or no quotes on text. Text in quotes, numbers bare. Check every value. [pause]
Number three. A comma after the last column in a CREATE TABLE. Look at the last line before the closing bracket. [pause]
Number four. Writing the clauses in the wrong order. ORDER BY before WHERE will never work. [pause]
Number five. Forgetting the WHERE in an UPDATE or a DELETE. In the exam that is marks. At work it is your job. [pause]
Number six. Using WHERE where the question needs HAVING, because the condition is on a count. [pause]
Number seven. Spelling the column name differently from the way it was created. student_id is not studentid. [pause]
And number eight, the one that hurts most. Answering a different question from the one that was asked. [pause]
That is why we read it twice. Always twice.
```

#### `exam-technique/final-word.mp3` — The last thing I want to say to you

> whiteboard: 5 drawings appear during this clip

```text
So, we have come to the end. [pause]
Look at where you started. You did not know what a table was. [pause]
And now you can create a database, design a table with proper data types and constraints, and put real data into it. [pause]
You can pull that data back out with any condition you like. You can change it, and you can remove it safely. [pause]
You can join three tables together and produce a report. You can summarise thousands of records into one number. [pause]
You can build a view, and you can control who is allowed to see what. [pause]
That is not exam knowledge. That is a working skill, and people are paid for it. [pause]
Now, one last piece of advice, and it is the most important one. [pause]
Do not only listen to these lessons. Come back to this console and break things. [pause]
Type the command wrong on purpose. See the error. Understand the error. Then fix it. [pause]
Nobody has ever learned SQL by reading. You learn it with your fingers. [pause]
Go well, and I will see you in the practical.
```

---

**Totals:** 109 clips, roughly 117m 31s of speech across the whole course.
