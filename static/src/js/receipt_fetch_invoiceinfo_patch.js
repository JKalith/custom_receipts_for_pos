/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { ReceiptScreen } from "@point_of_sale/app/screens/receipt_screen/receipt_screen";
import { onMounted } from "@odoo/owl";

patch(ReceiptScreen.prototype, {
    setup() {
        super.setup();

        onMounted(async () => {
            try {
                const receipt = this.props?.receipt;
                if (!receipt) return;

                receipt.headerData = receipt.headerData || {};
                if (receipt.headerData.invoiceInfo) return;

                // 🔑 Referencia válida (según tu pantalla)
                const ref =
                    receipt.uid ||
                    receipt.name ||
                    receipt.pos_reference ||
                    receipt.headerData.trackingNumber;

                if (!ref) return;

                const orm = this.env.services.orm;
                const info = await orm.call(
                    "pos.order",
                    "pos_get_invoice_info",
                    [ref]
                );

                receipt.headerData.invoiceInfo = info;
                this.render(true);
            } catch (e) {
                console.log("Error invoiceInfo:", e);
            }
        });
    },
});
