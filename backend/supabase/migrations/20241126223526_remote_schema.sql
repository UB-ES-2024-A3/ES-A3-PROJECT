create extension if not exists "pg_trgm" with schema "public" version '1.6';

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_similar_users(search_term text, limit_num integer)
 RETURNS TABLE(user_id uuid, username text, sim double precision, pos integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        u.id::UUID AS user_id,  -- Cast a UUID
        u.username::TEXT AS username,  -- Cast explícit a TEXT
        similarity(u.username, search_term)::DOUBLE PRECISION AS sim,  -- Cast explícit a double precision
        position(search_term IN u.username) AS pos
    FROM users u
    WHERE u.username ILIKE '%' || search_term || '%'
    ORDER BY sim DESC, pos ASC, u.username ASC
    LIMIT limit_num;
END;
$function$
;


