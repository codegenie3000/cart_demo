/*
 * Copyright (c) 2018. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

/*
 * Copyright (c) 2017. Jonathan Peralez - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 */

import $ from 'jquery';

const overlay = (function() {
    const fadeIn = function() {
        $('.custom-overlay').fadeIn('fast', function() {
            // animation complete
        });
    };

    const fadeOut = function() {
        $('.custom-overlay').fadeOut('fast', function() {
            // animation complete
        });
    };

    return {
        fadeIn: fadeIn,
        fadeOut: fadeOut
    }
})();

const features = {
    hasValidEmail: function (formInput) {
        const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return emailRegex.test(formInput);
    }
};

const cart = {
    changeQty: function () {
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

const billingFunc = {
    init: function () {
        billingFunc.$checkout01 = $('.step01');
        billingFunc.$form = billingFunc.$checkout01.find('#checkout01-form');
        billingFunc.checkEmailAgain = false;
        this.enableNextButtonOnLoad();
    },
    enableNextButtonOnLoad: function () {
        const $button = billingFunc.$form.find(':button');
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
        const $button = billingFunc.$form.find(':button');
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
                const emailAddress = $(this).val();
                const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

                if (emailRegex.test(emailAddress)) {
                    const formGroup = $('#checkout01-form').find('#email');
                    const formParent = formGroup.parent();
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
            const form = document.getElementsByTagName('form')[0];
            const emailAddress = form[1].value;
            if (features.hasValidEmail(emailAddress)) {
                $('button, input[type="button"]').blur();
                const getFormData = function () {
                    const form = document.getElementById('checkout01-form');
                    const billingData = Object.create(null);
                    for (let i = 0; i < form.length - 1; i++) {
                        if (form[i].id !== 'bill-same-as-ship') {
                            billingData[form[i].id] = form[i].value;
                        } else {
                            billingData[form[i].id] = form[i].checked;
                        }
                    }
                    return billingData;
                };
                const formObject = getFormData();
                let transitionStarted;
                const fadeIn = window.setTimeout(function () {
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
                    const formGroup = $('#checkout01-form').find('#email');
                    const formParent = formGroup.parent();
                    formParent.addClass('has-warning');
                    formParent.append('<span class="help-block">Please enter a valid email address</span>');
                    billingFunc.checkEmailAgain = true;
                }
            }
        });
    }
};

const shippingFunc = {
    init: function () {
        shippingFunc.$checkout02 = $('.step02');
        shippingFunc.$form = shippingFunc.$checkout02.find('#checkout02-form');
        this.checkFieldsCompleteOnLoad();
    },
    checkFieldsCompleteOnLoad: function () {
        const $button = shippingFunc.$form.find(':button');
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
        const $button = shippingFunc.$form.find(':button');
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
            const formObject = function () {
                const formNodes = shippingFunc.$form[0];
                const formObject = {};
                for (let i = 0; i < formNodes.length - 1; i++) {
                    formObject[formNodes[i].id] = formNodes[i].value;
                }
                return formObject;
            };
            let transitionStarted;
            const fadeIn = window.setTimeout(function () {
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

const paymentFunc = {
    init: function () {
        paymentFunc.stripe = Stripe('pk_test_7FDEq537OGNCurGLehNg2FcB');

        paymentFunc.elements = paymentFunc.stripe.elements();

        paymentFunc.card = paymentFunc.elements.create('card');

        if ($('#card-element')[0]) {
            paymentFunc.card.mount('#card-element');

            const $button = $('.card-entry').find(':button').last();

            paymentFunc.card.addEventListener('change', function (event) {
                const displayError = document.getElementById('card-errors');
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
            const form = document.getElementById('payment-form');
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                overlay.fadeIn();
                paymentFunc.stripe.createToken(paymentFunc.card).then(function (result) {
                    if (result.error) {
                        overlay.fadeOut();
                        const errorElement = document.getElementById('card-errors');
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

const modalAjaxHandler = {
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

$(function () {
    const emailAddressRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    /*if (document.getElementsByClassName('product-detail')) {
        productDetail.addToCart();
    }*/

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

    if (document.getElementById('productDetail')) {
        window.slideShowModule = (function() {
            const imageNodeArray = document.querySelectorAll(
                '.slideshow-container > .slide'
            );

            let currentSlide = 0;

            const numOfSlides = imageNodeArray.length - 1;

            imageNodeArray[0].classList.add('show-image');

            const _nextSlide = function() {
                if (currentSlide < numOfSlides) {
                    /* imageNodeArray[currentSlide + 1].classList.add('show')
                    imageNodeArray[currentSlide].classList.remove('show'); */
                    imageNodeArray[currentSlide + 1].classList.add('show-image');
                    imageNodeArray[currentSlide].classList.remove('show-image');
                    // _incrementSlide();
                    currentSlide += 1;
                }
            };

            const _prevSlide = function() {
                if (currentSlide > 0) {
                    imageNodeArray[currentSlide - 1].classList.add('show-image');
                    imageNodeArray[currentSlide].classList.remove('show-image');
                    // _decrementSlide();
                    currentSlide -= 1;
                }
            };

            return {
                nextSlide: _nextSlide,
                prevSlide: _prevSlide
            }
        })();
    }
});