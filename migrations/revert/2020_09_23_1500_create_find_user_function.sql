-- Revert memorella:2020_09_23_1500_create_find_one_function from pg

BEGIN;

DROP FUNCTION "find_user", "where";

COMMIT;
