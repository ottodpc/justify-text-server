# Justification API

API REST en Node.js et TypeScript pour justifier des textes avec des lignes de 80 caractères, sans framework ni bibliothèques externes. Ce projet utilise un système d'authentification par token et applique une limite quotidienne de mots par utilisateur.

## Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Endpoints](#endpoints)
  - [/api/token](#api-token)
  - [/api/justify](#api-justify)
- [Détails de Justification](#détails-de-justification)

---

### Prérequis

- **Node.js** : v22.1.0
- **Yarn** : v1.22.22
- **Git** : v2.40.1 ou supérieur

Le code source est disponible sur GitHub : [https://github.com/ottodpc/justify-text-server](https://github.com/ottodpc/justify-text-server)

### Installation

1. **Cloner le dépôt :**

   ```bash
   git clone https://github.com/ottodpc/justify-text-server.git
   cd justify-text-server
   ```

2. **Installer les dépendances :**

   ```bash
   yarn install
   ```

3. **Compiler le code TypeScript :**

   ```bash
   yarn build
   ```

4. **Démarrer le serveur :**
   ```bash
   yarn start
   ```

### Configuration

1. **Créer le fichier `.env`** en utilisant le modèle `.env.example` :
   ```bash
   cp .env.example .env
   ```
2. **Modifier le fichier `.env`** pour définir votre clé secrète. Exemple de contenu :
   ```env
   SECRET_KEY="VOTRE_SECRET_KEY"
   ```

### Utilisation

L'API expose deux endpoints principaux : `/api/token` pour obtenir un token d'authentification et `/api/justify` pour justifier un texte. La justification respecte un format de 80 caractères par ligne, comme démontré dans les fichiers `input.txt` (texte non justifié) et `output.txt` (exemple de texte justifié) situés dans la racine du projet.

### Endpoints

#### **/api/token**

- **Description** : Retourne un token d’authentification pour l’utilisateur.
- **Méthode** : `POST`
- **Content-Type** : `application/json`
- **Body** :
  ```json
  {
    "email": "foo@bar.com"
  }
  ```
- **Réponse** :
  ```json
  {
    "token": "TOKEN"
  }
  ```

#### **/api/justify**

- **Description** : Justifie le texte envoyé dans le corps de la requête avec une limite de ligne à 80 caractères. Une limite de 80 000 mots par jour est appliquée pour chaque token.
- **Méthode** : `POST`
- **Content-Type** : `text/plain`
- **Headers** :
  - `Authorization: Bearer <votre_token>`
- **Body** : Texte brut à justifier.
- **Réponse** : Texte justifié avec des lignes de 80 caractères.

  - **Code 200** : Succès – retourne le texte justifié.
  - **Code 402** : Échec – Limite quotidienne atteinte.
  - **Code 403** : Échec – Token non fourni.

### Détails de Justification

Le texte est traité sans bibliothèques externes. Les mots sont répartis sur des lignes de 80 caractères, avec des espaces équilibrés pour obtenir une justification complète. Les exemples `input.txt` (texte brut) et `output.txt` (texte justifié) illustrent le fonctionnement.
