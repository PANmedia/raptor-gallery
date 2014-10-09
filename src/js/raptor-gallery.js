RaptorGallery = function(wrapper, images) {
    this.images = images;
    this.wrapper = wrapper;

    this.wrapper.addEventListener('click', this.click.bind(this));

    for (var i = 0; i < this.images.length; i++) {
        this.images[i].classList.add('raptor-gallery-item');
    }
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

        this.modal = document.createElement('div');
        this.modal.id = 'raptor-gallery-modal';
        this.modal.innerHTML = this.templates.modal;
        document.body.appendChild(this.modal);

        this.imageWapper = document.getElementById('raptor-gallery-modal-image-wrapper');
        document.getElementById('raptor-gallery-modal-close').addEventListener('click', this.close.bind(this))
        document.getElementById('raptor-gallery-modal-next').addEventListener('click', this.next.bind(this))
        document.getElementById('raptor-gallery-modal-previous').addEventListener('click', this.previous.bind(this))
        document.getElementById('raptor-gallery-modal-wrapper').addEventListener('click', this.stopPropagation.bind(this));
        this.modal.addEventListener('click', this.close.bind(this));

        if (typeof Hammer !== 'undefined') {
            var hammertime = new Hammer(this.modal);
            hammertime.on('swipeleft', this.next.bind(this));
            hammertime.on('swiperight', this.previous.bind(this));
        }

        window.addEventListener('resize', this.resize.bind(this));
        document.addEventListener('keyup', this.keyup.bind(this));
    }
    this.gallery = gallery;
    this.image = image;
    RaptorGallery.imageWapper.innerHTML = image.outerHTML;
    var images = RaptorGallery.imageWapper.querySelectorAll('[data-src]');
    for (var i = 0; i < images.length; i++) {
        images[i].src = images[i].dataset.src;
    }
    this.modal.style.display = 'block';
    this.resize();
};

RaptorGallery.close = function() {
    this.gallery = null;
    this.image = null;
    this.modal.style.display = 'none';
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
    this.imageWapper.style.maxWidth = window.innerWidth - 40;
    this.imageWapper.style.maxHeight = window.innerHeight - 40;
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
