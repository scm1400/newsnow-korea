import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const url = "https://bbs.ruliweb.com/best"
  const html: any = await myFetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  })
  const $ = cheerio.load(html)
  const news: NewsItem[] = []

  $("tr.table_body").each((_, el) => {
    const $el = $(el)
    const $a = $el.find("a.deco")
    const title = $a.text().trim()
    const href = $a.attr("href")
    const hit = $el.find("td.hit").text().trim()
    const recommend = $el.find("td.recomd").text().trim()

    if (title && href) {
      news.push({
        id: href,
        title,
        url: href.startsWith("http") ? href : `https://bbs.ruliweb.com${href}`,
        extra: {
          info: `조회 ${hit} | 추천 ${recommend}`,
        },
      })
    }
  })

  return news.slice(0, 30)
})
