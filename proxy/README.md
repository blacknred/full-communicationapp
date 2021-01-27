# Nginx + ssl

Proxy uses SSS by default:

```sh
  cd ssl
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout le-key.pem -out le-crt.pem
```

To use valid LE SSL on development just change next values to valid ones:

```sh
  export SSL_ON=true
  export NGINX_HOST=your_app_host
  export SSL_EMAIL=your_lets_encript_email
```

## Other

We need nginx to perform the Let’s Encrypt validation But nginx won’t start if the certificates are missing.
So what do we do? Create a dummy certificate, start nginx, delete the dummy and request the real certificates.
This will check if your certificate is up for renewal every 12 hours as recommended by Let’s Encrypt.
This makes nginx reload its configuration (and certificates) every six hours in the background and launches nginx in the foreground.

1. ssl only on prod(le-nginx) and http on dev(nginx) - bad decision
2. different http & https configs based domain ENV - http available only throuth /.well-known
3. full https with le & sss - this
