# SSUAP et synthèse globale

## Utilisation

- SSUAP → Évaluation : date et CS repris de l’accueil, puis évaluateur, cas concret, un chef d’agrès et deux équipiers. Grade et nom, ancienneté générale, indicateur moins d’un an et ancienneté CA suivent le format INC. Aucun champ matricule. Une modification conserve la session de l’évaluation enregistrée.
- Passer d’un personnel à l’autre avec les trois boutons. Chaque capacité se note en un appui ; les observations se déplient si nécessaire.
- Renseigner le signalement d’un geste dangereux pour chaque personnel, avec justification obligatoire si oui.
- Enregistrer une fois pour les trois personnels, puis consulter ou imprimer leur bilan. Un nouvel appui enregistre une modification de la même manœuvre, sans créer de doublon.
- SSUAP → Suivi : recherche (nom, CS, évaluateur, cas), filtres par dates, centre, fonction, note, vigilance ou synchronisation, tri, modification et exports CSV/JSON.
- Suppression : « Détails et actions » → « Supprimer la manœuvre ». Une manœuvre regroupe les trois personnels : la suppression les retire tous les trois, pour tous les utilisateurs, après confirmation. Une manœuvre encore en attente d'envoi est retirée de la file locale sans appel au serveur.
- Synthèse globale : résultats INC MDR et SSUAP, filtres communs, effectifs d’évaluations et de manœuvres, moyennes séparées par domaine, fonction et CS. Les évaluations répétées d’un même personnel comptent séparément ; la moyenne générale compte chaque évaluation individuelle une fois. Les moyennes par catégorie restent affichées.

## Barème

Source : fiche fournie « 02_EPO_SSUAP_Fiche évaluation.pdf ».

Chef d’agrès : 10 capacités, total direct sur 20.
Équipiers : 8 capacités, sans Contact / coordination / équipe médicale ni eFiBi. Note = somme des 8 notes × 20 / 16.

Chaque capacité : −1, 0, 1 ou 2. Aucune présélection. Les notes négatives sont conservées ; le total peut donc être négatif. Une grille incomplète n’a pas de note finale et ne peut pas être enregistrée.

Seuils : ≥ 15 maîtrisé ; ≥ 10 et < 15 maîtrisé avec imperfections ; < 10 non maîtrisé (mention « Inapte VSAV » de la fiche affichée dans le bilan). Comparaison des seuils avant arrondi d’affichage.
Le geste dangereux reste un signalement distinct. Aucune mise à zéro ou inaptitude automatique ajoutée, la fiche n’en précisant pas la règle. Ces résultats de grille ne constituent pas une décision administrative d’aptitude.

## Stockage et synchronisation

Les SSUAP utilisent la collection Firestore `evaluations_ssuap`, sans modifier les évaluations INC dans `evaluations` ni leurs migrations de calcul.
Une manœuvre = un document contenant les trois personnels. Brouillon et file d’attente sont conservés sur l’appareil. L’application n’annonce pas une synchronisation réussie tant que l’écriture serveur n’est pas confirmée.
Les transactions contrôlent la révision de la manœuvre pour éviter d’écraser une modification concurrente. Un conflit conserve la version locale, permet de l’exporter, puis de recharger la version serveur.
En cas de refus Firebase, le bandeau l’indique et les saisies restent dans la file locale. Vérifier les règles existantes pour cette nouvelle collection ; ne pas ouvrir toute la base pour contourner un refus. Règle Firestore `evaluations_ssuap` : lecture et suppression ouvertes comme pour `evaluations` ; création et modification limitées aux documents `schemaVersion == 1` à trois personnels.

## Mise à jour

Version du service worker : `epo-tablettes-v5-suppression-ssuap`. Les fichiers SSUAP sont mis en cache avec l’interface. Enregistrer les évaluations, fermer toutes les fenêtres et l’application EPO, puis rouvrir pour activer une mise à jour en attente.
L’URL `?preview=1` fournit un aperçu isolé : aucune connexion Firebase, données locales de démonstration uniquement.

## Tests

`npm install` puis `npm test` (jsdom, sans connexion à Firebase).
Couverture : 10/8/8 capacités, barème, seuils, notes manquantes, justification obligatoire, navigation, sauvegarde et reprise, bilan des trois personnels, filtres et synthèse, sécurité CSV, transactions simulées, erreurs de permission, idempotence, conflits et modifications pendant un envoi.
La synchronisation Firebase réelle et l’installation Android ne sont pas prouvées par ces tests. Aucune évaluation de test n’a été créée dans la base réelle.

## Navigation et fiche personnel

INC MDR et SSUAP possèdent chacun deux sous-onglets : Évaluation et Suivi. Les deux suivis utilisent le même format compact. Le bouton « Toutes les notes de cet évalué » affiche l’historique INC MDR + SSUAP, indépendamment des filtres actifs. La correspondance utilise le nom complet en ignorant le grade, la casse, les accents et les espaces répétés. Les données ne sont pas fusionnées : distinguer les homonymes avec leur prénom dans les évaluations. Les anciens matricules stockés ne sont pas effacés, mais ne sont plus affichés ni utilisés.

## Synthèse complète

Moyenne générale des évaluations individuelles sur 20 ; puis pour chaque catégorie : moyenne, minimum, maximum, tous les meilleurs résultats ex æquo avec noms et notes, listes nominatives sous 14 et sous 10 (cette dernière est incluse dans la première), jusqu’à trois points forts et trois axes de progrès documentés. Tous ces indicateurs respectent les filtres. Les valeurs manquantes sont exclues, pas transformées en zéro.

Points collectifs INC : fréquence des axes enregistrés dans les bilans. Points SSUAP : proportion de notes à 2 pour les points forts, proportion de notes sous 2 pour les axes de progrès, parmi les seuls personnels concernés par la capacité. Aucun point n’est inventé pour compléter artificiellement une liste de trois.
