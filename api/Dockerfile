FROM denoland/deno

WORKDIR /app

COPY jitok.ts /app/

EXPOSE 9000

USER deno

CMD ["deno", "run", "--allow-net", "jitok.ts"]
