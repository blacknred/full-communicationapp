# Message service

## Stack

TS, NodeJs, Redis, Mongodb, REST, WS

## Run the project

### Setup

1. Fork/Clone this repo

1. Download [Docker](https://docs.docker.com/docker-for-mac/install/) (if necessary)

### Build and Run the App

1. Build the image:
  
    ```sh
    cd message-service
    $ docker build -t message-service .
    ```

1. Set the Environment variable

    ```sh
    export DEBUG=development
    ```

1. Run the container:

    ```sh
    docker run -it -p 3000:3000 message-service
    ```

1. curl `http://localhost:3000`

### Run tests

1. Set the Environment variable

    ```sh
    export DEBUG=test
    ```

1. With the service up, run:

    ```sh
    ...
    ```

### Production
