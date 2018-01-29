"use strict";

$(function () {

    var URL = {
        GetModel: 'Users/GetModel',
        GetList: 'Users/GetList',
        New: 'Users/New',
        Edit: 'Users/Edit',
        SaveNew: 'Users/SaveNew',
        SaveUpdate: 'Users/SaveUpdate',
        Delete: 'Users/Delete',
        ResetPassword: 'Users/ResetPassword'
    }

    function ViewModel(data) {
        var self = this;

        let userMapping = {
            create: (options) => {
                let vm = ko.mapping.fromJS(options.data, {
                    UserPermissions: {
                        create: (options) => {
                            let userPermissionVm = ko.mapping.fromJS(options.data);

                            userPermissionVm.PermissionId.subscribe((newPermissionId) => {
                                if (newPermissionId) {
                                    let permission = ko.utils.arrayFirst(vm.Permissions(), (p) => {
                                        return p.Id() == newPermissionId;
                                    });
                                    userPermissionVm.PermissionName(permission.Name());
                                }
                                else {
                                    userPermissionVm.PermissionName(null);
                                }
                            });

                            return userPermissionVm;
                        }
                    }
                });

                return vm;
            }
        };

        ko.mapping.fromJS(data, {
            copy: ["UserPermissionTemplate"],
            Users: userMapping,
            Pager: {
                create: (options) => new PagerViewModel(options.data, () => self.applyFilters())
            }
        }, self);

        self.URL = URL;
        self.alerts = ko.observable(null);
        self.mode = ko.observable('list');
        self.nameFocus = ko.observable(false);
        self.user = ko.observable(null);
        self.userSearch = ko.observable('');

        self.applyFilters = function () {
            $.blockUI();
            $.apiCall(URL.GetList, { Pager: ko.mapping.toJS(self.Pager), UserSearch: self.userSearch() }).then((model) => {
                ko.mapping.fromJS({ Users: model.Users, Pager: model.Pager }, self);
            })
            .always(() => $.unblockUI());
        };

        self.cancel = function () {
            self.mode("list");
        }

        self.afterFormIn = () => setTimeout(() => new Foundation.Abide($('#edit-form')), 300);
        self.afterFormOut = () => self.user(null);

        self.new = function () {
            $.blockUI();
            $.apiCall(URL.New).then(function (model) {
                self.user(ko.mapping.fromJS(model.User, userMapping));
                self.mode("new");
                self.nameFocus(true);
            })
            .always(() => $.unblockUI());
        }

        self.save = function () {
            $.blockUI();
            var url = self.mode() === "new" ? URL.SaveNew : URL.SaveUpdate;
            $.apiCall(url, { User: ko.mapping.toJS(self.user, { 'ignore': ['Permissions'] }), Pager: ko.mapping.toJS(self.Pager) }).then((model) => {
                ko.mapping.fromJS({ Users: model.Users, Pager: model.Pager }, self);
                self.mode("list");
            })
            .always(() => $.unblockUI());
        }

        $(document).one("app.initialized", function () {
            self.enableUser = function (user) {
                $.blockUI();

                $.apiCall(URL.SaveUpdate, {
                    User: ko.mapping.toJS(user, { 'ignore': ['Permissions'] }),
                    Pager: ko.mapping.toJS(self.Pager)
                })
                    .then((model) => {
                        $.confirm('El estado ha sido actualizado', 'Operación Exitosa', false);
                    })
                    .always(() => $.unblockUI());
            }
        });

        self.edit = function (user) {
            $.blockUI();
            $.apiCall(URL.Edit, { User: { Id: user.Id() } }).then((model) => {
                self.user(ko.mapping.fromJS(model.User, userMapping));
                self.mode("edit");
                self.nameFocus(true);
            })
            .always(() => $.unblockUI());
        }
        
        self.resetPass = function (user) {
            $.confirm("Se dispone a restablecer la contraseña del usuario " + user.Name() + ". ¿Está ud. seguro?").then(function () {
                $.blockUI();
                $.apiCall(URL.ResetPassword, { User: { Id: user.Id() }, Pager: ko.mapping.toJS(self.Pager) }).then((model) => {

                })
                .always(() => $.unblockUI());
            });
        }

        self.delete = function (user) {
            $.confirm("Se dispone a eliminar el usuario " + user.Name() + ". ¿Está ud. seguro?").then(function () {
                $.blockUI();
                $.apiCall(URL.Delete, { User: { Id: user.Id() }, Pager: ko.mapping.toJS(self.Pager) }).then((model) => {
                    ko.mapping.fromJS({ Users: model.Users, Pager: model.Pager }, self);
                })
                .always(() => $.unblockUI());
            });
        }

        self.addPermission = function () {
            let param = self.user().UserPermissions.mappedCreate($.extend({}, self.UserPermissionTemplate));
            Foundation.reInit($('#edit-form'));
        };

        self.deletePermission = function (p) {
            self.user().UserPermissions.mappedRemove(p);
            Foundation.reInit($('#edit-form'));
        };
    }

    $.apiCall(URL.GetModel).then((data) => {
        var viewModel = new ViewModel(data);
        ko.applyBindings(viewModel);
        $(document).trigger("app.initialized");
    });
});