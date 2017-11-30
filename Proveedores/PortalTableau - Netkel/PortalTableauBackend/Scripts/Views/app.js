$.blockUI.defaults.message = null;
moment.locale("es");

Foundation.Abide.defaults.validators["moment"] = function (el, required, parent) {

    var value = $(el).val();

    var dateFormat = ($(el).data("dateformat") || "DD/MM/YYYY").split(",");
    if (typeof dateFormat === "undefined")
        dateFormat = ["DDMMMYYYY"];

    if (!required && (value === "" || dateFormat.indexOf(value) !== -1)) //value == dateformat => control con masked input
        return true;

    return moment.utc(value, dateFormat, true).isValid();
};

Foundation.Abide.defaults.validators["greatherEqualThan"] = function ($el, required, parent) {
    if (!required) return true;

    var from = parseInt($el.attr('data-min'), 10);
    var value = parseInt($el.val());
    return value >= from;
};

Foundation.Abide.defaults.validators["between"] = function ($el, required, parent) {
    if (!required) return true;

    var from, to, value;

    if ($el.attr("data-float") !== "true") {
        from = parseInt($el.attr('data-min'), 10);
        to = parseInt($el.attr('data-max'), 10);
        value = parseInt($el.val());
    }
    else {
        from = parseFloat($el.attr('data-min'), 10);
        to = parseFloat($el.attr('data-max'), 10);
        value = parseFloat($el.val());
    }

    var valid = true;
    if (!isNaN(from))
        valid = valid && value >= from;

    if (!isNaN(to))
        valid = valid && valid <= to;

    return valid;
};

Foundation.Abide.defaults.validators["knockout"] = function ($el) {
    var validationFunction = $el.data("_ko_validator");
    if (typeof validationFunction !== 'function') {
        console.warn('validationFunction is not a function');
        return true;
    }
    else {
        return validationFunction();
    }
};

Number.prototype.toMoney = function (addCurrency) {
    if (isNaN(this))
        return "";

    if (typeof addCurrency === "undefined")
        addCurrency = true;

    return this.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + (addCurrency ? " $" : "");
};

$(document).one("app.initialized", function () {
    $("#page-loading").hide();
    $("#page-body").show();
    $(document).foundation();
});

