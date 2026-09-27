// Panel de administracion: alta y gestion de usuarios (solo visible para admins).
// Se importa de forma perezosa desde main.js al entrar en #/admin.

import { el } from "./core/utils.js";
import { toast } from "./core/toast.js";
import { askConfirm } from "./desktop/dialogs.js";

function setBusy(btn, busy) {
  btn.disabled = busy;
  btn.classList.toggle("busy", busy);
  btn.setAttribute("aria-busy", busy ? "true" : "false");
}

export function renderAdmin(container, { api, refreshQuota }) {
  container.textContent = "";

  container.append(
    el("h2", { class: "admin-title", text: "Administracion de usuarios" }),
    el("p", { class: "muted", text: "Los usuarios nuevos reciben un vault cifrado vacio. Tu cuenta y la contraseña de la boveda no se pueden leer desde aqui." })
  );

  const form = buildCreateForm(api, () => load());
  container.append(form);

  const tableWrap = el("div", { class: "admin-table-wrap" });
  container.append(tableWrap);

  async function load() {
    try {
      const users = await api.adminUsers();
      tableWrap.textContent = "";
      tableWrap.append(renderTable(users, api, container, refreshQuota));
    } catch (err) {
      tableWrap.textContent = "";
      tableWrap.append(el("p", { class: "form-error", text: err.message }));
    }
  }

  async function afterChange(msg) {
    toast(msg, "ok");
    await load();
  }

  load();
}

function buildCreateForm(api, onDone) {
  const wrap = el("div", { class: "card" });
  const grid = el("div", { class: "admin-form" });

  const usernameI = el("input", { class: "field-input", placeholder: "usuario", autocapitalize: "none", spellcheck: "false" });
  const displayI = el("input", { class: "field-input", placeholder: "Nombre visible" });
  const passI = el("input", { class: "field-input", type: "password", placeholder: "Contrasena", autocomplete: "new-password" });
  const quotaI = el("input", { class: "field-input", type: "number", min: "1", step: "1", value: "100", title: "Quota en MB (defecto 100; DB D1 free compartida)" });

  grid.append(
    field(usernameI, "Usuario"),
    field(displayI, "Nombre visible"),
    field(passI, "Contrasena"),
    field(quotaI, "Quota (MB)")
  );

  const btn = el("button", { class: "btn btn-primary", type: "button", text: "Crear usuario" });
  btn.addEventListener("click", async () => {
    const username = usernameI.value.trim();
    const password = passI.value;
    if (!username || !password) {
      toast("Indica usuario y contrasena", "warn");
      return;
    }
    const quotaBytes = (parseInt(quotaI.value, 10) || 100) * 1024 * 1024;
    setBusy(btn, true);
    try {
      await api.adminCreateUser({
        username,
        displayName: displayI.value.trim() || username,
        password,
        quotaBytes,
      });
      usernameI.value = "";
      displayI.value = "";
      passI.value = "";
      onDone();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(btn, false);
    }
  });

  wrap.append(grid, el("div", { class: "admin-form-actions" }, [btn]));
  return wrap;
}

function field(input, label) {
  return el("label", { class: "field" }, [
    el("span", { class: "field-label", text: label }),
    input,
  ]);
}

function renderTable(users, api, ctx, refreshQuota) {
  const table = el("table", { class: "admin-table" });
  const head = el("thead", {}, [
    el("tr", {}, [
      el("th", { text: "Usuario" }),
      el("th", { text: "Rol" }),
      el("th", { text: "Estado" }),
      el("th", { text: "Quota" }),
      el("th", { text: "Acciones" }),
    ]),
  ]);

  const tbody = el("tbody");
  for (const u of users) {
    const tr = el("tr", {});
    const usedStr = formatQuota(u.quotaUsed) + " / " + formatQuota(u.quotaBytes);

    const actions = el("td", { class: "admin-actions" });
    if (u.role !== "admin") {
      if (u.status === "disabled") {
        actions.append(actionBtn("Activar", async () => {
          await api.adminPatchUser(u.id, { status: "enabled" });
          toast("Usuario activado", "ok");
          await reload();
        }));
      } else {
        actions.append(actionBtn("Deshabilitar", async () => {
          await api.adminPatchUser(u.id, { status: "disabled" });
          toast("Usuario deshabilitado", "ok");
          await reload();
        }));
      }
      actions.append(actionBtn("Borrar", async () => {
        const yes = await askConfirm({
          title: "Eliminar usuario",
          text: 'Se eliminaran la cuenta, el vault y todos los datos de "' + u.username + '". Esta accion no se puede deshacer.',
          okLabel: "Eliminar",
          okKind: "btn-danger",
        });
        if (!yes) return false;
        await api.adminDeleteUser(u.id);
        toast("Usuario eliminado", "ok");
        await reload();
        return true;
      }, "danger"));
    } else {
      actions.append(el("span", { class: "muted", text: "—" }));
    }

    tr.append(
      el("td", {}, [el("strong", { text: u.username }), el("div", { class: "muted", text: u.displayName || "" })]),
      el("td", { text: u.role }),
      el("td", { text: u.status }),
      el("td", { text: usedStr }),
      actions
    );
    tbody.append(tr);
  }

  table.append(head, tbody);

  async function reload() {
    const next = await api.adminUsers();
    const wrap = ctx.querySelector(".admin-table-wrap");
    if (wrap) wrap.textContent = "";
    if (wrap) wrap.append(renderTable(next, api, ctx, refreshQuota));
    refreshQuota();
  }

  return table;
}

function actionBtn(label, handler, kind) {
  const b = el("button", { class: "btn btn-ghost btn-sm" + (kind === "danger" ? " btn-danger-ghost" : ""), text: label, type: "button" });
  b.addEventListener("click", async () => {
    setBusy(b, true);
    try {
      await handler();
    } finally {
      setBusy(b, false);
    }
  });
  return b;
}

function formatQuota(n) {
  if (n == null) return "?";
  const mb = n / (1024 * 1024);
  if (mb < 1024) return mb.toFixed(1) + " MB";
  return (mb / 1024).toFixed(2) + " GB";
}