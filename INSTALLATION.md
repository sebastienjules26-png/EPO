# EPO — Application pour Android et iPad

Ce dossier contient la version installable de l’application EPO, avec le suivi compact.
Elle se publie sur un hébergement HTTPS tel que GitHub Pages. Ce n’est pas un fichier APK ni une application de l’App Store.

## Avant publication

La configuration Firebase de l’application d’origine est conservée. Les évaluations restent dans Firebase ; aucune évaluation ni sauvegarde nominative n’est incluse dans ce dossier.
Le code actuel n’a pas d’authentification utilisateur. Vérifier les règles Firestore et l’autorisation de diffusion avant de publier cette application. Une adresse GitHub Pages n’est pas un contrôle d’accès : l’interface publiée peut être accessible publiquement. Ne pas ouvrir les règles Firestore à tous pour résoudre une erreur de connexion.

## Publication avec GitHub Pages

1. Créer ou choisir le dépôt GitHub destiné à EPO.
2. Téléverser le CONTENU de ce dossier à la racine du dépôt : index.html, install.js, sw.js, manifest.webmanifest, le dossier icons et .nojekyll. Ne pas téléverser uniquement le ZIP.
3. Dans Settings → Pages → Build and deployment, choisir « Deploy from a branch », puis la branche main et le dossier / (root). Enregistrer.
4. Attendre la publication et ouvrir le lien HTTPS affiché par GitHub Pages. La disponibilité de Pages dépend du forfait et de la visibilité du dépôt.
5. Vérifier sur un appareil d’essai : chargement, état Firebase, préparation d’une évaluation et reprise d’un brouillon. Ne pas créer de fausse évaluation dans la base de production.

Les chemins sont relatifs : le dossier fonctionne aussi sous https://COMPTE.github.io/NOM-DU-DEPOT/ sans modifier les fichiers.

## Installer sur Android

Ouvrir le lien HTTPS dans Chrome. Appuyer sur « Installer EPO » dans l’accueil, ou utiliser le menu ⋮ → Installer l’application / Ajouter à l’écran d’accueil. Lancer ensuite EPO depuis son icône.

## Installer sur iPad

Ouvrir le lien HTTPS dans Safari. Partager → Sur l’écran d’accueil → Ajouter. Si disponible, activer « Ouvrir comme app web ». Lancer EPO depuis son icône.

Une politique de gestion des tablettes peut interdire cette installation : dans ce cas, l’administrateur doit l’autoriser.

## Données et connexion

- Faire une première ouverture avec Internet et laisser le chargement terminer avant de travailler hors ligne.
- L’interface est mise en cache ; les bibliothèques Firebase et Excel sont également mises en cache si leur téléchargement réussit. Un CDN bloqué peut limiter les fonctions hors ligne.
- Les mécanismes existants de brouillon local, cache Firebase et file d’attente sont conservés. La synchronisation entre tablettes nécessite Internet.
- Un appareil hors ligne ne dispose pas forcément de toutes les évaluations des autres appareils. Contrôler l’indicateur de synchronisation avant de fermer ou d’effacer les données.
- Les brouillons du fichier HTML local, du site et de l’application installée ne sont pas forcément partagés. Terminer/synchroniser le travail avant de changer de mode d’ouverture.
- Supprimer les données du navigateur ou désinstaller peut supprimer les données locales non synchronisées.

## Mises à jour

Remplacer les fichiers du dépôt. À CHAQUE version, changer VERSION dans sw.js (par exemple epo-tablettes-v2). La nouvelle version se prépare en arrière-plan ; aucun rechargement automatique n’interrompt l’évaluation.
Quand une mise à jour est annoncée, enregistrer le travail, fermer toutes les fenêtres EPO puis rouvrir. Conserver l’URL et le chemin du dépôt pour garder la même identité d’installation.

## Vérifications réalisées

Syntaxe JavaScript, manifeste et présence des ressources locales ; simulation du cache et des requêtes du service worker. Installation réelle Android/iPad, synchronisation Firebase et rendu visuel sur appareil non vérifiés dans cet environnement.

## Références

- https://web.dev/learn/pwa/installation
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
