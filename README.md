# MIC Digital Product

Site statique HTML/CSS/JavaScript. Le fichier `render.yaml` configure son
hébergement sur Render sans étape de compilation.

## Déployer sur Render

1. Dans Render, choisissez **New > Static Site** et connectez le compte GitHub
   qui a accès à `Mihoub31/MIC-DIGITAL-PRODUCT`.
2. Sélectionnez ce dépôt et la branche à publier.
3. Configurez la commande de build `echo No build step required` et le
   répertoire de publication `.`.

`render.yaml` contient la même configuration pour un déploiement Blueprint.
Render publiera le contenu du dépôt et redéploiera le site aux prochains
changements de la branche connectée.
