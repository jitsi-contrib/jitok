// ----------------------------------------------------------------------------
// jitok.ts
// ----------------------------------------------------------------------------
import { serve } from "https://deno.land/std/http/server.ts";
import { Status } from "https://deno.land/std/http/http_status.ts";
import { Algorithm } from "https://deno.land/x/djwt/algorithm.ts";
import {
  create,
  getNumericDate,
  Header,
  Payload,
} from "https://deno.land/x/djwt/mod.ts";

const HOSTNAME = "0.0.0.0";
const PORT = 9000;

// ----------------------------------------------------------------------------
interface Token {
  header: Header;
  payload: Payload;
  cryptoKey: CryptoKey;
}

// ----------------------------------------------------------------------------
interface Dict {
  [key: string]: unknown;
}

// ----------------------------------------------------------------------------
class BadRequest extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "BadRequest";
  }
}

// ----------------------------------------------------------------------------
function ok(body: string): Response {
  return new Response(body, {
    status: Status.OK,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

// ----------------------------------------------------------------------------
function badRequest(): Response {
  return new Response("BadRequest", {
    status: Status.BadRequest,
  });
}

// ----------------------------------------------------------------------------
function forbidden(): Response {
  return new Response("Forbidden", {
    status: Status.Forbidden,
  });
}

// ----------------------------------------------------------------------------
function notImplemented(): Response {
  return new Response("NotImplemented", {
    status: Status.NotImplemented,
  });
}

// ----------------------------------------------------------------------------
function validateInput(ps: Dict): Dict {
  // secret
  if (!ps.secret) throw new BadRequest("secret not found");
  if (typeof ps.secret !== "string") throw new BadRequest("invalid secret");
  if (!ps.secret.match("^[0-9a-zA-Z _.!@#$*+-]+$")) {
    throw new BadRequest("invalid character in secret");
  }
  // aud
  if (!ps.aud) throw new BadRequest("aud not found");
  if (typeof ps.aud !== "string") throw new BadRequest("invalid aud");
  if (!ps.aud.match("^[0-9a-zA-Z._-]+$")) {
    throw new BadRequest("invalid character in aud");
  }
  // iss
  if (ps.iss) {
    if (typeof ps.iss !== "string") throw new BadRequest("invalid iss");
    if (!ps.iss.match("^([*]|[0-9a-zA-Z._-]+)$")) {
      throw new BadRequest("invalid character in iss");
    }
  }
  // sub
  if (ps.sub) {
    if (typeof ps.sub !== "string") throw new BadRequest("invalid sub");
    if (!ps.sub.match("^([*]|[0-9a-zA-Z._-]+)$")) {
      throw new BadRequest("invalid character in sub");
    }
  }
  // room
  if (ps.room) {
    if (typeof ps.room !== "string") throw new BadRequest("invalid room");
    if (!ps.room.match("^([*]|[^<>&%/?'\"\\\\]+)$")) {
      throw new BadRequest("invalid character in room");
    }
  }
  // nbf
  if (ps.nbf) {
    if (typeof ps.nbf !== "number") throw new BadRequest("invalid nbf");
  }
  // exp
  if (ps.exp) {
    if (typeof ps.exp !== "number") throw new BadRequest("invalid exp");
  }

  return ps;
}

// ----------------------------------------------------------------------------
async function getCryptoKey(secret: string, hash: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    {
      name: "HMAC",
      hash: hash,
    },
    true,
    ["sign", "verify"],
  );

  return cryptoKey;
}

// ----------------------------------------------------------------------------
async function createToken(inp: Dict): Promise<Token> {
  let alg: Algorithm = "HS256";
  let hash = "SHA-256";

  if (inp.alg && inp.alg === "HS512") {
    alg = "HS512";
    hash = "SHA-512";
  }

  const cryptoKey = await getCryptoKey(String(inp.secret), hash);
  const user: Dict = {};
  const feat: Dict = {};
  const cntx: Dict = {};
  const pl: Payload = {
    aud: "",
    iss: "",
    sub: "*",
    room: "*",
    iat: getNumericDate(0),
    nbf: getNumericDate(0),
    exp: getNumericDate(3600),
  };

  // payload
  if (inp.aud) pl.aud = String(inp.aud);
  (inp.iss) ? pl.iss = String(inp.iss) : pl.iss = String(inp.aud);
  if (inp.sub) pl.sub = String(inp.sub);
  if (inp.room) pl.room = String(inp.room);
  if (inp.nbf) pl.nbf = getNumericDate(Number(inp.nbf));
  if (inp.exp) pl.exp = getNumericDate(Number(inp.exp));
  // payload.context.user
  if (inp.cntx_user_id) user["id"] = String(inp.cntx_user_id);
  if (inp.cntx_user_name) user["name"] = String(inp.cntx_user_name);
  if (inp.cntx_user_email) user["email"] = String(inp.cntx_user_email);
  if (inp.cntx_user_affi) user["affiliation"] = String(inp.cntx_user_affi);
  if (inp.cntx_user_avatar) user["avatar"] = String(inp.cntx_user_avatar);
  // payload.context.features
  if (inp.cntx_feat_rec !== undefined) {
    if (inp.cntx_feat_rec === 1 || inp.cntx_feat_rec === true) {
      feat["recording"] = true;
    } else {
      feat["recording"] = false;
    }
  }
  if (inp.cntx_feat_live !== undefined) {
    if (inp.cntx_feat_live === 1 || inp.cntx_feat_live === true) {
      feat["livestreaming"] = true;
    } else {
      feat["livestreaming"] = false;
    }
  }
  if (inp.cntx_feat_screen !== undefined) {
    if (inp.cntx_feat_screen === 1 || inp.cntx_feat_screen === true) {
      feat["screen-sharing"] = true;
    } else {
      feat["screen-sharing"] = false;
    }
  }
  if (inp.cntx_feat_lobby_bypass !== undefined) {
    if (
      inp.cntx_feat_lobby_bypass === 1 || inp.cntx_feat_lobby_bypass === true
    ) {
      feat["lobby_bypass"] = true;
    } else {
      feat["lobby_bypass"] = false;
    }
  }
  // payload.context
  if (Object.keys(user).length) cntx["user"] = user;
  if (Object.keys(feat).length) cntx["features"] = feat;
  if (Object.keys(cntx).length) pl["context"] = cntx;

  return {
    header: { alg: alg, typ: "JWT" },
    cryptoKey: cryptoKey,
    payload: pl,
  };
}

// ----------------------------------------------------------------------------
async function createJWT(tk: Token): Promise<string> {
  const jwt = await create(tk.header, tk.payload, tk.cryptoKey);

  return jwt;
}

// ----------------------------------------------------------------------------
async function triggerJWT(req: Request): Promise<Response> {
  try {
    const ps = await req.json();
    const inp = validateInput(ps);
    const tk = await createToken(inp);
    return await createJWT(tk).then((jwt) => ok(jwt));
  } catch (e) {
    if (e.name === "BadRequest") return badRequest();
    else return notImplemented();
  }
}

// ----------------------------------------------------------------------------
async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  if ((req.method === "POST") && (path.match("^/api"))) {
    return await triggerJWT(req);
  } else return forbidden();
}

// ----------------------------------------------------------------------------
function main() {
  serve(handler, {
    hostname: HOSTNAME,
    port: PORT,
  });
}

// ----------------------------------------------------------------------------
main();
