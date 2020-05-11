# SWOY - GraphQL Corporate Instant Messaging & Call Services on Docker

## Architecture

| Name                 | Container         | Stack                  | Ports  |
| -------------------- | ----------------- | ---------------------- | ------ |
| Workspace service    | workspace-service | NodeJs, Koa, GraphQL   | 4001   |
| Message service      | message-service   | NodeJs, Micro, GraphQL | 4002   |
| Call command Service | call-service      | NodeJs, Fastify, REST  | 4003   |
| File storage service | file-service      | Python, Flask, REST    | 5000   |
| Workspace DB         | workspace-db      | Postgres               | 5432   |
| Message DB           | message-db        | MongoDB => Cassandra   | 5432   |
| Redis                | redis             | Redis                  | 6379   |
| Nginx                | nginx             | Nginx                  | 80/443 |
| Certbot              | certbot           |                        |        |

### Redis

Cache layer for GraphQL Subscriptions pubsub, ratelimiting, users statuses and updates

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

### Run tests

1. Set the Environment variable:

   ```sh
   export NODE_ENV=test
   ```

1. With the apps up, run:

   ```sh
   cd server && npm test
   ```

### Production

1. Set the Environment variables:

   ```sh
   export NODE_ENV=production
   export TOKEN_SECRET=your_secret
   export TOKEN_SECRET_2=your_secret_2
   export REDIS_PASSWORD=your_redis_password
   export POSTGRESQL_USER=your_postgresql_user
   export POSTGRESQL_PASSWORD=your_postresql_user
   export MONGODB_USER=your_mongodb_user
   export MONGODB_PASSWORD=your_mongodb_password
   ```

1. Edit the `nginx/app.conf` to add your domain

1. Edit the `init-letsencrypt.sh` script to add in your domain(s) and your email address

1. Run `init-letsencrypt.sh` script:

   ```sh
   sudo ./init-letsencrypt.sh
   ```

1. Run the containers:

   ```sh
   docker-compose -f docker-compose.prod.yml up -d
   ```
