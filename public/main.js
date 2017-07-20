/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by Jonathan on 6/19/2017.
 */

$(document).ready(function() {
	if (document.getElementById('cart')) {
		// When user changes qty of item, post the change to the server and reload the page
		var $cart = $('#cart');
		$cart.find('select.change-qty').change(function (e) {
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
			$.post('/cart/change_qty', {
				data: JSON.stringify(obj),
				dataType: 'json',
				success: function(data) {
					window.location = '/cart/';
				}
			});
		});
		$cart.find('#checkOut').click(function(e) {
			// Go to first checkout step
			console.log('clicked');
			this.blur();
			window.location = '/cart/checkout01';
		});
	}
	if (document.getElementById('checkout') && document.getElementsByClassName('step01')) {
		var $checkout01 = $('.step01');
	//	when form is submitted (this is because all fields are formed
	//	validate the email address
	//	if email address isn't valid:
	//	blur the next button
	//	inform user that email address isn't valid
	//	if email address IS valid
	//	place the form data in an object
	//	post the object to the server
		var $form = $checkout01.find('#checkout01-form');
		$form.submit(function (e) {
			e.preventDefault();
			// get email address
			var form = document.getElementsByTagName('form')[0];
			var emailAddress = form[0].value;
			var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
			if (emailRegex.test(emailAddress)) {
			
			} else {
				if (!$checkout01.find('.help-block')[0]) {
					$('button, input[type="button"]').blur();
					var formGroup = $('#checkout01-form').find('#email');
					var formParent = formGroup.parent();
					formParent.addClass('has-warning');
					formParent.append('<span class="help-block">Please correct your email address</span>');
				} else {
					$('button, input[type="button"]').blur();
				}
			}
		});
	}
});