create table "public"."followers_list" (
    "id" character varying not null,
    "user_id" character varying not null,
    "list_id" character varying not null
);


CREATE UNIQUE INDEX followers_list_pkey ON public.followers_list USING btree (id);

alter table "public"."followers_list" add constraint "followers_list_pkey" PRIMARY KEY using index "followers_list_pkey";

alter table "public"."followers_list" add constraint "followers_list_list_id_fkey" FOREIGN KEY (list_id) REFERENCES book_lists(id) ON DELETE CASCADE not valid;

alter table "public"."followers_list" validate constraint "followers_list_list_id_fkey";

alter table "public"."followers_list" add constraint "followers_list_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."followers_list" validate constraint "followers_list_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_followed(given_id character varying)
 RETURNS TABLE(user_id character varying, username character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    users.id AS user_id,
    users.username AS username
  FROM
    followers
  JOIN
    users ON followers.followed_id = users.id
  WHERE
    followers.follower_id = given_id;
  END;
  $function$
;

CREATE OR REPLACE FUNCTION public.get_followers(given_id character varying)
 RETURNS TABLE(user_id character varying, username character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    users.id AS user_id,
    users.username AS username
  FROM
    followers
  JOIN
    users ON followers.follower_id = users.id
  WHERE
    followers.followed_id = given_id;
  END;
  $function$
;

CREATE OR REPLACE FUNCTION public.get_timeline(given_id character varying)
 RETURNS TABLE(user_id character varying, book_id character varying, username character varying, title text, author text, review_id character varying, rating smallint, description text, date date, "time" time without time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    users.id AS user_id,
    books.id AS book_id,
    users.username AS username,
    books.title AS title,
    books.author AS author,
    reviews.id AS review_id,
    reviews.stars AS rating,
    reviews.comment AS description,
    reviews.date AS "date",
    reviews.time AS "time"
  FROM
    followers
  JOIN
    users ON followers.followed_id = users.id
  JOIN
    reviews ON followers.followed_id = reviews.user_id
  JOIN
    books ON reviews.book_id = books.id
  WHERE
    followers.follower_id = given_id
  ORDER BY reviews.date DESC, reviews.time DESC;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.search_books_by_title(search_term text, limit_num integer)
 RETURNS TABLE(id character varying, author text, title text, genres text, description text, numreviews integer, avgstars double precision, sim double precision, match_pos integer, match_length integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        b.id AS id,
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
$function$
;

CREATE OR REPLACE FUNCTION public.search_similar_users(search_term text, limit_num integer DEFAULT NULL::integer)
 RETURNS TABLE(user_id uuid, username text, sim double precision, pos integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF limit_num IS NOT NULL THEN
        RETURN QUERY
        SELECT
            u.id::UUID AS user_id,
            u.username::TEXT AS username,
            similarity(u.username, search_term)::DOUBLE PRECISION AS sim,
            position(search_term IN u.username) AS pos
        FROM users u
        WHERE u.username ILIKE '%' || search_term || '%'
        ORDER BY sim DESC, pos ASC, u.username ASC
        LIMIT limit_num; -- Aplicamos LIMIT si limit_num tiene valor
    ELSE
        RETURN QUERY
        SELECT
            u.id::UUID AS user_id,
            u.username::TEXT AS username,
            similarity(u.username, search_term)::DOUBLE PRECISION AS sim,
            position(search_term IN u.username) AS pos
        FROM users u
        WHERE u.username ILIKE '%' || search_term || '%'
        ORDER BY sim DESC, pos ASC, u.username ASC; -- Sin LIMIT si limit_num es NULL
    END IF;
END;
$function$
;

grant delete on table "public"."followers_list" to "anon";

grant insert on table "public"."followers_list" to "anon";

grant references on table "public"."followers_list" to "anon";

grant select on table "public"."followers_list" to "anon";

grant trigger on table "public"."followers_list" to "anon";

grant truncate on table "public"."followers_list" to "anon";

grant update on table "public"."followers_list" to "anon";

grant delete on table "public"."followers_list" to "authenticated";

grant insert on table "public"."followers_list" to "authenticated";

grant references on table "public"."followers_list" to "authenticated";

grant select on table "public"."followers_list" to "authenticated";

grant trigger on table "public"."followers_list" to "authenticated";

grant truncate on table "public"."followers_list" to "authenticated";

grant update on table "public"."followers_list" to "authenticated";

grant delete on table "public"."followers_list" to "service_role";

grant insert on table "public"."followers_list" to "service_role";

grant references on table "public"."followers_list" to "service_role";

grant select on table "public"."followers_list" to "service_role";

grant trigger on table "public"."followers_list" to "service_role";

grant truncate on table "public"."followers_list" to "service_role";

grant update on table "public"."followers_list" to "service_role";


