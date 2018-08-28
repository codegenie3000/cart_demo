import $ from 'jquery';
import {hasValidEmail} from './common';
import {fadeIn as fadeInUtil, fadeOut as fadeOutUtil} from './common';

export default function(window) {
    const $checkout01 = $('.step01');
    const $form = $checkout01.find('#checkout01-form');
    let checkEmailAgain = false;

    (function enableNextButtonOnLoad () {
        const $button = $form.find(':button');
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
        const $button = $form.find(':button');
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

        checkEmailAgain = false;

        $form.find('#email').on('input propertychange paste', function () {
            if (checkEmailAgain) {
                const emailAddress = $(this).val();

                if (hasValidEmail(emailAddress)) {
                    const formGroup = $('#checkout01-form').find('#email');
                    const formParent = formGroup.parent();
                    $('.help-block').remove();
                    formParent.removeClass('has-warning');
                    formParent.addClass('has-success');
                }
            }
        });
    })();

    (function submitFormListener() {
        $form.submit(function (e) {
            e.preventDefault();
            const form = document.getElementsByTagName('form')[0];
            const emailAddress = form[1].value;

            if (hasValidEmail(emailAddress)) {
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
                }, 200);
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
                            fadeInUtil();
                        }
                        window.location = data;
                    }
                });
            } else {
                if (!$checkout01.find('.help-block')[0]) {
                    $('button, input[type="button"]').blur();
                    const formGroup = $('#checkout01-form').find('#email');
                    const formParent = formGroup.parent();
                    formParent.addClass('has-warning');
                    formParent.append('<span class="help-block">Please enter a valid email address</span>');
                    checkEmailAgain = true;
                }
            }
        })

    })();
};
