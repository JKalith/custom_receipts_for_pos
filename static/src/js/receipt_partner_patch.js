/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { Order } from "@point_of_sale/app/store/models";

patch(Order.prototype, {
  export_for_printing() {
    const data = super.export_for_printing(...arguments);

    // En POS, el cliente del pedido suele estar en this.get_partner()
    const partner = this.get_partner?.() || this.partner || null;

    data.partner_name = partner?.name || "";
    data.partner_vat = partner?.vat || "";
    data.partner_phone = partner?.phone || "";
    data.partner_email = partner?.email || "";

    return data;
  },
});
