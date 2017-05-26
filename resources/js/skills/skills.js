new Vue({
    el: '#skillsWrapper',
    data: {
        items: [],
        grid: null,
        colours: [],
        initialColours: [
            '#2d9cdb',
            '#eb5757',
            '#219653',
            '#9b51e0',
            '#f2994a'
        ],
        transitionDuration: 300
    },
    mounted: function() {
        this.getContent().then(() => {
            Vue.nextTick(() => {
                this.initMasonry();
            });
        });
    },
    methods: {
        fillColours: function(length) {
            for (var i = 0; i < length; i++) {
                this.colours.push(this.initialColours[i % this.initialColours.length]);
            }
        },
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
                    this.fillColours(response.items.length);
                    this.items = this.shuffleArray(response.items);
                    success();
                }).fail(() => {
                    fail();
                });
            });
        },
        getColour: function(itemIndex) {
            return this.colours[itemIndex % this.colours.length];
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