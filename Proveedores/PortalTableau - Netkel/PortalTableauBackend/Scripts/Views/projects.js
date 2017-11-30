"use strict";

$(function () {

    var URL = {
        GetModel: 'Projects/GetModel',
        GetList: 'Projects/GetList',
        New: 'Projects/New',
        Edit: 'Projects/Edit',
        SaveNew: 'Projects/SaveNew',
        SaveUpdate: 'Projects/SaveUpdate',
        Delete: 'Projects/Delete',
        GetIconPath: 'Projects/GetIconPath'
    }

    function ViewModel(data) {
        var self = this;

        ko.mapping.fromJS(data, {
            Projects: {
                create: (options) => options.data
            },
            Pager: {
                create: (options) => new PagerViewModel(options.data, () => self.applyFilters())
            },
            Project: {
                create: (options) => {
                    let vm = ko.mapping.fromJS(options.data, {
                        Icon: {
                            create: (opt) => {
                                var vm = new SingleFileUploadViewModel(opt.data);
                                vm.validationMessage('Seleccione un archivo del tipo .svg');
                                vm.validate = () => {
                                    return (!vm.uploading() && vm.Id() > 0 && (vm.Filename() || '').toLowerCase().endsWith('.svg')) || self.Project().SvgIconPath() !== null;
                                };

                                vm.onSelect = () => {
                                    $.blockUI();
                                    $.apiCall(URL.GetIconPath, ko.mapping.toJS(self.Project, { 'ignore': ['Sites'] })).then((path) => {
                                        self.Project().SvgIconPath(path);
                                    })
                                    .always(() => $.unblockUI());
                                };

                                return vm;
                            }
                        }
                    });;

                    vm.IconPaths = ko.pureComputed(() => {
                        return vm.SvgIconPath() != null ? vm.SvgIconPath().split(';') : null;
                    }, vm);

                    return vm;
                }
            }
        }, self);

        self.URL = URL;
        self.alerts = ko.observable(null);
        self.mode = ko.observable('list');
        self.nameFocus = ko.observable(false);

        self.applyFilters = function () {
            $.blockUI();
            $.apiCall(URL.GetList, { Pager: ko.mapping.toJS(self.Pager) }).then((model) => {
                ko.mapping.fromJS({ Projects: model.Projects, Pager: model.Pager }, self);
            })
            .always(() => $.unblockUI());
        };

        self.cancel = function () {
            self.mode("list");
        }

        self.afterFormIn = () => setTimeout(()=> new Foundation.Abide($('#edit-form')), 300);
        self.afterFormOut = () => self.Project(null);

        self.newProject = function () {
            $.blockUI();
            $.apiCall(URL.New).then(function (model) {
                ko.mapping.fromJS({ Project: model.Project }, self);
                self.mode("new");
                self.nameFocus(true);
            })
            .always(() => $.unblockUI());
        }

        self.save = function () {
            $.blockUI();
            var url = self.mode() === "new" ? URL.SaveNew : URL.SaveUpdate;
            $.apiCall(url, { Project: ko.mapping.toJS(self.Project, { 'ignore': ['Sites']}), Pager: ko.mapping.toJS(self.Pager) }).then((model) => {
                ko.mapping.fromJS({ Projects: model.Projects, Pager: model.Pager }, self);
                self.mode("list");
            })
            .always(() => $.unblockUI());
        }

        self.edit = function (project) {
            $.blockUI();
            $.apiCall(URL.Edit, { Project: { Id: project.Id } }).then((model) => {
                ko.mapping.fromJS({ Project: model.Project }, self);
                self.mode("edit");
                self.nameFocus(true);
            })
            .always(() => $.unblockUI());
        }

        self.delete = function (project) {
            $.confirm("Se dispone a eliminar el proyecto " + project.Name + ". ¿Está ud. seguro?").then(function () {
                $.blockUI();
                $.apiCall(URL.Delete, { Project: { Id: project.Id }, Pager: ko.mapping.toJS(self.Pager) }).then((model) => {
                    ko.mapping.fromJS({ Projects: model.Projects, Pager: model.Pager }, self);
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