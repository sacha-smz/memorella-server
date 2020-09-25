-- Revert memorella:2020_09_22_1500_create_user_table from pg

BEGIN;

DROP PROCEDURE "delete_user";
DROP FUNCTION "find_user", "where";

DROP TRIGGER "user_update" ON "user";
DROP FUNCTION "set_updated_at";

DROP VIEW "active_user";
DROP TABLE "user";

COMMIT;
