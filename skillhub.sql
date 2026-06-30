-- =============================================================================
-- SkillHub — Ressource fournie aux étudiants pour l'épreuve EC04
-- Schéma relationnel + jeu de données minimal
-- =============================================================================
--
-- Compatible PostgreSQL 13+ et MariaDB 10.5+ / MySQL 8.0+
-- (utilise SQL standard, identifiants en minuscules, pas d'AUTO_INCREMENT
--  pour éviter les différences de syntaxe ; les IDs sont fournis explicitement)
--
-- Mot de passe en clair correspondant à tous les password_hash : Password123!
-- (hash bcrypt cost 12 — adapté pour tests, à NE PAS réutiliser en prod)
--
-- Charger le fichier :
--   PostgreSQL :  psql -U <user> -d skillhub -f skillhub.sql
--   MySQL/Maria : mysql -u <user> -p skillhub < skillhub.sql
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Nettoyage (utile si on recharge le fichier)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS workshops;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;

-- -----------------------------------------------------------------------------
-- Schéma
-- -----------------------------------------------------------------------------

-- Catégories d'ateliers
CREATE TABLE categories (
  id          INTEGER       PRIMARY KEY,
  name        VARCHAR(80)   NOT NULL UNIQUE,
  slug        VARCHAR(80)   NOT NULL UNIQUE,
  description VARCHAR(500)
);

-- Utilisateurs (apprenants, formateurs, admin)
CREATE TABLE users (
  id            INTEGER       PRIMARY KEY,
  email         VARCHAR(180)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  first_name    VARCHAR(80)   NOT NULL,
  last_name     VARCHAR(80)   NOT NULL,
  role          VARCHAR(20)   NOT NULL,
  bio           VARCHAR(500),
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_users_role CHECK (role IN ('learner', 'trainer', 'admin'))
);

-- Ateliers
CREATE TABLE workshops (
  id                INTEGER       PRIMARY KEY,
  title             VARCHAR(160)  NOT NULL,
  slug              VARCHAR(180)  NOT NULL UNIQUE,
  description       VARCHAR(1000),
  category_id       INTEGER       NOT NULL,
  trainer_id        INTEGER       NOT NULL,
  starts_at         TIMESTAMP     NOT NULL,
  duration_minutes  INTEGER       NOT NULL,
  max_participants  INTEGER       NOT NULL,
  price_cents       INTEGER       NOT NULL DEFAULT 0,
  created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_workshops_category FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT fk_workshops_trainer  FOREIGN KEY (trainer_id)  REFERENCES users(id),
  CONSTRAINT chk_workshops_duration CHECK (duration_minutes > 0),
  CONSTRAINT chk_workshops_capacity CHECK (max_participants > 0),
  CONSTRAINT chk_workshops_price    CHECK (price_cents >= 0)
);

