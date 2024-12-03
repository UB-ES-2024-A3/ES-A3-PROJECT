create table "public"."followers" (
    "follower_id" character varying not null,
    "followed_id" character varying not null
);


alter table "public"."followers" enable row level security;

CREATE UNIQUE INDEX followers_pkey ON public.followers USING btree (follower_id, followed_id);

alter table "public"."followers" add constraint "followers_pkey" PRIMARY KEY using index "followers_pkey";

alter table "public"."followers" add constraint "followers_followed_id_fkey" FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."followers" validate constraint "followers_followed_id_fkey";

alter table "public"."followers" add constraint "followers_follower_id_fkey" FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."followers" validate constraint "followers_follower_id_fkey";

grant delete on table "public"."followers" to "anon";

grant insert on table "public"."followers" to "anon";

grant references on table "public"."followers" to "anon";

grant select on table "public"."followers" to "anon";

grant trigger on table "public"."followers" to "anon";

grant truncate on table "public"."followers" to "anon";

grant update on table "public"."followers" to "anon";

grant delete on table "public"."followers" to "authenticated";

grant insert on table "public"."followers" to "authenticated";

grant references on table "public"."followers" to "authenticated";

grant select on table "public"."followers" to "authenticated";

grant trigger on table "public"."followers" to "authenticated";

grant truncate on table "public"."followers" to "authenticated";

grant update on table "public"."followers" to "authenticated";

grant delete on table "public"."followers" to "service_role";

grant insert on table "public"."followers" to "service_role";

grant references on table "public"."followers" to "service_role";

grant select on table "public"."followers" to "service_role";

grant trigger on table "public"."followers" to "service_role";

grant truncate on table "public"."followers" to "service_role";

grant update on table "public"."followers" to "service_role";


