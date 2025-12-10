import { useRegisterSW } from "virtual:pwa-register/react"
import { useMount } from "react-use"
import { useToast } from "./useToast"

export function usePWA() {
  const toaster = useToast()
  const { updateServiceWorker, needRefresh: [needRefresh] } = useRegisterSW()

  useMount(async () => {
    const update = () => {
      updateServiceWorker().then(() => localStorage.setItem("updated", "1"))
    }
    await delay(1000)
    if (localStorage.getItem("updated")) {
      localStorage.removeItem("updated")
      toaster("업데이트가 완료되었습니다. 바로 사용해 보세요", {
        action: {
          label: "업데이트 확인",
          onClick: () => {
            window.open(`${Homepage}/releases/tag/v${Version}`)
          },
        },
      })
    } else if (needRefresh) {
      if (!navigator) return

      if ("connection" in navigator && !navigator.onLine) return

      const resp = await myFetch("/latest")

      if (resp.v && resp.v !== Version) {
        toaster("업데이트가 있습니다. 5초 후 자동으로 적용됩니다", {
          action: {
            label: "지금 업데이트",
            onClick: update,
          },
          onDismiss: update,
        })
      }
    }
  })
}
