(function($){
    const newsletter = {
        showNewsLetterConfirmPopup: function(){
            $("#NewsletterConfirmationModal").modal('show');
        },

        validateNewsletter: function() {
            if ($('#newsletter-form-email').val() === '') {
                const newsletterForm = $("#newsletter-form");
                newsletterForm.find("#submit-hidden").click();
            } else {
                newsletter.showNewsLetterConfirmPopup();
            }
        },

        init: function() {       
            $('.newsletter__submit').click(function (e) {
                newsletter.validateNewsletter();

                return false;
            });

            $('.newsletter-confirmation-modal__confirm').on('click', function (e) {
                const newsletterForm = $("#newsletter-form");
                newsletterForm.submit();
            });

            $('#newsletter-form-email').on('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    newsletter.validateNewsletter();
                }
            });
        }
    };

    $(document).ready(function(){
        newsletter.init();
    });
})($);