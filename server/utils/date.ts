import dayjs from "dayjs/esm"
import utcPlugin from "dayjs/esm/plugin/utc"
import timezonePlugin from "dayjs/esm/plugin/timezone"
import customParseFormat from "dayjs/esm/plugin/customParseFormat"
import duration from "dayjs/esm/plugin/duration"
import isSameOrBefore from "dayjs/esm/plugin/isSameOrBefore"
import weekday from "dayjs/esm/plugin/weekday"

dayjs.extend(utcPlugin)
dayjs.extend(timezonePlugin)
dayjs.extend(customParseFormat)
dayjs.extend(duration)
dayjs.extend(isSameOrBefore)
dayjs.extend(weekday)

/**
 * 특정 타임존의 시간을 UTC 기준으로 변환
 */
export function tranformToUTC(date: string, format?: string, timezone: string = "Asia/Shanghai"): number {
  if (!format) return dayjs.tz(date, timezone).valueOf()
  return dayjs.tz(date, format, timezone).valueOf()
}

// cloudflare 환경에서 dayjs() 결과가 0이 되는 문제가 있어 top 레벨 호출을 피함
function words() {
  return [
    {
      startAt: dayjs(),
      regExp: /^(?:오늘|to?day?)(.*)/,
    },
    {
      startAt: dayjs().subtract(1, "days"),
      regExp: /^(?:어제|y(?:ester)?day?)(.*)/,
    },
    {
      startAt: dayjs().subtract(2, "days"),
      regExp: /^(?:그제|그저께|(?:the)?d(?:ay)?b(?:eforeyesterda)?y)(.*)/,
    },
    {
      startAt: dayjs().isSameOrBefore(dayjs().weekday(1)) ? dayjs().weekday(1).subtract(1, "week") : dayjs().weekday(1),
      regExp: /^(?:월(?:요일)?|mon(?:day)?)(.*)/,
    },
    {
      startAt: dayjs().isSameOrBefore(dayjs().weekday(2)) ? dayjs().weekday(2).subtract(1, "week") : dayjs().weekday(2),
      regExp: /^(?:화(?:요일)?|tue(?:sday)?)(.*)/,
    },
    {
      startAt: dayjs().isSameOrBefore(dayjs().weekday(3)) ? dayjs().weekday(3).subtract(1, "week") : dayjs().weekday(3),
      regExp: /^(?:수(?:요일)?|wed(?:nesday)?)(.*)/,
    },
    {
      startAt: dayjs().isSameOrBefore(dayjs().weekday(4)) ? dayjs().weekday(4).subtract(1, "week") : dayjs().weekday(4),
      regExp: /^(?:목(?:요일)?|thu(?:rsday)?)(.*)/,
    },
    {
      startAt: dayjs().isSameOrBefore(dayjs().weekday(5)) ? dayjs().weekday(5).subtract(1, "week") : dayjs().weekday(5),
      regExp: /^(?:금(?:요일)?|fri(?:day)?)(.*)/,
    },
    {
      startAt: dayjs().isSameOrBefore(dayjs().weekday(6)) ? dayjs().weekday(6).subtract(1, "week") : dayjs().weekday(6),
      regExp: /^(?:토(?:요일)?|sat(?:urday)?)(.*)/,
    },
    {
      startAt: dayjs().isSameOrBefore(dayjs().weekday(7)) ? dayjs().weekday(7).subtract(1, "week") : dayjs().weekday(7),
      regExp: /^(?:일(?:요일)?|sun(?:day)?)(.*)/,
    },
    {
      startAt: dayjs().add(1, "days"),
      regExp: /^(?:내일|tom(?:orrow)?)(.*)/,
    },
    {
      startAt: dayjs().add(2, "days"),
      regExp: /^(?:모레|글피|(?:the)?d(?:ay)?a(?:fter)?t(?:omrrow)?)(.*)/,
    },
  ]
}

const patterns = [
  {
    unit: "years",
    regExp: /(\d+)(?:년|y(?:ea)?rs?)/,
  },
  {
    unit: "months",
    regExp: /(\d+)(?:개월|달|months?)/,
  },
  {
    unit: "weeks",
    regExp: /(\d+)(?:주일?|weeks?)/,
  },
  {
    unit: "days",
    regExp: /(\d+)(?:일|d(?:ay)?s?)/,
  },
  {
    unit: "hours",
    regExp: /(\d+)(?:(?:시간|시)|h(?:(?:ou)?r)?s?)/,
  },
  {
    unit: "minutes",
    regExp: /(\d+)(?:분|m(?:in(?:ute)?)?s?)/,
  },
  {
    unit: "seconds",
    regExp: /(\d+)(?:초|s(?:ec(?:ond)?)?s?)/,
  },
]

