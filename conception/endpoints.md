# Endpoints - API SkillHub

Liste des endpoints exposés par l'API pour répondre aux besoins de la plateforme (création de compte, authentification, gestion des ateliers et inscriptions).

| Méthode | Chemin | Description | Code Normal | Codes d'Erreur | Autorisation Requise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Création d'un compte utilisateur | 201 | 400 (Validation), 409 (Email existant) | Anonyme |
| **POST** | `/api/auth/login` | Authentification, retour d'un token JWT | 200 | 400 (Validation), 401 (Identifiants invalides) | Anonyme |
| **GET** | `/api/workshops` | Liste des ateliers (avec options de pagination/filtres) | 200 | 400 (Paramètres invalides) | Anonyme |
| **GET** | `/api/workshops/{id}/participants` | Liste des utilisateurs inscrits à un atelier | 200 | 401 (Non authentifié), 403 (Non autorisé), 404 (Atelier introuvable) | Formateur |
| **PATCH**| `/api/enrollments/{id}/cancel` | Annulation d'une inscription par l'apprenant | 200 | 400 (Validation/Statut), 401 (Non authentifié), 403 (Non autorisé), 404 (Inscription introuvable) | Apprenant |
