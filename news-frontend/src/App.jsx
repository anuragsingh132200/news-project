

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"

function App() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:5000/news/raw")
        console.log(response)
        if (!response.ok) {
          throw new Error("Failed to fetch news")
        }
        const data = await response.json()
        if (data.success) {
          setNews(data.news)
        } else {
          throw new Error("API response indicates failure")
        }
      } catch (err) {
        setError("Failed to load news. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Latest News</h1>
      {news.map((item, index) => (
        <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <img
            src={item["Please also Upload an Image about it"] || "https://via.placeholder.com/800x400"}
            alt={item["News Title"]}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-2">{item["News Title"]}</h2>
            <p className="text-gray-600 mb-4">
              {formatDistanceToNow(new Date(item.Timestamp), { addSuffix: true })} in {item.City}
            </p>
            <p className="text-gray-700 mb-4">{item["News Description"]}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Category: {item["Topic/Category"]}</span>
              <span>Published by: {item["Publishers First Name"]}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App

