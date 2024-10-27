import React, { useState } from 'react'
import { getSmartFeedback } from '@/actions/analytics'
import useSession from '@/app/hooks/useSession'

const AnalyticsView = () => {
  const { session } = useSession();
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const userId = session?.user?.id;

  const handleGenerateLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const feedbackData = await getSmartFeedback(userId)
      setFeedback(feedbackData)
    } catch (err) {
      setError("Failed to generate AI logs")
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4">Analytics View</h1>
      <button
        onClick={handleGenerateLogs}
        className="bg-white text-purple-700 font-semibold py-2 px-4 rounded-md shadow-md hover:bg-purple-100 transition duration-300"
      >
        Generate AI Logs
      </button>
      {loading && <p className="mt-4 text-lg">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {feedback && (
        <pre className="max-h-[70vh] overflow-y-auto mt-4 bg-white text-gray-800 p-4 rounded-md shadow-inner overflow-auto break-words whitespace-break-spaces">
          {feedback}
        </pre>
      )}
    </div>
  )
}

export default AnalyticsView
