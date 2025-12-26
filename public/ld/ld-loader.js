(function () {
  if (window.__lm360LdMounted) return;
  window.__lm360LdMounted = true;

  function stripTags(txt){ return txt.replace(/^\s*<script[^>]*>\s*|\s*<\/script>\s*$/g,''); }
  function inject(jsonText){
    if (!jsonText) return;
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.setAttribute("data-lm360-ld","1");
    s.text = stripTags(jsonText);
    document.head.appendChild(s);
  }
  function loadFor(path){
    var base = "/ld/";
    var files = ["schema-org.jsonld"]; // sempre
    if (path.indexOf("/amore/come-trovare-anima-gemella")>=0) {
      files.push("schema-breadcrumb-amore.jsonld","schema-amore.jsonld");
    }
    if (path.indexOf("/soldi/guadagnare-online-sicuro-veloce")>=0) {
      files.push("schema-breadcrumb-soldi.jsonld","schema-soldi.jsonld");
    }
    files.forEach(function(f){
      fetch(base+f, {cache:"no-store"}).then(function(r){return r.text();}).then(inject).catch(function(){});
    });
  }
  function currentPath(){
    var h = location.hash || "";
    if (h.indexOf("#/")===0) return location.pathname + h.slice(1);
    return location.pathname;
  }
  // prima iniezione
  loadFor(currentPath());
  // gestisci navigazione SPA
  window.addEventListener("hashchange", function(){ loadFor(currentPath()); });
  window.addEventListener("popstate", function(){ loadFor(currentPath()); });
})();
