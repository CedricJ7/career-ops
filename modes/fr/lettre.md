# Mode : lettre — Lettre de Motivation LaTeX (Overleaf)

Génère une lettre de motivation personnalisée en LaTeX (format moderncv) pour une offre d'emploi donnée.

## Workflow

1. **Lire l'offre** depuis URL (Playwright) ou texte fourni
2. **Extraire** : entreprise, poste, lieu, mots-clés clés, domaine
3. **Lire profil** : `/home/cj7/career-ops/config/profile.yml`
4. **Générer le contenu** :
   - Déterminer le secteur (tech, industriel, finance, etc.)
   - Adapter le ton et les références techniques
   - Mapper les compétences Cédric aux besoins de l'offre
   - Générer 3-4 paragraphes cohérents
5. **Construire LaTeX** depuis le template
6. **Écrire** à `/tmp/lettre-{company}-{date}.tex`
7. **Compiler** (optionnel via Overleaf)
8. **Rapporter** : URL Overleaf ou chemin TEX

## Template LaTeX de base

```latex
\documentclass[11pt,a4paper,roman]{moderncv}
\usepackage[french]{babel}
\moderncvstyle{classic}
\moderncvcolor{green}
\usepackage[utf8]{inputenc}
\usepackage[scale=0.75]{geometry}

\name{Cédric}{Jestin}
\address{}{}{} 

\begin{document}

% 1. Données candidat (Haut à gauche)
{\raggedright
\textbf{Cédric Jestin} \\
63110 Beaumont \\
07 86 59 19 97 \\
jestincedric@yahoo.com \\
}

\medskip

% 2. Informations entreprise (Droite)
\hfill
\begin{minipage}{0.5\textwidth}
\raggedleft
\textbf{{{COMPANY_NAME}}}\\
{{DEPARTMENT}}\\
{{LOCATION}}
\end{minipage}

\medskip
\medskip

% 3. Date
\hfill Le \today

\medskip

% 4. Objet
\noindent \textbf{Objet : {{SUBJECT}}}

\medskip

% 5. Contenu
Madame, Monsieur,

\medskip

{{PARAGRAPH_1}}

\medskip

{{PARAGRAPH_2}}

\medskip

{{PARAGRAPH_3}}

\medskip

Je reste à votre entière disposition pour convenir d'un rendez-vous et échanger davantage sur le sujet et vos attentes.

\medskip

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

\vspace{1cm}

\begin{center}
    \textbf{Cédric Jestin}
\end{center}

\end{document}
```

## Stratégie de contenu par secteur

### Secteur Tech / IA / Startup

**Paragraph 1** — Hook sur le contexte de l'offre
```
{Secteur} et {domaine specific} fascinent par {raison]. Étudiant en Master Intelligence 
Artificielle, j'ai développé [compétences pertinentes] et je vois dans votre poste 
l'opportunité idéale pour [contribuer à/apprendre/approfondir] [aspect spécifique].
```

**Paragraph 2** — Preuve de compétence (expériences + skills)
```
{Expérience 1 pertinente} m'a permis de maîtriser {stack tech du JD}. Dans {Expérience 2}, 
j'ai [réussite concrète]. Ces projets m'ont enseigné [pragmatisme/rigueur/itération], 
qualités essentielles pour {aspect du poste}.
```

**Paragraph 3** — Motivation + souplesse
```
Au-delà des skills, ce qui m'attire chez {Company} est {spécificité : culture, mission, 
équipe, technos]]. Je suis curieux, capable d'apprendre vite, et je m'engage à {durée du stage}.
```

### Secteur Industriel / Défense / Énergie (Thales, Airbus, CEA)

**Tone** : rigueur, fiabilité, contribution à des systèmes critiques

**Paragraph 1** — Mission/impact
```
{Secteur critique} {Thales/Airbus/CEA] exige une rigueur absolue. En tant qu'étudiant 
en Master IA, j'ai appris l'importance de {robustesse/fiabilité/scalabilité]. 
Intégrer votre équipe de {domaine} serait pour moi l'occasion d'appliquer ces principes 
dans un contexte {impactful/stratégique].
```

