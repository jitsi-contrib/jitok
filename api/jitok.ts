// ----------------------------------------------------------------------------
// jitok.ts
// ----------------------------------------------------------------------------
import { STATUS_CODE } from "jsr:@std/http/status";
import { Algorithm } from "jsr:@emrahcom/jwt/algorithm";
import { create, getNumericDate } from "jsr:@emrahcom/jwt";
import type { Header, Payload } from "jsr:@emrahcom/jwt";

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
    status: STATUS_CODE.OK,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

// ----------------------------------------------------------------------------
function badRequest(): Response {
  return new Response("BadRequest", {
    status: STATUS_CODE.BadRequest,
  });
}

// ----------------------------------------------------------------------------
function forbidden(): Response {
  return new Response("Forbidden", {
    status: STATUS_CODE.Forbidden,
  });
}

// ----------------------------------------------------------------------------
function notImplemented(): Response {
  return new Response("NotImplemented", {
    status: STATUS_CODE.NotImplemented,
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
    if (typeof ps.nbf !== "number") {
      try {
        const nbf = new Date(String(ps.nbf));
        ps.nbf = Math.floor(nbf.getTime() / 1000);
      } catch {
        throw new BadRequest("invalid nbf");
      }
    } else {
      try {
        ps.nbf = getNumericDate(ps.nbf);
      } catch {
        throw new BadRequest("invalid nbf");
      }
    }
  }
  // exp
  if (ps.exp) {
    if (typeof ps.exp !== "number") {
      try {
        const exp = new Date(String(ps.exp));
        ps.exp = Math.floor(exp.getTime() / 1000);
      } catch {
        throw new BadRequest("invalid exp");
      }
    } else {
      try {
        ps.exp = getNumericDate(ps.exp);
      } catch {
        throw new BadRequest("invalid exp");
      }
    }
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
  const room: Dict = {};
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
  if (inp.nbf) pl.nbf = Number(inp.nbf);
  if (inp.exp) pl.exp = Number(inp.exp);

  // payload.context.user
  if (inp.cntx_user_id) user["id"] = String(inp.cntx_user_id);
  if (inp.cntx_user_name) user["name"] = String(inp.cntx_user_name);
  if (inp.cntx_user_email) user["email"] = String(inp.cntx_user_email);
  if (inp.cntx_user_affi) user["affiliation"] = String(inp.cntx_user_affi);
  if (inp.cntx_user_avatar) user["avatar"] = String(inp.cntx_user_avatar);
  if (inp.cntx_user_lobby_bypass !== undefined) {
    if (
      inp.cntx_user_lobby_bypass === 1 || inp.cntx_user_lobby_bypass === true
    ) {
      user["lobby_bypass"] = true;
    } else {
      user["lobby_bypass"] = false;
    }
  }
  if (inp.cntx_user_security_bypass !== undefined) {
    if (
      inp.cntx_user_security_bypass === 1 ||
      inp.cntx_user_security_bypass === true
    ) {
      user["security_bypass"] = true;
    } else {
      user["security_bypass"] = false;
    }
  }

  // payload.context.room
  if (inp.cntx_room_password !== undefined) {
    room["password"] = String(inp.cntx_room_password);
  }
  if (inp.cntx_room_lobby !== undefined) {
    if (inp.cntx_room_lobby === 1 || inp.cntx_room_lobby === true) {
      room["lobby"] = true;
    } else {
      room["lobby"] = false;
    }
  }
  if (inp.cntx_room_lobby_autostart !== undefined) {
    if (
      inp.cntx_room_lobby_autostart === 1 ||
      inp.cntx_room_lobby_autostart === true
    ) {
      room["lobby_autostart"] = true;
    } else {
      room["lobby_autostart"] = false;
    }
  }

  // payload.context.features
  if (inp.cntx_feat_rec !== undefined) {
    if (inp.cntx_feat_rec === 1 || inp.cntx_feat_rec === true) {
      feat["recording"] = "true";
    } else {
      feat["recording"] = "false";
    }
  }
  if (inp.cntx_feat_live !== undefined) {
    if (inp.cntx_feat_live === 1 || inp.cntx_feat_live === true) {
      feat["livestreaming"] = "true";
    } else {
      feat["livestreaming"] = "false";
    }
  }
  if (inp.cntx_feat_screen !== undefined) {
    if (inp.cntx_feat_screen === 1 || inp.cntx_feat_screen === true) {
      feat["screen-sharing"] = "true";
    } else {
      feat["screen-sharing"] = "false";
    }
  }
  if (inp.cntx_feat_transcription !== undefined) {
    if (
      inp.cntx_feat_transcription === 1 ||
      inp.cntx_feat_transcription === true
    ) {
      feat["transcription"] = "true";
    } else {
      feat["transcription"] = "false";
    }
  }

  // payload.context
  if (Object.keys(user).length) cntx["user"] = user;
  if (Object.keys(room).length) cntx["room"] = room;
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
    if (e instanceof Error && e.name === "BadRequest") return badRequest();
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
  Deno.serve({
    hostname: HOSTNAME,
    port: PORT,
  }, handler);
}

// ----------------------------------------------------------------------------
main();
