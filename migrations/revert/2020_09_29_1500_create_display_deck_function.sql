-- Revert memorella:2020_09_29_1500_create_display_deck_function from pg

BEGIN;

DROP FUNCTION "display_deck";

COMMIT;
