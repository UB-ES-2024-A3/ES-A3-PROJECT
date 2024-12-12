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


