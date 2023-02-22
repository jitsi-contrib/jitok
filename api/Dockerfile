FROM denoland/deno

EXPOSE 9000

WORKDIR /app

USER deno

COPY jitok.ts /app/

CMD ["deno", "run", "--allow-net", "jitok.ts"]
