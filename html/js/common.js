(function ($) {
  var poilus = window.POILUS;

  function hue(name) {
    var h = 0;
    for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
    return h;
  }

  function avatar(name, sizeClass) {
    var h = hue(name);
    return $("<div>")
      .addClass("h-full w-full flex items-center justify-center font-mono text-white " + sizeClass)
      .css("background", "linear-gradient(135deg, hsl(" + h + ", 60%, 45%), hsl(" + h + ", 60%, 35%))")
      .text(name.charAt(0));
  }

  function photoOrAvatar(p, imgClass, sizeClass) {
    if (p.photo) {
      return $("<img>").attr({ src: p.photo, alt: "Portrait de " + p.nom }).addClass(imgClass);
    }
    return avatar(p.nom, sizeClass);
  }

  function getById(id) {
    return poilus.filter(function (p) { return p.id === id; })[0];
  }

  function allTags() {
    var set = {};
    poilus.forEach(function (p) {
      p.tags.forEach(function (t) { if (t !== p.metier) set[t] = true; });
    });
    return Object.keys(set).sort();
  }

  function search(query, tag) {
    var q = (query || "").toLowerCase();
    return poilus
      .filter(function (p) {
        var hay = [p.nom, p.regiment, p.lieu, p.metier, p.departement_deces].join(" ").toLowerCase();
        return (!q || hay.indexOf(q) !== -1) && (!tag || p.tags.indexOf(tag) !== -1);
      })
      .sort(function (a, b) { return a.nom.localeCompare(b.nom, "fr"); });
  }

  function card(p, compact) {
    var $a = $("<a>")
      .attr("href", "poilu.html?id=" + encodeURIComponent(p.id))
      .addClass("group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg hover:-translate-y-1");
    var $thumb = $("<div>").addClass((compact ? "h-32" : "h-48") + " w-full overflow-hidden bg-muted");
    $thumb.append(
      photoOrAvatar(
        p,
        "h-full w-full object-cover grayscale sepia-[.25] transition-all group-hover:grayscale-0",
        compact ? "text-lg font-semibold" : "text-sm"
      )
    );
    var $body = $("<div>").addClass(compact ? "flex-1 p-3" : "flex-1 p-4");
    $body.append(
      $("<p>").addClass("font-display font-semibold text-foreground" + (compact ? " text-sm" : "")).text(p.nom),
      $("<p>").addClass("text-xs text-muted").text(p.naissance + " – " + p.deces.split("-")[0])
    );
    return $a.append($thumb, $body);
  }

  window.MEM = {
    poilus: poilus,
    getById: getById,
    allTags: allTags,
    search: search,
    card: card,
    avatar: avatar,
    photoOrAvatar: photoOrAvatar
  };
})(jQuery);
