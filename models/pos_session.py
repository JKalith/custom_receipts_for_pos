# -*- coding: utf-8 -*-
################################################################################
#
#    Cybrosys Technologies Pvt. Ltd.
#
#    Copyright (C) 2024-TODAY Cybrosys Technologies(<https://www.cybrosys.com>).
#    Author: Sadique Kottekkat (<https://www.cybrosys.com>)
#
#    This program is free software: you can modify
#    it under the terms of the GNU Affero General Public License (AGPL) as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <https://www.gnu.org/licenses/>.
#
################################################################################
from odoo import models

class PosSession(models.Model):
    _inherit = 'pos.session'

    def _loader_params_product_product(self):
        result = super()._loader_params_product_product()
        if 'qty_available' not in result['search_params']['fields']:
            result['search_params']['fields'].append('qty_available')
        return result

    def _loader_params_pos_receipt(self):
        return {
            'search_params': {
                'fields': ['design_receipt', 'name'],
            },
        }

    def _get_pos_ui_pos_receipt(self, params):
        return self.env['pos.receipt'].search_read(**params['search_params'])

    def _loader_params_res_partner(self):
        result = super()._loader_params_res_partner()
        fields = result['search_params']['fields']

        extra_fields = [
            'vat', 'email', 'phone', 'mobile',
            'street', 'street2', 'zip', 'city',
            'state_id', 'country_id',
        ]

        for f in extra_fields:
            if f not in fields:
                fields.append(f)

        return result
