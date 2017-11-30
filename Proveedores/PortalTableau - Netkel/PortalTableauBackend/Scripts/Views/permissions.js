"use strict";

$(function () {

    var URL = {
        GetModel: 'Permissions/GetModel',
        GetList: 'Permissions/GetList',
        New: 'Permissions/New',
        Edit: 'Permissions/Edit',
        SaveNew: 'Permissions/SaveNew',
        SaveUpdate: 'Permissions/SaveUpdate',
        Delete: 'Permissions/Delete'
    }

    function ViewModel(data) {
        var self = this;

        var permissionMapping = {
            create: (options) => {
                let vm = ko.mapping.fromJS(options.data, {
                    PermissionTableaux: {
                        create: (options) => {
                            let permissionTableauVm = ko.mapping.fromJS(options.data);

                            permissionTableauVm.TableauId.subscribe((newTableauId) => {
                                if (newTableauId) {
                                    let tableau = ko.utils.arrayFirst(vm.Tableaux(), (t) => {
                                        return t.Id() == newTableauId;
                                    });
                                    permissionTableauVm.TableauTitle(tableau.Title());
                                }
                                else {
                                    permissionTableauVm.TableauTitle(null);
                                }
                            });

                            return permissionTableauVm;
                        }
                    }
                });

                return vm;
            }
        };

        ko.mapping.fromJS(data, {
            copy: ["PermissionTableauTemplate"],
            Permissions: {
                create: (options) => options.data
            },
            Pager: {
                create: (options) => new PagerViewModel(options.data, () => self.applyFilters())
            }
        }, self);

        self.URL = URL;
        self.alerts = ko.observable(null);
        self.mode = ko.observable('list');
        self.permission = ko.observable(null);
        self.nameFocus = ko.observable(false);

        self.applyFilters = function () {
            $.blockUI();
            $.apiCall(URL.GetList, { Pager: ko.mapping.toJS(self.Pager) }).then((model) => {
                ko.mapping.fromJS({ Permissions: model.Permissions, Pager: model.Pager }, self);
            })
            .always(() => $.unblockUI());
        };

        self.cancel = function () {
            self.mode("list");
        }

        self.afterFormIn = () => setTimeout(() => new Foundation.Abide($('#edit-form')), 300);
        self.afterFormOut = () => self.permission(null);

        self.new = function () {
            $.blockUI();
            $.apiCall(URL.New).then(function (model) {
                self.permission(ko.mapping.fromJS(model.Permission, permissionMapping));
                self.mode("new");
                self.nameFocus(true);
            })
            .always(() => $.unblockUI());
        }

        self.save = function () {
            $.blockUI();
            var url = self.mode() === "new" ? URL.SaveNew : URL.SaveUpdate;
            $.apiCall(url, { Permission: ko.mapping.toJS(self.permission(), { 'ignore': ['Tableaux'] }), Pager: ko.mapping.toJS(self.Pager) }).then((model) => {
                ko.mapping.fromJS({ Permissions: model.Permissions, Pager: model.Pager }, self);
                self.mode("list");
            })
            .always(() => $.unblockUI());
        }

        self.edit = function (permission) {
            $.blockUI();
            $.apiCall(URL.Edit, { Permission: { Id: permission.Id } }).then((model) => {
                self.permission(ko.mapping.fromJS(model.Permission, permissionMapping));
                self.mode("edit");
                self.nameFocus(true);
            })
            .always(() => $.unblockUI());
        }

        self.delete = function (permission) {
            $.confirm("Se dispone a eliminar el permiso " + permission.Name + ". ¿Está ud. seguro?").then(function () {
                $.blockUI();
                $.apiCall(URL.Delete, { Permission: { Id: permission.Id }, Pager: ko.mapping.toJS(self.Pager) }).then((model) => {
                    ko.mapping.fromJS({ Permissions: model.Permissions, Pager: model.Pager }, self);
                })
                .always(() => $.unblockUI());
            });
        }

        self.addTableau = function () {
            let param = self.permission().PermissionTableaux.mappedCreate(self.PermissionTableauTemplate);
            Foundation.reInit($('#edit-form'));
        };

        self.deleteTableau = function (p) {
            self.permission().PermissionTableaux.mappedRemove(p);
            Foundation.reInit($('#edit-form'));
        };
    }

    $.apiCall(URL.GetModel).then((data) => {
        var viewModel = new ViewModel(data);
        ko.applyBindings(viewModel);
        $(document).trigger("app.initialized");
    });
});