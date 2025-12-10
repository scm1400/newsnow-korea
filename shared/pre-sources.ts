import process from "node:process"
import { Interval } from "./consts"
import { typeSafeObjectFromEntries } from "./type.util"
import type { OriginSource, Source, SourceID } from "./types"

const Time = {
  Test: 1,
  Realtime: 2 * 60 * 1000,
  Fast: 5 * 60 * 1000,
  Default: Interval, // 10min
  Common: 30 * 60 * 1000,
  Slow: 60 * 60 * 1000,
}

export const originSources = {
  // === 뉴스 포털 ===
  "naver": {
    name: "네이버 뉴스",
    title: "실시간 랭킹",
    type: "hottest",
    column: "korea",
    color: "green",
    interval: Time.Fast,
    home: "https://news.naver.com",
  },
  "daum": {
    name: "다음 뉴스",
    title: "실시간 랭킹",
    type: "hottest",
    column: "korea",
    color: "blue",
    interval: Time.Fast,
    home: "https://news.daum.net",
  },

  // === 커뮤니티 ===
  "dcinside": {
    name: "디시인사이드",
    title: "실시간 베스트",
    type: "hottest",
    column: "community",
    color: "blue",
    interval: Time.Fast,
    home: "https://dcinside.com",
  },
  "clien": {
    name: "클리앙",
    title: "모아보기",
    type: "hottest",
    column: "community",
    color: "orange",
    interval: Time.Fast,
    home: "https://clien.net",
  },
  "ruliweb": {
    name: "루리웹",
    title: "베스트",
    type: "hottest",
    column: "community",
    color: "blue",
    interval: Time.Fast,
    home: "https://ruliweb.com",
  },
  "ppomppu": {
    name: "뽐뿌",
    title: "핫딜",
    type: "hottest",
    column: "community",
    color: "red",
    interval: Time.Fast,
    home: "https://ppomppu.co.kr",
  },
  // === 언론사 ===
  "chosun": {
    name: "조선일보",
    type: "realtime",
    column: "media",
    color: "blue",
    interval: Time.Common,
    home: "https://chosun.com",
  },
  "joongang": {
    name: "중앙일보",
    type: "realtime",
    column: "media",
    color: "red",
    interval: Time.Common,
    home: "https://joongang.co.kr",
  },
  "donga": {
    name: "동아일보",
    type: "realtime",
    column: "media",
    color: "blue",
    interval: Time.Common,
    home: "https://donga.com",
  },
  "hani": {
    name: "한겨레",
    type: "realtime",
    column: "media",
    color: "blue",
    interval: Time.Common,
    home: "https://hani.co.kr",
  },
  "khan": {
    name: "경향신문",
    type: "realtime",
    column: "media",
    color: "blue",
    interval: Time.Common,
    home: "https://khan.co.kr",
  },
  "sbs": {
    name: "SBS 뉴스",
    type: "realtime",
    column: "media",
    color: "blue",
    interval: Time.Common,
    home: "https://news.sbs.co.kr",
  },
  "kbs": {
    name: "KBS 뉴스",
    type: "realtime",
    column: "media",
    color: "red",
    interval: Time.Common,
    home: "https://news.kbs.co.kr",
  },
  "mbc": {
    name: "MBC 뉴스",
    type: "realtime",
    column: "media",
    color: "blue",
    interval: Time.Common,
    home: "https://www.imbc.com",
  },
  "jtbc": {
    name: "JTBC 뉴스",
    type: "realtime",
    column: "media",
    color: "red",
    interval: Time.Common,
    home: "https://news.jtbc.co.kr",
  },
  "yonhap": {
    name: "연합뉴스",
    type: "realtime",
    column: "media",
    color: "blue",
    interval: Time.Common,
    home: "https://www.yna.co.kr",
  },

  // === 국제/기술 (유지) ===
  "hackernews": {
    name: "Hacker News",
    color: "orange",
    column: "tech",
    type: "hottest",
    home: "https://news.ycombinator.com/",
  },
  "github": {
    name: "Github",
    color: "gray",
    home: "https://github.com/",
    column: "tech",
    sub: {
      "trending-today": {
        title: "Today",
        type: "hottest",
      },
    },
  },
  "steam": {
    name: "Steam",
    column: "world",
    title: "플레이어 수",
    color: "blue",
    type: "hottest",
    home: "https://store.steampowered.com",
  },
} as const satisfies Record<string, OriginSource>

export function genSources() {
  const _: [SourceID, Source][] = []

  Object.entries(originSources).forEach(([id, source]: [any, OriginSource]) => {
    const parent = {
      name: source.name,
      type: source.type,
      disable: source.disable,
      desc: source.desc,
      column: source.column,
      home: source.home,
      color: source.color ?? "primary",
      interval: source.interval ?? Time.Default,
    }
    if (source.sub && Object.keys(source.sub).length) {
      Object.entries(source.sub).forEach(([subId, subSource], i) => {
        if (i === 0) {
          _.push([
            id,
            {
              redirect: `${id}-${subId}`,
              ...parent,
              ...subSource,
            },
          ] as [any, Source])
        }
        _.push([`${id}-${subId}`, { ...parent, ...subSource }] as [
          any,
          Source,
        ])
      })
    } else {
      _.push([
        id,
        {
          title: source.title,
          ...parent,
        },
      ])
    }
  })

  return typeSafeObjectFromEntries(
    _.filter(([_, v]) => {
      if (v.disable === "cf" && process.env.CF_PAGES) {
        return false
      } else {
        return v.disable !== true
      }
    }),
  )
}
