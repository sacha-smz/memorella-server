-- Deploy memorella:2020_09_25_1100_create_deck_table to pg

BEGIN;

CREATE TABLE "deck" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" TEXT UNIQUE NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NULL,
  "deleted_at" TIMESTAMP WITH TIME ZONE NULL
);

CREATE VIEW "active_deck" AS
  SELECT *
  FROM "deck"
  WHERE "deleted_at" IS NULL;

CREATE TRIGGER "deck_update"
  BEFORE UPDATE ON "deck"
  FOR EACH ROW
  WHEN (OLD.* IS DISTINCT FROM NEW.*)
  EXECUTE FUNCTION "set_updated_at"();

CREATE FUNCTION "find_deck"("filter" JSON DEFAULT '{}')
RETURNS SETOF "deck" AS
$$
DECLARE
  "query" TEXT := 'SELECT * FROM "active_deck"';
BEGIN
  "query" := "query" || "where"("filter");
  RETURN QUERY EXECUTE "query";
END
$$ LANGUAGE plpgsql STABLE;

CREATE PROCEDURE "delete_deck"("filter" JSON DEFAULT '{}')
LANGUAGE plpgsql
AS $$
DECLARE
  "query" TEXT := 'UPDATE "deck" SET "deleted_at" = CURRENT_TIMESTAMP';
BEGIN
  "query" := "query" || "where"("filter");
  EXECUTE query;
END
$$;

COMMIT;