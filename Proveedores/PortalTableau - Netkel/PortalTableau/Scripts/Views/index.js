"use strict";

$(function () {

    var URL = {
        GetModel: 'Home/GetModel',
        SaveUserTableaux: 'Home/SaveUserTableaux',
        GetTableauUrl: 'Home/GetTableauUrl',
        RequestTableauPermission: 'Home/RequestTableauPermission'
    }

    function ViewModel(data) {
        var self = this;

        self.TableauMapping = {
            create: (options) => {
                let vm = ko.mapping.fromJS(options.data);

                vm.ImageUrl = ko.pureComputed(() => {
                    return $("body").data("baseurl") + "Files/Download?id=" + vm.ImageId().toString();
                }, vm);

                vm.TableauUrl = ko.observable(null);

                return vm;
            }
        };

        self.UserTableauMapping = {
            create: (options) => {
                let vm = ko.mapping.fromJS(options.data, {
                    Tableau: {
                        create: (options) => ko.mapping.fromJS(options.data, self.TableauMapping)
                    }
                });

                vm.AutoPosition = ko.pureComputed(() => {
                    return vm.Id() < 1;
                }, vm);

                return vm;
            }
        };

        ko.mapping.fromJS(data, {
            copy: ['UserTableauTemplate', 'TableauMapping', 'UserTableauMapping'],

            News: {
                create: (options) => new NewsCarouselViewModel(options.data)
            },
            TableauSearcher: {
                create: (options) => {
                    let vm = new TableauSearchViewModel(options.data);
                    vm.searchByTitleUrl('Tableaux/SearchByTitle');
                    vm.onSelect = (tableau) => {
                        if (tableau != null) {
                            if (tableau.IsAuthorized === true) {
                                self.addUserTableau(ko.mapping.fromJS(tableau, self.TableauMapping));
                                self.showSearch(false);
                            }
                            vm.clear();
                        }
                    };

                    vm.onRequestPermission = (tableauId) => {
                        $.apiCall(self.URL.RequestTableauPermission, {Id: tableauId}).then((model) => {
                            $.confirm("Su solicitud fue enviada con éxito.", null, false, null);
                        });
                    };

                    return vm;
                }
            },
            Projects: {
                create: (options) => {
                    let vm = ko.mapping.fromJS(options.data, {
                        Tableaux: {
                            create: (options) => ko.mapping.fromJS(options.data, self.TableauMapping)
                        }
                    });

                    vm.IconPaths = ko.pureComputed(() => {
                        return vm.SvgIconPath() != null ? vm.SvgIconPath().split(';') : null;
                    }, vm);

                    return vm;
                }
            },
            UserTableaux: self.UserTableauMapping
        }, self);

        self.URL = URL;
        self.mode = ko.observable('news');
        self.mode.subscribe(function (newValue) {
            self.News.enabled(newValue === 'news');
        });
        self.showProjects = ko.observable(true);
        self.showSearch = ko.observable(false);
        self.selectedProject = ko.observable(null);
        self.selectedTableau = ko.observable(null);
        self.loadProject = (project) => {
            var currentProject = self.selectedProject();

            if (currentProject == null || currentProject.Id() != project.Id())
                self.selectedProject(project);
            else
                self.selectedProject(null);
        }

        var numberOfChanges = 0;
        self.userTableauxChanged = () => {
            numberOfChanges++;
            self.saveUserTableaux();
        }

        var saving = false;
        self.saveUserTableaux = () => {
            if (!saving) {
                saving = true;
                //console.log('saving ' + numberOfChanges + ' user tableaux changes.');
                numberOfChanges = 0;
                $.apiCall(self.URL.SaveUserTableaux, { UserTableaux: ko.mapping.toJS(self.UserTableaux) }).then((model) => {
                    let updatedTableaux = ko.mapping.fromJS(model.UserTableaux);

                    ko.utils.arrayForEach(self.UserTableaux(), function (userTableau) {
                        let updatedUserTableau = ko.utils.arrayFirst(updatedTableaux(), function (ut) {
                            return ut.TableauId() === userTableau.TableauId();
                        });
                        if (updatedUserTableau != null) {
                            userTableau.Id(updatedUserTableau.Id());
                        }
                    });
                }).always(() => {
                    //console.log('user tableaux saved.');
                    saving = false;
                    if (numberOfChanges > 0)
                        self.saveUserTableaux();
                });
            }
        }

        self.addUserTableau = (tableau) => {
            if (!(ko.utils.arrayFirst(self.UserTableaux(), (userTableau) => userTableau.TableauId() === tableau.Id()))) {
                let userTableau = ko.mapping.fromJS(self.UserTableauTemplate, self.UserTableauMapping);
                userTableau.TableauId(tableau.Id());
                userTableau.Tableau = tableau;
                self.UserTableaux.push(userTableau);
            }
            else {
                $.confirm("El tablero '" + tableau.Title() + "' ya existe entre sus tableros.", null, false, null);
            }
        }

        self.deleteUserTableau = (userTableau) => {
            $.confirm("¿Estás seguro de querer eliminar el tablero " + userTableau.Tableau.Title() + "?").then(() => {
                self.UserTableaux.remove(userTableau);
            }); 
        }

        self.showTableau = (tableau) => {
            $.blockUI();
            $.apiCall(self.URL.GetTableauUrl, ko.mapping.toJS(tableau)).then((url) => {
                tableau.TableauUrl(url);
                self.selectedTableau(tableau);
            })
            .always(() => $.unblockUI());
        }

        self.hideTableau = (tableau) => {
            self.selectedTableau(null);
            tableau.TableauUrl(null);
        }
    }

    $.apiCall(URL.GetModel).then((data) => {
        var viewModel = new ViewModel(data);
        ko.applyBindings(viewModel);
        $('[data-toggle="tooltip"]').tooltip();
        $(document).trigger("app.initialized");
    });
});
