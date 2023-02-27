FROM denoland/deno

WORKDIR /app

COPY jitok.ts /app/
RUN deno cache /app/jitok.ts

USER deno
EXPOSE 9000

CMD ["deno", "run", "--allow-net", "jitok.ts"]
