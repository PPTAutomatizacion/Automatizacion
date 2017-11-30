let newsCarouselUid = 0;

function NewsCarouselViewModel(model) {
    var self = this;

    //URLs
    self.URL = {
        RefreshNews: "NewsCarousel/RefreshNews"
    };

    let newsMapping = {
        News: {
            create: (options) => {
                var news = ko.mapping.fromJS(options.data);
                news.type = 'tableauNewsTest';
                return news;
            }
        }
    };

    ko.mapping.fromJS(model, newsMapping, self);

    //set id's
    self.newsCarouselId = 'newsCarousel_' + newsCarouselUid.toString();
    newsCarouselUid += 1;

    self.enabled = ko.observable(true);

    self.refresh = function () {
        if (self.enabled()) {
            self.Gallery.pause();
            let lastLength = self.News().length;
            $.apiCall(self.URL.RefreshNews, ko.mapping.toJS(self, { 'ignore': ['Gallery'] })).then((model) => {
                ko.mapping.fromJS(model, newsMapping, self);
                var lastNews = self.News().slice(lastLength);
                if (lastNews.length > 0)
                    self.Gallery.add(lastNews);

                if (self.News().length > 1 && self.timerId > 0) {
                    clearInterval(self.timerId);
                    self.timerId = 0;
                }

            }).always(() => self.Gallery.play());
        }
    };
}

(function () {

    ko.components.register('news-carousel', {
        viewModel: {
            createViewModel: (params, componentInfo) => params.ViewModel
        },
        template: { element: 'news-carousel' },
        synchronous: true
    });

})();

ko.bindingHandlers.newsCarousel = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        let defaults = {
            container: element,
            carousel: true,
            toggleControlsOnSlideClick: false,
            toggleControlsOnReturn: false,
            onslide: function (index, slide) {
                if (index + 1 === this.getNumber()) {
                    viewModel.refresh();
                }
            },
            onopened: function () {
                setTimeout(() => {
                    if (this.getNumber() <= 1) {
                        viewModel.timerId = setInterval(viewModel.refresh, 10000);
                    }
                }, 2000);
            }
        };

        let options = $.extend({}, defaults, ko.unwrap(valueAccessor()));
        let newsItems = viewModel.News().length > 0 ? viewModel.News() : ['about:blank'];
        setTimeout(() => viewModel.Gallery = blueimp.Gallery(newsItems, options), 100);
    }
};

blueimp.Gallery.prototype.tableauNewsFactory = function (news, callback) {

    let $figure = $('<figure>').addClass('imghvr-slide-left slideImg');

    $figure.append("<img src='" + $("body").data("baseurl") + "NewsCarousel/Image?newsId=" + news.Id().toString() + "' />");

    let $figcaption = $('<figcaption>').addClass('imghvr-slide-left slideImg');
    let $titleDiv = $('<div>').addClass('slide-text-tit').html(news.Title());
    let $descDiv = $('<div>').addClass('slide-text').html(news.Description());
    $descDiv.append("<br /><span class='slide-link'>VISITAR</span><a target='_blank' href='" + news.Url() + "'></a>");

    $figcaption.append($titleDiv);
    $figcaption.append($descDiv);

    $figure.append($figcaption);

    setTimeout(() => callback({
        type: 'load',
        target: $figure[0]
    }), 100);

    return $figure[0];
};

blueimp.Gallery.prototype.tableauNewsTestFactory = function (news, callback) {

    let $figure = $('<figure>').addClass('imghvr-slide-up slideImg');

    $figure.append("<img src='" + $("body").data("baseurl") + "NewsCarousel/Image?newsId=" + news.Id().toString() + "' />");

    let $figcaption = $('<figcaption>').addClass('imghvr-slide-up slideImg');
    //let $titleDiv = $('<div>').addClass('slide-text-tit').html(news.Title());
    let $descDiv = $('<div>').addClass('slide-text').html('<span class="slide-text-tit">' + news.Title() + '</span><br />' + news.Description());
    let $buttonDiv = $('<div class="slide-link">').append("<div class='slide-boton'>Acceder <i class='fa fa-arrow-right' aria-hidden='true' style='padding-left: 5px;'></i></span><a target='_blank' href='" + news.Url() + "'></a>");

    $figcaption.append($descDiv);
    $figcaption.append($buttonDiv);

    $figure.append($figcaption);

    setTimeout(() => callback({
        type: 'load',
        target: $figure[0]
    }), 100);

    return $figure[0];
};