/* ==========================================================================
   SecHack — fő JavaScript (függőségmentes)
   Adatok és beállítások: assets/js/data.js  (azt kell szerkesztened)
   ========================================================================== */
(function () {
  "use strict";

  var CONFIG = window.SECHACK_CONFIG || {};
  var EPISODES = window.SECHACK_EPISODES || [];
  var TOPICS = window.SECHACK_TOPICS || [];

  /* ---------- Segédfüggvények ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function icon(name, cls) {
    return '<svg class="icon' + (cls ? " " + cls : "") + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"></use></svg>';
  }
  function normalize(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function topicBySlug(slug) {
    for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].slug === slug) return TOPICS[i];
    return null;
  }
  function isValidUrl(u) { return typeof u === "string" && /^https?:\/\//i.test(u.trim()); }
  function formatDate(iso) {
    if (!iso) return null;
    var d = new Date(iso + "T12:00:00");
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" });
  }
  /* Az első beállított hallgatási link: Spotify > Apple > YouTube > közvetlen hang > saját oldal */
  function listenLink(ep) {
    if (ep.status !== "published" || !ep.links) return null;
    var order = ["spotify", "apple", "youtube", "audio", "page"];
    for (var i = 0; i < order.length; i++) {
      var u = ep.links[order[i]];
      if (isValidUrl(u)) return u.trim();
    }
    return null;
  }

  /* ---------- Üres állapot: amíg nincs epizód, csak a „hamarosan” üzenet látszik ---------- */
  $all("[data-no-episodes]").forEach(function (el) { el.hidden = EPISODES.length > 0; });
  $all("[data-has-episodes]").forEach(function (el) { el.hidden = EPISODES.length === 0; });

  /* ---------- Lábléc: évszám ---------- */
  $all("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Mobil navigáció ---------- */
  var toggle = $(".nav-toggle");
  var nav = $("#site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menü bezárása" : "Menü megnyitása");
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    $all("a", nav).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    window.addEventListener("resize", function () { if (window.innerWidth >= 900) setOpen(false); });
    document.addEventListener("click", function (e) {
      if (toggle.getAttribute("aria-expanded") === "true" && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
  }

  /* ---------- Vissza a tetejére ---------- */
  var toTop = $(".to-top");
  if (toTop) {
    var onScroll = function () { toTop.classList.toggle("is-visible", window.scrollY > 700); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toTop.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* ---------- Epizódkártyák ---------- */
  function episodeCard(ep) {
    var topic = topicBySlug(ep.topic);
    var url = listenLink(ep);
    var dateText = formatDate(ep.date);
    var demo = ep.status !== "published";
    var num = String(ep.number).padStart(2, "0");

    var badge = demo ? '<span class="badge-demo">Példa tartalom</span>' : "";
    var action = url
      ? '<a class="btn btn--primary btn--sm" href="' + esc(url) + '" target="_blank" rel="noopener">' + icon("headphones") + 'Hallgasd meg<span class="sr-only">: ' + esc(ep.title) + '</span></a>'
      : '<span class="btn btn--sm btn--disabled">' + icon("timer") + 'Hamarosan<span class="sr-only"> – ehhez az epizódhoz még nincs hallgatási link</span></span>';

    return '<article class="card episode" data-topic="' + esc(ep.topic) + '">' +
      '<div class="episode__thumb">' +
        '<img src="assets/images/pedro-avatar.webp" alt="" width="320" height="320" loading="lazy">' +
        '<span class="episode__num">#' + num + '</span>' +
        '<span class="episode__topicicon">' + icon(topic ? topic.icon : "mic") + '</span>' +
      '</div>' +
      '<div class="episode__body">' +
        '<div class="episode__meta"><span class="tag">' + esc(ep.category) + '</span>' + badge + '</div>' +
        '<h3 class="episode__title">' + esc(ep.title) + '</h3>' +
        '<p class="episode__desc">' + esc(ep.description) + '</p>' +
        '<div class="episode__info">' +
          '<span>' + icon("timer") + (demo ? "tervezett: " : "") + esc(ep.duration) + '</span>' +
          '<span>' + icon("calendar") + (dateText ? esc(dateText) : "megjelenés: hamarosan") + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="episode__actions">' + action + '</div>' +
    '</article>';
  }

  function sortedEpisodes() {
    return EPISODES.slice().sort(function (a, b) { return b.number - a.number; });
  }

  function showDemoNotice(list) {
    var hasDemo = list.some(function (e) { return e.status !== "published"; });
    $all("[data-demo-notice]").forEach(function (n) { n.hidden = !hasDemo; });
  }

  /* Főoldal: legújabb epizódok */
  var latest = $("[data-episodes-latest]");
  if (latest) {
    var limit = parseInt(latest.getAttribute("data-limit"), 10) || 3;
    // A kártyák a legkisebb sorszámtól jelennek meg, hogy a példák 01–03 sorrendben látszódjanak,
    // ha még nincs valódi epizód. Valódi epizódoknál a legfrissebb kerül előre.
    var published = sortedEpisodes().filter(function (e) { return e.status === "published"; });
    var pick = published.length ? published.slice(0, limit) : EPISODES.slice().sort(function (a, b) { return a.number - b.number; }).slice(0, limit);
    latest.innerHTML = pick.map(episodeCard).join("");
    showDemoNotice(pick);
  }

  /* Epizódarchívum: keresés + témaszűrők */
  var list = $("#episode-list");
  if (list) {
    var searchInput = $("#episode-search");
    var chipsBox = $("#topic-chips");
    var count = $("#result-count");
    var empty = $("#episode-empty");
    var activeTopic = "all";

    // Szűrőgombok a témákból
    var chipHtml = '<button type="button" class="chip" data-topic="all" aria-pressed="true">Mind</button>' +
      TOPICS.map(function (t) {
        return '<button type="button" class="chip" data-topic="' + esc(t.slug) + '" aria-pressed="false">' + esc(t.title) + '</button>';
      }).join("");
    chipsBox.innerHTML = chipHtml;

    var all = EPISODES.slice().sort(function (a, b) {
      var ap = a.status === "published" ? 1 : 0, bp = b.status === "published" ? 1 : 0;
      return bp - ap || (ap ? b.number - a.number : a.number - b.number);
    });
    list.innerHTML = all.map(episodeCard).join("");
    showDemoNotice(all);
    var cards = $all(".episode", list);

    var apply = function () {
      var q = normalize(searchInput.value.trim());
      var shown = 0;
      cards.forEach(function (card, i) {
        var ep = all[i];
        var haystack = normalize(ep.title + " " + ep.category + " " + ep.description);
        var okTopic = activeTopic === "all" || ep.topic === activeTopic;
        var okText = !q || haystack.indexOf(q) !== -1;
        var visible = okTopic && okText;
        card.hidden = !visible;
        if (visible) shown++;
      });
      count.textContent = shown + " epizód" + (q || activeTopic !== "all" ? " a szűrés alapján" : "");
      empty.hidden = shown !== 0;
    };

    var setTopic = function (slug) {
      activeTopic = slug;
      $all(".chip", chipsBox).forEach(function (c) {
        c.setAttribute("aria-pressed", String(c.getAttribute("data-topic") === slug));
      });
      apply();
    };

    chipsBox.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (btn) setTopic(btn.getAttribute("data-topic"));
    });
    searchInput.addEventListener("input", apply);
    $("#episode-reset").addEventListener("click", function () {
      searchInput.value = "";
      setTopic("all");
      searchInput.focus();
    });
    $("#episode-search-form").addEventListener("submit", function (e) { e.preventDefault(); });

    // ?tema=jelszavak előszűrés (a Témák oldalról érkező linkekhez)
    var preset = new URLSearchParams(window.location.search).get("tema");
    if (preset && topicBySlug(preset)) setTopic(preset); else apply();
  }

  /* Témák oldal: kapcsolódó epizódok */
  $all("[data-topic-episodes]").forEach(function (box) {
    var slug = box.getAttribute("data-topic-episodes");
    var eps = sortedEpisodes().filter(function (e) { return e.topic === slug; }).reverse();
    if (!eps.length) {
      box.innerHTML = '<p class="footer__muted">Ehhez a témához még nincs epizód.</p>';
      return;
    }
    box.innerHTML = eps.map(function (ep) {
      var url = listenLink(ep);
      var title = url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(ep.title) + '</a>' : '<span>' + esc(ep.title) + '</span>';
      var tag = ep.status !== "published" ? '<span class="badge-demo">Példa</span>' : "";
      return '<li class="mini-ep"><span class="mono">#' + String(ep.number).padStart(2, "0") + '</span>' + title + tag + '</li>';
    }).join("");
  });

  /* ---------- Kapcsolat (csak beállított e-mail-címmel jelenik meg a gomb) ---------- */
  var email = ((CONFIG.contact && CONFIG.contact.email) || "").trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    $all("[data-contact]").forEach(function (box) {
      box.innerHTML = '<a class="btn btn--primary" href="mailto:' + esc(email) + '">' + icon("mail") + 'Írj nekem</a>';
    });
  }

  /* ---------- Lábléc: platformlinkek (csak a beállítottak jelennek meg) ---------- */
  var PLATFORMS = [
    { key: "spotify", label: "Spotify", icon: "headphones" },
    { key: "apple", label: "Apple Podcasts", icon: "headphones" },
    { key: "youtube", label: "YouTube", icon: "play" },
    { key: "rss", label: "RSS", icon: "rss" },
    { key: "linkedin", label: "LinkedIn", icon: "link" }
  ];
  var pl = CONFIG.platforms || {};
  var configured = PLATFORMS.filter(function (p) { return isValidUrl(pl[p.key]); });
  $all("[data-platforms]").forEach(function (box) {
    if (!configured.length) return; // marad az alapértelmezett „hamarosan” szöveg
    box.innerHTML = '<div class="platforms">' + configured.map(function (p) {
      return '<a href="' + esc(pl[p.key].trim()) + '" target="_blank" rel="noopener">' + icon(p.icon) + esc(p.label) + '</a>';
    }).join("") + '</div>';
  });
})();
