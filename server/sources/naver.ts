import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  // 네이버 뉴스 섹션 페이지 사용 (UTF-8)
  // 여러 섹션에서 뉴스 수집: 100=정치, 101=경제, 102=사회, 103=생활/문화, 104=세계, 105=IT/과학
  const sections = ["100", "101", "102", "103", "104", "105"]
  const news: NewsItem[] = []

  for (const section of sections) {
    if (news.length >= 30) break

    const url = `https://news.naver.com/section/${section}`
    const html: any = await myFetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    })
    const $ = cheerio.load(html)

    $("a.sa_text_title").each((_, el) => {
      if (news.length >= 30) return false
      const $a = $(el)
      const href = $a.attr("href")
      const title = $a.text().trim()

      if (title && href && !news.find(n => n.url === href)) {
        news.push({
          id: href,
          title,
          url: href,
        })
      }
    })
  }

  return news.slice(0, 30)
})
