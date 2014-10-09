(function($) {
    RaptorGallery = function(wrapper, images) {
        this.images = $(images);
        this.wrapper = $(wrapper);

        this.wrapper.click($.proxy(this.click, this));
        this.images.addClass('raptor-gallery-item');
    };

    RaptorGallery.prototype.click = function(event) {
        for (var i = 0; i < this.images.length; i++) {
            if (this.images[i] == event.target) {
                RaptorGallery.initialise(this, this.images[i]);
            }
        }
    };

    RaptorGallery.initialised = false;
    RaptorGallery.gallery = null;
    RaptorGallery.image = null;
    RaptorGallery.modal = null;
    RaptorGallery.imageWapper = null;

    RaptorGallery.templates = {
        modal: '<table><tr><td id="raptor-gallery-modal-content"><div id="raptor-gallery-modal-wrapper"><div id="raptor-gallery-modal-close" class="ui-icon ui-icon-closethick"></div><div id="raptor-gallery-modal-previous" class="ui-icon ui-icon-carat-1-w"></div><div id="raptor-gallery-modal-image-wrapper"></div><div id="raptor-gallery-modal-next" class="ui-icon ui-icon-carat-1-e"></div></div></td></tr></table>'
    };

    RaptorGallery.initialise = function(gallery, image) {
        if (!this.initialised) {
            this.initialised = true;

            this.modal = $('<div>')
                .attr('id', 'raptor-gallery-modal')
                .html(this.templates.modal)
                .appendTo('body');

            this.imageWapper = $('#raptor-gallery-modal-image-wrapper');
            $('#raptor-gallery-modal-close').click($.proxy(this.close, this))
            $('#raptor-gallery-modal-next').click($.proxy(this.next, this))
            $('#raptor-gallery-modal-previous').click($.proxy(this.previous, this))
            $('#raptor-gallery-modal-wrapper').click($.proxy(this.stopPropagation, this));
            this.modal.click($.proxy(this.close, this));

            if (typeof Hammer !== 'undefined') {
                var hammertime = new Hammer(this.modal);
                hammertime.on('swipeleft', this.next.bind(this));
                hammertime.on('swiperight', this.previous.bind(this));
            }

            $(window).resize($.proxy(this.resize, this));
            $(document).keyup($.proxy(this.keyup, this));
        }
        this.gallery = gallery;
        this.image = image;
        RaptorGallery.imageWapper.html(image.outerHTML);
        RaptorGallery.imageWapper.find('[data-src]').each(function() {
            $(this).attr('src', $(this).data('src'));
        });
        this.modal.show();
        this.resize();
    };

    RaptorGallery.close = function() {
        this.gallery = null;
        this.image = null;
        this.modal.hide();
    };

    RaptorGallery.next = function(event) {
        for (var i = 0; i < this.gallery.images.length; i++) {
            if (this.gallery.images[i] == this.image) {
                break;
            }
        }
        i++;
        if (i >= this.gallery.images.length) {
            i = 0;
        }
        this.initialise(this.gallery, this.gallery.images[i]);
        event.stopPropagation();
    };

    RaptorGallery.previous = function(event) {
        for (var i = 0; i < this.gallery.images.length; i++) {
            if (this.gallery.images[i] == this.image) {
                break;
            }
        }
        i--;
        if (i < 0) {
            i = this.gallery.images.length - 1;
        }
        this.initialise(this.gallery, this.gallery.images[i]);
        event.stopPropagation();
    };

    RaptorGallery.stopPropagation = function(event) {
        event.stopPropagation();
    };

    RaptorGallery.resize = function() {
        this.imageWapper.css({
            maxWidth: $(window).width() - 40,
            maxHeight: $(window).height() - 40,
        });
    };

    RaptorGallery.keyup = function(event) {
        if (!this.gallery ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                event.metaKey) {
            return;
        }
        switch (event.keyCode) {
            // Escape
            case 27: {
                this.close();
                break;
            }
            // Left
            case 37: {
                this.previous(event)
                break;
            }
            // Right
            case 39: {
                this.next(event)
                break;
            }
        }
    };
})(jQuery);
