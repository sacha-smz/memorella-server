-- Deploy memorella:2020_09_29_1500_create_display_deck_function to pg

BEGIN;

CREATE FUNCTION "display_deck"("filter" JSON DEFAULT '{}')
RETURNS SETOF "deck_with_cards" AS
$$
DECLARE
  "query" TEXT := 'SELECT "deck"."id", "deck"."name", "deck"."created_at", "deck"."updated_at",
                          COALESCE(json_agg(("card"."id", "card"."url", "card"."created_at", "card"."updated_at")::"deck_card")
                                   FILTER(WHERE "card"."id" IS NOT NULL), ''[]'') AS "cards"
                   FROM "deck"
                   LEFT JOIN "card"
                   ON "deck"."id" = "card"."deck_id"';
BEGIN
  "query" := "query" || "where"("filter") || ' GROUP BY "deck"."id"';

  RETURN QUERY EXECUTE "query";
END
$$ LANGUAGE plpgsql STABLE;

COMMIT;
