-- Deploy memorella:2020_09_25_1130_create_card_table to pg

BEGIN;

CREATE TABLE "card" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "url" TEXT UNIQUE NOT NULL,
  "deck_id" INT NOT NULL REFERENCES "deck"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NULL,
  "deleted_at" TIMESTAMP WITH TIME ZONE NULL
);

CREATE VIEW "active_card" AS
  SELECT *
  FROM "card"
  WHERE "deleted_at" IS NULL;

CREATE TRIGGER "card_update"
  BEFORE UPDATE ON "card"
  FOR EACH ROW
  WHEN (OLD.* IS DISTINCT FROM NEW.*)
  EXECUTE FUNCTION "set_updated_at"();

CREATE FUNCTION "find_card"("filter" JSON DEFAULT '{}')
RETURNS SETOF "card" AS
$$
DECLARE
  "query" TEXT := 'SELECT * FROM "active_card"';
BEGIN
  "query" := "query" || "where"("filter");
  RETURN QUERY EXECUTE "query";
END
$$ LANGUAGE plpgsql STABLE;

CREATE PROCEDURE "delete_card"("filter" JSON DEFAULT '{}')
LANGUAGE plpgsql
AS $$
DECLARE
  "query" TEXT := 'UPDATE "card" SET "deleted_at" = CURRENT_TIMESTAMP';
BEGIN
  "query" := "query" || "where"("filter");
  EXECUTE query;
END
$$;

COMMIT;