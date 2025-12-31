from odoo import api, fields, models

class PosOrder(models.Model):
    _inherit = 'pos.order'

    @api.model
    def pos_get_order_date(self, pos_reference):
        order = self.search([('pos_reference', '=', pos_reference)], limit=1)
        return order and fields.Datetime.to_string(order.date_order) or ''

    @api.model
    def pos_get_invoice_info(self, pos_reference):
        order = self.search([("pos_reference", "=", pos_reference)], limit=1)
        if not order:
            return {"ok": False, "error": "Order not found"}

        move = order.account_move
        if not move:
            return {"ok": True, "has_invoice": False}

        return {
            "ok": True,
            "has_invoice": True,
            "move_name": move.name,
            "move_state": move.state,
            "amount_total": move.amount_total,
            "partner_name": move.partner_id.name,
            "partner_vat": move.partner_id.vat,
        }
