new Vue({
    el: '#skillsWrapper',
    data: {
        items: [],
        grid: null,
        colours: ["#898CFF","#FF89B5","#FFDC89","#90D4F7","#71E096","#F5A26F","#668DE5","#ED6D79","#5AD0E5","#DA97E0","#CFF381","#FF96E3","#BB96FF","#67EEBD", "#E2FCEA", "#F3B9C5", "#E7D9D3", "#BBD7D1", "#BBD7D1", "#F6D9E0", "#CBBBC0", "#F5FADA", "#F5CFB9"],
        transitionDuration: 300
    },
    mounted: function() {
        this.colours = this.shuffleArray(this.colours);
        this.getContent().then(() => {
            Vue.nextTick(() => {
                this.initMasonry();
            });
        });
    },
    methods: {
        initMasonry: function() {
            this.masonry = $(this.$refs.grid).masonry({
                // options
                itemSelector: '.grid-item',
                columnWidth: '.grid-sizer',
                gutter: '.gutter-sizer',
                percentPosition: true,
                transitionDuration: this.transitionDuration
            });

            this.masonry.imagesLoaded().progress(() => {
                this.masonry.masonry('layout');
            });
        },
        getContent: function() {
            return new Promise((success, fail) => {
                $.ajax({
                    url: '/content/content.json',
                    dataType: 'json'
                }).done((response) => {
                    this.items = this.shuffleArray(response.items);
                    success();
                }).fail(() => {
                    fail();
                });
            });
        },
        getColour: function(itemIndex) {
            return this.colours[itemIndex];
        },
        toggleItemFocus: function(event, itemIndex) {
            var gridItem = $(event.target).closest('.grid-item');
            this.items[itemIndex].width = (this.items[itemIndex].width === 1) ? 2 : 1;
            $.each(this.items, (index, item) => {
                if (index === itemIndex) {
                    return true;
                } else {
                    item.width = 1;
                }
            });

            Vue.nextTick(() => {
                this.masonry.masonry('layout');
                setTimeout(() => {
                    $('body').animate({scrollTop: gridItem.offset().top - $('header').height() - 20}, 200);
                }, this.transitionDuration);
            });
        },
        shuffleArray: function(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

              // Pick a remaining element...
              randomIndex = Math.floor(Math.random() * currentIndex);
              currentIndex -= 1;

              // And swap it with the current element.
              temporaryValue = array[currentIndex];
              array[currentIndex] = array[randomIndex];
              array[randomIndex] = temporaryValue;
            }

            return array;
        }

    }
});