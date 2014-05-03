OWF.relayFile = '/owf-sample-html/js/eventing/rpc_relay.uncompressed.html';

console.log(owfdojo);

owfdojo.addOnLoad(function () {
    conosle.log('add on load');
    OWF.ready(init);
});

function init() {
    console.log('init relay widget');
    umap_subscribe();

}