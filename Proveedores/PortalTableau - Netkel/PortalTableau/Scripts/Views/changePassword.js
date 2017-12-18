"use strict";

$(function () {

    var URL = {
        GetModel: 'Account/GetChangePasswordModel',
        Save: 'Account/ChangePassword',
        Cancel: 'Account/CancelChangePassword'
    }

    function ViewModel(data) {
        var self = this;
        ko.mapping.fromJS(data, { }, self);

        self.URL = URL;
        self.save = function () {
            $.blockUI();
            $.apiCall(self.URL.Save, ko.mapping.toJS(self)).then((model) => {
                if (model === true) {
                    $.confirm("Su contraseña fue modificada. Debera ingresar al sistema nuevamente.", "", false).always(function () {
                        self.goToHome();
                    });
                }
            })
            .always(() => $.unblockUI());
        }

        self.cancel = () => {
            $.apiCall(self.URL.Cancel, ko.mapping.toJS(self)).always(self.goToHome);
        }

        self.goToHome = () => {
            $(location).attr('href', $("body").data("baseurl"));
        }
    }

    $.apiCall(URL.GetModel).then((data) => {
        var viewModel = new ViewModel(data);
        ko.applyBindings(viewModel);
        $(document).trigger("app.initialized");
    });
});
