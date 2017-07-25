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
	//	place the form data in an object
	//	post the object to the server
		
		var $form = $checkout01.find('#checkout01-form');
		var $button = $('#checkout01-form').find(':button');
		$('.required').on('input propertychange paste', function() { // Add propertychange and paste?
			$('.required').each(function() {
				if (!$(this).val()) {
					$button.prop('disabled', 'disabled');
					return false;
				} else {
					$button.prop('disabled', false);
				}
			});
		});
		
		var checkEmailAgain = false;
		
		$form.find('#email').on('input propertychange paste', function() {
			if (checkEmailAgain) {
				var emailAddress = $(this).val();
				var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
				
				if (emailRegex.test(emailAddress)) {
					var formGroup = $('#checkout01-form').find('#email');
					var formParent = formGroup.parent();
					$('.help-block').remove();
					formParent.removeClass('has-warning');
					formParent.addClass('has-success');
				}
			}
		});
		
		$form.submit(function (e) {
			e.preventDefault();
			// get email address
			var form = document.getElementsByTagName('form')[0];
			var emailAddress = form[0].value;
			var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
			if (emailRegex.test(emailAddress)) {
				$('button, input[type="button"]').blur();
				var getFormData = function () {
					var form = document.getElementById('checkout01-form');
					var billingData = Object.create(null);
					for (var i = 0; i < form.length - 1; i++) {
						if (form[i].id !== 'bill-same-as-ship') {
							billingData[form[i].id] = form[i].value;
						} else {
							billingData[form[i].id] = form[i].checked;
						}
					}
					return billingData;
				};
				var formObject = getFormData();
				$.post('/cart/checkout01', {
					data: JSON.stringify(formObject),
					dataType: 'json',
					success: function(data) {
						// console.log('success');
						window.location = '/cart/checkout02';

					}
				});
			} else {
				if (!$checkout01.find('.help-block')[0]) {
					$('button, input[type="button"]').blur();
					var formGroup = $('#checkout01-form').find('#email');
					var formParent = formGroup.parent();
					formParent.addClass('has-warning');
					formParent.append('<span class="help-block">Please enter a valid email address</span>');
					checkEmailAgain = true;
				}
			}
		});
	}
});