FROM denoland/deno

ENV BUILT_AT=20260317-1

WORKDIR /app

COPY jitok.ts /app/
RUN deno cache /app/jitok.ts

USER deno
EXPOSE 9000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["run", "--allow-net", "jitok.ts"]
