//OWF.relayFile = '/rpc_relay.uncompressed.html';

function init() {
    umap.Eventing.init();
}

$(document).ready(function () {
    if (typeof OWF !== 'object' || !OWF.Util.isRunningInOWF()) { // jslint wont allow Ozone === 'undefined' and despite crockfords claim, Ozone === undefined blows up the browser here
        alert('Map Widget tester only works as a widget in an OWF dashboard');
        return;
    }

    OWF.ready(function () {
        init();
    });
});