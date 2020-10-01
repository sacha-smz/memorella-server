-- Deploy memorella:2020_09_28_1500_create_insert_deck_function to pg

BEGIN;

CREATE TYPE "deck_with_cards" AS ("id" INT, "name" TEXT, "created_at" TIMESTAMPTZ, "updated_at" TIMESTAMPTZ, "cards" JSON);
CREATE TYPE "deck_card" AS ("id" INT, "url" TEXT, "created_at" TIMESTAMPTZ, "updated_at" TIMESTAMPTZ);

CREATE FUNCTION "insert_deck_cards"("deck_id" INT, "card_urls" JSON)
RETURNS SETOF "deck_card" AS
$$
DECLARE
  "query" TEXT := 'INSERT INTO "card" ("url", "deck_id")';
  "urls" TEXT[];
  "url" TEXT;
  "it" INT := 0;
BEGIN
  SELECT ARRAY(SELECT json_array_elements_text("card_urls")) INTO "urls";  

  IF array_length("urls", 1) IS NULL THEN
    RETURN;
  END IF;

  FOREACH "url" IN ARRAY "urls"
  LOOP
    IF "it" = 0 THEN
      "query" := "query" || ' VALUES ';
      "it" := "it" + 1;
    ELSE
      "query" := "query" || ', ';
    END IF;

    "query" := "query" || format('(%L, %L)', "url", "deck_id");
  END LOOP;

  "query" = "query" || ' RETURNING "id", "url", "created_at", "updated_at"';

  RETURN QUERY EXECUTE "query";
END
$$ LANGUAGE plpgsql;

CREATE FUNCTION "insert_deck"("deck" JSON)
RETURNS "deck_with_cards" AS
$$
DECLARE
  "new_deck" "deck_with_cards";
BEGIN
  EXECUTE format('INSERT INTO "deck" ("name") VALUES (%L) RETURNING "id", "name", "created_at", "updated_at", ''{}''', "deck"->>'name') INTO "new_deck";

  RETURN ("new_deck"."id", "new_deck"."name", "new_deck"."created_at", "new_deck"."updated_at",
         (WITH "deck_cards" AS (SELECT *
                                 FROM "insert_deck_cards"("new_deck"."id", "deck"->'card_urls'))
          SELECT COALESCE(json_agg("deck_cards".*) FILTER(WHERE "id" IS NOT NULL), '[]') FROM "deck_cards"));
END
$$ LANGUAGE plpgsql;

COMMIT;
