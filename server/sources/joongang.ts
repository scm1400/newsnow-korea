import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const url = "https://www.joongang.co.kr/"
  const html: any = await myFetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  })
  const $ = cheerio.load(html)
  const news: NewsItem[] = []

  // 중앙일보 메인 페이지 기사 링크 파싱
  $("a[href*='/article/']").each((_, el) => {
    const $a = $(el)
    const href = $a.attr("href")
    // 기사 제목 찾기: alt 텍스트, 직접 텍스트, 또는 하위 요소
    let title = $a.find("img").attr("alt") || $a.text().trim()

    // 긴 텍스트 정리 (불필요한 공백 제거)
    title = title.replace(/\s+/g, " ").trim()

    if (title && href && title.length > 5 && !news.find(n => n.url === href)) {
      news.push({
        id: href,
        title,
        url: href.startsWith("http") ? href : `https://www.joongang.co.kr${href}`,
      })
    }
  })

  return news.slice(0, 30)
})
