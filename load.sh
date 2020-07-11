#!/bin/bash

function build(){
    cd $1
    pwd
    ./reload.sh
    ./publish.sh
    cd ..
}
function reload(){
  rm package-lock.json
  npm cache clean --force
  npm install
}
cd ../
if [ $# -eq 0 ]; then
    build fansion-base
    build fansion-fac
    build fansion-ui
    build fansion-meta
    build fansion-env
else
  for i in $@
	do
	  build ${i}
	done
fi
cd fansion-demo
pwd
if [ $# -eq 0 ]; then
    rm -rf node_modules/fansion-*
else
  for i in $@
  do
    pwd
    echo ${i}
    rm -rf node_modules/${i}
  done
fi
reload

