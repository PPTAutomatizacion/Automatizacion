"use strict";

$(function () {

    var URL = {
        GetModel: 'Home/GetPublicModel',
        ResetPassword: "Account/ResetPassword"
    }

    function ViewModel(data) {
        var self = this;

        ko.mapping.fromJS(data, {
            News: {
                create: (options) => new NewsCarouselViewModel(options.data)
            },
            Projects: {
                create: (options) => {
                    let vm = ko.mapping.fromJS(options.data);

                    vm.IconPaths = ko.pureComputed(() => {
                        return vm.SvgIconPath() != null ? vm.SvgIconPath().split(';') : null;
                    }, vm);

                    return vm;
                }
            }
        }, self);

        self.URL = URL;

        self.resetPassword = () => {
            $(location).attr('href', $("body").data("baseurl") + self.URL.ResetPassword);
        }
    }

    $.apiCall(URL.GetModel).then((data) => {
        var viewModel = new ViewModel(data);
        ko.applyBindings(viewModel);
        $('[data-toggle="tooltip"]').tooltip();
        $(document).trigger("app.initialized");
    });
});
