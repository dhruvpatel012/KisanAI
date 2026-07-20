      import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../../lib/axios"

export const useLandAnalyze = () => {
  const [analyzing, setAnalyzing] = useState(false)
  const [landResult, setLandResult] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const analyzeLand = async (upload_id) => {
    try {
      setAnalyzing(true)
      setError(null)
      const response = await api.post(
        "/api/land-analyze",
        { upload_id }
      )
      setLandResult(response.data)
      navigate(`/land-result/${upload_id}`)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Land analysis failed. Try again."
      )
    } finally {
      setAnalyzing(false)
    }
  }

  return {
    analyzeLand,
    analyzing,
    landResult,
    error
  }
}
