import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const url = "https://news.kbs.co.kr/news/pc/main/main.html"
  const html: any = await myFetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  })
  const $ = cheerio.load(html)
  const news: NewsItem[] = []

  // KBS 뉴스 헤드라인 및 주요 기사 파싱
  // .box-content 클래스 내의 a 태그들을 선택
  $(".main-head-line a.box-content, .k-recommend-news a.box-content").each((_, el) => {
    const $a = $(el)
    const href = $a.attr("href")
    // 제목은 .title 또는 p.title 클래스에서
    const title = $a.find("p.title, .title").text().trim()

    if (title && href && !news.find(n => n.title === title)) {
      let fullUrl = href
      if (!href.startsWith("http")) {
        // URL 인코딩 처리 (&amp; -> &)
        fullUrl = `https://news.kbs.co.kr${href.replace(/&#x3D;/g, "=")}`
      }
      news.push({
        id: href,
        title,
        url: fullUrl,
      })
    }
  })

  return news.slice(0, 30)
})
