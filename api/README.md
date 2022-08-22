#### install

Install packages as `root`:

```bash
apt-get install unzip curl git
```

Install `deno` as `root`:

```bash
cd /tmp

LATEST=$(curl -sSf https://github.com/denoland/deno/releases | \
  grep -o "/denoland/deno/releases/download/.*/deno-.*linux.*\.zip" | \
  head -n1)
echo $LATEST

wget -T 30 -O deno.zip https://github.com/$LATEST
unzip -o deno.zip
cp /tmp/deno /usr/local/bin/

deno --version
```

Get a copy of the repo (_don't run as `root`_):

```bash
git clone https://github.com/jitsi-contrib/jitok.git
```

#### running

Don't run as `root`:

```bash
cd jitok/api
bash jitok.sh
```