**Paragraph 2** — Compétences + approche méthodique
```
Je maîtrise {Python + domaine spécifique : ML/NLP/CV/Time Series}. Chez {Expérience 
précédente}, j'ai {exemple de rigueur : refonte architecture / optimisation performance}. 
Ma polyvalence ({Front-end / Back-end / Data / DevOps]) me permet de contribuer au projet 
de façon holistique.
```

**Paragraph 3** — Engagement + durée
```
Je suis motivé par l'excellence technique et les défis complexes. Je suis disponible 
pour un stage de [3-6 mois] à partir de [date], idéalement en {location] ou full remote.
```

### Secteur Finance / Banque

**Tone** : rigueur analytique, gestion de données, compliance

**Paragraph 1** — Data-driven mindset
```
La finance générative exige de combiner rigueur analytique et créativité technique. 
Étudiant en Master IA avec une expertise en Data Science, j'ai appris à traduire 
les données en insights actionnables. Votre stage m'intéresse pour approfondir 
[ML trading / risk modeling / NLP pour compliance].
```

**Paragraph 2** — Proof points + méthodologie
```
Chez {Eurotranspharma}, j'ai refonte des pipelines de données complexes (Power BI) 
et bâti une application full-stack (Power Apps) pour l'aide à la décision. 
J'apporte {Python + SQL + Data Architecture} avec une forte sensibilité aux données propres.
```

**Paragraph 3** — Engagement
```
Je suis à l'écoute des risques operationnels et j'adhère aux principes de compliance. 
Disponible pour un stage [durée], je suis impatient de contribuer à [produit/équipe].
```

## Détection automatique du secteur

Chercher dans la JD :
- **Tech/IA** : "startup", "SaaS", "AI", "ML", "générative", "LLM", "API", "product"
- **Industriel** : "Thales", "Airbus", "défense", "aérospatial", "nucléaire", "robotique", "critiques"
- **Énergie** : "CEA", "EDF", "SNCF", "énergie", "électrique", "réseau"
- **Finance** : "banque", "trading", "risk", "fintech", "investment"

Si aucune correspondance → default **Tech/IA**.

## Extraction depuis l'offre

Lire la JD et extraire:
- `{{COMPANY_NAME}}` : nom entreprise
- `{{DEPARTMENT}}` : équipe/département (ex: "Équipe ML" ou "Division IA")
- `{{LOCATION}}` : ville/région
- `{{SUBJECT}}` : "Candidature au stage – {Poste}"
- `{{JD_KEYWORDS}}` : 5-8 mots-clés techniques
- `{{SECTOR}}` : Tech / Industriel / Finance / Énergie

## Écriture du fichier TEX

Chemin : `output/{company-slug}/{offer-slug}/lettre.tex`

Exemple : `output/galadrim/stage-ingenieur-ia/lettre.tex`

**Important :** Créer le dossier s'il n'existe pas.

## Post-génération

1. Afficher le contenu LaTeX généré
2. Proposer options :
   - **Option A** : Copier-coller dans Overleaf
   - **Option B** : Compiler localement si `pdflatex` dispo
3. Rapporter : chemin TEX, nombre de mots, secteur détecté

## Compilation optionnelle (si dispo)

Si `pdflatex` ou `xelatex` disponible :
```bash
cd /tmp
pdflatex -interaction=nonstopmode lettre-{company}-2026-04-20.tex
```

Générer PDF à `/tmp/lettre-{company}-2026-04-20.pdf`

## Customisations possibles

- **Couleur moderncv** : `\moderncvcolor{green}` → paramètre (blue, red, green, etc.)
- **Style** : `\moderncvstyle{classic}` → {classic, casual, banking}
- **Langue** : `[french]{babel}` → détecter depuis JD
