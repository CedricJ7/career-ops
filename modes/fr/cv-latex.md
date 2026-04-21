# Mode : cv-latex — CV LaTeX moderncv (Overleaf)

Génère un CV en LaTeX/moderncv optimisé pour une offre d'emploi donnée.

## Workflow

1. **Lire l'offre** depuis URL (Playwright) ou texte
2. **Extraire keywords** : 15-20 mots-clés depuis la JD
3. **Lire** `cv.md` (source de vérité)
4. **Lire** `config/profile.yml`
5. **Adapter CV** pour l'offre :
   - Rewrite "Profil" avec keywords + narratif
   - Reorder expériences par pertinence
   - Sélectionner + adapter compétences
   - Adapter le poste/titre cible
6. **Générer LaTeX** depuis template moderncv
7. **Écrire** à `/tmp/cv-{candidate}-{company}.tex`
8. **Compiler** optionnellement vers PDF
9. **Rapporter** : chemin TEX, suggestions Overleaf

## Template LaTeX (moderncv classic/banking)

Utiliser ce format (du CV source de Cédric) :

```latex
% !TEX TS-program = xelatex
\documentclass[10.3pt,a4paper,sans]{moderncv}

%----- THEMES -----
\moderncvstyle{banking}
\moderncvcolor{blue}
\usepackage[scale=0.85]{geometry}
\setlength{\hintscolumnwidth}{2.8cm}

\newcommand{\entrystyle}[1]{{\large\bfseries\color{color1}#1}}

%----- PERSONAL DATA -----
\name{Cédric}{Jestin}
\title{{{ADAPTED_TITLE}}}
\address{63110 Beaumont, France}
\phone[mobile]{+33~7~86~59~19~97}
\email{jestincedric@yahoo.com}

%----- DOCUMENT -----
\begin{document}
\makecvtitle

%----- PROFILE -----
\section{Profil}
{{PROFILE_TEXT}}

%----- EXPERIENCES -----
\section{Expériences Professionnelles}
{{EXPERIENCES}}

%----- PROJECTS -----
\section{Projets Personnels}
{{PROJECTS}}

%----- EDUCATION -----
\section{Formation}
{{EDUCATION}}

%----- SKILLS -----
\section{Compétences Techniques}
{{SKILLS}}

%----- INTERESTS -----
\section{Centres d'intérêt}
{{INTERESTS}}

\end{document}
```

## Stratégie d'adaptation par offre

### 1. Title adapté (depuis JD)

**Règles :**
- Si JD contient "stage" → `\title{Stage - {Poste abrégé}}`
- Si "alternance" → `\title{Alternance - {Poste abrégé}}`
- Si "Ingénieur" → `\title{Ingénieur {Domaine}}`
- Limiter à 40 caractères

**Exemples :**
- JD "Stage Ingénieur Machine Learning" → `\title{Stage - Ingénieur ML}`
- JD "Stage IA Générative" → `\title{Stage - IA Générative}`

### 2. Profil personnalisé

**Template :**
```
Étudiant en Master Intelligence Artificielle (ISIMA/UCA) spécialisé en {DOMAIN}.
Double compétence Data Science + {JD_SPECIALTY}. {EXPERIENCE_HIGHLIGHT}.
Compétences : {TOP_5_KEYWORDS}. Cherche un stage pour {GOAL}.
```

**Exemple pour Galadrim :**
```
Étudiant en Master Intelligence Artificielle spécialisé en IA générative et deep learning.
Double compétence Data Science + full-stack IA. Expérience en déploiement de modèles 
(Power BI, R Shiny) et automatisation de processus. Compétences : Python, Machine Learning, 
Full-Stack IA, Collecte Données, Pragmatique & Itératif. Cherche un stage pour implémenter 
des modèles IA pragmatiques intégrés dans des produits clients.
```

### 3. Reorder expériences par pertinence

Lire `cv.md` et classer les expériences par fit avec la JD:
1. Expérience la plus pertinente → première
2. Compétences mentionnées dans la JD → en évidence

**Format cventry :**
```latex
\cventry{DATE}{\entrystyle{TITRE}}{ENTREPRISE}{LIEU}{}{
DESCRIPTION avec keywords de la JD. \\[0.3em]
Détail second impact ou skill.
}
```

**Adaptation :** Reformuler les bullets avec le vocabulaire exact du JD (ex: "Full-Stack IA", "Pragmatique", "Modèles IA").

### 4. Projets (top 3)

Sélectionner depuis `cv.md` les projets les plus pertinents pour l'offre.

**Format :**
```latex
\cventry{DATE}{\entrystyle{TITRE}}{}{}{}{
Contexte + impact. Keywords du JD intégrés.
}
```

### 5. Formation

Copier depuis `cv.md` :
- Master IA ISIMA/UCA (2025-2027)
- BUT Science des Données (2022-2025)

**Adapter description** si la JD mentionne des spécialités (NLP, CV, etc.).

### 6. Compétences

**Grouper par catégorie :**
```latex
\cvitem{IA \& Machine Learning}{\textbf{Python}, TensorFlow, Scikit-learn, NumPy.}
\cvitem{Développement Web}{\textbf{Front-end :} Angular, JavaScript. \textbf{Back-end :} .NET, API REST.}
\cvitem{Data \& DevOps}{\textbf{SQL}, MongoDB, Git, Docker.}
\cvitem{Langues}{\textbf{Français (natif)}, Anglais (C1).}
```

**Adapter :**
- Mettre en **gras** les compétences mentionnées dans la JD
- Reorder les catégories : IA en premier si tech role, Data si data role
- Retirer les compétences non pertinentes

## Couleurs moderncv

| Couleur | Usage |
|---------|-------|
| `blue` | Tech, IA, data (default) |
| `green` | Santé, énergie, environnement |
| `red` | Finance, conseil |
| `orange` | Startup, innovation |
| `purple` | Recherche, académique |

**Sélectionner** selon le secteur de l'offre.

## Styles moderncv

| Style | Apparence |
|-------|-----------|
| `classic` | Traditionnel, à gauche entrée/sortie |
| `casual` | Modern, épuré |
| `banking` | Colonne gauche, professionnel (Cédric préfère) |

**Garder `banking`** par défaut.

## Écriture du fichier TEX

Chemin : `output/{company-slug}/{offer-slug}/cv.tex`

Exemple : `output/galadrim/stage-ingenieur-ia/cv.tex`

**Important :** Créer le dossier s'il n'existe pas.

## Compilation optionnelle

Si `xelatex` dispo (recommended pour XeTeX) :

```bash
cd /tmp
xelatex -interaction=nonstopmode cv-cedric-jestin-{company}.tex
```

Générer PDF : `/tmp/cv-cedric-jestin-{company}-2026-04-20.pdf`

## Post-génération

1. Afficher :
   - Chemin TEX
   - Title adapté
   - Keywords couverts
   - Nombre de mots
2. Proposer :
   - **A** : Copy-paste dans Overleaf
   - **B** : Télécharger PDF compilé (si xelatex OK)
3. Hints : "Utilise Overleaf pour prévisualiser et exporter en PDF"

## Tips Overleaf

1. Créer projet vide
2. Copier le contenu TEX
3. Menu en haut → Compiler
4. Export → PDF
5. URL shareable pour la lettre de motivation + CV
