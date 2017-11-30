let singleFileUploadUid = 0;

function SingleFileUploadViewModel(fileModel) {
    var self = this;

    //URLs
    self.URL = {
        Upload: "Files/Upload"
    };

    self.validate = () => true;

    if (!fileModel) {
        fileModel = {
            Id: 0,
            Filename: null
        };
    }

    ko.mapping.fromJS(fileModel, {}, self);

    self.onSelect = () => { };

    //set id's
    self.fileInputId = 'singleFileUpload_fileInputId_' + singleFileUploadUid.toString();
    self.progressControlId = 'singleFileUpload_progressControlId_' + singleFileUploadUid.toString();
    singleFileUploadUid += 1;

    self.enable = ko.observable(true);
    self.enable.subscribe(function (newValue) {
        if (newValue === true) {
            $('#' + self.fileInputId).fileupload('enable');
        }
        else {
            $('#' + self.fileInputId).fileupload('disable');
        }
    });

    self.validationMessage = ko.observable('Debe seleccionar un archivo');

    self.cancel = () => {
        if (self.jqXHR) {
            self.jqXHR.abort();
            self.jqXHR = null;
        }
    };

    self.uploading = ko.observable(false);
}

(function () {

    ko.components.register('single-file-upload', {
        viewModel: {
            createViewModel: (params, componentInfo) => params.ViewModel
        },
        template: { element: 'single-file-upload' },
        synchronous: true
    });

})();