if (OWF.Util.isRunningInOWF()) {

    // Enable logging in case we need it
    var logger = OWF.Log.getDefaultLogger();
    var appender = logger.getEffectiveAppenders()[0];
    appender.setThreshold(log4javascript.Level.INFO);
    OWF.Log.setEnabled(true);

    // once OWF has loaded
    OWF.ready(function() {
        umap_subscribe();

        // launch common map widget if it's not already running
        OWF.Launcher.launch({
            universalName: 'org.jc2cui.mapWidget',
            launchOnlyIfClosed: true,
            data: ""
        }, function (result) {
            OWF.Eventing.subscribe("hackathon.scenario.broadcast", deployScenarioPhase);
            setInterval(plotDynamic, 2000);
            OWF.notifyWidgetReady();
        });
    });
}