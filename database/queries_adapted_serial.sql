-- ============================================
-- Queries Úteis - Elarin Gym Admin (ID SERIAL)
-- ============================================
-- Adaptado para usar ID sequencial ao invés de UUID

-- ============================================
-- CONSULTAS (SELECT)
-- ============================================

-- 1. Listar todas as academias ativas
SELECT
    id,
    name,
    cnpj,
    email,
    phone,
    responsible_name,
    created_at
FROM gyms
WHERE is_active = true
ORDER BY created_at DESC;

-- 2. Buscar academia por email (para login)
SELECT
    id,
    name,
    email,
    password_hash,
    is_active
FROM gyms
WHERE email = 'contato@fitnessplus.com'
    AND is_active = true;

-- 3. Buscar academia por ID
SELECT *
FROM gyms
WHERE id = 1;  -- ID numérico simples

-- 4. Buscar academia por CNPJ
SELECT *
FROM gyms
WHERE cnpj = '12.345.678/0001-90';

-- 5. Listar usuários vinculados a uma academia (usando a tabela profiles)
SELECT
    gul.id as link_id,
    gul.status,
    gul.linked_at,
    p.id as user_id,
    p.email,
    p.full_name,
    p.avatar_url,
    p.locale
FROM gym_user_links gul
INNER JOIN profiles p ON gul.user_id = p.id
WHERE gul.gym_id = 1  -- ID numérico da academia
ORDER BY gul.linked_at DESC;

-- 5b. Usando a view criada (mais simples)
SELECT *
FROM gym_users_view
WHERE gym_id = 1  -- ID numérico
ORDER BY linked_at DESC;

-- 6. Estatísticas de uma academia
SELECT
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE status = 'active') as active_users,
    COUNT(*) FILTER (WHERE status = 'inactive') as inactive_users
FROM gym_user_links
WHERE gym_id = 1;  -- ID numérico

-- 7. Listar academias com total de usuários
SELECT
    g.id,
    g.name,
    g.email,
    g.phone,
    g.is_active,
    COUNT(gul.id) as total_users,
    COUNT(gul.id) FILTER (WHERE gul.status = 'active') as active_users
FROM gyms g
LEFT JOIN gym_user_links gul ON g.id = gul.gym_id
GROUP BY g.id
ORDER BY total_users DESC;

-- 8. Verificar se usuário já está vinculado a uma academia
SELECT EXISTS (
    SELECT 1
    FROM gym_user_links
    WHERE gym_id = 1  -- ID numérico
        AND user_id = '15921c54-27b3-4753-8b64-0c0197ccea5f'  -- UUID do usuário
) as is_linked;

-- 9. Buscar histórico de vínculos de um usuário
SELECT
    g.id as gym_id,
    g.name as gym_name,
    g.phone as gym_phone,
    g.address as gym_address,
    gul.status,
    gul.linked_at,
    gul.updated_at
FROM gym_user_links gul
INNER JOIN gyms g ON gul.gym_id = g.id
WHERE gul.user_id = '15921c54-27b3-4753-8b64-0c0197ccea5f'  -- UUID do usuário
ORDER BY gul.linked_at DESC;

-- 10. Buscar usuário por email (para vinculação)
SELECT
    id,
    email,
    full_name,
    created_at
FROM profiles
WHERE email = 'teste@gmail.com';

-- 11. Listar todos os usuários disponíveis para vincular a uma academia
SELECT
    p.id,
    p.email,
    p.full_name,
    p.locale,
    p.created_at,
    EXISTS (
        SELECT 1
        FROM gym_user_links gul
        WHERE gul.user_id = p.id
            AND gul.gym_id = 1  -- ID numérico
    ) as already_linked
FROM profiles p
ORDER BY p.created_at DESC;

-- 12. Ver próximo ID que será gerado
SELECT nextval('gyms_id_seq') as next_gym_id;

-- 13. Ver último ID inserido
SELECT currval('gyms_id_seq') as last_gym_id;

-- ============================================
-- INSERÇÕES (INSERT)
-- ============================================

-- 1. Cadastrar nova academia (ID gerado automaticamente)
INSERT INTO gyms (name, cnpj, email, password_hash, phone, address, responsible_name)
VALUES (
    'Academia Exemplo',
    '12.345.678/0001-90',
    'contato@exemplo.com',
    '$2b$10$HashedPasswordHere',
    '(11) 98765-4321',
    'Rua Exemplo, 123 - São Paulo, SP',
    'Maria Silva'
)
RETURNING id, name, email;  -- Retorna o ID gerado (ex: 1)

-- 2. Vincular usuário existente a uma academia
-- Usando ID numérico da academia e UUID do usuário
INSERT INTO gym_user_links (gym_id, user_id, status)
VALUES (
    1,  -- ID numérico da academia
    '15921c54-27b3-4753-8b64-0c0197ccea5f',  -- UUID do usuário (teste1@gmail.com)
    'active'
)
RETURNING id, gym_id, user_id, status, linked_at;

