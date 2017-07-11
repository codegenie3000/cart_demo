/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by Jonathan on 6/19/2017.
 */

$('.change-qty').change(function (e) {
	e.preventDefault();
	var qty = parseInt(this.value);
	var refId = this.id;
	var itemId = function() {
		var re  = /qtySelectItem(\S*)/;
		return re.exec(refId)[1];
	}();
	var obj = {
		itemId: itemId,
		qty: qty
	};
	// $.post('/cart/change_qty', obj);
	/*$.ajax({
		method: 'POST',
		url: '/cart/change_qty',
		dataType: 'json',
		data: obj,
		success: function(data) {
			console.log(data);
			/!*debugger;
			window.location = '/cart';*!/
		},
		error: function() {
			console.log('error');
		}
	});*/
	$.post('/cart/change_qty', {
		data: JSON.stringify(obj),
		dataType: 'json',
		success: function(data) {
			debugger;
			console.log(data);
			// goToCart();
			window.location = '/cart/';
		}/*,
		error: function() {
			console.log('error');
		}*/
	});
});

/*
$('.delete-button').click(function(e) {
	e.preventDefault();
	var re = /delete(\S*)/;
	var id = re.exec(this.id)[1];
	/!*debugger;
	e.preventDefault();
	var re = /delete(\S*)/;
	var id = re.exec(this.id)[1];
	$.ajax('/cart/delete_product/', {
		data: id,
		dataType: 'text',
		success: function (data) {
			console.log(data);
		}
	});*!/
});*/
