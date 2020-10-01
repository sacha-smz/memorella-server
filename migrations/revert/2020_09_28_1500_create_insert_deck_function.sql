-- Revert memorella:2020_09_28_1500_create_insert_deck_function from pg

BEGIN;

DROP FUNCTION "insert_deck", "insert_deck_cards";
DROP TYPE "deck_card";
DROP TYPE "deck_with_cards";

COMMIT;