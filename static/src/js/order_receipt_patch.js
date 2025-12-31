/** @odoo-module */

import { OrderReceipt } from "@point_of_sale/app/screens/receipt_screen/receipt/order_receipt";
import { patch } from "@web/core/utils/patch";
import { useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

patch(OrderReceipt.prototype, {
    setup() {
        super.setup();

        // ✅ Servicios que sí se usan en POS
        this.pos = useService("pos");
        this.orm = useService("orm");

        // ✅ Estado donde guardaremos lo que venga del backend
        this.state = useState({
            invoiceInfo: null,
        });

        // ✅ Cargar info de factura al iniciar el recibo
        this.loadInvoiceInfo();
    },

    async loadInvoiceInfo() {
        try {
            const order = this.pos.get_order();
            // En POS, muchas veces order.name es el pos_reference (ej: "POS/2025/0001")
            const posReference = order?.name;
            if (!posReference) return;

            const info = await this.orm.call(
                "pos.order",
                "pos_get_invoice_info",
                [posReference]
            );

            this.state.invoiceInfo = info;
        } catch (e) {
            this.state.invoiceInfo = { ok: false, error: String(e) };
        }
    },

    get templateProps() {
        const order = this.pos.get_order();
        const partner = order ? order.get_partner() : null;

        return {
            pos: this.pos,
            data: this.props.data,
            order: order,
            receipt: this.props.data,
            orderlines: this.props.data.orderlines,
            paymentlines: this.props.data.paymentlines,
            partner: partner,

            // ✅ Ahora tu XML puede usar invoiceInfo
            invoiceInfo: this.state.invoiceInfo,
        };
    },
});
