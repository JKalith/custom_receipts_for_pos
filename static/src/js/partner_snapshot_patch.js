/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { Order } from "@point_of_sale/app/store/models";

patch(Order.prototype, {
  export_for_printing() {
    const data = super.export_for_printing(...arguments);

    const p = this.get_partner?.() || null;

    // Snapshot: esto queda "congelado" en el recibo
    data.partner_snapshot = p
      ? {
          id: p.id,
          name: p.name || "",
          vat: p.vat || "",
          phone: p.phone || "",
          user_id: p.user_id || null, // many2one => [id, nombre]
        }
      : null;
    // ✅ Snapshot fecha (historial/reprint)
    data.order_date_iso = this.date_order || new Date().toISOString();
    return data;
  },
});
