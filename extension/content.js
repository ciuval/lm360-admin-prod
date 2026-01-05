(() => {
  const ID = "lm360-helper-toolbar";

  function ensureToolbar(){
    if(document.getElementById(ID)) return;
    const box = document.createElement("div");
    box.id = ID;
    box.innerHTML = `
      <div class="lm360-row">
        <strong>LM360</strong>
        <button class="lm360-btn" id="lm360-open">Apri app</button>
        <button class="lm360-btn ghost" id="lm360-chat">Chat</button>
        <button class="lm360-close" id="lm360-close" title="Nascondi">×</button>
      </div>
    `;
    document.documentElement.appendChild(box);

    document.getElementById("lm360-open")?.addEventListener("click", () => {
      const url = location.origin + "/#/";
      window.open(url, "_blank", "noopener");
    });
    document.getElementById("lm360-chat")?.addEventListener("click", () => {
      const url = location.origin + "/#/chat/placeholder";
      window.open(url, "_blank", "noopener");
    });
    document.getElementById("lm360-close")?.addEventListener("click", async () => {
      hideToolbar();
      try { await chrome.storage.local.set({ showToolbar:false }); } catch {}
    });
  }

  function hideToolbar(){
    const el = document.getElementById(ID);
    if(el) el.remove();
  }

  async function init(){
    try{
      const { showToolbar } = await chrome.storage.local.get({ showToolbar:true });
      if(showToolbar) ensureToolbar(); else hideToolbar();
    }catch{
      // fallback
      ensureToolbar();
    }
  }

  // Messaggi dal popup
  try {
    chrome.runtime.onMessage.addListener((msg) => {
      if(msg?.type === "TOGGLE_TOOLBAR"){
        if(msg.show === true) ensureToolbar(); else hideToolbar();
      }
    });
  } catch {}

  // Sync quando cambia storage (altri tab)
  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if(area !== "local") return;
      if(Object.prototype.hasOwnProperty.call(changes, "showToolbar")){
        const v = changes.showToolbar.newValue;
        if(v === true) ensureToolbar(); else hideToolbar();
      }
    });
  } catch {}

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  }else{
    init();
  }
})();
