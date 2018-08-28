import $ from 'jquery';
import {fadeIn as fadeInUtil, fadeOut as fadeOutUtil} from './common';

export default function(window, document) {
    const stripe = Stripe('pk_test_7FDEq537OGNCurGLehNg2FcB');
    const elements = stripe.elements();
    const card = elements.create('card');

    if ($('#card-element')[0]) {
        card.mount('#card-element');

        const $button = $('.card-entry').find(':button').last();

        card.addEventListener('change', function (event) {
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

    if (document.getElementById('payment-form')) {
        const form = document.getElementById('payment-form');
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            fadeInUtil();
            stripe.createToken(card).then(function (result) {
                if (result.error) {
                    fadeOutUtil();
                    const errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    tokenHandler(result.token);
                }
            });
        });
    }


    function tokenHandler(token) {
        $.ajax('/cart/stripeSubmit', {
            method: 'POST',
            data: JSON.stringify(token),
            contentType: 'application/json',
            error: function () {
                console.log('error');
            },
            success: function (data) {
                fadeOutUtil();
                window.location = data;
            }
        });
    }
};