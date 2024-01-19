# My2A

Useful website to manage student application form at the begining of the 2nd year at Ecole des Ponts ParisTech

## Installation [DEV]

To install and run this project, follow these steps:

1. Clone the repository:

    ```shell
    git clone https://github.com/adcrry/my2a
    ```

2. Setup environment variables (edit .env file if needed)

    ```shell
    cp .env-example .env
    ```

3. Build images

    ```shell
    docker compose build
    ```

4. Run 

    ```shell
    docker compose up
    ```

5. Open your web browser and visit `http://localhost/` to view the application.

## Production

1. Clone the repository:

    ```shell
    git clone https://github.com/adcrry/my2a
    ```

2. Setup environment variables (edit .env file if needed)

    ```shell
    cp .env-example .env
    ```

3. Build images

    ```shell
    docker compose build
    ```

4. Run 

    ```shell
    docker compose up
    ```
 
5. Do not forget to setup a reverse proxy that redirect my2a.enpc.org to the my2a's proxy.
