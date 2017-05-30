new Vue({
    el: '#contactContainer',
    mounted: function() {
        this.$refs.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.submit();
        });
    },
    data: {
        submitting: true,
        submitted: false
    },
    methods: {
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