(function () {
  if (location.hash && !location.hash.startsWith('#/')) {
    const clean = location.hash.replace(/^#\/?/, '');
    history.replaceState(null, '', '#/' + clean);
  }
})();
