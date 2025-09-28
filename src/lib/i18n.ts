import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      "nav.spaces": "Spaces",
      "nav.dashboard": "Dashboard", 
      "nav.create": "Create Space",
      "nav.organizations": "Organizations",
      "nav.notifications": "Notifications",
      "nav.profile": "Profile",
      "nav.settings": "Settings",
      "nav.logout": "Logout",
      "nav.login": "Sign In",
      "nav.signup": "Get Started",
      
      // Landing Page - Hero
      "landing.hero.badge": "✨ Next-Gen AI Workspaces",
      "landing.hero.title": "Transform Your",
      "landing.hero.subtitle1": "Documents Into",
      "landing.hero.subtitle2": "Intelligent Workspaces",
      "landing.hero.description": "Tenezis Spaces revolutionizes document management with AI. Collaborate, analyze, and leverage your knowledge like never before with our advanced platform.",
      "landing.hero.cta": "Start Free Today",
      "landing.hero.demo": "Watch Demo",
      "landing.hero.free": "Free to start",
      "landing.hero.nocard": "No credit card required",
      "landing.hero.setup": "2-minute setup",
      "landing.hero.trusted": "Trusted by 10,000+ teams worldwide",
      "landing.hero.image.alt": "Modern Tenezis Spaces AI Platform Interface",
      
      // Features - Value Proposition
      "features.badge": "See how it works in 60 seconds",
      "features.title": "Multi-format documents",
      "features.subtitle": "Upload PDF, Word, Excel, PPT, or URLs (up to 50MB).",
      "features.ai.title": "📄 Multi-format documents",
      "features.ai.desc": "Upload PDF, Word, Excel, PPT, or URLs (up to 50MB).",
      "features.docs.title": "🔍 AI-powered Q&A",
      "features.docs.desc": "Ask questions directly from your documents.",
      "features.teams.title": "👥 Collaborative spaces", 
      "features.teams.desc": "Work with your team or organization in real-time.",
      "features.analytics.title": "📊 Analytics & insights",
      "features.analytics.desc": "Track usage, queries, and engagement.",
      
      // Features Deep Dive
      "features.deep.title": "Powerful Features",
      "features.deep.subtitle": "Everything you need for intelligent collaboration",
      "features.deep.upload.title": "📄 Upload & organize documents easily",
      "features.deep.upload.desc": "Support for all major document formats with intelligent parsing",
      "features.deep.ai.title": "🤖 Choose your preferred AI models",
      "features.deep.ai.desc": "Multiple AI models available with transparent token cost display",
      "features.deep.team.title": "👥 Manage members, roles, and organizations",
      "features.deep.team.desc": "Complete team management with granular permissions",
      "features.deep.analytics.title": "📊 Dashboards for analytics and reporting",
      "features.deep.analytics.desc": "Comprehensive insights into usage and performance",
      "features.deep.notifications.title": "🔔 Smart notifications & invitations",
      "features.deep.notifications.desc": "Stay informed with intelligent notification system",
      "features.deep.deletion.title": "🗑️ Deferred space deletion",
      "features.deep.deletion.desc": "Recover deleted spaces within 30 days",
      
      // Social Proof
      "social.badge": "Trusted by learners, teams, and organizations worldwide",
      "social.testimonial1": "Tenezis changed the way my team studies research papers.",
      "social.testimonial1.author": "University Student",
      "social.testimonial2": "We collaborate smarter, not harder.",
      "social.testimonial2.author": "Startup Founder",
      
      // Pricing
      "pricing.badge": "Simple, transparent pricing",
      "pricing.title": "Choose your plan",
      "pricing.free.title": "Free",
      "pricing.free.desc": "Limited spaces, 3 docs per space, 50 queries/month",
      "pricing.pro.title": "Pro", 
      "pricing.pro.desc": "Unlimited spaces, larger uploads, advanced analytics",
      "pricing.org.title": "Organization",
      "pricing.org.desc": "Shared token pool, team management, dedicated support",
      
      // Final CTA
      "cta.title": "Join thousands already learning and working smarter",
      "cta.subtitle": "Start your intelligent workspace today",
      "cta.button": "Start free today",
      
      // Footer
      "footer.product": "Product",
      "footer.pricing": "Pricing", 
      "footer.blog": "Blog",
      "footer.docs": "Docs",
      "footer.contact": "Contact",
      "footer.privacy": "Privacy Policy",
      "footer.terms": "Terms of Service",
      "footer.support": "Support",
      
      // Demo
      "demo.badge": "Interactive Demo",
      "demo.title": "See Tenezis Spaces",
      "demo.subtitle": "in Action",
      "demo.description": "Discover how our AI-powered platform transforms team collaboration and document management.",
      "demo.cta": "Start Free Trial",
      "demo.back": "Back to Home",
      "demo.chat.title": "AI Chat Interface",
      "demo.chat.desc": "Experience natural conversations with your documents",
      "demo.docs.title": "Smart Document Hub",
      "demo.docs.desc": "Upload, organize, and search through your knowledge base",
      "demo.collab.title": "Team Collaboration",
      "demo.collab.desc": "Share insights and work together seamlessly",
      "demo.coming.title": "Interactive Demo Coming Soon",
      "demo.coming.desc": "We're building an amazing interactive experience to showcase all features.",
      "demo.coming.cta": "Get Early Access",
      
      // Spaces
      "spaces.create": "Create New Space",
      "spaces.name": "Space Name",
      "spaces.description": "Description",
      "spaces.category": "Category",
      "spaces.tags": "Tags",
      "spaces.visibility": "Visibility",
      "spaces.public": "Public",
      "spaces.private": "Private",
      "spaces.model": "AI Model",
      "spaces.instructions": "Instructions",
      "spaces.create.success": "Space created successfully",
      
      // Documents
      "docs.upload": "Upload Documents",
      "docs.drag": "Drag & drop your files",
      "docs.select": "Select Files",
      "docs.url": "Add from URL",
      "docs.supported": "Supported Formats",
      "docs.maxsize": "Maximum file size: 50MB per file",
      "docs.progress": "Upload Progress",
      "docs.completed": "completed",
      "docs.added": "Added to knowledge base",
      
      // Chat
      "chat.placeholder": "Ask me anything about the documents in this space...",
      "chat.send": "Send",
      "chat.thinking": "AI is thinking...",
      "chat.error": "Something went wrong. Please try again.",
      "chat.history": "Chat History",
      "chat.new": "New Conversation",
      
      // Organizations
      "org.create": "Create Organization",
      "org.manage": "Manage Organization", 
      "org.members": "Members",
      "org.spaces": "Organization Spaces",
      "org.invite": "Invite Members",
      "org.settings": "Settings",
      "org.stats": "Usage Statistics",
      
      // Common
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.share": "Share",
      "common.copy": "Copy",
      "common.loading": "Loading...",
      "common.error": "Error",
      "common.success": "Success",
    }
  },
  fr: {
    translation: {
      // Navigation  
      "nav.spaces": "Espaces",
      "nav.dashboard": "Tableau de bord",
      "nav.create": "Créer un Espace",
      "nav.organizations": "Organisations", 
      "nav.notifications": "Notifications",
      "nav.profile": "Profil",
      "nav.settings": "Paramètres",
      "nav.logout": "Déconnexion",
      "nav.login": "Se Connecter",
      "nav.signup": "Commencer",
      
      // Landing Page - Hero 
      "landing.hero.badge": "✨ Espaces de Travail IA Nouvelle Génération",
      "landing.hero.title": "Transformez Vos",
      "landing.hero.subtitle1": "Documents En",
      "landing.hero.subtitle2": "Espaces Intelligents",
      "landing.hero.description": "Tenezis Spaces révolutionne la gestion documentaire avec l'IA. Collaborez, analysez et exploitez vos connaissances comme jamais auparavant avec notre plateforme avancée.",
      "landing.hero.cta": "Commencer Gratuitement",
      "landing.hero.demo": "Voir la Démo",
      "landing.hero.free": "Gratuit pour commencer",
      "landing.hero.nocard": "Aucune carte de crédit requise",
      "landing.hero.setup": "Configuration en 2 minutes",
      "landing.hero.trusted": "Approuvé par plus de 10 000 équipes dans le monde",
      "landing.hero.image.alt": "Interface Moderne de la Plateforme IA Tenezis Spaces",
      
      // Features - Value Proposition
      "features.badge": "Découvrez comment ça marche en 60 secondes",
      "features.title": "Documents multi-formats",
      "features.subtitle": "Importez PDF, Word, Excel, PPT ou URLs (jusqu'à 50 Mo).",
      "features.ai.title": "📄 Documents multi-formats",
      "features.ai.desc": "Importez PDF, Word, Excel, PPT ou URLs (jusqu'à 50 Mo).",
      "features.docs.title": "🔍 Questions intelligentes",
      "features.docs.desc": "Posez vos questions directement à partir de vos documents.",
      "features.teams.title": "👥 Espaces collaboratifs",
      "features.teams.desc": "Travaillez avec votre équipe ou organisation en temps réel.",
      "features.analytics.title": "📊 Analyses & insights",
      "features.analytics.desc": "Suivez l'usage, les requêtes et l'engagement.",
      
      // Features Deep Dive
      "features.deep.title": "Fonctionnalités Puissantes", 
      "features.deep.subtitle": "Tout ce dont vous avez besoin pour une collaboration intelligente",
      "features.deep.upload.title": "📄 Importez & organisez vos documents facilement",
      "features.deep.upload.desc": "Support de tous les formats de documents majeurs avec parsing intelligent",
      "features.deep.ai.title": "🤖 Choisissez vos modèles IA préférés",
      "features.deep.ai.desc": "Plusieurs modèles d'IA disponibles avec affichage transparent du coût par token",
      "features.deep.team.title": "👥 Gérez les membres, rôles et organisations",
      "features.deep.team.desc": "Gestion d'équipe complète avec permissions granulaires",
      "features.deep.analytics.title": "📊 Tableaux de bord pour analyses et rapports",
      "features.deep.analytics.desc": "Insights complets sur l'utilisation et les performances",
      "features.deep.notifications.title": "🔔 Notifications & invitations intelligentes",
      "features.deep.notifications.desc": "Restez informé avec un système de notifications intelligent",
      "features.deep.deletion.title": "🗑️ Suppression différée des espaces",
      "features.deep.deletion.desc": "Récupération des espaces supprimés sous 30 jours",
      
      // Social Proof
      "social.badge": "Adopté par des apprenants, des équipes et des organisations dans le monde entier",
      "social.testimonial1": "Tenezis a changé la façon dont mon équipe étudie les articles de recherche.",
      "social.testimonial1.author": "Étudiant",
      "social.testimonial2": "Nous collaborons plus intelligemment, pas plus difficilement.",
      "social.testimonial2.author": "Fondateur de startup",
      
      // Pricing
      "pricing.badge": "Des tarifs simples et transparents",
      "pricing.title": "Choisissez votre plan",
      "pricing.free.title": "Gratuit",
      "pricing.free.desc": "Espaces limités, 3 docs/space, 50 requêtes/mois",
      "pricing.pro.title": "Pro",
      "pricing.pro.desc": "Espaces illimités, imports plus volumineux, analyses avancées",
      "pricing.org.title": "Organisation",
      "pricing.org.desc": "Pool de tokens partagé, gestion d'équipe, support dédié",
      
      // Final CTA
      "cta.title": "Rejoignez des milliers d'utilisateurs qui apprennent et travaillent déjà plus intelligemment",
      "cta.subtitle": "Commencez votre espace de travail intelligent aujourd'hui",
      "cta.button": "Commencez gratuitement dès aujourd'hui",
      
      // Footer
      "footer.product": "Produit",
      "footer.pricing": "Tarifs",
      "footer.blog": "Blog", 
      "footer.docs": "Docs",
      "footer.contact": "Contact",
      "footer.privacy": "Politique de confidentialité",
      "footer.terms": "Conditions d'utilisation",
      "footer.support": "Support",
      
      // Demo
      "demo.badge": "Démo Interactive",
      "demo.title": "Voir Tenezis Spaces",
      "demo.subtitle": "en Action",
      "demo.description": "Découvrez comment notre plateforme alimentée par l'IA transforme la collaboration d'équipe et la gestion documentaire.",
      "demo.cta": "Essai Gratuit",
      "demo.back": "Retour à l'accueil",
      "demo.chat.title": "Interface de Chat IA",
      "demo.chat.desc": "Expérimentez des conversations naturelles avec vos documents",
      "demo.docs.title": "Hub de Documents Intelligents",
      "demo.docs.desc": "Téléchargez, organisez et recherchez dans votre base de connaissances",
      "demo.collab.title": "Collaboration d'Équipe",
      "demo.collab.desc": "Partagez des insights et travaillez ensemble facilement",
      "demo.coming.title": "Démo Interactive Bientôt Disponible",
      "demo.coming.desc": "Nous construisons une expérience interactive incroyable pour présenter toutes les fonctionnalités.",
      "demo.coming.cta": "Accès Anticipé",
      
      // Spaces
      "spaces.create": "Créer un Nouvel Espace",
      "spaces.name": "Nom de l'Espace",
      "spaces.description": "Description",
      "spaces.category": "Catégorie",
      "spaces.tags": "Tags",
      "spaces.visibility": "Visibilité",
      "spaces.public": "Public",
      "spaces.private": "Privé",
      "spaces.model": "Modèle IA",
      "spaces.instructions": "Instructions",
      "spaces.create.success": "Espace créé avec succès",
      "spaces.search": "Rechercher des espaces...",
      "spaces.filter": "Filtrer",
      "spaces.mySpaces": "Mes espaces",
      "spaces.publicSpaces": "Espaces publics",
      "spaces.recentActivity": "Activité récente",
      "spaces.totalSpaces": "Espaces totaux",
      "spaces.publicCount": "Espaces publics",
      "spaces.privateCount": "Espaces privés",
      "spaces.totalMessages": "Messages totaux",
      "spaces.noSpacesFound": "Aucun espace trouvé",
      "spaces.noSpacesYet": "Pas encore d'espaces",
      "spaces.tryAdjusting": "Essayez d'ajuster vos termes de recherche",
      "spaces.createFirst": "Créez votre premier espace pour commencer la collaboration alimentée par l'IA",
      "spaces.discoverPublic": "Découvrir les espaces publics",
      "spaces.explorePublic": "Explorez les espaces publics créés par la communauté. Rejoignez les conversations et collaborez sur des sujets intéressants.",
      "spaces.viewRecent": "Voir l'activité récente",
      "spaces.recentInteractions": "Voir vos interactions récentes dans tous les espaces.",
      "spaces.manageWorkspaces": "Gérez et explorez vos espaces de travail intelligents",
      "spaces.backToSpaces": "Retour aux espaces",
      
      // Documents
      "docs.upload": "Télécharger des Documents",
      "docs.drag": "Glissez et déposez vos fichiers",
      "docs.select": "Sélectionner des Fichiers",
      "docs.url": "Ajouter depuis une URL",
      "docs.supported": "Formats Supportés",
      "docs.maxsize": "Taille maximale de fichier : 50MB par fichier",
      "docs.progress": "Progression du Téléchargement",
      "docs.completed": "terminé",
      "docs.added": "Ajouté à la base de connaissances",
      
      // Chat
      "chat.placeholder": "Demandez-moi tout ce que vous voulez savoir sur les documents de cet espace...",
      "chat.send": "Envoyer",
      "chat.thinking": "L'IA réfléchit...",
      "chat.error": "Quelque chose s'est mal passé. Veuillez réessayer.",
      "chat.history": "Historique des Conversations",
      "chat.new": "Nouvelle Conversation",
      "chat.welcome": "Bienvenue dans",
      "chat.startConversation": "Commencez une conversation avec l'IA sur les documents de cet espace. Posez des questions, demandez des résumés ou explorez des insights.",
      "chat.responseGenerated": "Réponse générée",
      "chat.aiAnalyzed": "L'IA a analysé vos documents et fourni une réponse.",
      "chat.sources": "Sources :",
      "chat.recentConversations": "Conversations récentes",
      "chat.chatHistory": "Votre historique de chat apparaîtra ici. Commencez une conversation pour voir les discussions précédentes avec l'IA sur les documents de cet espace.",
      "chat.documents": "Documents",
      "chat.members": "Membres",
      "chat.team": "Équipe",
      "chat.settings": "Paramètres",
      "chat.invite": "Inviter",
      "chat.add": "Ajouter",

      // Organizations
      "org.create": "Créer une Organisation",
      "org.manage": "Gérer l'Organisation",
      "org.members": "Membres",
      "org.spaces": "Espaces de l'Organisation",
      "org.invite": "Inviter des Membres",
      "org.settings": "Paramètres",
      "org.stats": "Statistiques d'Utilisation",
      "common.cancel": "Annuler",
      "common.delete": "Supprimer",
      "common.edit": "Modifier",
      "common.share": "Partager",
      "common.copy": "Copier",
      "common.loading": "Chargement...",
      "common.error": "Erreur",
      "common.success": "Succès",
    }
  },
  es: {
    translation: {
      // Navigation
      "nav.spaces": "Espacios",
      "nav.dashboard": "Panel de Control",
      "nav.create": "Crear Espacio",
      "nav.organizations": "Organizaciones",
      "nav.notifications": "Notificaciones",
      "nav.profile": "Perfil",
      "nav.settings": "Configuración",
      "nav.logout": "Cerrar Sesión",
      "nav.login": "Iniciar Sesión",
      "nav.signup": "Empezar",
      
      // Landing Page
      "landing.hero.badge": "✨ Espacios de Trabajo IA Nueva Generación",
      "landing.hero.title": "Transforma Tus",
      "landing.hero.subtitle1": "Documentos En",
      "landing.hero.subtitle2": "Espacios Inteligentes",
      "landing.hero.description": "Tenezis Spaces revoluciona la gestión de documentos con IA. Colabora, analiza y aprovecha tu conocimiento como nunca antes con nuestra plataforma avanzada.",
      "landing.hero.cta": "Comenzar Gratis Hoy",
      "landing.hero.demo": "Ver Demo",
      "landing.hero.free": "Gratis para empezar",
      "landing.hero.nocard": "No se requiere tarjeta de crédito",
      "landing.hero.setup": "Configuración en 2 minutos",
      "landing.hero.trusted": "Confiado por más de 10,000 equipos en todo el mundo",
      "landing.hero.image.alt": "Interfaz Moderna de la Plataforma IA Tenezis Spaces",
      
      // Features
      "features.badge": "Características Poderosas",
      "features.title": "Todo lo que necesitas para colaboración inteligente",
      "features.subtitle": "Desde insights potenciados por IA hasta gestión fluida de documentos, Tenezis Spaces proporciona todas las herramientas que tu equipo necesita para trabajar más inteligentemente.",
      "features.ai.title": "Insights Potenciados por IA",
      "features.ai.desc": "Chatea con múltiples modelos de IA, obtén resúmenes inteligentes y recibe recomendaciones conscientes del contexto basadas en la base de conocimientos de tu equipo.",
      "features.docs.title": "Hub de Documentos Inteligente",
      "features.docs.desc": "Sube, organiza y comparte documentos con análisis inteligente. La IA entiende tu contenido y lo hace consultable y accionable.",
      "features.teams.title": "Colaboración en Equipo",
      "features.teams.desc": "Crea espacios públicos y privados, gestiona permisos y colabora sin problemas con miembros del equipo y socios externos.",
      
      // Benefits
      "benefits.badge": "Por Qué Elegir Tenezis Spaces",
      "benefits.title": "Construido para el futuro del trabajo",
      "benefits.subtitle": "Nuestra plataforma combina el poder de la IA con herramientas de colaboración intuitivas, haciendo más fácil que nunca gestionar conocimiento y trabajar juntos efectivamente.",
      "benefits.speed.title": "IA Súper Rápida",
      "benefits.speed.desc": "Obtén respuestas instantáneas de múltiples modelos de IA con contexto de la base de conocimientos de tu equipo.",
      "benefits.security.title": "Seguridad Empresarial",
      "benefits.security.desc": "Tus datos están protegidos con seguridad de nivel empresarial y controles de privacidad.",
      "benefits.global.title": "Accesibilidad Global",
      "benefits.global.desc": "Accede a tus espacios desde cualquier lugar con soporte móvil completo y capacidades fuera de línea.",
      
      // CTA
      "cta.title": "¿Listo para empezar?",
      "cta.subtitle": "Únete a miles de equipos que ya usan Tenezis Spaces para trabajar más inteligentemente.",
      "cta.button": "Comenzar Tu Prueba Gratuita",
      
      // Footer
      "footer.privacy": "Privacidad",
      "footer.terms": "Términos",
      "footer.support": "Soporte",
      
      // Demo
      "demo.badge": "Demo Interactiva",
      "demo.title": "Ve Tenezis Spaces",
      "demo.subtitle": "en Acción",
      "demo.description": "Descubre cómo nuestra plataforma potenciada por IA transforma la colaboración en equipo y la gestión de documentos.",
      "demo.cta": "Prueba Gratuita",
      "demo.back": "Volver al Inicio",
      "demo.chat.title": "Interfaz de Chat IA",
      "demo.chat.desc": "Experimenta conversaciones naturales con tus documentos",
      "demo.docs.title": "Hub de Documentos Inteligente",
      "demo.docs.desc": "Sube, organiza y busca en tu base de conocimientos",
      "demo.collab.title": "Colaboración en Equipo",
      "demo.collab.desc": "Comparte insights y trabaja junto de manera fluida",
      "demo.coming.title": "Demo Interactiva Próximamente",
      "demo.coming.desc": "Estamos construyendo una experiencia interactiva increíble para mostrar todas las características.",
      "demo.coming.cta": "Acceso Temprano",
      
      // Rest of translations...
      "spaces.create": "Crear Nuevo Espacio",
      "docs.upload": "Subir Documentos",
      "chat.placeholder": "Pregúntame cualquier cosa sobre los documentos en este espacio...",
      "org.create": "Crear Organización",
      "common.save": "Guardar",
      "common.cancel": "Cancelar",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;