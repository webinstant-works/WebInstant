(function () {
  "use strict";

  var PROMO = {
    enabled: true,
    name: "Diwali Sale",
    endDate: "2026-11-15", 
    tiers: [
      { min: 6000, percent: 20 },
      { min: 10000, percent: 30 },
    ],
  };

  var root = document.documentElement;

  function isActive() {
    if (!PROMO.enabled) return false;
    if (PROMO.endDate) {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(PROMO.endDate);
      if (m) {
        // end of the last day in India time (UTC+05:30)
        var endMs =
          Date.UTC(+m[1], +m[2] - 1, +m[3], 23, 59, 59) - 5.5 * 3600 * 1000;
        if (Date.now() > endMs) return false;
      }
    }
    return true;
  }

  var tiers = PROMO.tiers.slice().sort(function (a, b) {
    return a.min - b.min;
  });

  function percentFor(price) {
    var pct = 0;
    for (var i = 0; i < tiers.length; i++)
      if (price >= tiers[i].min) pct = tiers[i].percent;
    return pct;
  }
  function discounted(price, pct) {
    return Math.round((price * (100 - pct)) / 100);
  }
  function inr(n) {
    return "₹" + Number(n).toLocaleString("en-IN");
  }

  if (!isActive()) {
    root.classList.remove("promo-on");
    document.addEventListener("DOMContentLoaded", function () {
      var ui = document.querySelectorAll("[data-promo-ui]");
      for (var i = 0; i < ui.length; i++) ui[i].parentNode.removeChild(ui[i]);
    });
    return;
  }
  root.classList.add("promo-on");

  function fill() {
    var low = tiers[0],
      high = tiers[tiers.length - 1];
    var map = {
      "max-pct": high.percent,
      "low-pct": low.percent,
      "low-min": inr(low.min),
      "high-pct": high.percent,
      "high-min": inr(high.min),
      "low-old": inr(low.min),
      "low-new": inr(discounted(low.min, low.percent)),
      "high-old": inr(high.min),
      "high-new": inr(discounted(high.min, high.percent)),
      "high2-old": inr(15000),
      "high2-new": inr(discounted(15000, percentFor(15000))),
      name: PROMO.name,
    };
    var nodes = document.querySelectorAll("[data-promo-fill]");
    for (var i = 0; i < nodes.length; i++) {
      var k = nodes[i].getAttribute("data-promo-fill");
      if (map[k] !== undefined) nodes[i].textContent = map[k];
    }
    // optional end date note (only when configured)
    var until = document.querySelectorAll("[data-promo-until]");
    if (PROMO.endDate && until.length) {
      var d = new Date(PROMO.endDate + "T00:00:00Z");
      var txt =
        "Offer valid until " +
        d.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }) +
        ".";
      for (var j = 0; j < until.length; j++) {
        until[j].textContent = txt;
        until[j].hidden = false;
      }
    }
  }

  function decorate(card) {
    var price = parseInt(card.getAttribute("data-promo-price"), 10);
    var pct = percentFor(price);
    if (!price || !pct) return;
    var now = discounted(price, pct),
      save = price - now;

    var priceEl = card.querySelector(".price, .amount");
    if (priceEl) {
      var small = priceEl.querySelector("small");
      var suffix = small ? " " + small.outerHTML : "";
      priceEl.innerHTML =
        '<span class="promo-old"><span class="promo-sr">Original price </span><s>' +
        inr(price) +
        "</s></span> " +
        '<span class="promo-new"><span class="promo-sr">Sale price </span>' +
        inr(now) +
        "</span>" +
        suffix;
      priceEl.classList.add("promo-price");

      var badge = document.createElement("span");
      badge.className = "promo-badge";
      badge.textContent = PROMO.name + " · " + pct + "% OFF";
      priceEl.parentNode.insertBefore(badge, priceEl);

      var saving = document.createElement("p");
      saving.className = "promo-save";
      saving.textContent = "You save " + inr(save);
      priceEl.parentNode.insertBefore(saving, priceEl.nextSibling);
    }
    card.classList.add("has-promo");

    // WhatsApp / enquiry button: keep the original message and append the offer details
    var links = card.querySelectorAll('a[href^="https://wa.me/"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var href = a.getAttribute("href");
      var q = href.indexOf("?text=");
      var base = q > -1 ? href.slice(0, q) : href;
      var msg = q > -1 ? decodeURIComponent(href.slice(q + 6)) : "";
      if (msg.indexOf(PROMO.name) > -1) continue;
      msg =
        msg.replace(/[.\s]+$/, "") +
        ". " +
        PROMO.name +
        " offer: original price " +
        inr(price) +
        ", " +
        pct +
        "% OFF, discounted price " +
        inr(now) +
        " (saving " +
        inr(save) +
        ").";
      a.setAttribute("href", base + "?text=" + encodeURIComponent(msg));
    }
  }

  function init() {
    fill();
    var cards = document.querySelectorAll("[data-promo-price]");
    for (var i = 0; i < cards.length; i++) decorate(cards[i]);
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();

  // exposed for quick checks in the browser console: WIPromo.calc(10000)
  window.WIPromo = {
    calc: function (price) {
      var pct = percentFor(price);
      return {
        price: price,
        percent: pct,
        final: pct ? discounted(price, pct) : price,
      };
    },
  };
})();
