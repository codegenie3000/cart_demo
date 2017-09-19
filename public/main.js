/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/**
 * Created by Jonathan on 6/19/2017.
 */

var overlay = (function() {
    var fadeIn = function() {
        $('.custom-overlay').fadeIn('fast', function() {
            // animation complete
        });
    };

    var fadeOut = function() {
        $('.custom-overlay').fadeOut('fast', function() {
            // animation complete
        });
    };

    return {
        fadeIn: fadeIn,
        fadeOut: fadeOut
    }
})();

var features = {
    hasValidEmail: function (formInput) {
        var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return emailRegex.test(formInput);
    }
};

var productDetail = {
    addToCart: function () {
        $('#add-to-cart').submit(function (e) {
            console.log('ran');
            var productClassName = this.classList[1];
            var productId = /product-(\S+)/g.exec(productClassName)[1];
            var qtySelected = {qtySelect: this[0].value};
            var uri = '/product/' + productId;
            $.ajax(uri, {
                data: JSON.stringify(qtySelected),
                method: 'POST',
                contentType: 'application/json',
                dataType: 'text',
                success: function (data) {
                    window.location = data;
                },
                error: function (err) {
                    console.log(err);
                }
            });
        });
    }
};

var cart = {
    changeQty: function () {
        $('#cart').find('select.change-qty').change(function (e) {
            e.preventDefault();
            var itemQtyObject = (function () {
                var itemQty = parseInt(this.value);
                var itemId = /qtySelectItem(\S*)/.exec(this.id)[1];
                return {
                    itemId: itemId,
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
    },

    checkout: function () {
        $('#cart').find('#checkOut').click(function (e) {
            // Go to first checkout step
            console.log('clicked');
            this.blur();
            window.location = '/cart/billing';
        });
    }
};

var billingFunc = {
    init: function () {
        billingFunc.$checkout01 = $('.step01');
        billingFunc.$form = billingFunc.$checkout01.find('#checkout01-form');
        billingFunc.checkEmailAgain = false;
        this.enableNextButtonOnLoad();
    },
    enableNextButtonOnLoad: function () {
        var $button = billingFunc.$form.find(':button');
        $('.required').each(function () {
            if (!$(this).val()) {
                $button.prop('disabled', 'disabled');
                return false;
            } else {
                $button.prop('disabled', false);
            }
        });
    },

    fieldsCompleteCheck: function () {
        var $button = billingFunc.$form.find(':button');
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

        billingFunc.checkEmailAgain = false;

        billingFunc.$form.find('#email').on('input propertychange paste', function () {
            if (billingFunc.checkEmailAgain) {
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

    submitForm: function () {
        billingFunc.init();
        billingFunc.$form.submit(function (e) {
            e.preventDefault();
            var form = document.getElementsByTagName('form')[0];
            var emailAddress = form[1].value;
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
                var transitionStarted;
                var fadeIn = window.setTimeout(function () {
                    transitionStarted = true;
                    overlay.fadeIn();
                }, 500);
                // if it takes more than 500 ms for the callback to return,
                // display the spinner
                $.ajax('/cart/billing/submit', {
                    method: 'POST',
                    data: JSON.stringify(formObject),
                    dataType: 'text',
                    contentType: 'application/json',
                    error: function () {
                        console.log('There was an error. Please try again');
                    },
                    success: function (data) {
                        clearInterval(fadeIn);
                        if (transitionStarted) {
                            overlay.fadeOut();
                        }
                        window.location = data;
                    }
                });
            } else {
                if (!billingFunc.$checkout01.find('.help-block')[0]) {
                    $('button, input[type="button"]').blur();
                    var formGroup = $('#checkout01-form').find('#email');
                    var formParent = formGroup.parent();
                    formParent.addClass('has-warning');
                    formParent.append('<span class="help-block">Please enter a valid email address</span>');
                    billingFunc.checkEmailAgain = true;
                }
            }
        });
    }
};

var shippingFunc = {
    init: function () {
        shippingFunc.$checkout02 = $('.step02');
        shippingFunc.$form = shippingFunc.$checkout02.find('#checkout02-form');
        this.checkFieldsCompleteOnLoad();
    },
    checkFieldsCompleteOnLoad: function () {
        var $button = shippingFunc.$form.find(':button');
        $('.required').each(function () {
            if (!$(this).val()) {
                $button.prop('disabled', 'disabled');
                return false;
            } else {
                $button.prop('disabled', false);
            }
        });
    },
    fieldsCompleteCheck: function () {
        this.init();
        var $button = shippingFunc.$form.find(':button');
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
    },
    submitForm: function () {
        this.init();
        shippingFunc.$form.submit(function (e) {
            e.preventDefault();
            var formObject = function () {
                var formNodes = shippingFunc.$form[0];
                var formObject = {};
                for (var i = 0; i < formNodes.length - 1; i++) {
                    formObject[formNodes[i].id] = formNodes[i].value;
                }
                return formObject;
            };
            var transitionStarted;
            var fadeIn = window.setTimeout(function () {
                transitionStarted = true;
                overlay.fadeIn();
            }, 500);
            $.ajax('/cart/shipping/submit', {
                method: 'POST',
                data: JSON.stringify(formObject()),
                dataType: 'text',
                contentType: 'application/json',
                error: function () {
                    console.log('error');
                },
                success: function (data) {
                    clearInterval(fadeIn);
                    if (transitionStarted) {
                        overlay.fadeOut();
                    }
                    window.location = data;
                }
            });
        });
    }
};

var paymentFunc = {
    init: function () {
        paymentFunc.stripe = Stripe('pk_test_7FDEq537OGNCurGLehNg2FcB');

        paymentFunc.elements = paymentFunc.stripe.elements();

        paymentFunc.card = paymentFunc.elements.create('card');

        if ($('#card-element')[0]) {
            paymentFunc.card.mount('#card-element');

            var $button = $('.card-entry').find(':button').last();

            paymentFunc.card.addEventListener('change', function (event) {
                var displayError = document.getElementById('card-errors');
                if (event.error) {
                    displayError.textContent = event.error.message;
                    $button.prop('disabled', 'disabled');
                } else {

                    $button.prop('disabled', false);
                    displayError.textContent = '';
                }
            });
        }
    },

    submitListener: function () {
        if (document.getElementById('payment-form')) {
            var form = document.getElementById('payment-form');
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                overlay.fadeIn();
                paymentFunc.stripe.createToken(paymentFunc.card).then(function (result) {
                    if (result.error) {
                        overlay.fadeOut();
                        var errorElement = document.getElementById('card-errors');
                        errorElement.textContent = result.error.message;
                    } else {
                        paymentFunc.tokenHandler(result.token);
                    }
                });
            });
        }
    },

    tokenHandler: function (token) {
        $.ajax('/cart/stripeSubmit', {
            method: 'POST',
            data: JSON.stringify(token),
            contentType: 'application/json',
            error: function () {
                console.log('error');
            },
            success: function (data) {
                overlay.fadeOut();
                window.location = data;
            }
        });
    }
};

var modalAjaxHandler = {
    method: 'GET',
    contentType: 'application/json',
    error: function() {
        console.log('error');
    },
    success: function(data) {
        if (data.allClear !== 'true') {
            $('#modal-message').text(data.modalMessage);
            $('#button-message').text(data.buttonMessage);
            $('a.modal-url').attr('href', data.buttonURL);
            $('#info-missing-modal').modal({
                backdrop: 'static'
            });
        }
    }
};

$(document).ready(function () {
    var emailAddressRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    if (document.getElementsByClassName('product-detail')) {
        productDetail.addToCart();
    }

    if (document.getElementById('cart')) {
        cart.changeQty();
        cart.checkout();
    }
    if (document.getElementById('checkout') && document.getElementsByClassName('step01')[0]) {
        // Send get request to /cart/billing/itemsInCart
        $.ajax('/cart/billing/checkIfReady', modalAjaxHandler);

        billingFunc.init();
        billingFunc.fieldsCompleteCheck();
        billingFunc.submitForm();
    }
    if (document.getElementById('checkout') && document.getElementsByClassName('step02')[0]) {

        $.ajax('/cart/shipping/checkIfReady', modalAjaxHandler);
        shippingFunc.init();
        shippingFunc.fieldsCompleteCheck();
        shippingFunc.submitForm();
    }
    if (document.getElementById('checkout') && document.getElementsByClassName('step03')[0]) {
        $.ajax('/cart/confirmation/checkIfReady', modalAjaxHandler);
    }

    if (document.getElementById('checkout') && document.getElementsByClassName('card-entry')[0]) {
        $.ajax('/cart/confirmation/checkIfReady', modalAjaxHandler);
        paymentFunc.init();
        paymentFunc.submitListener();
    }
});