-- Add numreviews and avgstars to books table
ALTER TABLE books
ADD COLUMN numreviews int8 NOT NULL DEFAULT 0;

ALTER TABLE books
ADD COLUMN avgstars float4 NOT NULL DEFAULT 0;
