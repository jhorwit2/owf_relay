/*global umap, cmapi */

/**
 * This method needs to be called when the eventing object is ready, so
 * the map can subscribe to the necessary channels.
 */
$(window).bind('socketConnected', function() {
    umap_subscribe();
  });

function umap_subscribe() {
    console.log("subscribing to umap channels");

    // OVERLAYS
    umap.Eventing.subscribe('map.overlay.create', umap.Eventing.onMessage);
    umap.Eventing.subscribe('map.overlay.remove', umap.Eventing.onMessage);
    umap.Eventing.subscribe('map.overlay.hide', umap.Eventing.onMessage);
    umap.Eventing.subscribe('map.overlay.show', umap.Eventing.onMessage);
    umap.Eventing.subscribe('map.overlay.update', umap.Eventing.onMessage);

    // FEATURES
    umap.Eventing.subscribe('map.feature.plot', umap.Eventing.onMessage);
    umap.Eventing.subscribe('map.feature.plot.url', umap.Eventing.onMessage);
    umap.Eventing.subscribe('map.feature.unplot', umap.Eventing.onMessage);
    umap.Eventing.subscribe('map.feature.hide', umap.Eventing.onMessage);
    umap.Eventing.subscribe('map.feature.show', umap.Eventing.onMessage);
    umap.Eventing.subscribe('map.feature.update', umap.Eventing.onMessage);

    // VIEW
    umap.Eventing.subscribe('map.view.zoom', umap.Eventing.onMessage);
    umap.Eventing.subscribe('map.view.center.overlay', umap.Eventing.onMessage);
    umap.Eventing.subscribe('map.view.center.feature', umap.Eventing.onMessage);
    umap.Eventing.subscribe('map.view.center.location', umap.Eventing.onMessage);
    umap.Eventing.subscribe('map.view.center.bounds', umap.Eventing.onMessage);

    // STATUS
    umap.Eventing.subscribe('map.status.view', umap.Eventing.onMessage);
}