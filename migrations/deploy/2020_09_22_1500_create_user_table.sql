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

CREATE FUNCTION "where"("filter" JSON DEFAULT '{}')
RETURNS TEXT AS
$$
DECLARE
  "clause" TEXT := '';
  "field" TEXT;
  "detail" JSON;
  "it" INT := 0;
BEGIN
  FOR "field", "detail" IN SELECT * FROM json_each("filter")
  LOOP
    IF "it" = 0 THEN
      "clause" := "clause" || ' WHERE ';
      "it" := "it" + 1;
    ELSE
      "clause" := "clause" || ' AND ';
    END IF;

    if(("detail"->>'table') IS NOT NULL) THEN
      "clause" := "clause" || format('%I.', "detail"->>'table');
    END IF;

    "clause" := "clause" || format('%I %s', "field", "detail"->>'op');

    IF(("detail"->>'val') IS NOT NULL) THEN
      "clause" := "clause" || format(' %L', "detail"->>'val');
    END IF;
  END LOOP;

  RETURN "clause";
END
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE FUNCTION "find_user"("filter" JSON DEFAULT '{}')
RETURNS SETOF "user" AS
$$
DECLARE
  "query" TEXT := 'SELECT * FROM "active_user"';
BEGIN
  "query" := "query" || "where"("filter");
  RETURN QUERY EXECUTE "query";
END
$$ LANGUAGE plpgsql STABLE;

CREATE PROCEDURE "delete_user"("filter" JSON DEFAULT '{}')
LANGUAGE plpgsql
AS $$
DECLARE
  "query" TEXT := 'UPDATE "user" SET "deleted_at" = CURRENT_TIMESTAMP';
BEGIN
  "query" := "query" || "where"("filter");
  EXECUTE query;
END
$$;

COMMIT;
