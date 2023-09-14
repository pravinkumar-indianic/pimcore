pimcore.registerNS("pimcore.plugin.checkProcessPanel");
var curpan;
var selectedId = [];
var mappingStore;
var username ='';
pimcore.plugin.checkProcessPanel = Class.create({

    /*
     * @constructor
     */
    initialize: function (parent) {
        Ext.Ajax.setTimeout(6000000);
        curpan = this;
        var user = new pimcore.user(pimcore.currentuser);
        username = user.name;
        var exportTab = Ext.get("checkProcessPanel");

        if (exportTab) {
            var tabPanel = Ext.getCmp("pimcore_panel_tabs");
            tabPanel.setActiveItem("checkProcessPanel");
        } else {
            if (typeof (ProductModel) == 'undefined') {
                Ext.define('ProductModel', {
                    extend: 'Ext.data.Model',
                    fields: [
                        { name: 'SKU', mapping: 'SKU' },
                        { name: 'ASIN', mapping: 'asinUS + " " + asinCA' },
                        { name: 'Price', mapping: 'priceUS' },
                        { name: 'Stock', mapping: 'netsuite' },
                        { name: 'ProductSynced', mapping: 'status' },
                        { name: 'PriceSynced', mapping: 'status' },
                        { name: 'StockSynced', mapping: 'status' },
                    ]
                });
            }
            this.getPanel();
        }
    },
    activate: function () {
        var tabPanel = Ext.getCmp("pimcore_panel_tabs");
    },
    getData: function () {

        mappingStore = Ext.create('Ext.data.Store', {
            model: 'ProductModel',
            proxy: {
                type: 'ajax',
                url: "/check_process",
                reader: {
                    type: 'json',
                    rootProperty: 'ProductModel',
                    totalProperty: 'total'
                }
            },
            config: {
                autoLoad: true,
                remoteFilter: true,
                remoteSort: true,
            }
        });
        return mappingStore;
    },
    /*
     * @desc Open Mapping panel
     */
    getPanel: function () {
        var productstore = this.getData();
        var mygrid = this.createMappingGrid(productstore);
        if (!this.panel) {
            this.panel = new Ext.Panel({
                id: "checkProcessPanel",
                store: productstore,
                title: 'Check Process',
                iconCls: "panal_amazon_icon",
                bodyStyle: "padding: 10px;",
                layout: "fit",
                closable: true,
                width: '100%',
                bodyPadding: 10,
                autoWidth: true,
                items: [
                    mygrid
                ],
                viewConfig: {
                    forceFit: true,
                },
                listeners: {
                    'onHeaderClick': {
                        fn: function (grid, col, e) {

                            if (col.fullColumnIndex == 0) {
                                grid.store.each(function (rec) {
                                    rec.set(col.dataIndex, true);
                                });
                            }
                        },
                        scope: this
                    },
                    'onSearchAction': {
                        fn: function () {

                        },
                    }
                },
            });

            var tabPanel = Ext.getCmp("pimcore_panel_tabs");
            tabPanel.add(this.panel);
            tabPanel.setActiveItem("checkProcessPanel");

            this.panel.on("destroy", function () {
                pimcore.globalmanager.remove("checkProcessPanel");
                pimcore.globalmanager.remove("ProductModel");
            }.bind(this));

            pimcore.layout.refresh();
        }
        return this.panel;
    },
    createMappingGrid: function (mappingStore) {

        var pageSize = pimcore.helpers.grid.getDefaultPageSize(-1);
        var gridColumns = [];
        gridColumns.push({ text: t("ID"), flex: 20, dataIndex: 'id', filter: 'string', sortable: false, });
        gridColumns.push({ text: t("Name"), flex: 170, dataIndex: 'name', filter: 'string', sortable: false, });
        gridColumns.push({ text: t("Description"), flex: 170, dataIndex: 'description', filter: 'string', sortable: false, });
       
        gridColumns.push({
            xtype: 'actioncolumn',
            text: t("Remove"),
            menuText: t("Remove"),
            width: 60,
            items: [
                {
                    tooltip: t("Remove"),
                    iconCls: "pimcore_icon_delete",
                    handler: function (grid, rowIndex) {
                       
                        var store = grid.getStore();
                        var data = store.getAt(rowIndex).getData();
                        Ext.MessageBox.confirm(
                            'Confirm', 'Are you sure that you want to remove this command?', callbackFunction);
                        function callbackFunction(btn) {
                            if(btn == 'yes') {                            
                                Ext.Ajax.request({
                                    url: "/remove_process",
                                    method: "POST",
                                    params: {
                                        id: data.Pid,
                                        username:username                                   
                                    },
                                    success: function(response) {
                                        var res = Ext.decode(response.responseText);   
                                        if(res.success){       
                                            mappingStore.load();
                                            Ext.MessageBox.alert("Info", res.message);                
                                        }else{
                                            mappingStore.load();
                                            Ext.MessageBox.alert("Error", res.message); 
                                        }
                                    
                                    },
                                    failure: function (response) {
                                        mappingStore.load(); 
                                        Ext.MessageBox.alert("Error", response);
                                    },
                                });
                            } 
                        };

                    }.bind(this)
                }
            ]
        });

        var plugins = ['gridfilters'];
        //var sm = Ext.create('Ext.selection.CheckboxModel');
        this.listGrid = new Ext.grid.Panel({
            id: 'checklookupGrid',
            renderTo: Ext.getBody(),
            // selModel: {
            //     selType: 'checkboxmodel',
            //     mode: 'MULTI',
            //     checkOnly: true,
            // },
            setMask: function () {
                this.store.on('load', this.unmask, this);
                this.mask('Loading...');
            },
            frame: false,
            store: mappingStore,
            loadMask: true,
            columnLines: true,
            bodyCls: "pimcore_editable_grid",
            plugins: plugins,
            stripeRows: true,
            region: "west",
            hidden: false,
            //selModel: Ext.create('Ext.selection.RowModel', {}),
            columns: gridColumns,
            bbar: pimcore.helpers.grid.buildDefaultPagingToolbar(mappingStore, { pageSize: pageSize }),
            width: 700,
            viewConfig: {
                forceFit: true,
                getRowClass: function (record, index) {

                }
            }
        });

        mappingStore.load();
        return this.listGrid
    }
});
