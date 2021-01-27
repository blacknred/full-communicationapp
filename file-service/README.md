# File pocessing and storage service

## Stack

Python, Flask, REST

## Run the project

### Setup

1. Fork/Clone this repo

1. Download [Docker](https://docs.docker.com/docker-for-mac/install/) (if necessary)

### Build and Run the App

1. Build the image:
  
    ```sh
    cd file-service
    $ docker build -t file-service .
    ```

1. Set the Environment variable

    ```sh
    export DEBUG=development
    ```

1. Run the container:

    ```sh
    docker run -it -p 5000:5000 file-service
    ```

1. curl `http://localhost:5000`

### Run tests

1. Set the Environment variable

    ```sh
    export DEBUG=test
    ```

1. With the service up, run:

    ```sh
    ...
    ```
