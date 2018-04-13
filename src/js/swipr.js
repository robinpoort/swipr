/* Swipr */
(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define([], function () {
            return factory(root);
        });
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(root);
    } else {
        root.swipr = factory(root);
    }
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (root) {

    'use strict';


    // Variables
    // ---------

    var supports = 'querySelector' in document && 'addEventListener' in window && 'classList' in document.createElement('_');
    var settings, scrollbarSize;


    // Default settings
    // ----------------

    var defaults = {
        wrapper: '[data-swipr-wrapper]',
        swiper: '[data-swipr]',
        startItem: '[data-swipr-start]',
        swiprPreviousButtonClass: 'swipr-prev',
        swiprPreviousButtonContent: 'previous',
        swiprNextButtonClass: 'swipr-next',
        swiprNextButtonContent: 'next',
        disabledButtonClass: 'is-disabled',
        amount: 0.8,
        speed: 400,
        initiatedClass: 'is-initiated',
        enabledClass: 'is-enabled'
    };


    // Polyfills
    // ---------

    /**
     * Element.matches() polyfill (simple version)
     * https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
     */
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }


    /**
     * Element.closest() polyfill
     * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
     */
    if (!Element.prototype.closest) {
        if (!Element.prototype.matches) {
            Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
        }
        Element.prototype.closest = function (s) {
            var el = this;
            var ancestor = this;
            if (!document.documentElement.contains(el)) return null;
            do {
                if (ancestor.matches(s)) return ancestor;
                ancestor = ancestor.parentElement;
            } while (ancestor !== null);
            return null;
        };
    }


    // Shared Methods
    // --------------

    /**
     * forEach
     */
    var forEach = function(collection, callback, scope) {
        if (Object.prototype.toString.call(collection) === "[object Object]") {
            for (var prop in collection) {
                if (Object.prototype.hasOwnProperty.call(collection, prop)) {
                    callback.call(scope, collection[prop], prop, collection);
                }
            }
        } else {
            for (var i = 0, len = collection.length; i < len; i++) {
                callback.call(scope, collection[i], i, collection);
            }
        }
    };


    /**
     * Extend
     */
    var extend = function () {

        // Variables
        var extended = {};
        var deep = false;
        var i = 0;

        // Check if a deep merge
        if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
            deep = arguments[0];
            i++;
        }

        // Merge the object into the extended object
        var merge = function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    // If property is an object, merge properties
                    if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                        extended[prop] = extend(extended[prop], obj[prop]);
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        // Loop through each object and conduct a merge
        for (; i < arguments.length; i++) {
            var obj = arguments[i];
            merge(obj);
        }

        return extended;

    };


    /**
     * Is mobile
     */
    var isMobile = function() {
        var useragent = navigator.userAgent;

        if(useragent.match(/Android/i)) {
            return 'android';
        } else if(useragent.match(/webOS/i)) {
            return 'webos';
        } else if(useragent.match(/iPhone/i)) {
            return 'iphone';
        } else if(useragent.match(/iPod/i)) {
            return 'ipod';
        } else if(useragent.match(/iPad/i)) {
            return 'ipad';
        } else if(useragent.match(/Windows Phone/i)) {
            return 'windows phone';
        } else if(useragent.match(/SymbianOS/i)) {
            return 'symbian';
        } else if(useragent.match(/RIM/i) || useragent.match(/BB/i)) {
            return 'blackberry';
        } else {
            return false;
        }
    };


    /**
     * Is touch device
     */
    function isTouchDevice() {
        return 'ontouchstart' in document.documentElement;
    }


    /**
     * Get scrollbar size
     */
    var getScrollbarSize = function() {
        var outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
        document.body.appendChild(outer);
        var widthNoScroll = outer.offsetWidth;

        // force scrollbars
        outer.style.overflow = "scroll";

        // Inner div
        var inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);
        var widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);

        // Set fallback
        if (widthNoScroll == widthWithScroll) {
            return false;
        }

        return widthNoScroll - widthWithScroll;
    };


    /**
     * Get first child and skip text nodes
     */
    function getFirstChild(el){
        var firstChild = el.firstChild;
        while (firstChild != null && firstChild.nodeType == 3) { // skip TextNodes
            firstChild = firstChild.nextSibling;
        }
        return firstChild;
    }


    /**
     * Get previous sibling and skip text nodes
     */
    function getPreviousSibling(el){
        var prevSibling = el.previousSibling;
        while (prevSibling != null && prevSibling.nodeType == 3) { // skip TextNodes
            prevSibling = prevSibling.previousSibling;
        }
        return prevSibling;
    }


    /**
     * Get next sibling and skip text nodes
     */
    function getNextSibling(el){
        var nextSibling = el.nextSibling;
        while (nextSibling != null && nextSibling.nodeType == 3) { // skip TextNodes
            nextSibling = nextSibling.nextSibling;
        }
        return nextSibling;
    }


    // Animation
    // ---------

    var Swipe = function (options) {

        // Unique Variables
        // ----------------

        var publicAPIs = {};
        var settings;
        var hasHorizontalScrollbar;
        var swipers;
        var $wrapper;
        var $swiper;
        var eventTimeout;


        /**
         * Add buttons to the wrapper
         */
        var addButtons = function($swiper) {

            // Sanity check
            if (!settings) return;

            // Return if buttons are already there
            if (getFirstChild($swiper.parentNode).classList.contains(settings.swiprPreviousButtonClass)) return;

            // Create button elements
            var $prevButton = document.createElement('button');
            var $nextButton = document.createElement('button');

            // Add classes and content
            $prevButton.classList.add(settings.swiprPreviousButtonClass);
            $prevButton.innerHTML = settings.swiprPreviousButtonContent;
            $nextButton.classList.add(settings.swiprNextButtonClass);
            $nextButton.innerHTML = settings.swiprNextButtonContent;

            // Add to the DOM
            $swiper.parentNode.insertBefore($prevButton, $swiper);
            $swiper.parentNode.insertBefore($nextButton, $swiper.nextSibling);

            // Add event listeners
            $prevButton.addEventListener('click', clickHandler, false);
            $nextButton.addEventListener('click', clickHandler, false);
        };


        /**
         * Remove buttons from wrapper
         */
        var removeButtons = function($swiper) {

            // Sanity check
            if (!settings) return;

            // Variables
            var $prevButton = $swiper.parentNode.getElementsByClassName(settings.swiprPreviousButtonClass)[0];
            var $nextButton = $swiper.parentNode.getElementsByClassName(settings.swiprNextButtonClass)[0];

            // Remove event listeners
            $prevButton.removeEventListener('click', clickHandler, false);
            $nextButton.removeEventListener('click', clickHandler, false);

            // Remove buttons
            $prevButton.parentNode.removeChild($prevButton);
            $nextButton.parentNode.removeChild($nextButton);
        };


        /**
         * Hide buttons
         */
        var hideButtons = function($swiper) {

            // Sanity check
            if (!settings) return;

            if (getPreviousSibling($swiper).classList.contains(settings.swiprPreviousButtonClass)) {
                getPreviousSibling($swiper).style.display = 'none';
            }
            if (getNextSibling($swiper).classList.contains(settings.swiprNextButtonClass)) {
                getNextSibling($swiper).style.display = 'none';
            }
        };


        /**
         * Show buttons
         */
        var showButtons = function($swiper) {

            // Sanity check
            if (!settings) return;

            if (getPreviousSibling($swiper).classList.contains(settings.swiprPreviousButtonClass)) {
                getPreviousSibling($swiper).removeAttribute('style');
            }
            if (getNextSibling($swiper).classList.contains(settings.swiprNextButtonClass)) {
                getNextSibling($swiper).removeAttribute('style');
            }
        };


        /**
         * Calculate button visibility
         */
        var calculateButtonVisibility = function($swiper) {

            var $prevButton = getPreviousSibling($swiper);
            var $nextButton = getNextSibling($swiper);

            // Show / hide prev button
            if ($swiper.scrollLeft > 0) {
                $prevButton.classList.remove(settings.disabledButtonClass);
                $prevButton.removeAttribute('disabled');
            } else {
                $prevButton.disabled = true;
                $prevButton.classList.add(settings.disabledButtonClass);
            }

            // Show/hide next button
            if ($swiper.scrollWidth - $swiper.scrollLeft == $swiper.offsetWidth) {
                $nextButton.disabled = true;
                $nextButton.classList.add(settings.disabledButtonClass);
            } else {
                $nextButton.classList.remove(settings.disabledButtonClass);
                $nextButton.removeAttribute('disabled');
            }
        };


        /**
         * Set scrollbar size
         */
        var setScrollbarStyle = function($swiper, scrollbarSize) {
            if (scrollbarSize != false) {
                $swiper.style.marginBottom = -(scrollbarSize * 2) + 'px';
                $swiper.style.paddingBottom = scrollbarSize + 'px';
            }
        };


        /**
         * Run Swipr
         */
        publicAPIs.runswipr = function (options) {

            // Local settings
            var localSettings = extend(settings || defaults, options || {}); // Merge user options with defaults

            // Swipers
            swipers = document.querySelectorAll(localSettings.swiper);

            // Loop through swipers
            forEach(swipers, function ($swiper) {

                // Add buttons
                addButtons($swiper);
                hideButtons($swiper);

                // Add initiated class
                $swiper.parentNode.classList.add(localSettings.initiatedClass);

                // See if there's a start item
                var startScroll = $swiper.querySelector(localSettings.startItem);
                if (startScroll) {
                    animateScroll($swiper, startScroll.offsetLeft, settings.speed);
                }

                // Check for scrollbar
                hasHorizontalScrollbar = $swiper.scrollWidth > $swiper.clientWidth;

                // Enable the swiper
                if (hasHorizontalScrollbar) {
                    publicAPIs.enable($swiper);
                    setScrollbarStyle($swiper, scrollbarSize);
                    calculateButtonVisibility($swiper);
                }

                // Disable the swiper
                else {
                    publicAPIs.disable($swiper);
                }

            });

        };


        /**
         * animate scroll
         */
        function animateScroll(element, to, duration) {
            var start = element.scrollLeft,
                change = to - start,
                currentTime = 0,
                increment = 20;

            var animateScroll = function(){
                currentTime += increment;
                var val = Math.easeInOutQuad(currentTime, start, change, duration);
                element.scrollLeft = val;
                if(currentTime < duration) {
                    setTimeout(animateScroll, increment);
                }
            };

            animateScroll();
        }


        /**
         * Easing
         */
        Math.easeInOutQuad = function (t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2*t*t + b;
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        };


        /**
         * scrollTo
         */
        function scrollTo($wrapper, direction) {
            $swiper = $wrapper.querySelector(settings.swiper);

            var width = Math.round($wrapper.offsetWidth * settings.amount);
            var scroll = $swiper.scrollLeft;
            var newScroll;

            if (direction == 'prev') {
                newScroll = scroll - width;
            }

            if (direction == 'next') {
                newScroll = scroll + width;
            }

            animateScroll($swiper, newScroll, settings.speed);
        }


        /**
         * Click handler
         */
        var clickHandler = function () {
            var className = this.className;
            if ( className == settings.swiprPreviousButtonClass) {
                scrollTo(this.parentNode, 'prev');
            }
            if ( className == settings.swiprNextButtonClass) {
                scrollTo(this.parentNode, 'next');
            }
        };


        /**
         * Scroll handler
         */
        var scrollHandler = function () {
            calculateButtonVisibility(this);
        };


        /**
         * On window resize, only run at a rate of 15fps for better performance
         */
        var eventThrottler = function () {
            if ( !eventTimeout ) {
                eventTimeout = setTimeout(function() {
                    eventTimeout = null;
                    publicAPIs.runswipr(options);
                }, 66);
            }
        };


        /**
         * Enable
         */
        publicAPIs.enable = function ($swiper) {

            // Sanity check
            if (!settings) return;

            // Hide the buttons
            showButtons($swiper);

            // Add class
            $swiper.parentNode.classList.add(settings.enabledClass);

            // scroll handler
            $swiper.addEventListener('scroll', scrollHandler, false);

        };


        /**
         * Disable
         */
        publicAPIs.disable = function ($swiper) {

            // Sanity check
            if (!settings) return;

            // Hide the buttons
            hideButtons($swiper);

            // Remove class
            $swiper.parentNode.classList.remove(settings.enabledClass);

            // Remove styling
            $swiper.removeAttribute('style');

        };


        /**
         * Destroy
         */
        publicAPIs.destroy = function () {

            // Sanity check
            if (!settings) return;

            // Remove event listener
            root.removeEventListener('resize', eventThrottler, false);

            // Remove the buttons
            removeButtons($swiper);

            // Remove classes
            $swiper.parentNode.classList.remove(settings.initiatedClass);
            $swiper.parentNode.classList.remove(settings.enabledClass);

            // Reset variables
            swipers = null;
            settings = null;
            $wrapper = null;
            $swiper = null;
            eventTimeout = null;
            scrollbarSize = null;

        };


        /**
         * Init
         */
        publicAPIs.init = function (options) {

            // feature test
            if (!supports) return;

            // Return if device is mobile and support touch
            if (isTouchDevice() && isMobile()) return;

            // Set variables
            settings = extend(defaults, options || {});

            // Get scrollbar size
            scrollbarSize = getScrollbarSize();

            // Setup
            publicAPIs.runswipr(options);

            // Run on window resize
            root.addEventListener('resize', eventThrottler, false);

        };

        // Initialize the plugin
        publicAPIs.init(options);

        // Return the public APIs
        return publicAPIs;

    };


    // Return the constructor
    // ----------------------

    return Swipe;

});
