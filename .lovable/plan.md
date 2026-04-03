## Plan d'implémentation - Système de Spaces complet

### Phase 1 : Base de données et authentification
1. **Tables Supabase** : `profiles`, `spaces`, `space_members`, `documents`, `document_chunks` (vectorisation), `messages` (chat IA), `team_messages` (chat équipe)
2. **Authentification** : Migrer de localStorage vers Supabase Auth (email, Google, Apple)
3. **RLS policies** : Sécuriser toutes les tables

### Phase 2 : Gestion des spaces
4. **CRUD Spaces** : Créer, lire, modifier, supprimer des spaces via Supabase
5. **Membres** : Rejoindre/quitter un space, invitations, rôles
6. **Navigation** : Sidebar fonctionnelle avec switch entre spaces en temps réel

### Phase 3 : Documents et RAG
7. **Upload de documents** : Stockage dans Supabase Storage
8. **Edge function `process-document`** : Extraction de texte, chunking, génération d'embeddings via Lovable AI
9. **Table `document_chunks`** avec colonne vector pour pgvector
10. **Edge function `chat`** : Recherche sémantique dans les chunks + réponse contextuelle via LLM

### Phase 4 : Chat et collaboration
11. **Chat IA** : Messages persistants, streaming des réponses, sources des documents
12. **Chat d'équipe** : Messages entre membres en temps réel via Supabase Realtime
13. **UI unifiée** : Onglets pour basculer entre chat IA et chat équipe

### Phase 5 : Traductions et finitions
14. **i18n complet** : Toutes les nouvelles clés traduites FR/EN
15. **UX** : Transitions fluides, loading states, notifications