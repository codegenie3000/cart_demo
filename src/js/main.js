import $ from 'jquery';
import {modalAjaxHandler} from './common';
import cart from './cart';
import slideshow from './slideshow';
import billing from './billing';
import shipping from './shipping';
import payment from './payment';

(function(window, document) {
    if (document.getElementById('productDetail')) {
        window.slideShowModule = slideshow(document);
    }

    if (document.getElementById('cart')) {
        cart(window);
    }

    // billing
    if (document.getElementById('checkout') && document.getElementsByClassName('step01')[0]) {
        $.ajax('/cart/billing/checkIfReady', modalAjaxHandler);
        billing(window);
    }

    // shipping
    if (document.getElementById('checkout') && document.getElementsByClassName('step02')[0]) {
        $.ajax('/cart/shipping/checkIfReady', modalAjaxHandler);
        shipping(window);
    }

    // cart review
    if (document.getElementById('checkout') && document.getElementsByClassName('step03')[0]) {
        $.ajax('/cart/confirmation/checkIfReady', modalAjaxHandler);
    }

    // payment entry
    if (document.getElementById('checkout') && document.getElementsByClassName('card-entry')[0]) {
        $.ajax('/cart/confirmation/checkIfReady', modalAjaxHandler);
        payment(window, document);
    }

})(window, document);