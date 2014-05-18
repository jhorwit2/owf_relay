
$(document).ready(function () {
    umap.Eventing.init('https://gmul-pf-app01.pf.cee-w.net/', true);

    if (typeof OWF !== 'object' || !OWF.Util.isRunningInOWF()) { // jslint wont allow Ozone === 'undefined' and despite crockfords claim, Ozone === undefined blows up the browser here
        //alert('The OWF Relay widget only works in an OWF dashboard');
        return;
    }

    OWF.ready(function () {
        console.log('initializing the eventing object');
        // Start the eventing object pointed to the socket server.
    });
});
