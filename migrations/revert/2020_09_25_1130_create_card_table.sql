-- Revert memorella:2020_09_25_1130_create_card_table from pg

BEGIN;

DROP PROCEDURE "delete_card";
DROP FUNCTION "find_card";

DROP TRIGGER "card_update" ON "card";

DROP VIEW "active_card";
DROP TABLE "card";

COMMIT;
