import type { Payload } from "$lib/custom-types";

export async function getToken(apiUrl: string, p: Payload) {
  const req = new Request(apiUrl, {
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
