SELECT COUNT(*) FROM books;
SELECT COUNT(*) AS books_released, released_year FROM books GROUP BY released_year;
SELECT SUM(stock_quantity) FROM books;
SELECT AVG(released_year) FROM books GROUP BY author_lname, author_fname;

SELECT 
    CONCAT(author_fname, ' ', author_lname) AS author
FROM
    books
WHERE
    pages = (SELECT  MAX(pages) FROM books);
            
SELECT 
    released_year AS year,
    COUNT(*) AS '# books',
    AVG(pages) AS 'avg pages'
FROM
    books
GROUP BY released_year
ORDER BY released_year;
