(function(){
  try{
    var p = location.pathname || "/";
    // Se siamo già su hash routing o root, esci
    if (p === "/" || (location.hash && location.hash.indexOf("#/") === 0)) return;

    // Escludi asset, API e file statici
    var ignore = [/^\/assets\//, /^\/api\//, /^\/favicon/i, /^\/robots\.txt$/i, /^\/sitemap\.xml$/i, /^\/_vercel\//];
    for (var i=0;i<ignore.length;i++){ if (ignore[i].test(p)) return; }

    // Mappa /foo/bar?x=y -> /#/foo/bar?x=y (senza reload)
    var newUrl = location.origin + "/#" + p.replace(/^\//,"") + (location.search || "");
    history.replaceState(null, "", newUrl);
  }catch(e){}
})();