-- Inscriptions des apprenants aux ateliers
CREATE TABLE registrations (
  id            INTEGER       PRIMARY KEY,
  user_id       INTEGER       NOT NULL,
  workshop_id   INTEGER       NOT NULL,
  status        VARCHAR(20)   NOT NULL DEFAULT 'confirmed',
  registered_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_registrations_user     FOREIGN KEY (user_id)     REFERENCES users(id),
  CONSTRAINT fk_registrations_workshop FOREIGN KEY (workshop_id) REFERENCES workshops(id),
  CONSTRAINT uq_registrations_user_ws  UNIQUE (user_id, workshop_id),
  CONSTRAINT chk_registrations_status  CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

-- Index utiles
CREATE INDEX idx_workshops_category ON workshops(category_id);
CREATE INDEX idx_workshops_trainer  ON workshops(trainer_id);
CREATE INDEX idx_workshops_starts   ON workshops(starts_at);
CREATE INDEX idx_registrations_user ON registrations(user_id);
CREATE INDEX idx_registrations_ws   ON registrations(workshop_id);

-- =============================================================================
-- Fixtures
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Catégories (10)
-- -----------------------------------------------------------------------------
INSERT INTO categories (id, name, slug, description) VALUES
  (1,  'Développement web',     'developpement-web',     'HTML, CSS, JavaScript et frameworks front/back.'),
  (2,  'Développement mobile',  'developpement-mobile',  'iOS, Android, frameworks cross-platform.'),
  (3,  'Design UX/UI',          'design-ux-ui',          'Wireframing, prototypage, design systems.'),
  (4,  'DevOps & Cloud',        'devops-cloud',          'CI/CD, conteneurs, infrastructure as code.'),
  (5,  'Data science',          'data-science',          'Python, analyse de données, visualisation.'),
  (6,  'Cybersécurité',         'cybersecurite',         'OWASP, audit, sécurité applicative.'),
  (7,  'IA & Machine Learning', 'ia-machine-learning',   'LLMs, modèles supervisés, outils pratiques.'),
  (8,  'Gestion de produit',    'gestion-de-produit',    'Product discovery, roadmap, priorisation.'),
  (9,  'Marketing digital',     'marketing-digital',     'SEO, contenu, acquisition.'),
  (10, 'Soft skills',           'soft-skills',           'Communication, animation, posture pro.');

-- -----------------------------------------------------------------------------
-- Utilisateurs (12 : 4 formateurs, 7 apprenants, 1 admin)
-- Tous les password_hash correspondent au mot de passe : Password123!
-- -----------------------------------------------------------------------------
INSERT INTO users (id, email, password_hash, first_name, last_name, role, bio) VALUES
  (1,  'marie.dubois@skillhub.test',   '$2b$12$dsQ6CWtE3D/vkvstt0uXFuv45NRBFyAKdpnKzTuBJ5Iv7gh9YhMuC', 'Marie',    'Dubois',   'trainer', 'Développeuse front-end senior, 8 ans d''expérience React/Vue.'),
  (2,  'thomas.martin@skillhub.test',  '$2b$12$dsQ6CWtE3D/vkvstt0uXFuv45NRBFyAKdpnKzTuBJ5Iv7gh9YhMuC', 'Thomas',   'Martin',   'trainer', 'Mobile et data : Flutter, Python, pipelines analytics.'),
  (3,  'sophie.bernard@skillhub.test', '$2b$12$dsQ6CWtE3D/vkvstt0uXFuv45NRBFyAKdpnKzTuBJ5Iv7gh9YhMuC', 'Sophie',   'Bernard',  'trainer', 'Designer produit et formatrice en sécurité applicative.'),
  (4,  'lucas.petit@skillhub.test',    '$2b$12$dsQ6CWtE3D/vkvstt0uXFuv45NRBFyAKdpnKzTuBJ5Iv7gh9YhMuC', 'Lucas',    'Petit',    'trainer', 'SRE et formateur DevOps : Docker, Kubernetes, CI/CD.'),
  (5,  'emma.leroy@skillhub.test',     '$2b$12$dsQ6CWtE3D/vkvstt0uXFuv45NRBFyAKdpnKzTuBJ5Iv7gh9YhMuC', 'Emma',     'Leroy',    'learner', 'Étudiante en reconversion vers le front-end.'),
  (6,  'hugo.moreau@skillhub.test',    '$2b$12$dsQ6CWtE3D/vkvstt0uXFuv45NRBFyAKdpnKzTuBJ5Iv7gh9YhMuC', 'Hugo',     'Moreau',   'learner', 'Développeur junior, intéressé par le mobile.'),
  (7,  'lea.garcia@skillhub.test',     '$2b$12$dsQ6CWtE3D/vkvstt0uXFuv45NRBFyAKdpnKzTuBJ5Iv7gh9YhMuC', 'Léa',      'Garcia',   'learner', 'Designer junior souhaitant monter en compétence sur Figma.'),
  (8,  'nathan.roux@skillhub.test',    '$2b$12$dsQ6CWtE3D/vkvstt0uXFuv45NRBFyAKdpnKzTuBJ5Iv7gh9YhMuC', 'Nathan',   'Roux',     'learner', 'Admin sys curieux de DevOps.'),
  (9,  'chloe.fournier@skillhub.test', '$2b$12$dsQ6CWtE3D/vkvstt0uXFuv45NRBFyAKdpnKzTuBJ5Iv7gh9YhMuC', 'Chloé',    'Fournier', 'learner', 'Analyste data en transition vers la dev.'),
  (10, 'jules.lambert@skillhub.test',  '$2b$12$dsQ6CWtE3D/vkvstt0uXFuv45NRBFyAKdpnKzTuBJ5Iv7gh9YhMuC', 'Jules',    'Lambert',  'learner', 'Étudiant en informatique, intéressé par l''IA.'),
  (11, 'ines.bonnet@skillhub.test',    '$2b$12$dsQ6CWtE3D/vkvstt0uXFuv45NRBFyAKdpnKzTuBJ5Iv7gh9YhMuC', 'Inès',     'Bonnet',   'learner', 'PM junior, veut comprendre la tech.'),
  (12, 'admin@skillhub.test',          '$2b$12$dsQ6CWtE3D/vkvstt0uXFuv45NRBFyAKdpnKzTuBJ5Iv7gh9YhMuC', 'Admin',    'SkillHub', 'admin',   'Compte administrateur de la plateforme.');

-- -----------------------------------------------------------------------------
-- Ateliers (10)
-- -----------------------------------------------------------------------------
INSERT INTO workshops (id, title, slug, description, category_id, trainer_id, starts_at, duration_minutes, max_participants, price_cents) VALUES
  (1,  'Introduction à React 18',           'introduction-react-18',           'Composants, hooks de base, et premier projet en autonomie.',                1, 1, '2026-06-15 14:00:00', 180, 12, 7900),
  (2,  'Maîtriser Tailwind CSS',            'maitriser-tailwind-css',          'Utility-first, configuration, et stratégies de design system.',            1, 1, '2026-06-22 10:00:00', 120, 15, 5900),
  (3,  'Flutter pour débutants',            'flutter-pour-debutants',          'Mise en place du SDK, widgets, et première app multi-écran.',              2, 2, '2026-07-03 09:30:00', 240, 10, 9900),
  (4,  'Figma : du wireframe au prototype', 'figma-wireframe-prototype',       'Wireframes basse fidélité, composants, et prototypage interactif.',        3, 3, '2026-06-10 14:00:00', 180, 20, 6900),
  (5,  'Docker & Docker Compose',           'docker-et-docker-compose',        'Conteneurs, images, et orchestration locale multi-services.',              4, 4, '2026-06-18 13:30:00', 180, 12, 8900),
  (6,  'GitHub Actions : CI/CD pratique',   'github-actions-cicd',             'Pipelines de tests, build et déploiement automatisés.',                    4, 4, '2026-07-08 10:00:00', 150, 12, 7900),
  (7,  'Initiation à Python pour la data',  'initiation-python-data',          'Pandas, manipulation de DataFrames, et premières visualisations.',         5, 2, '2026-06-25 09:00:00', 240, 15, 8900),
  (8,  'Sécurité OWASP Top 10',             'securite-owasp-top-10',           'Panorama des 10 risques majeurs et démos de remédiation.',                 6, 3, '2026-07-15 14:00:00', 180, 15, 7900),
  (9,  'Prompt engineering avec les LLMs',  'prompt-engineering-llms',         'Anatomie d''un prompt efficace, few-shot, et bonnes pratiques.',           7, 1, '2026-07-22 16:00:00', 120, 20, 5900),
  (10, 'Animer un atelier en présentiel',   'animer-atelier-presentiel',       'Cadrage, posture, et techniques d''animation participatives.',            10, 3, '2026-06-29 18:00:00',  90, 25, 3900);

-- -----------------------------------------------------------------------------
-- Inscriptions (12) — mix de statuts
-- -----------------------------------------------------------------------------
INSERT INTO registrations (id, user_id, workshop_id, status, registered_at) VALUES
  (1,  5,  1,  'confirmed', '2026-05-20 10:15:00'),
  (2,  5,  4,  'confirmed', '2026-05-22 11:30:00'),
  (3,  6,  3,  'confirmed', '2026-05-25 14:05:00'),
  (4,  6,  5,  'pending',   '2026-06-01 09:42:00'),
  (5,  7,  4,  'confirmed', '2026-05-18 16:20:00'),
  (6,  7,  10, 'confirmed', '2026-06-02 13:00:00'),
  (7,  8,  5,  'confirmed', '2026-05-29 17:10:00'),
  (8,  8,  6,  'confirmed', '2026-06-03 12:45:00'),
  (9,  9,  7,  'confirmed', '2026-05-26 08:55:00'),
  (10, 10, 9,  'pending',   '2026-06-04 19:30:00'),
  (11, 10, 1,  'cancelled', '2026-05-21 15:00:00'),
  (12, 11, 8,  'confirmed', '2026-05-30 11:11:00');

-- =============================================================================
-- Notes pour les étudiants
-- =============================================================================
-- 1. Si vous utilisez PostgreSQL et que vous ajoutez des lignes via votre ORM,
--    pensez à synchroniser les séquences si vous avez transformé les colonnes
--    id en SERIAL / GENERATED. Sinon, gérez les IDs manuellement.
--
-- 2. Vous pouvez enrichir ce schéma si votre conception l'exige (colonnes
--    supplémentaires, table de catégorisation fine, etc.) — pensez à le
--    mentionner dans le rapport.
--
-- 3. password_hash : bcrypt cost 12 pour "Password123!". Lors de l'inscription
--    via votre endpoint /api/auth/register, vous devez générer vos propres
--    hashes côté serveur. Le hash en clair ci-dessus n'est là que pour vous
--    permettre de tester /api/auth/login avec un compte existant.
