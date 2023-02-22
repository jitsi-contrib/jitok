FROM denoland/deno

WORKDIR /app

COPY jitok.ts /app/

USER deno
EXPOSE 9000

CMD ["deno", "run", "--allow-net", "jitok.ts"]
