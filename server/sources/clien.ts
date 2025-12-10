import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const url = "https://www.clien.net/service/board/park"
  const html: any = await myFetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  })
  const $ = cheerio.load(html)
  const news: NewsItem[] = []

  $(".list_item").each((_, el) => {
    const $el = $(el)
    const $a = $el.find(".list_subject .subject_fixed")
    const title = $a.text().trim()
    const href = $el.find("a.list_subject").attr("href")
    const hit = $el.find(".list_hit .hit").text().trim()
    const recommend = $el.find(".list_hit .recommend").text().trim()

    if (title && href) {
      news.push({
        id: href,
        title,
        url: `https://www.clien.net${href}`,
        extra: {
          info: `조회 ${hit}${recommend ? ` | 추천 ${recommend}` : ""}`,
        },
      })
    }
  })

  return news.slice(0, 30)
})
