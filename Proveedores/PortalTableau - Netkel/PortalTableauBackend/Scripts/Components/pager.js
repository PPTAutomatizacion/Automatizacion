function PagerViewModel(model, applyCallback) {
    var self = this;

    ko.mapping.fromJS(model, {}, self);

    self.pageNumberInput = ko.observable(self.PageNumber());

    self.pageNumberInput.extend({ rateLimit: { timeout: 200, method: "notifyWhenChangesStop" } }).subscribe(function (value) {
        var pn = parseInt(value, 10);
        if (isNaN(pn) || pn > self.TotalPages() || pn < 1) {
            return;
        }

        self.PageNumber(pn);
    });

    self.goFirst = () => {
        if (self.PageNumber() > 1)
            self.pageNumberInput(1);
    }
    self.goPrev = () => {
        if (self.PageNumber() > 1)
            self.pageNumberInput(self.PageNumber() - 1);
    }
    self.goNext = () => {
        if (self.PageNumber() < self.TotalPages())
            self.pageNumberInput(self.PageNumber() + 1);
    }
    self.goLast = () => {
        if (self.PageNumber() < self.TotalPages())
            self.pageNumberInput(self.TotalPages());
    }

    self.PageNumber.subscribe(applyCallback);
}

(function () {

    ko.components.register('pager', {
        viewModel: {
            createViewModel: (params, componentInfo) => params.ViewModel
        },
        template: { element: 'pager-component' },
        synchronous: true
    });

})();