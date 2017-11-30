"use strict";

$(function () {

    var URL = {
        GetModel: 'Account/GetResetPasswordModel',
        Save: 'Account/ResetPassword' 
    }

    function ViewModel(data) {
        var self = this;
        ko.mapping.fromJS(data, { }, self);

        self.URL = URL;
        self.save = function () {
            $.blockUI();
            $.apiCall(self.URL.Save, ko.mapping.toJS(self)).then((model) => {
                $.confirm("Hemos enviado un correo electronico a " + model.Email + ". Por favor, revise su bandeja de entrada para continuar.").always(function () {
                    self.goToHome();
                });
            })
            .always(() => $.unblockUI());
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
