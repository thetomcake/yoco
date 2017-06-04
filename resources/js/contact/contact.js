new Vue({
    el: '#contactContainer',
    mounted: function() {
        this.$refs.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.submit();
        });
        this.setupRecaptcha();
    },
    data: {
        submitting: true,
        submitted: false,
        recaptchaInterval: null,
    },
    methods: {
        setupRecaptcha: function() {
            if (window.grecaptcha !== undefined) {
                window.grecaptcha.render(this.$refs.captcha, {
                    'sitekey' : this.$refs.captcha.dataset.sitekey
                });
                window.clearInterval(this.recaptchaInterval);
            } else {
                setTimeout(() => {
                    this.setupRecaptcha();
                }, 100);
            }
        },
        submit: function() {
            var formData = new FormData(this.$refs.form);
            this.submitting = true;
            this.$http.post(this.$refs.form.action, formData).then((response) => {
                this.submitted = true;
            }).catch((response) => {
                alert('Sorry, something went wrong :-(');
            }).then(() => {
                this.submitting = false;
            });
        }
    }
});