/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by Jonathan on 6/19/2017.
 */

var features = {
	init: function(id, className) {

	},
	hasValidEmail: function(formInput) {
		var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
		return emailRegex.test(formInput);
	}

};

var cart = {
	changeQty: function() {
		$('#cart').find('select.change-qty').change(function (e) {
			e.preventDefault();
			var itemQtyObject = (function() {
				var itemQty = parseInt(this.value);
				var itemId = /qtySelectItem(\S*)/.exec(this.id)[1];
				return {
					itemId: itemId,
					qty: itemQty
				}
			}.bind(this))();

			$.ajax('/cart/change_qty', {
				data: itemQtyObject,
				method: 'PUT',
				success: function(data) {
					console.log('foo');
					window.location = '/cart/'
				}
			});
		});
	},

	checkout: function() {
		$('#cart').find('#checkOut').click(function (e) {
			// Go to first checkout step
			console.log('clicked');
			this.blur();
			window.location = '/cart/checkout01';
		});
	}
};

var checkout01 = {
	init: function() {
		checkout01.$checkout01 = $('.step01');
		checkout01.$form = checkout01.$checkout01.find('#checkout01-form');
		checkout01.checkEmailAgain = false;
	},

	fieldsCompleteCheck: function() {
		checkout01.init();
		var $button = checkout01.$form.find(':button');
		$('.required').on('input propertychange paste', function () {
			$('.required').each(function () {
				if (!$(this).val()) {
					$button.prop('disabled', 'disabled');
					return false;
				} else {
					$button.prop('disabled', false);
				}
			});
		});
		checkout01.checkEmailAgain = false;

		checkout01.$form.find('#email').on('input propertychange paste', function() {
			if (checkout01.checkEmailAgain) {
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
	},

	submitForm: function() {
		checkout01.init();
		checkout01.$form.submit(function (e) {
			e.preventDefault();
			var form = document.getElementsByTagName('form')[0];
			var emailAddress = form[1].value;
			// var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
			// if (emailRegex.test(emailAddress)) {
			if (features.hasValidEmail(emailAddress)) {
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
				$.ajax('/cart/checkout01/submit', {
					method: 'POST',
					data: JSON.stringify(formObject),
					dataType: 'text',
					contentType: 'application/json',
					error: function() {
						console.log('There was an error. Please try again');
					},
					success: function(data) {
						debugger;
						window.location = data;
					}
				});
			} else {
				if (!checkout01.$checkout01.find('.help-block')[0]) {
					$('button, input[type="button"]').blur();
					var formGroup = $('#checkout01-form').find('#email');
					var formParent = formGroup.parent();
					formParent.addClass('has-warning');
					formParent.append('<span class="help-block">Please enter a valid email address</span>');
					checkout01.checkEmailAgain = true;
				}
			}
		});
	}
};

var checkout02 = {
	init: function() {
		checkout02.$checkout02 = $('.step02');
		checkout02.$form = checkout02.$checkout02.find('#checkout02-form');
	},
	fieldsCompleteCheck: function() {
		this.init();
		var $button = checkout02.$form.find(':button');
		$('.required').on('input propertychange paste', function() {
			$('.required').each(function() {
				if (!$(this).val()) {
					$button.prop('disabled', 'disabled');
					return false;
				} else {
					$button.prop('disabled', false);
				}
			});
		});
	},
	submitForm: function() {
		this.init();
		checkout02.$form.submit(function (e) {
			e.preventDefault();
			var formObject = function() {
				debugger;
				var formNodes = checkout02.$form[0];
				var formObject = {};
				for (var i = 0; i < formNodes.length - 1; i++) {
					formObject[formNodes[i].id] = formNodes[i].value;
				}
				return formObject;
			};
			$.ajax('/cart/checkout02/submit', {
				method: 'POST',
				data: JSON.stringify(formObject()),
				dataType: 'text',
				contentType: 'application/json',
				error: function () {
					console.log('error');
				},
				success: function (data) {
					window.location = data;
				}
			});
		});
	}
};

$(document).ready(function() {
	var emailAddressRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	/*var cartActions = {
		changeQty: function(){
			$('#cart').find('select.change-qty').change(function (e) {
				e.preventDefault();
				var itemQtyObject = (function() {
					var itemQty = parseInt(this.value);
					var itemId = /qtySelectItem(\S*)/.exec(this.id)[1];
					return {
						itemId: itemId,
						qty: itemQty
					}
				}.bind(this))();

				$.ajax('/cart/change_qty', {
					data: itemQtyObject,
					method: 'PUT',
					success: function(data) {
						console.log('foo');
						window.location = '/cart/'
					}
				});
			});
		},
		checkOut: function() {
			$('#cart').find('#checkOut').click(function (e) {
				// Go to first checkout step
				console.log('clicked');
				this.blur();
				window.location = '/cart/checkout01';
			});
		}
	};*/


	if (document.getElementById('cart')) {
		// When user changes qty of item, post the change to the server and reload the page
		/*var $cart = $('#cart');
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
			/!*$.post('/cart/change_qty', {
				data: JSON.stringify(obj),
				dataType: 'json',
				success: function(data) {
					window.location = '/cart/';
				}
			});*!/
			$.ajax('/cart/change_qty', {
				data: obj,
				method: 'PUT',
				success: function(data) {
					console.log('foo');
					window.location = '/cart/'
				}
			});
		});
		$cart.find('#checkOut').click(function(e) {
			// Go to first checkout step
			console.log('clicked');
			this.blur();
			window.location = '/cart/checkout01';
		});*/
		cart.changeQty();
		cart.checkout();
	}
	if (document.getElementById('checkout') && document.getElementsByClassName('step01')) {
		checkout01.fieldsCompleteCheck();
		checkout01.submitForm();
/*
		var $checkout01 = $('.step01');
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
				$.ajax('/cart/checkout01/next', {
					method: 'POST',
					data: JSON.stringify(formObject),
					dataType: 'text',
					contentType: 'application/json',
					error: function() {
						console.log('There was an error. Please try again');
					},
					success: function(data) {
						debugger;
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
*/
	}
	if (document.getElementById('checkout') && document.getElementsByClassName('step02')) {
		checkout02.init();
		checkout02.fieldsCompleteCheck();
		checkout02.submitForm();
	}
});




































