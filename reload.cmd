rd/s/q node_modules\fansion-base
rd/s/q node_modules\fansion-fac
rd/s/q node_modules\fansion-ui
rd/s/q node_modules\fansion-meta
del package-lock.json
set NODE_OPTIONS=--openssl-legacy-provider
npm cache clean --force&&npm install
