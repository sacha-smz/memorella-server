-- Deploy memorella:2020_09_23_1500_create_find_one_function to pg

BEGIN;

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

    "clause" := "clause" || format('%I %s', "field", detail->>'op');

    IF(("detail"->>'val') IS NOT NULL) THEN
      "clause" := "clause" || format(' %L', detail->>'val');
    END IF;
  END LOOP;

  RETURN "clause";
END
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE FUNCTION "find_user"("filter" JSON DEFAULT '{}')
RETURNS SETOF "user" AS
$$
DECLARE
  "query" TEXT := 'SELECT * FROM "user"';
BEGIN
  "query" := "query" || "where"("filter");
  RETURN QUERY EXECUTE "query";
END
$$ LANGUAGE plpgsql STABLE;

COMMIT;
