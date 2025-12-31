/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { Order } from "@point_of_sale/app/store/models";

// helpers simples
function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatCR(iso) {
  const d = new Date(iso);
  return (
    pad2(d.getDate()) +
    "/" +
    pad2(d.getMonth() + 1) +
    "/" +
    d.getFullYear() +
    " " +
    pad2(d.getHours()) +
    ":" +
    pad2(d.getMinutes()) +
    ":" +
    pad2(d.getSeconds())
  );
}

patch(Order.prototype, {
  export_for_printing() {
    const data = super.export_for_printing(...arguments);

    const p = this.get_partner?.() || null;

    // ✅ Snapshot partner
    data.partner_snapshot = p
      ? {
          id: p.id,
          name: p.name || "",
          vat: p.vat || "",
          phone: p.phone || "",
          user_id: p.user_id || null,
        }
      : null;

    // ✅ Snapshot fecha (ISO + formateada)
    const iso = this.date_order || new Date().toISOString();
    data.order_date_iso = iso;
    data.order_date_fmt = formatCR(iso); // 👈 ESTA ES LA QUE VAS A IMPRIMIR

    return data;
  },
});
