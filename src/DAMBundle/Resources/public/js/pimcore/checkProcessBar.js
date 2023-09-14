pimcore.registerNS("pimcore.plugin.checkProcessBar");


pimcore.plugin.checkProcessBar = Class.create({

    /*
     * @constructor
     */
    initialize: function () {
    },
    /*
     * @desc Adds menu icon in the left main menu
     */
    leftNavigation: function () {
        
        var navigation = Ext.get("pimcore_navigation");
        var ulElement = navigation.selectNode('ul');
        var li = document.createElement("li");
        self = this;
        li.setAttribute("id", "pimcore_menu_command2");
        li.setAttribute("class", "rowBezahlt");
        li.setAttribute("data-menu-tooltip", "Check Process");
        var img = document.createElement("img");
        img.setAttribute("src", "/bundles/pimcoreadmin/img/flat-color-icons/remove.svg");
        li.appendChild(img);
        ulElement.appendChild(li);

        pimcore.helpers.initMenuTooltips();
        
        /** Direct click on navigation */
        var commandBTN = Ext.get("pimcore_menu_command2");
        commandBTN.on("click", function () {
            var commandItem = new pimcore.plugin.checkProcessItem();
            commandItem.showList();
        });
        /**  menu stopped */
        //this.addMenu(this);
       
    }.bind(this),
    /*
     * @desc Adds sub menu icon for Mapping
     */
    addMenu: function (scope) {
        var commandItems = [];

        commandItems.push({
            text: "Check Process",
            iconCls: "pimcore_icon_portlet_feed",
            handler: function () {
              var commandItem = new pimcore.plugin.checkProcessItem();
              commandItem.showList();
            }
        });
      this.commandMenu = new Ext.menu.Menu({
            items: commandItems,
            shadow: false,
            cls: "pimcore_navigation_flyout"
        });
        var distributionMenus = this.commandMenu;
        Ext.get("pimcore_menu_command2").on("mousedown", function (e, el) {
            if (distributionMenus.hidden) {
                e.stopEvent();
                el = Ext.get(el);
                var offsets = el.getOffsetsTo(Ext.getBody());
                offsets[0] = 60;
                distributionMenus.showAt(offsets);
            } else {
                distributionMenus.hide();
            }
        });
    },

});

var checkProcessToolBar = new pimcore.plugin.checkProcessBar();
