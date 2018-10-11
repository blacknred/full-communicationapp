# Corporate Messenger - GraphQL Messenger on Docker


## Architecture

| Name       | Container            | Stack                        | Ports |
|------------|----------------------|------------------------------|-------|
| Web client | messenger-web-client | GraphQL, React, Router, Mobx | 4001  |
| Server     | messenger-server     | Node, Express, GraphQL       | 4000  |
| DB         | messenger-db         | Postgres                     | 5432  |
| Redis      | messenger-redis      | Redis                        | 6379  |
| Storage    | messenger-storage    | Node, Koa                    | 4004  |

#### Web client - http://localhost:4001

| Endpoint                    | Result                                    |
|-----------------------------|-------------------------------------------|
| /                           | redirect to /teams                        |
| /login                      | login page                                |
| /register                   | register page                             |
| /settings                   | settings page                             |
| /new-team                   | team creating page                        |
| /teams/:teamId?/:channelId? | renders teams, channels, messages of user |

#### Server - http://localhost:4000

#### Files Storage - http://localhost:4004

Mock storage with API for CREATE, DELETE and GET static posts files

#### Redis

Cache layer for GraphQL Subscriptions and users' online/offline status

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
    $ export NODE_ENV=development
    ```

1. Fire up the Containers

    Build the images:

    ```sh
    $ docker-compose build
    ```

    Run the containers:

    ```sh
    $ docker-compose up -d
    ```

1. Database

    To access, get the container id from `docker ps` and then open `psql`:

    ```sh
    $ docker exec -ti <container-id> psql -U postgres
    ```

### Run tests

1. Set the Environment variable
    ```sh
    $ export NODE_ENV=test
    ```

1. With the apps up, run:

    ```sh
    $ cd server && npm run test
    ```


