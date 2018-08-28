import $ from 'jquery';
import {fadeIn as fadeInUtil, fadeOut as fadeOutUtil} from './common';

export default function(window) {
    const $checkout02 = $('.step02');
    const $form = $checkout02.find('#checkout02-form');
    const $button = $form.find(':button');

    (function checkFieldsCompleteOnLoad() {
        $('.required').each(function () {
            if (!$(this).val()) {
                $button.prop('disabled', 'disabled');
                return false;
            } else {
                $button.prop('disabled', false);
            }
        });
    })();

    (function fieldsCompleteCheck() {
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

    })();

    (function submitForm() {
        $form.submit(function (e) {
            e.preventDefault();
            const formObject = function () {
                const formNodes = $form[0];
                const formObject = {};
                for (let i = 0; i < formNodes.length - 1; i++) {
                    formObject[formNodes[i].id] = formNodes[i].value;
                }
                return formObject;
            };
            let transitionStarted;
            const fadeIn = window.setTimeout(function () {
                transitionStarted = true;
                fadeInUtil();
            }, 200);
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
                        fadeOutUtil();
                    }
                    window.location = data;
                }
            });
        });

    })();
};