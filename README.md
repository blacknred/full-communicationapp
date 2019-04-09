# Corporate Messenger - GraphQL Messenger on Docker

## Architecture

| Name       | Container            | Stack                  | Ports  |
|------------|----------------------|------------------------|--------|
| Server     | messenger-server     | Node, Express, GraphQL | 4000   |
| DB         | messenger-db         | Postgres               | 5432   |
| Redis      | messenger-redis      | Redis                  | 6379   |
| Nginx      | messenger-nginx      | Nginx                  | 80/443 |
| Certbot    | messenger-certbot    |                        |        |

### Redis

Cache layer for GraphQL Subscriptions pubsub, users statuses and updates

## Run the project

### Setup

1. Fork/Clone this repo

1. Download [Docker](https://docs.docker.com/docker-for-mac/install/) (if necessary)

1. Make sure you are using a Docker version >= 17:

    ```sh
    $ docker -v
    Docker version 17.03.0-ce, build 60ccb22
    ```

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

1. Set the Environment variable

    ```sh
    export NODE_ENV=test
    ```

1. With the apps up, run:

    ```sh
    cd server && npm test
    ```

### Production

1. Edit the `nginx/app.conf` to add your domain.

1. Edit the `init-letsencrypt.sh` script to add in your domain(s) and your email address.

1. Run `init-letsencrypt.sh` script:

    ```sh
    sudo ./init-letsencrypt.sh
    ```

1. Run the containers:

    ```sh
    docker-compose -f docker-compose.prod.yml up -d
    ```
