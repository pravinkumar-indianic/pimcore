pimcore.registerNS("pimcore.plugin.material");

pimcore.plugin.material = Class.create(pimcore.plugin.admin, {
    getClassName: function () {
        return "pimcore.plugin.material";
    },

    initialize: function () {
        pimcore.plugin.broker.registerPlugin(this);
        this.navEl = Ext.get('pimcore_menu_search').insertSibling('<li id="pimcore_menu_mds" data-menu-tooltip="Sync Material" class="pimcore_menu_item pimcore_menu_needs_children pimcore_icon_user"></li>', 'after');
        this.menu = new Ext.menu.Menu({
            items: [{
                text: "Product List",
                iconCls: "pimcore_icon_product",
                handler: () => {
                    Ext.Ajax.request({
                        url: '/products',
                        method: 'GET',
                        success: (response) => {
                            if (response.status == '200') {
                                this.showProductsGridView(response.responseText);
                            }
                        }
                    });
                },
            }],
            cls: "pimcore_navigation_flyout"
        });
        pimcore.layout.toolbar.prototype.mdsMenu = this.menu;
    },

    showProductsGridView: function (html) {
        var rightPanel = Ext.getCmp('pimcore_panel_tabs');

        if (rightPanel) {
            var panel = Ext.create('Ext.panel.Panel', {
                title: 'Product Listing',
                html: html,
                width: '100%',
                height: '100%',
                layout: 'fit',
                closable: true
            });

            rightPanel.removeAll(true);
            rightPanel.add(panel);
            rightPanel.setActiveTab(panel);
        } else {
            Ext.MessageBox.alert('Error', 'Failed to find the right panel.');
        }
    },

    pimcoreReady: function (params, broker) {
        var toolbar = pimcore.globalmanager.get("layout_toolbar");
        this.navEl.on("mousedown", toolbar.showSubMenu.bind(toolbar.mdsMenu));
        pimcore.plugin.broker.fireEvent("mdsMenuReady", toolbar.mdsMenu);
    }
});

new pimcore.plugin.material();
