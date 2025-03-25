export interface Option {
  optName: string;
  optValue: undefined | number | string;
}

export interface Payload {
  alg: "HS256" | "HS512";
  secret: string;
  aud: string;
  iss: string;
  sub: string;
  room: string;
  nbf: string;
  exp: string;
  cntx_user_id: string;
  cntx_user_name: string;
  cntx_user_email: string;
  cntx_user_avatar: string;
  cntx_user_affi: undefined | "owner" | "member";
  cntx_user_lobby_bypass: undefined | 0 | 1;
  cntx_user_security_bypass: undefined | 0 | 1;
  cntx_room_lobby: undefined | 0 | 1;
  cntx_room_lobby_autostart: undefined | 0 | 1;
  cntx_room_password: string;
  cntx_feat_rec: undefined | 0 | 1;
  cntx_feat_live: undefined | 0 | 1;
  cntx_feat_screen: undefined | 0 | 1;
  cntx_feat_sip_outbound_call: undefined | 0 | 1;
}
