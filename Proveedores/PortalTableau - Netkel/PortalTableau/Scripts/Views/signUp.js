"use strict";

$(function () {

    var URL = {
        GetModel: 'Account/GetSignUpModel',
        Save: 'Account/SignUp'
    }

    function ViewModel(data) {
        var self = this;
        ko.mapping.fromJS(data, {}, self);

        self.URL = URL;
        self.save = function () {
            $.blockUI();
            $.apiCall(self.URL.Save, ko.mapping.toJS(self)).then((model) => {
                $.confirm("Hemos enviado un correo electronico de confirmacion a " + model.Email + ". Por favor, revise su bandeja de entrada para continuar.", null, false, null).always(function () {
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
