<script lang="ts">
  import type { Payload } from "$lib/custom-types";
  import FieldText from "$lib/components/field-text.svelte";
  import FieldPassword from "$lib/components/field-password.svelte";
  import FieldNumber from "$lib/components/field-number.svelte";
  import FieldSelect from "$lib/components/field-select.svelte";
  import FieldRadio from "$lib/components/field-radio.svelte";
  import { getToken } from "$lib/functions";
  import {
    algOptions,
    affiOptions,
    recOptions,
    liveOptions,
    screenOptions,
    lobbyOptions,
  } from "$lib/globals";

  let host = "https://jitsi.mydomain.com/myroom";
  let hasToken = false;
  let token = "no token yet";
  let tokenColor = "text-muted";
  let payload: Payload = {
    alg: "HS256",
    secret: "myappsecret",
    aud: "myappid",
    iss: "",
    sub: "*",
    room: "*",
    nbf: 0,
    exp: 3600,
    cntx_user_id: "",
    cntx_user_name: "",
    cntx_user_email: "",
    cntx_user_avatar: "",
    cntx_user_affi: undefined,
    cntx_feat_rec: undefined,
    cntx_feat_live: undefined,
    cntx_feat_screen: undefined,
    cntx_feat_lobby_bypass: undefined,
  };

  async function setToken() {
    hasToken = false;
    token = "no token yet";
    tokenColor = "text-muted";
    payload.nbf = Number(payload.nbf) || 0;
    payload.exp = Number(payload.exp) || 3600;

    const _token = await getToken(payload);

    if (_token === "error") {
      tokenColor = "text-danger";
    } else {
      hasToken = true;
      tokenColor = "text-success";
    }

    token = _token;
  }

  function connectToMeeting() {
    if (host && hasToken) {
      window.open(`${host}?jwt=${token}`, "_blank");
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<div class="container-fluid">
  <form on:submit|preventDefault={setToken}>
    <div class="row justify-content-center">
      <div class="col-lg text-center" style="max-width:540px;">
        <h5 class="text-muted mt-3">System</h5>

        <FieldSelect name="alg" bind:value={payload.alg} options={algOptions} />
        <FieldPassword bind:secret={payload.secret} />
        <FieldText name="aud" required={true} bind:value={payload.aud} />
        <FieldText name="iss" required={false} bind:value={payload.iss} />
        <FieldText name="sub" required={false} bind:value={payload.sub} />
        <FieldText name="room" required={false} bind:value={payload.room} />
        <FieldNumber name="nbf (sec)" required={false} bind:value={payload.nbf} />
        <FieldNumber name="exp (sec)" required={false} bind:value={payload.exp} />
      </div>

      <div class="col-lg text-center" style="max-width:540px;">
        <h5 class="text-muted mt-3">User Profile</h5>

        <FieldText
          name="username"
          required={false}
          bind:value={payload.cntx_user_name}
        />
        <FieldText
          name="user id"
          required={false}
          bind:value={payload.cntx_user_id}
        />
        <FieldText
          name="email"
          required={false}
          bind:value={payload.cntx_user_email}
        />
        <FieldText
          name="avatar link"
          required={false}
          bind:value={payload.cntx_user_avatar}
        />
        <FieldRadio
          title="affiliation"
          name="affi"
          bind:value={payload.cntx_user_affi}
          options={affiOptions}
        />
      </div>

      <div class="col-lg text-center" style="max-width:540px;">
        <h5 class="text-muted mt-3">Features</h5>

        <FieldRadio
          title="recording"
          name="rec"
          bind:value={payload.cntx_feat_rec}
          options={recOptions}
        />
        <FieldRadio
          title="streaming"
          name="live"
          bind:value={payload.cntx_feat_live}
          options={liveOptions}
        />
        <FieldRadio
          title="screen-sharing"
          name="screen"
          bind:value={payload.cntx_feat_screen}
          options={screenOptions}
        />
        <FieldRadio
          title="lobby-bypass"
          name="lobby_bypass"
          bind:value={payload.cntx_feat_lobby_bypass}
          options={lobbyOptions}
        />
      </div>
    </div>

    <div class="row justify-content-center">
      <div
        class="col text-center {tokenColor} text-break mx-3 my-3"
        style="max-width:1080px;"
      >
        {token}
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col text-center mb-3">
        <button class="btn btn-secondary" type="submit">Update Token</button>
      </div>
    </div>
  </form>

  <hr />

  <div class="row justify-content-center">
    <div class="col input-group my-3"  style="max-width:540px;">
      <input type="text" class="form-control" id="host" bind:value={host} />
      <button
        class="btn btn-secondary input-group-text"
        on:click={connectToMeeting}
        disabled={!(hasToken && host)}
      >
        Go with token
      </button>
    </div>
  </div>
</div>
