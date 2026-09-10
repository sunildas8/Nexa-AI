import { RouterProvider } from "react-router"
import { router } from "./app.routes"
import { useAuth } from "../features/auth/hook/useAuth"
import { useEffect, useRef, useState } from "react"

const App = () => {

  const { handleGetMe } = useAuth()
  const hasBootstrapped = useRef(false)
  const [isPreloading, setIsPreloading] = useState(true)

  useEffect(() => {
    if (hasBootstrapped.current) return

    hasBootstrapped.current = true
    const minimumPreloaderTime = new Promise((resolve) => {
      setTimeout(resolve, 700)
    })

    Promise.allSettled([handleGetMe(), minimumPreloaderTime]).then(() => {
      setIsPreloading(false)
    })
  }, [handleGetMe])

  return (
    <>
      <RouterProvider router={router} />
      {isPreloading && (
        <div className="preloader" role="status" aria-label="Loading GyanAI">
          <div className="preloader-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="preloader-name">NexaAI</p>
          <p className="preloader-status">Preparing your space</p>
        </div>
      )}
    </>
  )
}

export default App