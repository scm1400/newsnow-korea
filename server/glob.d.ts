/* eslint-disable */

declare module 'glob:./sources/{*.ts,**/index.ts}' {
  export const chosun: typeof import('./sources/chosun')
  export const clien: typeof import('./sources/clien')
  export const daum: typeof import('./sources/daum')
  export const dcinside: typeof import('./sources/dcinside')
  export const donga: typeof import('./sources/donga')
  export const github: typeof import('./sources/github')
  export const hackernews: typeof import('./sources/hackernews')
  export const hani: typeof import('./sources/hani')
  export const joongang: typeof import('./sources/joongang')
  export const jtbc: typeof import('./sources/jtbc')
  export const kbs: typeof import('./sources/kbs')
  export const khan: typeof import('./sources/khan')
  export const mbc: typeof import('./sources/mbc')
  export const naver: typeof import('./sources/naver')
  // export const ppomppu: typeof import('./sources/ppomppu')
  export const ruliweb: typeof import('./sources/ruliweb')
  export const sbs: typeof import('./sources/sbs')
  export const steam: typeof import('./sources/steam')
  export const yonhap: typeof import('./sources/yonhap')
}
