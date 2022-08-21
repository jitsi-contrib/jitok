import { API_URL } from "$lib/config";
import type { Payload } from "$lib/custom-types";

export async function getToken(p: Payload) {
  const req = new Request(API_URL, {
    method: "POST",
    body: JSON.stringify(p),
    mode: "cors",
  });

  const token = await fetch(req)
    .then(async (res) => {
      if (!res.ok) throw new Error("invalid token");
      return await res.text();
    })
    .then((data) => {
      return data;
    })
    .catch(() => {
      return "error";
    });

  return token;
}
