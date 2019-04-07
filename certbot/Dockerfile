FROM certbot/certbot

# check if your certificate is up for renewal every 12 hours as recommended by Let’s Encrypt.
# ENTRYPOINT [ "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'" ]