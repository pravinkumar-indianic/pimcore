pimcore.registerNS("pimcore.plugin.DAMBundle");

pimcore.plugin.DAMBundle = Class.create(pimcore.plugin.admin, {
    getClassName: function () {
        return "pimcore.plugin.DAMBundle";
    },

    initialize: function () {
        pimcore.plugin.broker.registerPlugin(this);
    },

    pimcoreReady: function (params, broker) {
        var checkProcessToolbar = new pimcore.plugin.checkProcessBar();
        checkProcessToolbar.leftNavigation();
    }
});

var DAMBundlePlugin = new pimcore.plugin.DAMBundle();
