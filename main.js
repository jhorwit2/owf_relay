OWF.relayFile = '/rpc_relay.uncompressed.html';

console.log(owfdojo);

owfdojo.addOnLoad(function () {
    console.log('add on load');
    OWF.ready(init);
});

function init() {
    console.log('init relay widget');
    umap.Eventing.init();
    console.log('umap init');

}