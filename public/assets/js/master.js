new Vue({
    el: '#header',
    data: {
        activeMenu: 0,
        animating: false,
        open: false,
        links: [
            {name: 'Me', 'content': '/content/home.html', 'url': '/', assetName: 'home'},
            {name: 'Skills', 'content': '/content/skills.html', 'url': '/skills', assetName: 'skills'},
            {name: 'Contact', 'content': '/content/skills.html', 'url': '/contact', assetName: 'contact'}
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
        
        window.addEventListener('popstate', (event) => {
            this.links.forEach((link, linkIndex) => {
                if (link.url === document.location.pathname) {
                    event.preventDefault();
                    this.setActiveMenu(linkIndex);
                    return false;
                }
            });
            this.setInitialContent();
        });
        
        document.addEventListener('swiperight', (event) => {
            this.setActiveMenu(this.activeMenu === 0 ? this.links.length - 1 : this.activeMenu - 1);
        });
        
        document.addEventListener('swipeleft', (event) => {
            this.setActiveMenu(this.activeMenu === this.links.length - 1 ? 0 : this.activeMenu + 1);
        });
    },
    methods: {
        scrollToTop: function(time) {
            $('body').animate({scrollTop: 0}, time === undefined ? 400 : time);
        },
        setInitialContent: function() {
            var activeMenu = 0;
            var contentPath = this.links[0].content;
            var assetName = this.links[0].assetName;
            
            $.each(this.links, (linkIndex, link) => {
                if (link.url === document.location.pathname) {
                    activeMenu = linkIndex;
                    contentPath = link.content;
                    return false;
                }
            });
            
            this.activeMenu = activeMenu;
            this.loadContent(contentPath).then((content) => {
                this.setContent(content, assetName);
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
                    this.slideContentLeft(this.links[activeMenu].content, this.links[activeMenu].assetName);
                } else {
                    this.slideContentRight(this.links[activeMenu].content, this.links[activeMenu].assetName);
                }
                this.activeMenu = activeMenu;
                window.history.pushState({}, "", this.links[activeMenu].url);
            }
        },
        slideContentLeft: function(path, assetName) {
            this.slideContent('slide-out-right', 'slide-out-left', 'sliding-out', path, assetName);
        },
        slideContentRight: function(path, assetName) {
            this.slideContent('slide-out-left', 'slide-out-right', 'sliding-out', path, assetName);
        },
        slideContent: function(slideOutClass, slideInClass, bodyClass, path, assetName) {
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
                this.setContent(response, assetName, contentContainerClone);
                
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
        setContent: function(content, assetName, container) {
            container = (container === undefined ? this.getContentContainer() : container);
            container.html(content);
            this.addScriptAsset('/assets/js/' + assetName + '.js');
            this.addCssAsset('/assets/css/' + assetName + '.css');
        },
        getContentContainer: function() {
            return $('.content-container');
        },
        getAssetContainer: function() {
            return document.getElementById('pageAssets');
        },
        clearAssets: function() {
            this.getAssetContainer().innerHTML = '';
        },
        addScriptAsset: function(path) {
            var script = document.createElement('script');
            script.setAttribute('async', true);
            var promise = new Promise((accept, reject) => {
                script.onload = () => {
                    accept();
                };
            });
            script.src = path;
            this.getAssetContainer().appendChild(script);
            
            return promise;
        },
        addCssAsset: function(path) {
            var script = document.createElement('link');
            script.setAttribute('rel', 'stylesheet');
            script.setAttribute('async', true);
            var promise = new Promise((accept, reject) => {
                script.onload = () => {
                    accept();
                };
            });
            script.href = path;
            this.getAssetContainer().appendChild(script);
            
            return promise;
        }
    }
});

console.log('\'ere be debugging content! What brings you scoundrel to these parts?!');
(function() {
    swipe_det = new Object();
    swipe_det.sX = 0;
    swipe_det.sY = 0;
    swipe_det.eX = 0;
    swipe_det.eY = 0;
    var min_x = 30;  //min x swipe for horizontal swipe
    var max_x = 30;  //max x difference for vertical swipe
    var min_y = 50;  //min y swipe for vertical swipe
    var max_y = 60;  //max y difference for horizontal swipe
    var direc = "";
    
    document.addEventListener('touchstart', function (e) {
        var t = e.touches[0];
        swipe_det.sX = t.screenX;
        swipe_det.sY = t.screenY;
    }, false);
    document.addEventListener('touchmove', function (e) {
        var t = e.touches[0];
        swipe_det.eX = t.screenX;
        swipe_det.eY = t.screenY;
    }, false);
    document.addEventListener('touchend', function (e) {
        //horizontal detection
        if ((((swipe_det.eX - min_x > swipe_det.sX) || (swipe_det.eX + min_x < swipe_det.sX)) && ((swipe_det.eY < swipe_det.sY + max_y) && (swipe_det.sY > swipe_det.eY - max_y) && (swipe_det.eX > 0)))) {
            if (swipe_det.eX > swipe_det.sX)
                document.dispatchEvent(new Event('swiperight'));
            else
                document.dispatchEvent(new Event('swipeleft'));
        }
        //vertical detection
        else if ((((swipe_det.eY - min_y > swipe_det.sY) || (swipe_det.eY + min_y < swipe_det.sY)) && ((swipe_det.eX < swipe_det.sX + max_x) && (swipe_det.sX > swipe_det.eX - max_x) && (swipe_det.eY > 0)))) {
            if (swipe_det.eY > swipe_det.sY)
                document.dispatchEvent(new Event('swipedown'));
            else
                document.dispatchEvent(new Event('swipeup'));
        }

        if (direc != "") {
            if (typeof func == 'function')
                func(el, direc);
        }
        direc = "";
        swipe_det.sX = 0;
        swipe_det.sY = 0;
        swipe_det.eX = 0;
        swipe_det.eY = 0;
    }, false);
}());