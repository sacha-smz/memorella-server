-- Deploy memorella:2020_09_22_1500_create_user_table to pg

BEGIN;

CREATE TABLE "user" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "firstname" TEXT NULL,
  "lastname" TEXT NULL,
  "avatar_url" TEXT NULL,
  "is_admin" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NULL,
  "deleted_at" TIMESTAMP WITH TIME ZONE NULL
);

CREATE VIEW "active_user" AS
  SELECT *
  FROM "user"
  WHERE "deleted_at" IS NULL;

CREATE FUNCTION "set_updated_at"() RETURNS TRIGGER AS
$$
  BEGIN
    NEW."updated_at" := CURRENT_TIMESTAMP;
    RETURN NEW;
  END
$$ LANGUAGE plpgsql;

CREATE TRIGGER "user_update"
  BEFORE UPDATE ON "user"
  FOR EACH ROW
  WHEN (OLD.* IS DISTINCT FROM NEW.*)
  EXECUTE FUNCTION "set_updated_at"();

COMMIT;
