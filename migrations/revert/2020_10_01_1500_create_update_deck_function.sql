-- Revert memorella:2020_10_01_1500_create_update_deck_function from pg

BEGIN;

DROP FUNCTION "update_one_deck";

COMMIT;
