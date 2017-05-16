new Vue({
    el: '#header',
    data: {
        activeMenu: 0,
        animating: false,
        open: false,
        links: [
            {name: 'Me', 'content': '/content/home.html', 'url': '/'},
            {name: 'Skills', 'content': '/content/skills.html', 'url': '/skills'},
        ],
        backToTopButton: $('.back-to-top')
    },
    mounted: function() {
        this.setInitialContent();
        
        $('body').on('click', 'a[data-internal]', (event) => {
            event.preventDefault();
            var targetUrl = $(event.target).attr('href');
            
            $.each(this.links, (linkIndex, link) => {
                if (link.url === targetUrl) {
                    this.setActiveMenu(linkIndex);
                    return false;
                }
            });
        });
        
        this.backToTopButton.on('click', () => {
            this.scrollToTop();
        });
                
        $(window).on('scroll', (event) => {
            if (window.scrollY < 500) {
                this.backToTopButton.stop().fadeTo(200, 0, () => {
                    this.backToTopButton.css('display', 'none');
                });
            } else {
                this.backToTopButton
                    .stop()
                    .css('display', 'block')
                    .fadeTo(1000, 0.5);
            }
        });
    },
    methods: {
        scrollToTop: function(time) {
            $('body').animate({scrollTop: 0}, time === undefined ? 400 : time);
        },
        setInitialContent: function() {
            var activeMenu = 0;
            var contentPath = this.links[0].content;
            
            $.each(this.links, (linkIndex, link) => {
                if (link.url === document.location.pathname) {
                    activeMenu = linkIndex;
                    contentPath = link.content;
                    return false;
                }
            });
            
            this.activeMenu = activeMenu;
            this.loadContent(contentPath).then((content) => {
                this.setContent(content);
            });
        },
        toggleOpenMenu: function() {
            this.open = !this.open;
        },
        
        loadContent: function(path) {
            return new Promise((success, fail) => {
                $.ajax({
                    url: path,
                    dataType: 'text'
                }).done((response) => {
                    success(response);
                }).fail(() => {
                    fail();
                });
            });
        },
        
        setActiveMenu: function(activeMenu) {
            if (!this.animating && activeMenu !== this.activeMenu) {
                if (activeMenu < this.activeMenu) {
                    this.slideContentLeft(this.links[activeMenu].content);
                } else {
                    this.slideContentRight(this.links[activeMenu].content);
                }
                this.activeMenu = activeMenu;
                window.history.pushState({}, "", this.links[activeMenu].url);
            }
        },
        slideContentLeft: function(path) {
            this.slideContent('slide-out-right', 'slide-out-left', 'sliding-out', path);
        },
        slideContentRight: function(path) {
            this.slideContent('slide-out-left', 'slide-out-right', 'sliding-out', path);
        },
        slideContent: function(slideOutClass, slideInClass, bodyClass, path) {
            this.open = false;
            this.animating = true;
            var contentContainer = this.getContentContainer();
            var contentContainerClone = contentContainer.clone();
            contentContainerClone
                .addClass(slideInClass)
                .appendTo('#content');

            contentContainer.addClass(slideOutClass);
            
            var startTime = Date.now();
            
            this.loadContent(path).then((response) => {
                var endTime = Date.now();
                contentContainerClone.html(response);
                
                var removeOldContent = () => {
                    this.scrollToTop(0);
                    contentContainer.remove();
                    contentContainerClone.removeClass(slideInClass);
                    
                    setTimeout(() => {
                        this.animating = false;
                    }, 300);
                };
                
                if (endTime - startTime > 300) {
                    removeOldContent();
                } else {
                    setTimeout(() => {
                        removeOldContent();
                    }, 300 - (endTime - startTime));
                }
                
            });
           
        },
        setContent: function(content) {
            this.getContentContainer().html(content);
        },
        getContentContainer: function() {
            return $('.content-container');
        }
    }
});

console.log('\'ere be debugging content! What brings you scoundrel to these parts?!')