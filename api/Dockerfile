FROM denoland/deno

ENV BUILT_AT=20251212-1

WORKDIR /app

COPY jitok.ts /app/
RUN deno cache /app/jitok.ts

USER deno
EXPOSE 9000

CMD ["deno", "run", "--allow-net", "jitok.ts"]
