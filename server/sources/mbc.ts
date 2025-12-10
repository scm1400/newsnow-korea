import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  // MBC 뉴스는 JavaScript 렌더링이 필요해서 Google News RSS를 사용
  const url = "https://news.google.com/rss/search?q=site:imnews.imbc.com&hl=ko&gl=KR&ceid=KR:ko"
  const xml: any = await myFetch(url)
  const $ = cheerio.load(xml, { xmlMode: true })
  const news: NewsItem[] = []

  $("item").each((_, item) => {
    const $item = $(item)
    // Google News에서 제목 뒤의 " - MBC 뉴스" 부분 제거
    let title = $item.find("title").text().trim()
    title = title.replace(/ - MBC 뉴스$/, "").replace(/ - MBC NEWS$/, "")

    const link = $item.find("link").text().trim()
    const pubDate = $item.find("pubDate").text().trim()

    if (title && link) {
      news.push({
        id: link,
        title,
        url: link,
        pubDate: pubDate ? new Date(pubDate).getTime() : undefined,
      })
    }
  })

  return news.slice(0, 30)
})
