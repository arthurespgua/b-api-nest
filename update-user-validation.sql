-- Actualizar todos los usuarios existentes para que estén validados
UPDATE "Users" SET is_validated = true WHERE is_validated = false;
