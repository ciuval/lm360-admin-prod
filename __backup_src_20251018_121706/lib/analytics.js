import { supabase } from "./supabaseClient";
export async function track(name, props={}, userId=null){
  try{
    if(localStorage.getItem("cmp.analytics")!=="true") return; // rispetto consenso
  }catch{}
  try{
    const uid = userId ?? (await supabase.auth.getUser()).data.user?.id ?? null;
    await supabase.from("events").insert({ name, props, user_id: uid });
  }catch{}
}
