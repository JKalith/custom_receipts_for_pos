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

                // si ya existe no recargar
                if (receipt.date_original) return;

                // usa un ref válido del ticket
                const ref = receipt?.name || receipt?.pos_reference || this.pos?.get_order()?.name;
                if (!ref) return;

                const orm = this.env.services.orm;

                // ✅ correcto: pasar pos_reference como parámetro posicional
                const d = await orm.call("pos.order", "pos_get_order_date", [ref]);

                if (d) {
                    receipt.date_original = String(d).replace("T", " ").replace("Z", "");
                    this.render(true); // refrescar ticket
                }
            } catch (e) {
                // silencioso
            }
        });
    },
});
