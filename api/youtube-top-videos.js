const DEFAULT_REGION = "IT";
const DEFAULT_CATEGORY_IDS = ["28", "22", "0"];
const MAX_RESULTS_LIMIT = 12;

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function normalizeRegion(value) {
  const raw = String(value || DEFAULT_REGION).trim().toUpperCase();
  return /^[A-Z]{2}$/.test(raw) ? raw : DEFAULT_REGION;
}

function normalizeCategoryIds(value) {
  const raw = String(value || "").trim();

  if (!raw) return DEFAULT_CATEGORY_IDS;

  const ids = raw
    .split(",")
    .map((item) => item.trim())
    .filter((item) => /^\d+$/.test(item))
    .slice(0, 5);

  return ids.length ? ids : DEFAULT_CATEGORY_IDS;
}

function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function pointsFor({ views, likes, comments }, index) {
  const v = safeNumber(views);
  const l = safeNumber(likes);
  const c = safeNumber(comments);

  const viewScore = Math.min(55, Math.log10(v + 1) * 8);
  const likeScore = Math.min(25, Math.log10(l + 1) * 6);
  const commentScore = Math.min(15, Math.log10(c + 1) * 5);
  const rankScore = Math.max(0, 10 - index);

  return Math.max(1, Math.min(99, Math.round(viewScore + likeScore + commentScore + rankScore)));
}

function themeFor(categoryId) {
  if (categoryId === "27") return "Educazione";
  if (categoryId === "28") return "Tecnologia";
  if (categoryId === "22") return "Persone e blog";
  if (categoryId === "0") return "Top generali";
  return "YouTube";
}

function transformFor(categoryId) {
  if (categoryId === "27") return "Guida breve: cosa imparare e come applicarlo.";
  if (categoryId === "28") return "Post pratico: strumento, vantaggio, limite e prossimo passo.";
  if (categoryId === "22") return "Messaggio umano: storia, domanda e invito a commentare.";
  if (categoryId === "0") return "Idea generale: Short, post, WhatsApp e articolo.";
  return "Da video a Short, post, WhatsApp e articolo.";
}

function whyFor(categoryId) {
  if (categoryId === "27") return "Tema utile per trasformare attenzione in apprendimento e contenuto condivisibile.";
  if (categoryId === "28") return "Tema forte per creator e blogger: tecnologia spiegata in modo pratico.";
  if (categoryId === "22") return "Tema adatto a persone, storie, relazioni e conversazioni pubbliche.";
  if (categoryId === "0") return "Video popolare utile per capire cosa sta attirando attenzione adesso.";
  return "Video utile da trasformare in contenuto editoriale.";
}

function normalizeVideo(item, index) {
  const snippet = item?.snippet || {};
  const statistics = item?.statistics || {};
  const id = item?.id;

  const views = safeNumber(statistics.viewCount);
  const likes = safeNumber(statistics.likeCount);
  const comments = safeNumber(statistics.commentCount);
  const categoryId = String(snippet.categoryId || "");

  return {
    id,
    rank: String(index + 1).padStart(2, "0"),
    source: "Top YouTube",
    title: snippet.title || "Video YouTube",
    channel: snippet.channelTitle || "YouTube",
    theme: themeFor(categoryId),
    categoryId,
    publishedAt: snippet.publishedAt || null,
    url: `https://www.youtube.com/watch?v=${id}`,
    thumb:
      snippet.thumbnails?.maxres?.url ||
      snippet.thumbnails?.standard?.url ||
      snippet.thumbnails?.high?.url ||
      snippet.thumbnails?.medium?.url ||
      `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    views,
    likes,
    comments,
    score: pointsFor({ views, likes, comments }, index),
    why: whyFor(categoryId),
    transform: transformFor(categoryId),
  };
}

async function fetchCategory({ apiKey, regionCode, categoryId, maxResults }) {
  const url = new URL("https://www.googleapis.com/youtube/v3/videos");

  url.searchParams.set("part", "snippet,statistics,status");
  url.searchParams.set("chart", "mostPopular");
  url.searchParams.set("regionCode", regionCode);
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("key", apiKey);

  // categoryId=0 significa: top generali. In questo caso non forziamo videoCategoryId.
  if (categoryId && categoryId !== "0") {
    url.searchParams.set("videoCategoryId", categoryId);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`YouTube API ${response.status} category ${categoryId}: ${text.slice(0, 240)}`);
  }

  const data = await response.json();
  return Array.isArray(data.items) ? data.items : [];
}

function uniqueVideos(items) {
  const unique = new Map();

  for (const item of items) {
    if (!item?.id) continue;
    if (item?.status && item.status.embeddable === false) continue;
    if (!unique.has(item.id)) unique.set(item.id, item);
  }

  return Array.from(unique.values());
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=3600");

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      ok: false,
      source: "fallback",
      reason: "missing_youtube_api_key",
      message: "YOUTUBE_API_KEY non configurata lato server.",
      videos: [],
    });
  }

  try {
    const regionCode = normalizeRegion(req.query.regionCode);
    const categoryIds = normalizeCategoryIds(req.query.categoryIds);
    const maxResults = clampNumber(req.query.maxResults, 4, MAX_RESULTS_LIMIT, 8);
    const perCategory = Math.max(2, Math.ceil(maxResults / categoryIds.length));
    const categoryErrors = [];

    const settled = await Promise.allSettled(
      categoryIds.map((categoryId) =>
        fetchCategory({ apiKey, regionCode, categoryId, maxResults: perCategory }).then((items) => ({
          categoryId,
          items,
        }))
      )
    );

    let fetchedItems = [];

    for (const result of settled) {
      if (result.status === "fulfilled") {
        fetchedItems.push(...result.value.items);
      } else {
        categoryErrors.push(String(result.reason?.message || result.reason || "category_error"));
      }
    }

    // Se tutte le categorie specifiche falliscono, proviamo top generali.
    if (!fetchedItems.length && !categoryIds.includes("0")) {
      try {
        const fallbackItems = await fetchCategory({
          apiKey,
          regionCode,
          categoryId: "0",
          maxResults,
        });

        fetchedItems.push(...fallbackItems);
      } catch (error) {
        categoryErrors.push(String(error?.message || error || "fallback_0_error"));
      }
    }

    const videos = uniqueVideos(fetchedItems)
      .map((item, index) => normalizeVideo(item, index))
      .sort((a, b) => b.score - a.score || b.views - a.views)
      .slice(0, maxResults)
      .map((item, index) => ({
        ...item,
        rank: String(index + 1).padStart(2, "0"),
      }));

    if (!videos.length) {
      return res.status(200).json({
        ok: false,
        source: "fallback",
        reason: "youtube_no_videos",
        message: "YouTube API raggiunta, ma nessun video utilizzabile e stato restituito.",
        regionCode,
        categoryIds,
        categoryErrors: categoryErrors.slice(0, 6),
        videos: [],
      });
    }

    return res.status(200).json({
      ok: true,
      source: "youtube_api",
      regionCode,
      categoryIds,
      categoryErrors: categoryErrors.slice(0, 6),
      updatedAt: new Date().toISOString(),
      videos,
    });
  } catch (error) {
    return res.status(200).json({
      ok: false,
      source: "fallback",
      reason: "youtube_api_error",
      message: error?.message || "Errore YouTube API",
      videos: [],
    });
  }
}