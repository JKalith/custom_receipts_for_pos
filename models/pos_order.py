from odoo import api, fields, models


class PosOrder(models.Model):
    _inherit = "pos.order"

    @api.model
    def pos_get_invoice_info(self, pos_reference):
        order = self.search([("pos_reference", "=", pos_reference)], limit=1)
        if not order:
            return {"ok": False, "error": "Order not found"}

        move = order.account_move
        if not move:
            return {"ok": True, "has_invoice": False}

        # Fecha de la factura (prioridad: invoice_date, fallback: date)
        invoice_date = move.invoice_date or move.date
        invoice_date_str = fields.Date.to_string(invoice_date) if invoice_date else ""

        # Vendedor (prioridad: invoice_user_id, fallback: user_id del POS)
        seller = move.invoice_user_id or order.user_id
        seller_name = seller.name if seller else ""

        return {
            "ok": True,
            "has_invoice": True,
            "move_name": move.name,
            "move_state": move.state,
            "amount_total": move.amount_total,

            # 👇 LO QUE QUERÍAS
            "seller_name": seller_name,
            "invoice_date": invoice_date_str,
        }
