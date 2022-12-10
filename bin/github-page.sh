#!/bin/bash
rm -rf ./dist/leitor-de-notas/
npm run build

# rm -f ../leitordenotas.github.io-MASTER/main.*
# rm -f ../leitordenotas.github.io-MASTER/styles.*
rm -f ../leitordenotas.github.io-MASTER/polyfills.*
rm -f ../leitordenotas.github.io-MASTER/runtime.*

cp -r ./dist/leitor-de-notas/* ../leitordenotas.github.io-MASTER/
cp README.md ../leitordenotas.github.io-MASTER/README.md
cd ../leitordenotas.github.io-MASTER/
cp index.html 404.html

git add .
git commit -m "🚀"
git push
