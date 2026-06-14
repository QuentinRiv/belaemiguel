# Ojlev

Site web de mariage **statique** (HTML / CSS / JavaScript), sans backend. Une page unique présente le couple, son histoire, le programme du jour J et un formulaire RSVP. Le contenu est traduit côté client (anglais / portugais) et le visiteur peut changer le thème de couleur et basculer en mode clair / sombre.

---

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Structure du projet](#structure-du-projet)
- [Stack technique](#stack-technique)
- [Lancement](#lancement)
- [Internationalisation (i18n)](#internationalisation-i18n)
- [Thèmes de couleur](#thèmes-de-couleur)
- [Personnalisation](#personnalisation)
- [Fichiers hérités](#fichiers-hérités)

---

## Fonctionnalités

- **Page d'accueil unique** (`index.html`) avec sections : accueil, couple, histoire (« Our Story »), programme (« The Day ») et RSVP.
- **Bilingue EN / PT** : toutes les chaînes traduisibles portent un attribut `data-i18n` et sont remplacées au chargement par [static/js/i18n.js](static/js/i18n.js). La langue choisie est mémorisée dans `localStorage`.
- **Sélecteur de thème** : cinq couleurs d'accent (rose, bleu, vert, rouge, jaune) et un mode clair / sombre, gérés par [static/js/settings.js](static/js/settings.js).
- **Carrousel de slides** et animations de défilement.
- Aucune base de données, aucune authentification, aucun appel réseau vers un serveur : tout s'exécute dans le navigateur.

---

## Structure du projet

```
Ojlev-main/
├── index.html                 # La page du site (point d'entrée unique)
├── README.md
├── static/
│   ├── css/                   # Feuilles de style
│   │   ├── style.css          # Styles principaux
│   │   ├── responsive.css     # Adaptations mobiles
│   │   ├── settings.css       # Panneau de réglages (couleur / mode)
│   │   ├── font-awesome.css   # Icônes Font Awesome
│   │   └── pink|blue|green|red|yellow.css   # Thèmes d'accent interchangeables
│   ├── js/
│   │   ├── i18n.js            # Moteur de traduction client (EN / PT)
│   │   ├── settings.js        # Sélecteur de couleur + mode clair/sombre
│   │   ├── main.js            # Comportements de la page (nav, slides, scroll)
│   │   ├── mixitup.min.js     # Filtrage/animation de galerie (lib tierce)
│   │   └── jquery.min.js
│   ├── locales/
│   │   ├── en/translation.json
│   │   └── pt/translation.json
│   ├── img/                   # Images du site (slides, fond, icônes)
│   └── webfonts/              # Polices Font Awesome
└── wedding-starter-template/  # Template HTML/CSS d'origine, conservé comme référence
```

---

## Stack technique

- **HTML5 / CSS3** — page statique, mise en page responsive.
- **JavaScript (vanilla)** pour l'i18n ([i18n.js](static/js/i18n.js)).
- **jQuery** + **MixItUp** pour les interactions et le filtrage.
- **Font Awesome** pour les icônes.
- Fichiers de traduction au format **JSON** (`static/locales/<lang>/translation.json`).

> Pas de Python, pas de Flask, pas de base de données : le projet est entièrement front-end.

---

## Lancement

Comme il s'agit d'un site statique, il suffit d'ouvrir `index.html`. Toutefois, le chargement des traductions (`fetch` sur les fichiers JSON) nécessite un serveur HTTP — l'ouverture directe via `file://` peut être bloquée par le navigateur (CORS).

Servir le dossier avec n'importe quel serveur statique, par exemple :

```bash
# Python (inclus sur la plupart des systèmes)
python -m http.server 8000

# ou Node
npx serve .
```

Puis ouvrir [http://localhost:8000](http://localhost:8000).

---

## Internationalisation (i18n)

- Marquer un élément traduisible avec `data-i18n="section.cle"` (ou `data-i18n-placeholder` / `data-i18n-title` pour ces attributs).
- Ajouter la clé correspondante dans **chaque** fichier `static/locales/<lang>/translation.json`.
- Langues supportées : `en`, `pt` (voir `SUPPORTED_LANGS` dans [i18n.js](static/js/i18n.js)). La langue par défaut est l'anglais ; le choix de l'utilisateur est conservé dans `localStorage` (`ojlev_lang`).

Pour ajouter une langue : créer `static/locales/<code>/translation.json`, ajouter le code à `SUPPORTED_LANGS`, et un bouton `.lang-btn[data-lang="<code>"]` dans le header.

---

## Thèmes de couleur

Les couleurs d'accent sont définies dans le tableau `color` de [settings.js](static/js/settings.js) (nom, code couleur, feuille de style associée). Le sélecteur applique dynamiquement la feuille `static/css/<couleur>.css` sur le `<link class="alternate-style">`. Le mode clair / sombre bascule la classe `dark` sur `<body>`.

---

## Personnalisation

- **Noms / dates / textes** : éditer directement `index.html` et les fichiers `translation.json`.
- **Images** (slides, fond, couple…) : remplacer les fichiers dans `static/img/`.
- **Couleurs** : ajuster les fichiers de thème dans `static/css/` ou le tableau `color` de `settings.js`.

---

## Fichiers hérités

Le projet provenait d'une ancienne application **Flask** (backend Python + SQLite) qui a été retirée. Les fichiers JavaScript/CSS de l'ancienne interface d'administration (édition de contenu, galerie photo, connexion) qui dépendaient de ce backend ont été supprimés. Le dossier [wedding-starter-template/](wedding-starter-template/) est conservé comme référence du template HTML/CSS d'origine.
