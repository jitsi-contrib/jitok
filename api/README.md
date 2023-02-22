## Dockerized instance

```bash
docker build -t jitok-api .
docker run -p 9000:9000 jitok-api
```

## Standalone setup

#### installation

- Install packages as `root`:

```bash
apt-get install unzip curl git
```

- Install `deno` as `root`:

```bash
cd /tmp
wget -T 30 -O deno.zip https://github.com/denoland/deno/releases/latest/download/deno-x86_64-unknown-linux-gnu.zip
unzip -o deno.zip
cp /tmp/deno /usr/local/bin/

deno --version
```

- Get a copy of the repo (_don't run as `root`_):

```bash
git clone https://github.com/jitsi-contrib/jitok.git
```

#### running

Don't run as `root`:

```bash
cd jitok/api
bash jitok.sh
```
