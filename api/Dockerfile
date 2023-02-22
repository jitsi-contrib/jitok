FROM denoland/deno

USER deno

WORKDIR /app

COPY jitok.ts /app/

EXPOSE 9000

CMD ["deno", "run", "--allow-net", "jitok.ts"]
