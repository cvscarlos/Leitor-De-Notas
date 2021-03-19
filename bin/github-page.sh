#!/bin/bash
rm -rf ./dist/leitor-de-notas/
ng build --prod

rm -f ../leitordenotas.github.io-MASTER/main.*
rm -f ../leitordenotas.github.io-MASTER/polyfills.*
rm -f ../leitordenotas.github.io-MASTER/runtime.*
rm -f ../leitordenotas.github.io-MASTER/styles.*

cp -r ./dist/leitor-de-notas/* ../leitordenotas.github.io-MASTER/
cd ../leitordenotas.github.io-MASTER/
cp index.html 404.html

git add .
git commit -m "🚀"
git push