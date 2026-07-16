import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../../lib/axios"

export const usePlantIdentify = () => {
  const [identifying, setIdentifying] = useState(false)
  const [identifyResult, setIdentifyResult] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const identifyPlant = async (upload_id) => {
    try {
      setIdentifying(true)
      setError(null)
      const response = await api.post(
        "/api/plant-identify",
        { upload_id }
      )
      setIdentifyResult(response.data)
      navigate(`/plant-result/${upload_id}`)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Plant identification failed. Try again."
      )
    } finally {
      setIdentifying(false)
    }
  }

  return {
    identifyPlant,
    identifying,
    identifyResult,
    error
  }
}
