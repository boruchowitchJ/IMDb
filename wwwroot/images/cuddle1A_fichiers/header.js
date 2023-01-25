!function () {
    var e = $(".menu__search__container");
    e.css("width", Math.round($("#search_block").width()));
    $("input.menu-search-input").css("width", Math.round($("#navBarMenu").width()));
}();
$.fn.pressEnter = function (e) {
    return this.each(function () {
        $(this).bind("enterPress", e), $(this).keyup(function (e) {
            13 == e.keyCode && $(this).trigger("enterPress"), 27 == e.keyCode && $("a.menu-search-close").click()
        })
    })
};


var $vartypeahead = $(".typeahead");
var responseList = {},
    CC_Query = "";
$vartypeahead.pressEnter(function (e) {
    window.location.href = "https://mystickermania.com/search?q=" + $(this).val()
});

var engine = new Bloodhound({
    datumTokenizer: function (datum) {
        return Bloodhound.tokenizers.whitespace(datum.value);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
        wildcard: '%QUERY',
        url: '/search',
        limit: 20,
        transform: function (data) {
            return data;
        },
        filter: function (parsedResponse) {
            responseList = parsedResponse;
            $('#quickLinks').hide();
            if (parsedResponse) {
               //$('#quickLinks').hide();
            }
            return parsedResponse.data.stickers;
        },
        /*filter: function (parsedResponse) {
            var result = [];
            responseList = parsedResponse;
            if (parsedResponse) {
                let a = parsedResponse.data.stickers;
                result = a;
                console.log(result)
                $('#quickLinks').hide();
            } else {
            }
            return result;
        },*/
        prepare: function (query, settings) {
            CC_Query = query;
            settings.type = 'POST';
            settings.data = {
                query: query
            };
            return settings;
        },

    }
});

engine.initialize();

$vartypeahead.typeahead({
    hint: true,
    highlight: true,
    limit: 20,
    menu: $("ul#result"),

    dynamic: false,

}, {
    menu: $("#result"),
    templates: {
        empty: ["<li> Nothing found </li>"],
        header: [""],
        suggestion: function (e) {
            console.log(e)
            return '<li class="item__search" ><a class="link__collection" href="' + e.link + '">' + e.name + "</a></li>"
        },
        footer: function (e) {
            return '<li class="text-right" style="padding: 7px 15px 0px"><a id="showMoreSearch"  href="/search/' + e.query + '"> Show All (' + responseList.total + ")</a></li>"
        }
    },
    cache: false,
    name: "name",
    limit: 20,
    displayKey: "name",
    source: engine.ttAdapter()
});
$vartypeahead.bind("typeahead:selected", function (e, n, t) {
}).bind("typeahead:render", function (e) {
    Array.prototype.slice.call(arguments, 1)
});
$(".typeahead").on("keydown", function (e) {
    13 == e.keyCode && (window.location.href = "https://mystickermania.com/search/" + $(this).val())
});