"use strict";

$(function () {

    var URL = {
        GetModel: 'Sites/GetModel',
        GetList: 'Sites/GetList',
        New: 'Sites/New',
        Edit: 'Sites/Edit',
        SaveNew: 'Sites/SaveNew',
        SaveUpdate: 'Sites/SaveUpdate',
        Delete: 'Sites/Delete'
    }

    function ViewModel(data) {
        var self = this;

        ko.mapping.fromJS(data, {
            Sites: {
                create: (options) => ko.mapping.fromJS(options.data)
            },
            Site: {
                create: (options) => {
                    if (options.data !== null) {
                        options.data.Colors = [];
                        for (var i = 1; i <= 16; i++) {
                            options.data.Colors.push({ Name: ('00' + i).slice(-2), Id: i });
                        }
                        
                    }
                    return ko.mapping.fromJS(options.data);
                }
            },
            Pager: {
                create: (options) => new PagerViewModel(options.data, () => self.applyFilters())
            }
        }, self);

        self.URL = URL;
        self.alerts = ko.observable(null);
        self.mode = ko.observable('list');
        self.nameFocus = ko.observable(false);

        self.applyFilters = function () {
            $.blockUI();
            $.apiCall(URL.GetList, { Pager: ko.mapping.toJS(self.Pager) }).then((model) => {
                ko.mapping.fromJS({ Sites: model.Sites, Pager: model.Pager }, self);
            })
            .always(() => $.unblockUI());
        };

        self.cancel = function () {
            self.mode("list");
        }

        self.afterFormIn = () => new Foundation.Abide($('#edit-form'));
        self.afterFormOut = () => self.Site(null);

        self.newSite = function () {
            $.blockUI();
            $.apiCall(URL.New).then(function (model) {
                ko.mapping.fromJS({ Site: model.Site }, self);
                self.mode("new");
                self.nameFocus(true);
            })
            .always(() => $.unblockUI());
        }

        self.save = function () {
            $.blockUI();
            var url = self.mode() === "new" ? URL.SaveNew : URL.SaveUpdate;
            $.apiCall(url, { Site: ko.mapping.toJS(self.Site), Pager: ko.mapping.toJS(self.Pager) }).then((model) => {
                ko.mapping.fromJS({ Sites: model.Sites, Pager: model.Pager }, self);
                self.mode("list");
            })
            .always(() => $.unblockUI());
        }

        self.edit = function (site) {
            $.blockUI();
            $.apiCall(URL.Edit, { Site: { Id: site.Id() } }).then((model) => {
                ko.mapping.fromJS({ Site: model.Site }, self);
                self.mode("edit");
                self.nameFocus(true);
            })
            .always(() => $.unblockUI());
        }

        self.delete = function (site) {
            $.confirm("Se dispone a eliminar el sitio " + site.Name() + ". ¿Está ud. seguro?").then(function () {
                $.blockUI();
                $.apiCall(URL.Delete, { Site: { Id: site.Id() }, Pager: ko.mapping.toJS(self.Pager) }).then((model) => {
                    ko.mapping.fromJS({ Sites: model.Sites, Pager: model.Pager }, self);
                })
                .always(() => $.unblockUI());
            });
        }
    }

    $.apiCall(URL.GetModel).then((data) => {
        var viewModel = new ViewModel(data);
        ko.applyBindings(viewModel);
        $(document).trigger("app.initialized");
    });
});