-- 3. Vincular múltiplos usuários de uma vez
INSERT INTO gym_user_links (gym_id, user_id, status)
VALUES
    (1, '15921c54-27b3-4753-8b64-0c0197ccea5f', 'active'),  -- teste1@gmail.com
    (1, '19a18bdb-67c4-4524-a4bb-073c1069311b', 'active'),  -- teste@gmail.com
    (1, 'd052e307-951d-42d3-9270-f05a08446f46', 'active')   -- batman@gmail.com
RETURNING *;

-- ============================================
-- ATUALIZAÇÕES (UPDATE)
-- ============================================

-- 1. Atualizar dados da academia
UPDATE gyms
SET
    name = 'Novo Nome',
    phone = '(11) 99999-9999',
    address = 'Novo Endereço'
WHERE id = 1  -- ID numérico
RETURNING *;

-- 2. Desativar academia
UPDATE gyms
SET is_active = false
WHERE id = 1;

-- 3. Alterar senha da academia
UPDATE gyms
SET password_hash = '$2b$10$NewHashedPasswordHere'
WHERE id = 1;

-- 4. Ativar usuário vinculado
UPDATE gym_user_links
SET status = 'active'
WHERE gym_id = 1
    AND user_id = '15921c54-27b3-4753-8b64-0c0197ccea5f'
RETURNING *;

-- 5. Desativar usuário vinculado
UPDATE gym_user_links
SET status = 'inactive'
WHERE gym_id = 1
    AND user_id = '15921c54-27b3-4753-8b64-0c0197ccea5f'
RETURNING *;

-- 6. Toggle status do usuário (por ID do vínculo)
UPDATE gym_user_links
SET status = CASE
    WHEN status = 'active' THEN 'inactive'
    ELSE 'active'
END
WHERE id = 1  -- ID numérico do vínculo
RETURNING *;

-- 7. Toggle status do usuário (por gym_id + user_id)
UPDATE gym_user_links
SET status = CASE
    WHEN status = 'active' THEN 'inactive'
    ELSE 'active'
END
WHERE gym_id = 1
    AND user_id = '15921c54-27b3-4753-8b64-0c0197ccea5f'
RETURNING *;

-- ============================================
-- DELEÇÕES (DELETE)
-- ============================================

-- 1. Remover vínculo usuário-academia
DELETE FROM gym_user_links
WHERE gym_id = 1
    AND user_id = '15921c54-27b3-4753-8b64-0c0197ccea5f'
RETURNING *;

-- 2. Remover vínculo por ID
DELETE FROM gym_user_links
WHERE id = 1  -- ID numérico do vínculo
RETURNING *;

-- 3. Remover todos os vínculos de uma academia
DELETE FROM gym_user_links
WHERE gym_id = 1;

-- 4. Deletar academia (também deleta vínculos por CASCADE)
DELETE FROM gyms
WHERE id = 1
RETURNING name, email;

-- ============================================
-- QUERIES ANALÍTICAS
-- ============================================

-- 1. Ranking de academias por número de usuários ativos
SELECT
    g.id,
    g.name,
    g.email,
    COUNT(gul.id) FILTER (WHERE gul.status = 'active') as active_users,
    g.created_at
FROM gyms g
LEFT JOIN gym_user_links gul ON g.id = gul.gym_id
WHERE g.is_active = true
GROUP BY g.id
ORDER BY active_users DESC
LIMIT 10;

-- 2. Academias sem usuários vinculados
SELECT
    g.id,
    g.name,
    g.email,
    g.created_at
FROM gyms g
LEFT JOIN gym_user_links gul ON g.id = gul.gym_id
WHERE gul.id IS NULL
    AND g.is_active = true;

-- 3. Usuários vinculados a múltiplas academias
SELECT
    p.id,
    p.email,
    p.full_name,
    COUNT(gul.gym_id) as total_gyms,
    array_agg(g.name) as gym_names,
    array_agg(g.id) as gym_ids
FROM profiles p
INNER JOIN gym_user_links gul ON p.id = gul.user_id
INNER JOIN gyms g ON gul.gym_id = g.id
GROUP BY p.id
HAVING COUNT(gul.gym_id) > 1;

-- 4. Estatísticas gerais do sistema
SELECT
    (SELECT COUNT(*) FROM gyms WHERE is_active = true) as total_active_gyms,
    (SELECT COUNT(*) FROM gyms WHERE is_active = false) as total_inactive_gyms,
    (SELECT COUNT(*) FROM gym_user_links) as total_links,
    (SELECT COUNT(*) FROM gym_user_links WHERE status = 'active') as total_active_links,
    (SELECT COUNT(DISTINCT user_id) FROM gym_user_links) as total_unique_users,
    (SELECT COUNT(*) FROM profiles) as total_registered_users;

