/*global Porthole, _, console */

(function (window) {
    "use strict";

    var umap = {};

    umap.Eventing = (function () {

        /**
         * Return true if object is neither null nor undefined.
         *
         * @private
         * @param {Object} obj: object to evaluate the existence of.
         */
        function exists(obj) {
            return !_(obj).isEmpty();
        }

        /**
         * Handler for messages received from the server relay.
         * This function will call the appropriate map handler
         * function, then propogate the message locally.
         *
         * To be clear, this message will have originated from
         * a publish in another browser, gone through the server,
         * and arrived here, to be handled by this function.
         *
         * @public
         * @param {String} channel
         *   the channel which the message was published on.
         * @param {Object} message
         *   the data of the publish.
         * @param {String} uid
         *   the uid of the widget that published this message.
         */
        function onServerReceive(channel, message, sender_uid) {
            OWF.Eventing.publish(channel, message);
        }

        function onMessage(channel, message) {
            if (exists(window.relay)) {
                setTimeout(window.relay.publish(channel, message), 0);
            }
        }

        /**
         * Initialize the windowProxy object on the window object.
         *
         * @public
         * @param {String} server_url: Domain where proxy html is located.
         */
        function init(server_url) {

            // If the widget has a relay established, then send to relay.
            if (typeof window.loadRelay === 'function') {
                window.loadRelay('http://horwitzja.com:3000/');
            }
        }

        /**
         * Subscribe a handler to a particular channel.  Note that
         * this will also unsubscribe any previously subscribed
         * handlers. In other words, each channel can only have one
         * callback subscribed at a time.
         *
         * @public
         * @param {String} channel: name of channel to subscribe to.
         * @param {Function} callback to execute for the subscribed channel
         * @return {Boolean} true if subscribed, false is error
         */
        function subscribe(channel, callback) {
            if (typeof callback !== 'function') {
                console.log("[error]: you must pass a function as a callback");
                return false;
            }

            OWF.Eventing.subscribe(channel, callback);

            if (exists(window.relay)) {
                window.relay.subscribe(channel, onServerReceive);
            }
            return true;
        }

        /**
         * Unsubscribe the previously subscribed callback from
         * the given channel.
         *
         * @public
         * @param {String} channel: Name of channel to unsubscribe from.
         * @return {Boolean} Returns false if not subscribed, true when removed
         */
        function unsubscribe(channel) {
            // TODO: implement later if we want this...
        }

        /**
         * Publish a message to the given channel.
         * Returns true if published; otherwise, false.
         *
         * @public
         * @param {String} channel: name of channel to publish to.
         * @param {String} message: the message to publish.
         * @return {Boolean}
         */
        function publish(channel, message) {

            OWF.Eventing.pubish(channel, message);

            if (exists(window.relay)) {
                setTimeout(window.relay.publish(channel, message), 0);
            }
        }

        /*
         * Expose public interface.
         */
        return {
            /* variables */

            /* methods */
            publish: publish,
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            init: init,
            onMessage: onMessage,
        };

    }());

    /*
     * Support testing in node.js by binding the `umap` object to the
     * global window context.
     */
    if (window.exports !== undefined) {
        window.exports.umap = umap;
    } else {
        window.umap = umap;
    }

}(this));

