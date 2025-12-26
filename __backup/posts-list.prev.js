import { listPosts } from "./_posts-lib.js";

export default async function handler(req, res) {
  try {
    const limit = Number(req.query?.limit ?? 20);
    const items = await listPosts({ limit });
    res.status(200).json({ ok:true, items });
  } catch (err) {
    // niente 500: ritorna struttura coerente anche in errore
    res.status(200).json({ ok:true, items:[], reason:String(err?.message ?? err) });
  }
}
