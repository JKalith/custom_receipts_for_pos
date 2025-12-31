from odoo import api, fields, models


class PosOrder(models.Model):
    _inherit = "pos.order"

    @api.model
    def pos_get_invoice_info(self, pos_reference):
        """
        Devuelve información real desde BD:
        - Factura (account.move)
        - Vendedor
        - Fechas correctas
        """
        order = self.search([
            '|',
            ('pos_reference', '=', pos_reference),
            ('name', '=', pos_reference),
        ], limit=1)

        if not order:
            return {"ok": False, "error": "Order not found"}

        move = order.account_move
        if not move:
            return {"ok": True, "has_invoice": False}

        # 📅 Fecha de factura (Date)
        invoice_date = move.invoice_date or move.date
        invoice_date_str = (
            fields.Date.to_string(invoice_date)
            if invoice_date else ""
        )

        # 🕒 Fecha/hora real del POS (Datetime con TZ usuario)
        dt = order.date_order
        dt_local = (
            fields.Datetime.context_timestamp(self.env.user, dt)
            if dt else None
        )
        pos_order_datetime = (
            dt_local.strftime("%Y-%m-%d %H:%M:%S")
            if dt_local else ""
        )

        # 👤 Vendedor
        seller = move.invoice_user_id or order.user_id
        seller_name = seller.name if seller else ""

        # 👥 Cliente real (res.partner)
        partner = order.partner_id

        return {
            "ok": True,
            "has_invoice": True,

            # Factura
            "invoice_number": move.name,
            "invoice_state": move.state,
            "invoice_date": invoice_date_str,

            # POS
            "pos_order_datetime": pos_order_datetime,

            # Vendedor
            "seller_name": seller_name,

            # Cliente
            "partner_name": partner.name if partner else "",
            "partner_vat": partner.vat if partner else "",
            "partner_email": partner.email if partner else "",
            "partner_phone": partner.phone if partner else "",
        }