const patternSize = Object.keys(patterns).length

/**
 * 날짜 문자열 전처리
 * @param {string} date 원본 날짜 문자열
 */
function toDate(date: string) {
  return date
    .toLowerCase()
    .replace(/(^an?\s)|(\san?\s)/g, "1") // `a`, `an`을 `1`로 치환
    .replace(/몇/g, "3") // `몇 초 전`을 `3초 전`으로 간주
    .replace(/[\s,]/g, "")
} // 모든 공백 제거

/**
 * `['\d+시간', ..., '\d+초']`를 `{ hours: \d+, ..., seconds: \d+ }` 형태로 변환
 * 시간 길이를 나타낼 때 사용
 * @param {Array.<string>} matches 모든 매칭 결과
 */
function toDurations(matches: string[]) {
  const durations: Record<string, string> = {}

  let p = 0
  for (const m of matches) {
    for (; p <= patternSize; p++) {
      const match = patterns[p].regExp.exec(m)
      if (match) {
        durations[patterns[p].unit] = match[1]
        break
      }
    }
  }
  return durations
}

export const parseDate = (date: string | number, ...options: any) => dayjs(date, ...options).toDate()

export function parseRelativeDate(date: string, timezone: string = "UTC") {
  if (date === "방금") return new Date()
  // 날짜 문자열 전처리

  const theDate = toDate(date)

  // `\d+년\d+월...\d+초전`을 `['\d+년', ..., '\d+초전']` 형태로 분리

  const matches = theDate.match(/\D*\d+(?![:\-/]|(a|p)m)\D+/g)
  const offset = dayjs.duration({ hours: (dayjs().tz(timezone).utcOffset() - dayjs().utcOffset()) / 60 })

  if (matches) {
    // 마지막 시간 단위를 가져옴. 예) `\d+초전`

    const lastMatch = matches.pop()

    if (lastMatch) {
      // 마지막 시간 단위에 `전` 표시가 있으면 해당 시간만큼 차감
      // 예) `1분10초전`

      const beforeMatches = /(.*)(?:전|ago)$/.exec(lastMatch)
      if (beforeMatches) {
        matches.push(beforeMatches[1])
        // duration 플러그인이 subtract를 재정의하며 weeks 처리를 누락하는 버그가 있어 기본 subtract 사용
        return dayjs().subtract(dayjs.duration(toDurations(matches))).toDate()
      }

      // 마지막 시간 단위에 `후` 표시가 있으면 해당 시간만큼 추가
      // 예) `1분10초후`

      const afterMatches = /(?:^in(.*)|(.*)(?:후))$/.exec(lastMatch)
      if (afterMatches) {
        matches.push(afterMatches[1] ?? afterMatches[2])
        return dayjs()
          .add(dayjs.duration(toDurations(matches)))
          .toDate()
      }

      // 날짜 문자열에 특수 단어가 포함된 경우 처리
      // 예) `오늘1시10분`

      matches.push(lastMatch)
    }
    const firstMatch = matches.shift()

    if (firstMatch) {
      for (const w of words()) {
        const wordMatches = w.regExp.exec(firstMatch)
        if (wordMatches) {
          matches.unshift(wordMatches[1])

          // 특수 단어에 해당하는 날짜의 0시를 기준으로 시간 길이를 더함

          return dayjs.tz(w.startAt
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .set("millisecond", 0)
            .add(dayjs.duration(toDurations(matches)))
            .add(offset), timezone)
            .toDate()
        }
      }
    }
  } else {
    // 날짜 문자열이 기존 패턴과 맞지 않으면 `특수단어 + 표준 시간 형식`으로 간주
    // 예) 오늘이 `2022-03-22`일 때 `오늘 20:00` => `2022-03-22 20:00`

    for (const w of words()) {
      const wordMatches = w.regExp.exec(theDate)
      if (wordMatches) {
        // The default parser of dayjs() can parse '8:00 pm' but not '8:00pm'
        // so we need to insert a space in between
        return dayjs.tz(`${w.startAt.add(offset).format("YYYY-MM-DD")} ${/a|pm$/.test(wordMatches[1]) ? wordMatches[1].replace(/a|pm/, " $&") : wordMatches[1]}`, timezone).toDate()
      }
    }
  }

  return date
}
