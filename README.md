# Packemon

Application Angular pour collectionner les 102 cartes du set de base Pokémon : on ouvre des boosters, les cartes tirées s'ajoutent à sa collection, et on peut créer, modifier ou supprimer des cartes

## Prérequis

- [Node.js](https://nodejs.org/) 22.22.3 ou plus récent
- npm (installé avec Node.js)

## Installation

```bash
npm install
```

## Lancer le projet

**En une seule commande** (les deux serveurs tournent en parallèle grâce à [`concurrently`](https://www.npmjs.com/package/concurrently)) :

```bash
npm run dev
```

**Ou dans deux terminaux :**

```bash
# Terminal 1 : l'API sur http://localhost:3000
npm run api

# Terminal 2 : l'application sur http://localhost:4200
npm start
```

Ouvrir ensuite http://localhost:4200.

Si l'API n'est pas lancée, l'application affiche un message d'erreur avec un bouton « Try again ».

## Roadmap

### 1. Idées
La première étape a été de trouver une idée qui me plaisait. J'avoue que les 3 propositions de base ne me donnaient pas trop envie, j'ai donc orienté mon projet sur un précédent projet de collection de cartes. Mais je trouvais ça trop simple, d'où l'ajout d'un système d'ouverture de boosters pour rendre le projet plus fun.

### 2. Mise en place
Comme tout projet, il a fallu l'initialiser (`ng new <nom_du_projet>`), puis j'ai directement installé les packages dont j'avais besoin :
- `json-server` pour la fausse API
- `concurrently` pour lancer plusieurs scripts en une seule commande
- [`TCGdex`](https://tcgdex.net) une base de cartes que j'ai scrapée

### 3. Implémentation des features
J'ai commencé par le système de collection avec `card/card.ts` et `cards/card-list`, puis je suis passé à `cards/card-detail` avec `cards/energy`, et enfin au système de filtres. Avant de faire le CRUD, je me suis dit que juste ça... **bah on souffle**. C'est pourquoi j'ai rajouté la partie `pack/open-pack`. Une fois cette partie finie, j'ai fait le CRUD, d'où l'existence de `cards/card-form`.

## Utilisations de l'IA
L'IA a principalement été utilisée pour : 
- Simplifier du code

**Prompt :**
> tu es un dev senior, tu code depuis plus de 20 ans. ta tache est maintenant de m'aider avec mon code. Je veux que tu analyse le code qui a été produit et que tu me propose des simplications que je pourrais apporter, liste moi les avantages et defaut de chaques versions.

- Convertir du code React en équivalent Angular

**Prompt :**
> Je veux que tu me refasse ce code en Angular [le code React]