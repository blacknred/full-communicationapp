# SWOY - IM and voice communication platform

## Architecture

| Services        | Container       | Stack                    | Ports  |
| --------------- | ----------------| ------------------------ | ------ |
| Channel service | channel-service | TS, Nodejs, Koa, GraphQL | 3001   |
| Xmpp service    | xmpp-service    | TS, NodeJs, WS           | 4000   |
| File service    | file-service    | Python, Flask, REST      | 5000   |
| Channel DB      | channel-db      | Postgres                 | 5432   |
| Message DB      | message-db      | MongoDB                  | 27017  |
| Redis           | redis           | Redis                    | 6379   |
| Reverse proxy   | proxy           | Nginx                    | 80/443 |

## Run the project

### Setup

1. Fork/Clone this repo

1. Download [Docker](https://docs.docker.com/docker-for-mac/install/) (if necessary)

### Build and Run the App

1. Set the Environment variable

   ```sh
   export NODE_ENV=development
   ```

1. Fire up the Containers

   Build the images:

   ```sh
   docker-compose build
   ```

   Run the containers:

   ```sh
   docker-compose up -d
   ```

1. Database

   To access, get the container id from `docker ps` and then open `psql`:

   ```sh
   docker exec -ti <container-id> psql -U postgres
   ```

### Production

1. Set the Environment variables one by one or in .env:

   ```sh
   export SECRET=your_secret
   export NGINX_HOST=your_app_host
   export SSL_EMAIL=your_lets_encript_email
   export REDIS_PASSWORD=your_redis_password
   export POSTGRES_USER=your_postgresql_user
   export POSTGRES_PASSWORD=your_postresql_password
   export MONGODB_USER=your_mongodb_user
   export MONGODB_PASSWORD=your_mongodb_password
   export SMTP_URL=your_smtp_url_like_smtps://username:password@smtp.gmail.com:465/
   ```

1. Run the containers:

   ```sh
   docker-compose -f docker-compose.prod.yml up -d
   ```
