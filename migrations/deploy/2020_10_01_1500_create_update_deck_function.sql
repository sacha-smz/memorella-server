-- Deploy memorella:2020_10_01_1500_create_update_deck_function to pg

BEGIN;

CREATE FUNCTION "update_one_deck"("update" JSON, "filter" JSON DEFAULT '{}')
RETURNS "deck_with_cards" AS
$$
DECLARE
  "query" TEXT := 'UPDATE "deck"';
  "updated_deck" "deck_with_cards";
  "removed_cards" INT[];
  "card_filter" JSON;
BEGIN
  "query" := "query" ||
              format(' SET "name" = %L', "update"->>'name') ||
                     ' WHERE "id" = (SELECT "id"
                                     FROM "deck"' ||
                                     "where"("filter") ||
                                   ' ORDER BY "id" DESC LIMIT 1)
                       RETURNING "id", "name", "created_at", "updated_at", ''{}''';
  EXECUTE "query" INTO "updated_deck";

  IF("update"->'removed_cards' IS NOT NULL) THEN
     SELECT ARRAY(SELECT json_array_elements_text("update"->'removed_cards')) INTO "removed_cards";

    IF array_length("removed_cards", 1) > 0 THEN
      "card_filter" := json_build_object(
                         'id', json_build_object('op', format('= ANY (%L)', "removed_cards")),
                         'deck_id', json_build_object('op', '=', 'val', "updated_deck"."id")
                       );
      CALL "delete_card"("card_filter");
    END IF;
  END IF;

  RETURN ("updated_deck"."id", "updated_deck"."name", "updated_deck"."created_at", "updated_deck"."updated_at",
         (WITH "deck_cards" AS (SELECT *
                                FROM "insert_deck_cards"("updated_deck"."id", "update"->'card_urls'))
          SELECT COALESCE(json_agg("deck_cards".*) FILTER(WHERE "id" IS NOT NULL), '[]') FROM "deck_cards"));
END
$$ LANGUAGE plpgsql;

COMMIT;
