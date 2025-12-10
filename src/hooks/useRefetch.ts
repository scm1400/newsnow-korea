import type { SourceID } from "@shared/types"
import { useUpdateQuery } from "./query"

export function useRefetch() {
  const { enableLogin, loggedIn, login } = useLogin()
  const toaster = useToast()
  const updateQuery = useUpdateQuery()
  /**
   * force refresh
   */
  const refresh = useCallback((...sources: SourceID[]) => {
    if (enableLogin && !loggedIn) {
      toaster("로그인 후 최신 데이터를 강제로 새로고침할 수 있습니다", {
        type: "warning",
        action: {
          label: "로그인",
          onClick: login,
        },
      })
    } else {
      refetchSources.clear()
      sources.forEach(id => refetchSources.add(id))
      updateQuery(...sources)
    }
  }, [loggedIn, toaster, login, enableLogin, updateQuery])

  return {
    refresh,
    refetchSources,
  }
}
