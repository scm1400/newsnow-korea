import { describe, expect, it } from "vitest"
import MockDate from "mockdate"

describe("parseRelativeDate", () => {
  Object.assign(process.env, { TZ: "UTC" })
  const second = 1000
  const minute = 60 * second
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * day
  const date = new Date()

  const weekday = (d: number) => +new Date(date.getFullYear(), date.getMonth(), date.getDate() + d - (date.getDay() > d ? date.getDay() : date.getDay() + 7))

  // 기준 시간 고정
  MockDate.set(date)

  it("s초 전", () => {
    expect(+new Date(parseRelativeDate("10초전"))).toBe(+date - 10 * second)
  })

  it("m분 전", () => {
    expect(+new Date(parseRelativeDate("10분전"))).toBe(+date - 10 * minute)
  })

  it("m분 전(공백 포함)", () => {
    expect(+new Date(parseRelativeDate("10분 전"))).toBe(+date - 10 * minute)
  })

  it("m분 후", () => {
    expect(+new Date(parseRelativeDate("10분후"))).toBe(+date + 10 * minute)
  })

  it("a minute ago", () => {
    expect(+new Date(parseRelativeDate("a minute ago"))).toBe(+date - 1 * minute)
  })

  it("s minutes ago", () => {
    expect(+new Date(parseRelativeDate("10 minutes ago"))).toBe(+date - 10 * minute)
  })

  it("s mins ago", () => {
    expect(+new Date(parseRelativeDate("10 mins ago"))).toBe(+date - 10 * minute)
  })

  it("in s minutes", () => {
    expect(+new Date(parseRelativeDate("in 10 minutes"))).toBe(+date + 10 * minute)
  })

  it("in an hour", () => {
    expect(+new Date(parseRelativeDate("in an hour"))).toBe(+date + 1 * hour)
  })

  it("h시간 전", () => {
    expect(+new Date(parseRelativeDate("10시간전"))).toBe(+date - 10 * hour)
  })

  it("h시간 전(공백 포함)", () => {
    expect(+new Date(parseRelativeDate("10시간 전"))).toBe(+date - 10 * hour)
  })

  it("d일 전", () => {
    expect(+new Date(parseRelativeDate("10일전"))).toBe(+date - 10 * day)
  })

  it("w주 전", () => {
    expect(+new Date(parseRelativeDate("10주전"))).toBe(+date - 10 * week)
  })

  it("w주일 전", () => {
    expect(+new Date(parseRelativeDate("10주일전"))).toBe(+date - 10 * week)
  })

  it("w주 전(공백 포함)", () => {
    expect(+new Date(parseRelativeDate("10주 전"))).toBe(+date - 10 * week)
  })

  it("m달 전", () => {
    expect(+new Date(parseRelativeDate("1달전"))).toBe(+date - 1 * month)
  })

  it("m개월 전", () => {
    expect(+new Date(parseRelativeDate("1개월전"))).toBe(+date - 1 * month)
  })

  it("y년 전", () => {
    expect(+new Date(parseRelativeDate("1년전"))).toBe(+date - 1 * year)
  })

  it("y년M개월 전", () => {
    expect(+new Date(parseRelativeDate("1년1개월전"))).toBe(+date - 1 * year - 1 * month)
  })

  it("d일H시간 전", () => {
    expect(+new Date(parseRelativeDate("1일1시간전"))).toBe(+date - 1 * day - 1 * hour)
  })

  it("h시간m분s초 전", () => {
    expect(+new Date(parseRelativeDate("1시간1분1초전"))).toBe(+date - 1 * hour - 1 * minute - 1 * second)
  })

  it("dd Hh mm ss ago", () => {
    expect(+new Date(parseRelativeDate("1d 1h 1m 1s ago"))).toBe(+date - 1 * day - 1 * hour - 1 * minute - 1 * second)
  })

  it("h시간m분s초 후", () => {
    expect(+new Date(parseRelativeDate("1시간1분1초후"))).toBe(+date + 1 * hour + 1 * minute + 1 * second)
  })

  it("오늘", () => {
    expect(+new Date(parseRelativeDate("오늘"))).toBe(+date.setHours(0, 0, 0, 0))
  })

  it("today H:m", () => {
    expect(+new Date(parseRelativeDate("Today 08:00"))).toBe(+date + 8 * hour)
  })

  it("today, h:m a", () => {
    expect(+new Date(parseRelativeDate("Today, 8:00 pm"))).toBe(+date + 20 * hour)
  })

  it("tDA H:m:s", () => {
    expect(+new Date(parseRelativeDate("TDA 08:00:00"))).toBe(+date + 8 * hour)
  })

  it("오늘 H:m", () => {
    expect(+new Date(parseRelativeDate("오늘 08:00"))).toBe(+date + 8 * hour)
  })

  it("오늘H시m분", () => {
    expect(+new Date(parseRelativeDate("오늘8시0분"))).toBe(+date + 8 * hour)
  })

  it("어제H시m분s초", () => {
    expect(+new Date(parseRelativeDate("어제20시0분0초"))).toBe(+date - 4 * hour)
  })

  it("그제 H:m", () => {
    expect(+new Date(parseRelativeDate("그제 20:00"))).toBe(+date - 1 * day - 4 * hour)
  })

  it("내일 H:m", () => {
    expect(+new Date(parseRelativeDate("내일 20:00"))).toBe(+date + 1 * day + 20 * hour)
  })

  it("요일 h:m", () => {
    expect(+new Date(parseRelativeDate("월요일 8:00"))).toBe(weekday(1) + 8 * hour)
  })

  it("요일(대체) h:m", () => {
    expect(+new Date(parseRelativeDate("화요일 8:00"))).toBe(weekday(2) + 8 * hour)
  })

  it("일요일 h:m", () => {
    expect(+new Date(parseRelativeDate("일요일 8:00"))).toBe(weekday(7) + 8 * hour)
  })

  it("invalid", () => {
    expect(parseRelativeDate("RSSHub")).toBe("RSSHub")
  })
})

describe("transform Beijing time to UTC in different timezone", () => {
  const a = "2024/10/3 12:26:16"
  const b = 1727929576000
  it("in UTC", () => {
    Object.assign(process.env, { TZ: "UTC" })
    const date = tranformToUTC(a)
    expect(date).toBe(b)
  })

  it("in Beijing", () => {
    Object.assign(process.env, { TZ: "Asia/Shanghai" })
    const date = tranformToUTC(a)
    expect(date).toBe(b)
  })

  it("in New York", () => {
    Object.assign(process.env, { TZ: "America/New_York" })
    const date = tranformToUTC(a)
    expect(date).toBe(b)
  })
})
