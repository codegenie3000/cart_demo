import $ from 'jquery';

export default function (window){
    (function changeQty() {
        $('#cart').find('select.change-qty').change(function (e) {
            e.preventDefault();

            const itemQtyObject = (function () {
                const itemQty = parseInt(this.value);
                const itemId = /qtySelectItem(\S*)/.exec(this.id)[1];
                return {
                    id: itemId,
                    qty: itemQty
                }
            }.bind(this))();

            $.ajax('/cart/change_qty', {
                data: JSON.stringify(itemQtyObject),
                contentType: 'application/json',
                dataType: 'text',
                method: 'PUT',
                success: function (data) {
                    window.location = data;
                },
                error: function (err) {
                    console.log(err);
                }
            });
        });
    })();

    (function checkout() {
        $('#cart').find('#checkOut').click(function (e) {
            // Go to first checkout step
            this.blur();
            window.location = '/cart/billing';
        });
    })();
};