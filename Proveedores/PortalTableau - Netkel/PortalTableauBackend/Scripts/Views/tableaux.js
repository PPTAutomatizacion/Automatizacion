"use strict";

$(function () {

    var URL = {
        GetModel: 'Tableaux/GetModel',
        GetList: 'Tableaux/GetList',
        New: 'Tableaux/New',
        Edit: 'Tableaux/Edit',
        SaveNew: 'Tableaux/SaveNew',
        SaveUpdate: 'Tableaux/SaveUpdate',
        Delete: 'Tableaux/Delete'
    }

    function ViewModel(data) {
        var self = this;

        var tableauMapping = {
            create: (options) => {
                let vm = ko.mapping.fromJS(options.data, {
                    Image: {
                        create: (opt) => {
                            var vm = new SingleFileUploadViewModel(opt.data);
                            vm.validate = () => !vm.uploading() && vm.Id() > 0;

                            return vm;
                        }
                    },
                    Params: {
                        create: (options) => ko.mapping.fromJS(options.data)
                    }
                });

                vm.ImageUrl = ko.pureComputed(() => {
                    return vm.Image.Id() > 0 ? $("body").data("baseurl") + "Files/Download?id=" + vm.Image.Id().toString() : null;
                }, vm);

                return vm;
            }
        };

        ko.mapping.fromJS(data, {
            copy : ["ParamTemplate"],
            Tableaux: {
                create: (options) => options.data
            },
            Pager: {
                create: (options) => new PagerViewModel(options.data, () => self.applyFilters())
            }
        }, self);

        self.URL = URL;
        self.alerts = ko.observable(null);
        self.mode = ko.observable('list');
        self.tableau = ko.observable(null);
        self.titleFocus = ko.observable(false);
        self.projectSelectedId = ko.observable(null);

        self.applyFilters = function () {
            $.blockUI();
            $.apiCall(URL.GetList, { Pager: ko.mapping.toJS(self.Pager), ProjectSelectedId: self.projectSelectedId() }).then((model) => {
                ko.mapping.fromJS({ Tableaux: model.Tableaux, Pager: model.Pager }, self);
            })
            .always(() => $.unblockUI());
        };

        self.cancel = function () {
            self.mode("list");
        }

        self.afterFormIn = () => setTimeout(() => new Foundation.Abide($('#edit-form')), 300);
        self.afterFormOut = () => self.tableau(null);

        self.new = function () {
            $.blockUI();
            $.apiCall(URL.New).then(function (model) {
                self.tableau(ko.mapping.fromJS(model.Tableau, tableauMapping));
                self.mode("new");
                self.titleFocus(true);
            })
            .always(() => $.unblockUI());
        }

        self.save = function () {
            $.blockUI();
            var url = self.mode() === "new" ? URL.SaveNew : URL.SaveUpdate;
            $.apiCall(url, { Tableau: ko.mapping.toJS(self.tableau(), { 'ignore': ['Projects'] }), Pager: ko.mapping.toJS(self.Pager) }).then((model) => {
                ko.mapping.fromJS({ Tableaux: model.Tableaux, Pager: model.Pager }, self);
                self.mode("list");
            })
            .always(() => $.unblockUI());
        }

        self.edit = function (tableau) {
            $.blockUI();
            $.apiCall(URL.Edit, { Tableau: { Id: tableau.Id } }).then((model) => {
                self.tableau(ko.mapping.fromJS(model.Tableau, tableauMapping));
                self.mode("edit");
                self.titleFocus(true);
            })
            .always(() => $.unblockUI());
        }

        self.delete = function (tableau) {
            $.confirm("Se dispone a eliminar el tablero " + tableau.Title + ". ¿Está ud. seguro?").then(function () {
                $.blockUI();
                $.apiCall(URL.Delete, { Tableau: { Id: tableau.Id }, Pager: ko.mapping.toJS(self.Pager) }).then((model) => {
                    ko.mapping.fromJS({ Tableaux: model.Tableaux, Pager: model.Pager }, self);
                })
                .always(() => $.unblockUI());
            });
        }

        self.addParam = function () {
            let param = self.tableau().Params.mappedCreate(self.ParamTemplate);
            Foundation.reInit($('#edit-form'));
        };

        self.deleteParam = function (p) {
            self.tableau().Params.mappedRemove(p);
            Foundation.reInit($('#edit-form'));
        };
    }

    $.apiCall(URL.GetModel).then((data) => {
        var viewModel = new ViewModel(data);
        ko.applyBindings(viewModel);
        $(document).trigger("app.initialized");
    });
});