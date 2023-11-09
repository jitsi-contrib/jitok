## Dockerized instance

```bash
docker build -t jitok-ui .
docker run -p 3000:3000 -e API_URL=http://127.0.0.1:9000/api jitok-ui
```

## Standalone setup

#### installation

- Install `nodejs`, `yarn` and `git` packages.

- Get a copy of the repo (don't run as `root`):

```bash
git clone https://github.com/jitsi-contrib/jitok.git
```

- Install modules (don't run as `root`):

```bash
cd jitok/ui
yarn install
```

#### configuration

Set `API_URL` in [static/config/api-url](/ui/static/config/api-url) according
to your environment.

```text
http://127.0.0.1:9000/api
```

#### running (dev)

```bash
yarn run dev --host --port 3000
```

#### running (prod)

Build the static files:

```bash
yarn run build
```

Configure your web server to point to the `build` folder.
_e.g. for `Nginx`_

```config
location / {
    root /home/jitok/ui/build;
    try_files $uri /index.html;
}
```
