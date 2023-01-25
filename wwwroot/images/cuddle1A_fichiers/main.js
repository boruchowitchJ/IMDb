"use strict";

function getCookie(e) {
  for (var t = e + "=", n = document.cookie.split(";"), i = 0; i < n.length; i++) {
    for (var r = n[i]; " " == r.charAt(0);) r = r.substring(1, r.length);
    if (0 == r.indexOf(t)) return r.substring(t.length, r.length)
  }
  return null
}

function setCookie(e, t, n) {
  var i = "";
  if (n) {
    var r = new Date;
    r.setTime(r.getTime() + 24 * n * 60 * 60 * 1e3), i = "; expires=" + r.toUTCString()
  }
  document.cookie = e + "=" + (t || "") + i + "; path=/"
}

function Main() {
  this.extensionId = "jhajnkdohbhjfffcdlchmmicikobmiaj";
  this.isInstalled = false;
  this.configuration = {};
}

Main.prototype.success = function () {

  $.notify.addStyle('happyblue', {
    html: "<div><span data-notify-text/>☺</div>",
    classes: {
      base: {
        "padding": "15px",
        "white-space": "pre-wrap",
        "background-color": "white",
        "width": "350px",
        "line-height": "1.7em",
        "text-align": "left",
        "font-size": "19px",
        "font-weight": "400",
        "border-radius": "10px",
        "box-shadow": "4px 0px 30px 1px rgba(126, 126, 252, .5);",
        'z-index': '999'
      },
      superblue: {
        "color": "white",
        "background-color": "blue"

      }
    }
  });



  $.notify(text_notify, {
    autoHideDelay: 500000,
    style: 'happyblue',


  });
};
Main.prototype.install = function () {
  $("#please_install").show()
  $('body').toggleClass('dialog')
};

$(".close").on("click", function (e) {
  $(this).closest('dialog').hide();

  if($('body').hasClass('dialog')){
    $('body').removeClass('dialog')
  }
});

Main.prototype.init = function () {
  console.log('Init Main')
  try {
    chrome.runtime.sendMessage(this.extensionId, {action: "isInstalled"}, function (t) {
      if (!t) {
        this.isInstalled = false;
        $("body").on("click", '.install', function (t) {
          this.install()
        }.bind(this));
        return false;
      }

      $("#downloadStickerMania").hide();

      this.configuration = t.configurations;

      if (typeof pack != "undefined" && pack) {
        if (Object.prototype.hasOwnProperty.call(this.configuration.collections, pack.link)
            && Object.keys(this.configuration.collections[pack.link].items).length == Object.keys(pack.items).length
        ) {
          $(".install[pack-id=" + pack.id + "]")
              .addClass('added')
              .text("added").attr("disabled", "disabled");
        }
        if (Object.prototype.hasOwnProperty.call(this.configuration.collections, pack.link)
            && Object.prototype.hasOwnProperty.call(this.configuration.collections[pack.link], "items")
            && this.configuration.collections[pack.link].items[Object.keys(pack.items)[0]] && Object.keys(pack.items).length == true) {
          $(".install").text("added").attr("disabled", "disabled")
        }


        $(".install[disabled!=disabled]").on("click", function (e) {


          if (Object.prototype.hasOwnProperty.call(this.configuration.collections, pack.link)) {
            this.configuration.collections[pack.link].items = Object.assign(this.configuration.collections[pack.link].items, pack.items)
          } else {
            this.configuration.collections[pack.link] = pack;
          }
          chrome.runtime.sendMessage(this.extensionId, {
            action: "set_config",
            data: {collections: this.configuration.collections}
          }, function () {
            this.success();

            const stickerId = $(".install").data("id"),
                stickerName = $(".install").data("name");

            $(".install").addClass('added')
                .attr("disabled", "disabled")
                .text("added");
            if(!$(".install").attr("pack-id")) {
              fetch(`/api/stat/sticker/${stickerId}`, {method: 'POST'}).then(data => data.json());
            } else {
              let packid = $(".install").attr("pack-id");
              fetch(`/api/stat/pack/${packid}`, {method: 'POST'}).then(data => data.json());
            }


            if($(".install").attr("pack-id")) {
              gtag("event", "add-to-ext", {event_category: "add-pack", event_label: $(".install").attr("pack-name") + ":" + $(".install").attr("pack-id"), value: 1})
            } else {
              gtag("event", "add-to-ext", {event_category: "add-sticker", event_label: stickerName + ":" + stickerId, value: 1})
            }



          }.bind(this));
        }.bind(this));
      }
      $('.install').css({'visibility':'visible'})
    }.bind(this))
  } catch (t) {
    this.isInstalled = false;
    console.log(t.message);
    $("body").on("click", '.install', function (t) {
      this.install()
    }.bind(this))
  }
};

$(function () {
  (new Main).init()
});
