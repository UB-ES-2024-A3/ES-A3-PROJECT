CREATE UNIQUE INDEX unique_user_name ON public.book_lists USING btree (user_id, name);

alter table "public"."book_lists" add constraint "unique_user_name" UNIQUE using index "unique_user_name";