$(function () {

    var uniqueIdCount = 1;

    $.apiCall = function (url, request) {

        if (typeof request === "undefined") {
            request = {};
        }
        else if (request === null) {
            request = {};
        }

        if (typeof request !== "object")
            throw "Request data must be provided as a javascript object.";

        return $.ajax({
            url: $("body").data("baseurl") + url,
            type: "POST",
            data: JSON.stringify(request),
            contentType: "application/json",
            processData: false,
            dataType: "json"
        });
    };


    $.confirm = function (text, title, showCancel, okText) {
        if (!title)
            title = document.title;

        if (typeof showCancel === "undefined" || showCancel === true) {
            $("#confirmBoxModal-cancel").show();
        }
        else {
            $("#confirmBoxModal-cancel").hide();
        }

        if (typeof okText === "undefined" || okText == null || okText.trim() === '') {
            $("#confirmBoxModal-ok").text("Ok");
        }
        else {
            $("#confirmBoxModal-ok").text(okText);
        }

        $("#confirmBoxModal-title").text(title);
        $("#confirmBoxModal-text").html(text.replace(/\n/, "<br/>"));

        var confirm = $.Deferred();

        function ok() {
            confirm.resolve();
            $("#confirmBoxModal").foundation('close');
            return false;
        }

        function cancel() {
            $("#confirmBoxModal").foundation('close');
            return false;
        }

        function onclose() {
            $(document).off("click", "#confirmBoxModal-ok", ok);
            $(document).off("click", "#confirmBoxModal-cancel, #confirmBoxModal-close", cancel);
            $(document).off("closed.zf.reveal", "#confirmBoxModal", onclose);
            if (confirm.state() === "pending")
                confirm.reject();
        }

        $(document).on("click", "#confirmBoxModal-ok", ok);
        $(document).on("click", "#confirmBoxModal-cancel, #confirmBoxModal-close", cancel);
        $(document).on("closed.zf.reveal", "#confirmBoxModal", onclose);

        $("#confirmBoxModal").one("open.zf.reveal", function () {
            setTimeout(() => { $("#confirmBoxModal-ok").focus(); }, 350);
            //$("#confirmBoxModal-ok").focus();
        });

        $('#confirmBoxModal').foundation('open');
        return confirm.promise();
    };

    ko.bindingHandlers.notEmptyText = {

        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var text = ko.utils.unwrapObservable(valueAccessor());
            if (text === null || typeof text === "undefined" || text.length === 0)
                text = '-';

            $(element).text(text);
        }
    };

    ko.bindingHandlers.slideVisible = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var value = valueAccessor();
            var valueUnwrapped = ko.unwrap(value);
            if (valueUnwrapped) {
                $(element).show();
            } else {
                $(element).hide();
            }

            $(element).data("slideVisibleState", valueUnwrapped);
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var duration = allBindings.get("duration") || "fast";
            var value = valueAccessor();
            var valueUnwrapped = ko.unwrap(value);

            if (valueUnwrapped === $(element).data("slideVisibleState"))
                return;

            $(element).data("slideVisibleState", valueUnwrapped);

            if (valueUnwrapped) {
                var afterIn = allBindings.has("afterIn") ? allBindings.get("afterIn") : () => null;
                $(element).slideDown(duration, afterIn);
            } else {
                var afterOut = allBindings.has("afterOut") ? allBindings.get("afterOut") : () => null;
                $(element).slideUp(duration, afterOut);
            }
        }
    };

    ko.bindingHandlers.submit = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            let $form = $(element);

            let initialize = function () {
                if (!(typeof $form.data("ko-submit-initialized") === "undefined"))
                    return;

                $form.data("ko-submit-initialized", true);
                if (typeof $form.attr("kosubmit") === "undefined") {
                    $form.attr("kosubmit", "form-" + uniqueIdCount);
                    uniqueIdCount++;
                }

                let isValid = null;
                let onformvalid = () => isValid = true;
                let onforminvalid = () => isValid = false;
                let onformsubmit = (ev) => {
                    if (isValid === null)
                        throw "isValid es nulo.";

                    if (isValid) {
                        ko.unwrap(valueAccessor())();
                    }

                    ev.preventDefault();
                    isValid = null;
                };

                let selector = "[kosubmit='" + $form.attr("kosubmit") + "']";

                $(document).on("formvalid.zf.abide", selector, onformvalid)
                    .on("forminvalid.zf.abide", selector, onforminvalid)
                    .on("submit", selector, onformsubmit);

                ko.utils.domNodeDisposal.addDisposeCallback($form[0], () => {
                    $(document).off("formvalid.zf.abide", selector, onformvalid)
                        .off("forminvalid.zf.abide", selector, onforminvalid)
                        .off("submit", selector, onformsubmit);
                });
            };

            $(document).on("app.initialized init.zf.abide", initialize);
        }
    };

    ko.bindingHandlers.isValid = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var value = ko.unwrap(valueAccessor());
            if (value === null) {
                var $form = $(element).is("form") ? $(element) : $(element).closest("form");

                var isValid = null;
                $form
                    .one("forminvalid.zf.abide", function () {
                        isValid = false;
                    })
                    .one("formvalid.zf.abide", function () {
                        isValid = true;
                    })
                    .foundation('validateForm');

                if (isValid === null)
                    throw "isValid es nulo.";

                valueAccessor()(isValid);
            }
        }
    };

    ko.bindingHandlers.switch = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

            var id = allBindings.has("Id") ? allBindings.get("Id") : "switch" + (++uniqueIdCount).toString();

            $(element).html("<input class='switch-input' id='" + id + "' type='checkbox'" + (ko.unwrap(valueAccessor()) ? "checked" : "") + "><label class='switch-paddle' for='" + id + "'><span class='show-for-sr'>Activar</span><span class='switch-active' aria-hidden='true'>Si</span><span class='switch-inactive' aria-hidden='true'>No</span></label>");

            $(element).find("input").on("change", function (e) {
                var value = valueAccessor();
                value(e.target.checked);
            });
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var value = valueAccessor();
            $(element).find("input").prop("checked", ko.unwrap(value)).trigger("change");
            $(element).trigger("switchChanged");
        }
    };

    ko.bindingHandlers.switchEnable = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var enabled = ko.unwrap(valueAccessor());
            var $input = $(element).find("input");
            $input.prop("disabled", !enabled);
            $(element).find("span.switch-active").text(enabled ? "Si" : "X");
            $(element).find("span.switch-inactive").text(enabled ? "No" : "X");
        }
    };

    ko.bindingHandlers.alerts = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var rawValue = ko.unwrap(valueAccessor());
            if (rawValue === null) {
                return;
            }

            if (rawValue === "clear") {
                $("button", element).trigger("close.zf.trigger");
                return;
            }

            var value = [];
            var colonIndex = rawValue.indexOf("||");
            if (colonIndex !== -1) {
                value.push(rawValue.substr(0, colonIndex));
                value.push(rawValue.substr(colonIndex + 2));
            }
            else {
                value.push("alert");
                value.push(rawValue);
            }

            var exists = false;
            $(element).find("div>div.alert").each(function (i, e) {
                if ($(e).text() === value[1]) {
                    exists = true;
                    return false;
                }
            });

            if (!exists) {
                var $alert = $("<div data-closable></div>")
                    .addClass("callout " + value[0])
                    .append($("<span></span>").text(value[1]))
                    .append("<button class='close-button' aria-label='Cerrar' type='button' data-close><span aria-hidden='true'>&times;</span></button>")
                    .appendTo(element);

                $(element).foundation();

                var timeoutMillis;
                if (allBindings.has("timeout")) {
                    timeoutMillis = parseInt(allBindings.get("timeout"), 10);
                }
                else {
                    timeoutMillis = 5 * 1000;
                }

                if (timeoutMillis !== -1) {
                    var timeout = setTimeout(function () {
                        $alert.find("button").trigger("close.zf.trigger");
                    }, timeoutMillis);

                    $alert.one("close.zf.trigger", function () {
                        window.clearTimeout(timeout);
                    });
                }
            }

            valueAccessor()(null);
        }
    };

    ko.bindingHandlers.errorBox = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

            $(document).ajaxSend(() => {
                if (!ko.unwrap(valueAccessor()))
                    return;

                $("button", element).trigger("close.zf.trigger");
            });

            $(document).ajaxError((e, xhr) => {
                if (!ko.unwrap(valueAccessor()))
                    return;

                var message;
                if (xhr.status === 400)
                    message = xhr.statusText;
                else
                    message = "(" + xhr.status + ") - " + xhr.statusText;

                var $alert = $("<div data-closable></div>")
                    .addClass("callout alert")
                    .append($("<small>La operación no pudo ser completada.</small><br/>"))
                    .append($("<span></span>").text(message))
                    .append("<button class='close-button' aria-label='Cerrar' type='button' data-close><span aria-hidden='true'>&times;</span></button>")
                    .appendTo(element);

                $(element).foundation();

                var timeout = setTimeout(function () {
                    $alert.find("button").trigger("close.zf.trigger");
                }, 5 * 1000);

                $alert.one("close.zf.trigger", function () {
                    window.clearTimeout(timeout);
                });

            });
        }
    };

    ko.bindingHandlers.autocomplete = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

            var defaults = {
                type: "POST",
                dataType: "json",
                deferRequestBy: 150,
                minChars: 3,
                autoSelectFirst: true,
                transformResult: function (response) {
                    return {
                        suggestions: $.map(response[options.values], (item) => ({ data: item, value: item[options.displayField].toString() }))
                    };
                }
            };

            var options = $.extend({}, defaults, ko.unwrap(valueAccessor()));

            if (options.serviceUrl) {
                options.serviceUrl = $("body").data("baseurl") + "api/" + options.serviceUrl;
            }

            $(element).autocomplete(options);
        }
    };

    ko.bindingHandlers.autocompleteEnabled = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var value = ko.unwrap(valueAccessor());
            $(element).autocomplete(value ? "enable" : "disable");
        }
    };

    ko.bindingHandlers.autocompleteParams = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var value = ko.unwrap(valueAccessor());
            $(element).autocomplete().setOptions({ params: value });
        }
    };

    ko.bindingHandlers.datePicker = { //requires moment and pickaday
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var dateFormat = allBindings.has("dateFormat") ? allBindings.get("dateFormat") : "DD/MM/YYYY";
            var field = allBindings.has("calendarField") ? $("#" + allBindings.get("calendarField"))[0] : element;
            var min = allBindings.has("minDate") ? ko.unwrap(allBindings.get("minDate")) : null;
            if (min) min = min.toDate();
            var max = allBindings.has("maxDate") ? ko.unwrap(allBindings.get("maxDate")) : null;
            if (max) max = max.toDate();
            var useUtc = allBindings.has("utc") ? ko.unwrap(allBindings.get("utc")) : true;

            var intercept = ko.observable(null);
            intercept.subscribe((value) => {
                if (!moment(value, dateFormat, true).isValid())
                    valueAccessor()(null);
            });

            var picker = new Pikaday({
                field: field,
                trigger: element,
                format: dateFormat,
                minDate: min,
                maxDate: max,
                onSelect: function () {
                    var m;
                    if (useUtc)
                        m = moment.utc(this.getMoment().format("YYYY-MM-DD"));
                    else
                        m = moment(this.getMoment().format("YYYY-MM-DD"));

                    if (this.minDate && m.isBefore(this.minDate)) {
                        m.add(1, "y");
                    }
                    var value = valueAccessor();
                    value(m.toISOString());
                },
                i18n: {
                    previousMonth: 'Mes anterior',
                    nextMonth: 'Mes siguiente',
                    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                    weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sa']
                }
            });

            var value;
            if (useUtc)
                value = moment.utc(ko.unwrap(valueAccessor()));
            else
                value = moment(ko.unwrap(valueAccessor()));

            if (value.isValid()) {
                picker.setMoment(moment(value.format("YYYY-MM-DD")));
            }

            $(field).data("picker", picker);

            ko.applyBindingsToNode(element, { textInput: intercept });
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var field = allBindings.has("calendarField") ? $("#" + allBindings.get("calendarField"))[0] : element;
            var raw = ko.unwrap(valueAccessor());
            var useUtc = allBindings.has("utc") ? ko.unwrap(allBindings.get("utc")) : true;
            var value = useUtc ? moment.utc(raw) : moment(raw);
            var picker = $(field).data("picker");

            if (value.isValid()) {
                picker.setMoment(moment(value.format("YYYY-MM-DD")), true);
            }
            else {
                $(field).val(raw);
            }
        }
    };

    ko.bindingHandlers.dateValue = { //requires moment and maskedinput
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

            var dateFormat = allBindings.has("dateFormat") ? allBindings.get("dateFormat") : "DD/MMM/YYYY";
            $(element).data("dateFormat", dateFormat);

            var value = moment.utc(ko.unwrap(valueAccessor()));
            if (value.isValid()) {
                $(element).val(value.format(dateFormat).toUpperCase());
            }

            $(element).blur(function () {
                var raw = $(this).val().toUpperCase();
                $(this).val(raw);

                var value = moment.utc(raw, dateFormat, true);
                if (value.isValid()) {
                    valueAccessor()(value.toISOString());
                }
                else {
                    valueAccessor()(raw);
                }
            });

            $(element).attr({
                "data-abide-validator": "moment"
            });
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var raw = ko.unwrap(valueAccessor());
            var value = moment.utc(raw);
            var format = $(element).data("dateFormat");

            if (typeof format === "undefined")
                format = "DD/MMM/YYYY";

            if (value.isValid()) {
                $(element).val(value.format(format).toUpperCase());
            }
        }
    };

    ko.bindingHandlers.validator = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            $(element).attr({ "data-validator": "knockout" });
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            $(element).data("_ko_validator", ko.unwrap(valueAccessor()));
        }
    };

    ko.bindingHandlers.plusMinus = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var $e = $(element);
            $("<i class='fa'></i>").appendTo($e);
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var $e = $(element);
            var value = ko.unwrap(valueAccessor());

            $e.find("i").toggleClass("fa-plus-square", !value).toggleClass("fa-minus-square", value);
        }
    };

    ko.bindingHandlers.selectedTab = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            $(element).foundation();
            let value = ko.unwrap(valueAccessor());
            let tab = $(element).find("li:nth-child(" + (value + 1) + ")").addClass("is-active").find("a").attr("href");
            $(tab).addClass("is-active");

            $(element).on("change.zf.tabs", function () {
                let value = valueAccessor();
                value($(element).find("li.is-active").index());
            });
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            let value = ko.unwrap(valueAccessor());
            $(element).foundation("selectTab", $(element).find("li:nth-child(" + (value + 1) + ")>a").attr("href").substring(1));
        }
    };

    ko.bindingHandlers.amount = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            let $e = $(element);
            let value = parseFloat(ko.unwrap(valueAccessor()));

            $e.removeClass("amount-nan amount-negative amount-positive amount-zero");

            if (isNaN(value))
                $e.addClass("amount-nan").text(value);

            else if (value < 0)
                $e.addClass("amount-negative").text("(" + Math.abs(value).toMoney(false) + ")");

            else if (value > 0)
                $e.addClass("amount-positive").text(value.toMoney(false));

            else
                $e.addClass("amount-zero").text("-");
        }
    };

    ko.bindingHandlers.singleFileUpload = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

            let defaults = {
                dataType: 'json',
                url: $("body").data("baseurl") + "Files/Upload",
                progressall: function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $('#' + viewModel.progressControlId + ' .bar').css(
                        'width',
                        progress + '%'
                    );
                },
                add: function (e, data) {
                    viewModel.uploading(true);
                    viewModel.jqXHR = data.submit();
                },
                done: function (e, data) {
                    if (data.result) {
                        viewModel.Id(data.result.Id);
                        viewModel.Filename(data.result.Filename);
                    }
                    else {
                        viewModel.Id(null);
                        viewModel.Filename(null);
                    }
                    viewModel.onSelect();
                    viewModel.jqXHR = null;

                    viewModel.uploading(false);

                    $('#' + viewModel.fileInputId).closest('form').foundation('validateInput', $('#' + viewModel.fileInputId));
                }
            };

            let options = $.extend({}, defaults, ko.unwrap(valueAccessor()));

            $(element).fileupload(options);
        }
    };
});