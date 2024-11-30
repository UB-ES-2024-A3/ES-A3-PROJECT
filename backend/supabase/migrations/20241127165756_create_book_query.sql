CREATE OR REPLACE FUNCTION search_books_by_title(
    search_term TEXT,
    limit_num INT
)
RETURNS TABLE (
    book_id VARCHAR,
    author TEXT,
    title TEXT,
    genres TEXT,
    description TEXT,
    numreviews INT,
    avgstars DOUBLE PRECISION,
    sim DOUBLE PRECISION,
    match_pos INT,
    match_length INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        b.id AS book_id,
        b.author AS author,
        b.title AS title,
        b.genres AS genres,
        b.description AS description,
        b.numreviews::INT AS numreviews,
        b.avgstars::DOUBLE PRECISION AS avgstars,
        similarity(b.title, search_term)::DOUBLE PRECISION AS sim,
        position(lower(search_term) IN lower(b.title)) AS match_pos,
        char_length(substring(b.title FROM position(lower(search_term) IN lower(b.title)))) AS match_length
    FROM books b
    WHERE b.title ILIKE '%' || search_term || '%'
    ORDER BY
        match_pos ASC,   
        sim DESC,        
        match_length ASC,
        b.title ASC
    LIMIT limit_num;
END;
$$ LANGUAGE plpgsql;
