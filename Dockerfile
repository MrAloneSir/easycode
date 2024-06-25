FROM --platform=arm64 registry.eeo-inc.com/classin_www/fe-base:1.0.18

COPY ./dist/ /usr/share/nginx/html/
