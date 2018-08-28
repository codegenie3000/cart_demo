import $ from 'jquery';

const utilities = (function() {
    const overlay = {
        _fadeIn: function() {
            $('.custom-overlay').fadeIn('fast', function() {
                // animation complete
            });
        },
        _fadeOut: function() {
            $('.custom-overlay').fadeOut('fast', function() {
                // animation complete
            });
        }
    };

    const _hasValidEmail = function(formInputEmail) {
        const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return emailRegex.test(formInputEmail);
    };

    const _modalAjaxHandler = {
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

    return  {
        fadeIn: overlay._fadeIn,
        fadeOut: overlay._fadeOut,
        hasValidEmail: _hasValidEmail,
        modalAjaxHandler: _modalAjaxHandler
    }
})();

export const fadeIn = utilities.fadeIn;
export const fadeOut = utilities.fadeOut;
export const hasValidEmail = utilities.hasValidEmail;
export const modalAjaxHandler = utilities.modalAjaxHandler;