<script lang="ts">
  import type { Payload } from "$lib/custom-types";
  import FieldDatetime from "$lib/components/field-datetime.svelte";
  import FieldPassword from "$lib/components/field-password.svelte";
  import FieldRadio from "$lib/components/field-radio.svelte";
  import FieldRadioInline from "$lib/components/field-radio-inline.svelte";
  import FieldSelect from "$lib/components/field-select.svelte";
  import FieldText from "$lib/components/field-text.svelte";
  import { getToken } from "$lib/functions";
  import { affiOptions, algOptions, defaultOptions } from "$lib/globals";

  let apiUrl: string;
  let host = "https://jitsi.mydomain.corp/myroom";
  let hasToken = false;
  let token = "no token yet";
  let tokenColor = "text-muted";

  const _time = new Date();
  const _nbf = new Date(
    _time.getTime() - 60 * 1000 * _time.getTimezoneOffset(),
  );
  const _exp = new Date(_nbf.getTime() + 4 * 3600 * 1000);
  let payload: Payload = {
    alg: "HS256",
    secret: "myappsecret",
    aud: "myappid",
    iss: "",
    sub: "*",
    room: "*",
    nbf: _nbf.toISOString().slice(0, 16),
    exp: _exp.toISOString().slice(0, 16),
    cntx_user_id: "",
    cntx_user_name: "",
    cntx_user_email: "",
    cntx_user_avatar: "",
    cntx_user_affi: undefined,
    cntx_user_lobby_bypass: undefined,
    cntx_user_security_bypass: undefined,
    cntx_room_lobby: undefined,
    cntx_room_password: "undefined",
    cntx_feat_rec: undefined,
    cntx_feat_live: undefined,
    cntx_feat_screen: undefined,
    cntx_feat_sip_outbound_call: undefined,
  };

  async function setToken() {
    hasToken = false;
    token = "no token yet";
    tokenColor = "text-muted";

    if (!apiUrl) {
      // get the hardcoded API URL from ui/static/config/api-url
      const res = await fetch("/config/api-url");
      if (!res.ok) return;
      apiUrl = await res.text();
    }

    const _token = await getToken(apiUrl, payload);

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
        <FieldPassword label="secret" bind:secret={payload.secret} />
        <FieldText name="aud" required={true} bind:value={payload.aud} />
        <FieldText name="iss" required={false} bind:value={payload.iss} />
        <FieldText name="sub" required={false} bind:value={payload.sub} />
        <FieldText name="room" required={false} bind:value={payload.room} />
        <FieldDatetime name="nbf" required={false} bind:value={payload.nbf} />
        <FieldDatetime name="exp" required={false} bind:value={payload.exp} />
      </div>

      <div class="col-lg text-center" style="max-width:540px;">
        <h5 class="text-muted mt-3">User</h5>

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

        <h5 class="text-muted mt-3">Room</h5>

        <FieldPassword
          label="password"
          bind:secret={payload.cntx_room_password}
          required={false}
        />

        <div class="row justify-content-center">
          <div class="col-12" style="max-width:540px;">
            <FieldRadioInline
              title="lobby"
              name="lobby"
              bind:value={payload.cntx_room_lobby}
              options={defaultOptions}
            />
          </div>
        </div>
      </div>

      <div class="col-lg text-center" style="max-width:540px;">
        <h5 class="text-muted mt-3">Permissions</h5>

        <div class="row justify-content-center">
          <div class="col-6" style="max-width:270px;">
            <FieldRadio
              title="affiliation"
              name="affi"
              bind:value={payload.cntx_user_affi}
              options={affiOptions}
            />
            <FieldRadio
              title="lobby-bypass"
              name="lobby_bypass"
              bind:value={payload.cntx_user_lobby_bypass}
              options={defaultOptions}
            />
          </div>
          <div class="col-6" style="max-width:270px;">
            <FieldRadio
              title="security-bypass"
              name="security_bypass"
              bind:value={payload.cntx_user_security_bypass}
              options={defaultOptions}
            />
          </div>
        </div>

        <h5 class="text-muted mt-3">Features</h5>

        <div class="row justify-content-center">
          <div class="col-6" style="max-width:270px;">
            <FieldRadio
              title="recording"
              name="rec"
              bind:value={payload.cntx_feat_rec}
              options={defaultOptions}
            />
            <FieldRadio
              title="streaming"
              name="live"
              bind:value={payload.cntx_feat_live}
              options={defaultOptions}
            />
          </div>

          <div class="col-6" style="max-width:270px;">
            <FieldRadio
              title="screen-sharing"
              name="screen"
              bind:value={payload.cntx_feat_screen}
              options={defaultOptions}
            />
            <FieldRadio
              title="sip-outbound-call"
              name="sip-outbound-call"
              bind:value={payload.cntx_feat_sip_outbound_call}
              options={defaultOptions}
            />
          </div>
        </div>
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
    <div class="col input-group my-3" style="max-width:540px;">
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

  <div class="row justify-content-center">
    <div class="col text-center text-break" style="max-width:1080px;">
      {#if hasToken}
        <h6 class="text-muted mt-3">{host}?jwt={token}</h6>
      {/if}
    </div>
  </div>
</div>
