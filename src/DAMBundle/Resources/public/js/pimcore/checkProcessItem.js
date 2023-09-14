/**
 *
 * @class mappingtoolbar
 * @desc This file is used to create new panel for Mapping Screen
 * @version 1.0
 *
 */


pimcore.registerNS("pimcore.plugin.checkProcessItem");

pimcore.plugin.checkProcessItem = Class.create({

    /*
     * @constructor
     */
    initialize: function () {

    },
    showList: function () {
        if (!Ext.getCmp("checkProcessPanel")) {
            var dataCon = new pimcore.plugin.checkProcessPanel();
        } else {
            Ext.getCmp("pimcore_panel_tabs").setActiveItem("checkProcessPanel");
        }
    }

});

var checkProcessItem = new pimcore.plugin.checkProcessItem();
