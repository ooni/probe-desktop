import { useCallback } from 'react'
import { useRouter } from 'next/router'

const useRunTest = () => {
  const router = useRouter()
  return useCallback((testGroupName) => {
    return () => {
      router.push(
        {
          pathname: '/dashboard/running',
          query: {
            runningTestGroupName: testGroupName
          },
        }
      )
    }
  }, [router])
}

export default useRunTest
