# Informations manquantes dans la base (tables CSV)

Champs affichés par la page « Poilus » qui n'existent pas (ou ne sont pas exploitables) dans les tables actuelles.
Ils sont renvoyés vides par l'API en attendant.

| Info du site | Statut | Ce qu'il faut ajouter |
|---|---|---|
| Métier / profession | Manquant | Colonne `profession` (ou table `profession` + `profession_id`) dans `personne` |
| Département de décès | Manquant | `dpt_deces` dans `personne` (ou `departement` dans `commune`). Seul `dpt_naissance` existe |
| Département des communes | Manquant | `commune` n'a que `id, libelle` : pas de code département ni coordonnées |
| Monument aux morts | Manquant | Table `monument` + `monument_id` dans `personne` |
| Église | Manquant | Table `eglise` + `eglise_id` dans `personne` |
| Livre d'or | Manquant | Table `livre_or` + `livre_or_id` dans `personne` |
| Décorations | Manquant | Table `decoration` + table de liaison `personne_decoration` (plusieurs par personne) |
| Tags (Marne, Infanterie…) | Manquant | Table `tag` + `personne_tag`, ou à dériver (ex. depuis le régiment) |
| Résumé court | Manquant | Colonne `resume` dans `personne` (actuellement le résumé = `biographie` complète) |
| Biographie en sections (titre + texte) | Manquant | Table `biographie_section(personne_id, ordre, titre, texte)`. `biographie` est un seul texte |
| Glossaire | Manquant | Table `glossaire(terme, definition)` et liaison avec les personnes |
| Dates de naissance incomplètes | À vérifier | Si seule l'année est connue, prévoir un champ texte ou une précision |
| Portrait | À vérifier | `portrait` est vide dans les premières lignes : définir s'il s'agit d'une URL ou d'un chemin |
| Prénom/nom | À vérifier | Colonne `nom` en MAJUSCULES, `prenom` peut contenir plusieurs prénoms |

## Déjà couvert par les tables

Nom, prénom, conflit, date et commune de naissance, `dpt_naissance`, classe, bureau de recrutement,
régiment, section, date de décès, lieu de décès, cause du décès, lieu d'inhumation, biographie, portrait.
