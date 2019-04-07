FROM nginx:mainline-alpine

# nginx reload its configuration (and certificates) every six hours
# CMD [ "/bin/sh -c 'while :; do sleep 6h & wait $${!}; nginx -s reload; done & nginx -g \"daemon off;\"'" ]