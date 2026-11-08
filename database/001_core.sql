BEGIN;

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'active', 'suspended')),
    email_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_unique
ON public.users (LOWER(email));

CREATE TABLE IF NOT EXISTS public.roles (
    id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(150)
);

INSERT INTO public.roles (code, description)
VALUES
    ('owner', 'Proprietaire de l'espace'),
    ('admin', 'Administrateur'),
    ('manager', 'Gestionnaire'),
    ('member', 'Membre'),
    ('client', 'Client')
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    owner_user_id UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id)
        ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id)
        ON DELETE CASCADE,
    role_id SMALLINT NOT NULL REFERENCES public.roles(id),
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('invited', 'active', 'suspended')),
    invited_by UUID REFERENCES public.users(id),
    joined_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (workspace_id, user_id)
);

CREATE INDEX IF NOT EXISTS workspace_members_user_idx
ON public.workspace_members(user_id);

COMMIT;

