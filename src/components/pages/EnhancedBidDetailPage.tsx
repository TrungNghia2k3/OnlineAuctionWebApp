/**
 * Enhanced Bid Detail Page with Real-time Bidding
 * Example integration of the RealtimeBidding component
 */

import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@/hooks'
import RealtimeBidding from '@/components/organisms/RealtimeBidding'
import PageLayout from '@/components/templates/PageLayout'
import { API_URL } from '@/common'

interface AuctionItem {
  id: string | number
  title: string
  description: string
  currentPrice: number
  totalBids: number
  bidIncrement: number
  endTime: string
  status: string
  images: Array<{ imageUrl: string }>
  seller: { username: string }
  category: { name: string }
  condition: string
  startingPrice: number
  reservePrice?: number
  isActive: () => boolean
  getFormattedCurrentBid: () => string
  getReadableTimeLeft: () => string
}

/**
 * Enhanced Bid Detail Page with real-time functionality
 */
const EnhancedBidDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { currentUser } = useAuth()
  const [item, setItem] = useState<AuctionItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch auction item details
   */
  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!id) return

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_URL}/items/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch auction details')
        }

        const data = await response.json()
        setItem(data)
      } catch (err) {
        console.error('Error fetching auction details:', err)
        setError(err instanceof Error ? err.message : 'Failed to load auction details')
      } finally {
        setLoading(false)
      }
    }

    fetchItemDetails()
  }, [id])

  // Loading state
  if (loading) {
    return (
      <PageLayout>
        <div className="container my-5">
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading auction details...</span>
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <PageLayout>
        <div className="container my-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Auction</h4>
            <p>{error}</p>
            <hr />
            <button 
              className="btn btn-outline-danger" 
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      </PageLayout>
    )
  }

  // Item not found
  if (!item) {
    return (
      <PageLayout>
        <div className="container my-5">
          <div className="alert alert-warning" role="alert">
            <h4 className="alert-heading">Auction Not Found</h4>
            <p>The auction item you're looking for could not be found.</p>
            <hr />
            <button 
              className="btn btn-outline-warning" 
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      </PageLayout>
    )
  }

  const isAuctionActive = item.status === 'ACTIVE' && new Date(item.endTime) > new Date()

  return (
    <PageLayout>
      <div className="container my-4">
        <div className="row">
          {/* Left Column - Item Images */}
          <div className="col-lg-6 col-md-6">
            <div className="bid-detail__images">
              {/* Main Image */}
              <div className="bid-detail__main-image mb-3">
                <img
                  src={item.images[0]?.imageUrl || '/images/placeholder-item.jpg'}
                  alt={item.title}
                  className="img-fluid rounded"
                  style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder-item.jpg'
                  }}
                />
              </div>

              {/* Thumbnail Images */}
              {item.images.length > 1 && (
                <div className="bid-detail__thumbnails">
                  <div className="row">
                    {item.images.slice(0, 4).map((image, index) => (
                      <div key={index} className="col-3 mb-2">
                        <img
                          src={image.imageUrl}
                          alt={`${item.title} - View ${index + 1}`}
                          className="img-fluid rounded cursor-pointer"
                          style={{ height: '80px', objectFit: 'cover', width: '100%' }}
                          onClick={() => {
                            const mainImg = document.querySelector('.bid-detail__main-image img') as HTMLImageElement
                            if (mainImg) mainImg.src = image.imageUrl
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Item Details and Real-time Bidding */}
          <div className="col-lg-6 col-md-6">
            <div className="bid-detail__info">
              {/* Title and Category */}
              <div className="bid-detail__header mb-4">
                <h1 className="bid-detail__title">{item.title}</h1>
                <span className="bid-detail__category badge bg-secondary">
                  {item.category?.name}
                </span>
              </div>

              {/* Real-time Bidding Component */}
              <RealtimeBidding
                itemId={item.id}
                initialPrice={item.currentPrice}
                initialTotalBids={item.totalBids}
                minBidIncrement={item.bidIncrement}
                isAuctionActive={isAuctionActive}
                currentUserId={(currentUser as any)?.username}
                showHistory={true}
                showConnectionStatus={true}
                className="mb-4"
              />

              {/* Additional Item Details */}
              <div className="bid-detail__details">
                <h3>Item Details</h3>
                <div className="bid-detail__details-grid">
                  <div className="detail-item">
                    <strong>Seller:</strong>
                    <span>{item.seller.username}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Status:</strong>
                    <span className={`badge ${item.status === 'ACTIVE' ? 'bg-success' : 'bg-warning'}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <strong>Starting Price:</strong>
                    <span>€{item.startingPrice.toLocaleString()}</span>
                  </div>
                  {item.reservePrice && (
                    <div className="detail-item">
                      <strong>Reserve Price:</strong>
                      <span>€{item.reservePrice.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <strong>Condition:</strong>
                    <span>{item.condition}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Auction Ends:</strong>
                    <span>{new Date(item.endTime).toLocaleString()}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-4">
                  <h4>Description</h4>
                  <p className="text-muted">{item.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default EnhancedBidDetailPage
