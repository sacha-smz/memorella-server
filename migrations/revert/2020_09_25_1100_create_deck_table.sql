-- Revert memorella:2020_09_25_1100_create_deck_table from pg

BEGIN;

DROP PROCEDURE "delete_deck";
DROP FUNCTION "find_deck";

DROP TRIGGER "deck_update" ON "deck";

DROP VIEW "active_deck";
DROP TABLE "deck";

COMMIT;
