import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const url = "https://news.daum.net/"
  const html: any = await myFetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  })
  const $ = cheerio.load(html)
  const news: NewsItem[] = []

  // 이 시각 주요뉴스 섹션에서 가져오기
  $(".item_newsheadline2, .item_newsbasic").each((idx, el) => {
    const $el = $(el)
    const title = $el.find(".tit_txt").text().trim()
    const href = $el.attr("href")
    const source = $el.find(".txt_info").first().text().trim()

    if (title && href) {
      news.push({
        id: href,
        title,
        url: href,
        extra: {
          info: source || undefined,
        },
      })
    }
  })

  return news.slice(0, 30)
})
