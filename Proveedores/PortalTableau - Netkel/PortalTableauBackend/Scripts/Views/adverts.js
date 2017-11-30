"use strict";

$(function () {

    var URL = {
        GetModel: 'Advertisements/GetModel',
        GetList: 'Advertisements/GetList',
        New: 'Advertisements/New',
        Edit: 'Advertisements/Edit',
        SaveNew: 'Advertisements/SaveNew',
        SaveUpdate: 'Advertisements/SaveUpdate',
        Delete: 'Advertisements/Delete'
    }

    function ViewModel(data) {
        var self = this;

        ko.mapping.fromJS(data, {
            Advertisements: {
                create: (options) => options.data
            },
            Pager: {
                create: (options) => new PagerViewModel(options.data, () => self.applyFilters())
            },
            Advertising: {
                create: (options) => {
                    let vm = ko.mapping.fromJS(options.data, {
                        Image: {
                            create: (opt) => {
                                var vm = new SingleFileUploadViewModel(opt.data);
                                vm.validate = () => !vm.uploading() && vm.Id() > 0;

                                return vm;
                            }
                        }
                    });

                    vm.ImageUrl = ko.pureComputed(() => {
                        return vm.Image.Id() > 0 ? $("body").data("baseurl") + "Files/Download?id=" + vm.Image.Id().toString() : null;
                    }, vm);

                    return vm;
                }
            }
        }, self);

        self.URL = URL;
        self.alerts = ko.observable(null);
        self.mode = ko.observable('list');
        self.titleFocus = ko.observable(false);

        self.applyFilters = function () {
            $.blockUI();
            $.apiCall(URL.GetList, { Pager: ko.mapping.toJS(self.Pager) }).then((model) => {
                ko.mapping.fromJS({ Advertisements: model.Advertisements, Pager: model.Pager }, self);
            })
            .always(() => $.unblockUI());
        };

        self.cancel = function () {
            self.mode("list");
        }

        self.afterFormIn = () => setTimeout(() => new Foundation.Abide($('#edit-form')), 300);
        self.afterFormOut = () => self.Advertising(null);

        self.new = function () {
            $.blockUI();
            $.apiCall(URL.New).then(function (model) {
                ko.mapping.fromJS({ Advertising: model.Advertising }, self);
                self.mode("new");
                self.titleFocus(true);
            })
            .always(() => $.unblockUI());
        }

        self.save = function () {
            $.blockUI();
            var url = self.mode() === "new" ? URL.SaveNew : URL.SaveUpdate;
            $.apiCall(url, { Advertising: ko.mapping.toJS(self.Advertising), Pager: ko.mapping.toJS(self.Pager) }).then((model) => {
                ko.mapping.fromJS({ Advertisements: model.Advertisements, Pager: model.Pager }, self);
                self.mode("list");
            })
            .always(() => $.unblockUI());
        }

        self.edit = function (advertising) {
            $.blockUI();
            $.apiCall(URL.Edit, { Advertising: { Id: advertising.Id } }).then((model) => {
                ko.mapping.fromJS({ Advertising: model.Advertising }, self);
                self.mode("edit");
                self.titleFocus(true);
            })
            .always(() => $.unblockUI());
        }

        self.delete = function (advertising) {
            $.confirm("Se dispone a eliminar la publicidad " + advertising.Title + ". ¿Está ud. seguro?").then(function () {
                $.blockUI();
                $.apiCall(URL.Delete, { Advertising: { Id: advertising.Id }, Pager: ko.mapping.toJS(self.Pager) }).then((model) => {
                    ko.mapping.fromJS({ Advertisements: model.Advertisements, Pager: model.Pager }, self);
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