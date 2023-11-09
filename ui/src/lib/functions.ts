import type { Payload } from "$lib/custom-types";

export async function getToken(apiUrl: string, p: Payload) {
  const _p = JSON.parse(JSON.stringify(p));

  // undefined as value is used to differ the empty password and an undefined
  // one
  if (_p.cntx_room_password === "undefined") {
    _p.cntx_room_password = undefined;
  }

  const req = new Request(apiUrl, {
    method: "POST",
    body: JSON.stringify(_p),
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
