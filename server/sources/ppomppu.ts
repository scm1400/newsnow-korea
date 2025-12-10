import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  // 뽐뿌는 EUC-KR 인코딩이라 Google News RSS 사용
  const url = "https://news.google.com/rss/search?q=site:ppomppu.co.kr&hl=ko&gl=KR&ceid=KR:ko"
  const xml: any = await myFetch(url)
  const $ = cheerio.load(xml, { xmlMode: true })
  const news: NewsItem[] = []

  $("item").each((_, item) => {
    const $item = $(item)
    // Google News에서 제목 뒤의 " - 뽐뿌" 부분 제거
    let title = $item.find("title").text().trim()
    title = title.replace(/ - 뽐뿌$/, "").replace(/ - ppomppu$/, "")

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
