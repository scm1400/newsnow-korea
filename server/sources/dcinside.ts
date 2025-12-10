import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const url = "https://gall.dcinside.com/board/lists/?id=dcbest&page=1"
  const html: any = await myFetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  })
  const $ = cheerio.load(html)
  const news: NewsItem[] = []

  $("tr.ub-content").each((_, el) => {
    const $el = $(el)
    const $a = $el.find("td.gall_tit a").first()
    const title = $a.text().trim()
    const href = $a.attr("href")
    const no = $el.find("td.gall_num").text().trim()
    const recommend = $el.find("td.gall_recommend").text().trim()
    const count = $el.find("td.gall_count").text().trim()

    if (title && href && no) {
      news.push({
        id: no,
        title,
        url: `https://gall.dcinside.com${href}`,
        extra: {
          info: `추천 ${recommend} | 조회 ${count}`,
        },
      })
    }
  })

  return news.slice(0, 30)
})
