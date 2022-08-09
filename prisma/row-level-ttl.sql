use roach_mart;

ALTER TABLE IF EXISTS cart_items DROP COLUMN IF EXISTS crdb_internal_expiration;

ALTER TABLE IF EXISTS cart_items SET (ttl_expire_after = '1 hour');