FROM denoland/deno

COPY jitok.ts /app/

USER deno
WORKDIR /app
EXPOSE 9000

CMD ["deno", "run", "--allow-net", "jitok.ts"]