-- 5. Academias cadastradas por mês
SELECT
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_gyms
FROM gyms
GROUP BY month
ORDER BY month DESC;

-- 6. Usuários mais ativos (vinculados a mais academias)
SELECT
    p.id,
    p.email,
    p.full_name,
    COUNT(gul.gym_id) as total_gyms,
    COUNT(gul.gym_id) FILTER (WHERE gul.status = 'active') as active_gyms,
    array_agg(DISTINCT g.name ORDER BY g.name) as gym_names
FROM profiles p
INNER JOIN gym_user_links gul ON p.id = gul.user_id
INNER JOIN gyms g ON gul.gym_id = g.id
GROUP BY p.id
ORDER BY total_gyms DESC
LIMIT 10;

-- 7. Detalhamento completo de uma academia
SELECT
    g.*,
    COUNT(gul.id) as total_users,
    COUNT(gul.id) FILTER (WHERE gul.status = 'active') as active_users,
    COUNT(gul.id) FILTER (WHERE gul.status = 'inactive') as inactive_users,
    (
        SELECT json_agg(
            json_build_object(
                'link_id', gul2.id,
                'user_id', p.id,
                'email', p.email,
                'full_name', p.full_name,
                'status', gul2.status,
                'linked_at', gul2.linked_at
            ) ORDER BY gul2.linked_at DESC
        )
        FROM gym_user_links gul2
        INNER JOIN profiles p ON gul2.user_id = p.id
        WHERE gul2.gym_id = g.id
    ) as users
FROM gyms g
LEFT JOIN gym_user_links gul ON g.id = gul.gym_id
WHERE g.id = 1  -- ID numérico
GROUP BY g.id;

-- ============================================
-- QUERIES DE MANUTENÇÃO
-- ============================================

-- 1. Verificar integridade dos dados
SELECT
    'Gyms without email' as issue,
    COUNT(*) as count
FROM gyms
WHERE email IS NULL OR email = ''
UNION ALL
SELECT
    'Links with invalid gym_id',
    COUNT(*)
FROM gym_user_links gul
LEFT JOIN gyms g ON gul.gym_id = g.id
WHERE g.id IS NULL
UNION ALL
SELECT
    'Links with invalid user_id',
    COUNT(*)
FROM gym_user_links gul
LEFT JOIN profiles p ON gul.user_id = p.id
WHERE p.id IS NULL;

-- 2. Limpar vínculos de usuários deletados
DELETE FROM gym_user_links
WHERE user_id NOT IN (SELECT id FROM profiles);

-- 3. Listar vínculos órfãos (sem usuário ou academia)
SELECT
    gul.*,
    CASE
        WHEN g.id IS NULL THEN 'Gym not found'
        WHEN p.id IS NULL THEN 'User not found'
        ELSE 'OK'
    END as status
FROM gym_user_links gul
LEFT JOIN gyms g ON gul.gym_id = g.id
LEFT JOIN profiles p ON gul.user_id = p.id
WHERE g.id IS NULL OR p.id IS NULL;

-- 4. Resetar sequence (CUIDADO! Use apenas se necessário)
-- ALTER SEQUENCE gyms_id_seq RESTART WITH 1;

-- 5. Ver informações da sequence
SELECT
    sequence_name,
    last_value,
    increment_by,
    max_value
FROM gyms_id_seq;

-- ============================================
-- QUERIES PARA API (retorno em JSON)
-- ============================================

-- 1. Endpoint: GET /gyms/:id/users
SELECT json_build_object(
    'gym_id', 1,
    'total', COUNT(*),
    'active', COUNT(*) FILTER (WHERE gul.status = 'active'),
    'inactive', COUNT(*) FILTER (WHERE gul.status = 'inactive'),
    'users', json_agg(
        json_build_object(
            'id', p.id,
            'email', p.email,
            'full_name', p.full_name,
            'status', gul.status,
            'linked_at', gul.linked_at
        ) ORDER BY gul.linked_at DESC
    )
) as response
FROM gym_user_links gul
INNER JOIN profiles p ON gul.user_id = p.id
WHERE gul.gym_id = 1;

-- 2. Endpoint: GET /gyms/:id/stats
SELECT json_build_object(
    'total_users', COUNT(*),
    'active_users', COUNT(*) FILTER (WHERE status = 'active'),
    'inactive_users', COUNT(*) FILTER (WHERE status = 'inactive')
) as response
FROM gym_user_links
WHERE gym_id = 1;

-- 3. Endpoint: GET /gyms/:id (detalhes completos)
SELECT row_to_json(g) as response
FROM gyms g
WHERE g.id = 1;
