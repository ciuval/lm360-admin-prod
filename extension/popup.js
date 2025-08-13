(async function(){
  const toggle = document.getElementById("toggleToolbar");
  const openSiteBtn = document.getElementById("openSite");

  async function getActiveTab(){
    const tabs = await chrome.tabs.query({active:true, currentWindow:true});
    return tabs?.[0];
  }

  // init stato
  try{
    const { showToolbar } = await chrome.storage.local.get({ showToolbar:true });
    toggle.checked = !!showToolbar;
  }catch{ toggle.checked = true; }

  // toggle toolbar: salva e manda messaggio al tab attivo
  toggle.addEventListener("change", async () => {
    const show = toggle.checked;
    try { await chrome.storage.local.set({ showToolbar: show }); } catch {}
    try{
      const t = await getActiveTab();
      if(t?.id) await chrome.tabs.sendMessage(t.id, { type:"TOGGLE_TOOLBAR", show });
    }catch{}
  });

  openSiteBtn.addEventListener("click", async () => {
    const url = "https://www.lovematch360.com/";
    try{ await chrome.tabs.create({ url }); }catch{ window.open(url, "_blank"); }
  });
})();
