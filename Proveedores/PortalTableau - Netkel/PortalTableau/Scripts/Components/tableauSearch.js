let tableauSearchUid = 0;

function TableauSearchViewModel(model) {
    var self = this;

    self.validate = () => true;

    ko.mapping.fromJS(model, {
        ignore: ["Options"],
        Selected: {
            create: (options) => ko.observable(options.data)
        }
    }, self);

    //set id's
    self.tableauTitleInputIdMd = 'tableauSearch_titleInputId_Md_' + tableauSearchUid.toString();
    self.tableauTitleInputIdSm = 'tableauSearch_titleInputId_Sm_' + tableauSearchUid.toString();
    self.tableauTitleInputIdXs = 'tableauSearch_titleInputId_Xs_' + tableauSearchUid.toString();
    tableauSearchUid += 1;

    self.searchByTitleUrl = ko.observable(null);
    self.iconToolTipImageUrl = ko.observable($("body").data("baseurl") + "Content/Images/iconToolTip.jpg");
    self.enable = ko.observable(true);
    self.onSelect = () => { };
    self.onRequestPermission = (tableauId) => { };
    self.suggestion = ko.observable('');

    self.tableauTitleBlur = function () {
        if (self.Selected() === null || self.Selected().Title !== self.Title())
            clear();
    };

    self.invalidateSelection = function () {
        self.Selected(null);
    };

    self.setBackgroundSuggestion = (suggestion) => {
        self.suggestion(suggestion);
    }

    self.tableauSelected = function (seleccion) {
        select(seleccion.data);
        let form = $('#' + self.tableauTitleInputIdMd).closest('form');
        if (form.length > 0) {
            form.foundation('validateInput', $('#' + self.tableauTitleInputIdMd));
            form.foundation('validateInput', $('#' + self.tableauTitleInputIdSm));
            form.foundation('validateInput', $('#' + self.tableauTitleInputIdXs));
        }
            
    };

    self.searchStart = function (search) {
        if (self.Selected() !== null && self.Selected().Title === search.query)
            return false;
        else
            return true;
    };

    //public method
    self.clear = function () {
        self.Selected(null);
        self.Title(null);
    }

    function clear() {
        self.Selected(null);
        self.Title(null);
        self.onSelect(null);
    }

    function select(selected) {
        self.Selected(selected);
        self.Title(selected.Title);
        self.onSelect(selected);
    }

    self.formatSuggestion = function (suggestion, currentValue) {
        let searchResultId = "searchResult_" + suggestion.data.Id;
        let searchItem = $("<div class='searchResult' id='" + searchResultId + "' />");
        if (suggestion.data.IsAuthorized === true)
        {
            searchItem.append('<i class="fa fa-plus-circle" aria-hidden="true"></i>');
        }   
        else
        {
            let onClick = "let idSelector = '#" + self.tableauTitleInputIdMd + "';  ko.dataFor($(idSelector).closest('tableau-search').get(0))[/ViewModel\s*:\s*(.[^\,]*)(\,?.*?)/.exec($(idSelector).closest('tableau-search').attr('params'))[1].trim()].onRequestPermission(" + suggestion.data.Id + ");";
            searchItem.append('<a href="#" title="Solicitar permiso de acceso" onclick="' + onClick + '"><i class="fa fa-unlock-alt" aria-hidden="true"></i></a>');
        }

        searchItem.append('<a href="#" class="searchClick" onclick="$(\'#searchResult_detail_' + suggestion.data.Id + '\').slideToggle(200); event.preventDefault(); event.stopPropagation();"><i class="fa fa-question-circle-o" aria-hidden="true"></i></a>');
        var value = searchItem.append($.Autocomplete.formatResult({ value: suggestion.data.Title }, currentValue))[0].outerHTML;
        value += $("<div class='detail' style='display: none' id='searchResult_detail_" + suggestion.data.Id + "' />").html($.Autocomplete.formatResult({ value: suggestion.data.Description }, currentValue))[0].outerHTML;
        return value;
    };

    self.tableauFocus = ko.observable(false);
}

(function () {

    ko.components.register('tableau-search', {
        viewModel: {
            createViewModel: (params, componentInfo) => params.ViewModel
        },
        template: { element: 'tableau-search' },
        synchronous: true
    });

})();