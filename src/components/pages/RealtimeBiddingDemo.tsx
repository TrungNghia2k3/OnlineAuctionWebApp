/**
 * Real-time Bidding Demo Page
 * Demonstrates the complete real-time bidding implementation
 */

import React, { useState } from 'react'
import RealtimeBidding from '@/components/organisms/RealtimeBidding'
import BidForm from '@/components/molecules/BidForm'
import BidHistory from '@/components/molecules/BidHistory'
import ConnectionStatus from '@/components/atoms/ConnectionStatus'
import { useBidding } from '@/hooks/useBidding'
import PageLayout from '@/components/templates/PageLayout'

/**
 * Demo page showcasing real-time bidding components
 */
const RealtimeBiddingDemo: React.FC = () => {
  const [selectedItemId, setSelectedItemId] = useState<string>('demo-item-1')
  
  // Sample auction items for demo
  const demoItems = [
    {
      id: 'demo-item-1',
      title: 'Vintage Rolex Watch',
      currentPrice: 2500,
      totalBids: 12,
      bidIncrement: 50,
      isActive: true
    },
    {
      id: 'demo-item-2', 
      title: 'Classic Ferrari Model',
      currentPrice: 850,
      totalBids: 8,
      bidIncrement: 25,
      isActive: true
    },
    {
      id: 'demo-item-3',
      title: 'Art Deco Sculpture',
      currentPrice: 1200,
      totalBids: 15,
      bidIncrement: 30,
      isActive: false
    }
  ]

  const selectedItem = demoItems.find(item => item.id === selectedItemId) || demoItems[0]

  // Demonstration of individual component usage
  const ComponentDemo: React.FC = () => {
    const {
      currentPrice,
      bidHistory,
      isConnected,
      isLoading,
      error,
      bidSubmission,
      placeBid,
      canBid,
      retry
    } = useBidding({ itemId: selectedItemId, autoConnect: true })

    const handleBidSubmit = async (amount: number) => {
      await placeBid(amount)
    }

    return (
      <div className="component-demo">
        <h3>Individual Components Demo</h3>
        
        {/* Connection Status Demo */}
        <div className="mb-4">
          <h5>Connection Status Component</h5>
          <ConnectionStatus
            isConnected={isConnected}
            isLoading={isLoading}
            error={error}
            onRetry={retry}
          />
        </div>

        {/* Bid Form Demo */}
        <div className="mb-4">
          <h5>Bid Form Component</h5>
          <div className="card">
            <div className="card-body">
              <BidForm
                currentPrice={currentPrice || selectedItem.currentPrice}
                minBidIncrement={selectedItem.bidIncrement}
                isSubmitting={bidSubmission.isSubmitting}
                canBid={canBid || false}
                onSubmit={handleBidSubmit}
                error={bidSubmission.error}
                success={bidSubmission.success}
              />
            </div>
          </div>
        </div>

        {/* Bid History Demo */}
        <div className="mb-4">
          <h5>Bid History Component</h5>
          <div className="card">
            <div className="card-body">
              <BidHistory
                bidHistory={bidHistory}
                currentUserId="demo-user"
                isLoading={isLoading && bidHistory.length === 0}
                maxItems={5}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <PageLayout>
      <div className="container my-5">
        <div className="row">
          <div className="col-12">
            {/* Page Header */}
            <div className="text-center mb-5">
              <h1 className="display-4">Real-time Bidding Demo</h1>
              <p className="lead text-muted">
                Experience live auction bidding with WebSocket integration
              </p>
              <div className="alert alert-info" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                This demo showcases the real-time bidding system. 
                Connect multiple browser tabs to see live updates in action!
              </div>
            </div>

            {/* Item Selector */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-collection me-2"></i>
                  Select Auction Item
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {demoItems.map(item => (
                    <div key={item.id} className="col-md-4 mb-3">
                      <div 
                        className={`card cursor-pointer ${selectedItemId === item.id ? 'border-primary' : ''}`}
                        onClick={() => setSelectedItemId(item.id)}
                      >
                        <div className="card-body text-center">
                          <h6 className="card-title">{item.title}</h6>
                          <p className="card-text">
                            <strong>€{item.currentPrice.toLocaleString()}</strong>
                            <br />
                            <small className="text-muted">{item.totalBids} bids</small>
                          </p>
                          <span className={`badge ${item.isActive ? 'bg-success' : 'bg-secondary'}`}>
                            {item.isActive ? 'Active' : 'Ended'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Demo Sections */}
            <div className="row">
              {/* Complete Component Demo */}
              <div className="col-lg-8">
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="bi bi-hammer me-2"></i>
                      Complete Real-time Bidding Interface
                    </h5>
                  </div>
                  <div className="card-body">
                    <RealtimeBidding
                      itemId={selectedItem.id}
                      initialPrice={selectedItem.currentPrice}
                      initialTotalBids={selectedItem.totalBids}
                      minBidIncrement={selectedItem.bidIncrement}
                      isAuctionActive={selectedItem.isActive}
                      currentUserId="demo-user"
                      showHistory={true}
                      showConnectionStatus={true}
                    />
                  </div>
                </div>
              </div>

              {/* Item Details */}
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">
                      <i className="bi bi-info-circle me-2"></i>
                      Item Details
                    </h6>
                  </div>
                  <div className="card-body">
                    <h6>{selectedItem.title}</h6>
                    <div className="mb-2">
                      <strong>Starting Price:</strong> €{selectedItem.currentPrice.toLocaleString()}
                    </div>
                    <div className="mb-2">
                      <strong>Bid Increment:</strong> €{selectedItem.bidIncrement}
                    </div>
                    <div className="mb-2">
                      <strong>Total Bids:</strong> {selectedItem.totalBids}
                    </div>
                    <div className="mb-3">
                      <strong>Status:</strong>{' '}
                      <span className={`badge ${selectedItem.isActive ? 'bg-success' : 'bg-secondary'}`}>
                        {selectedItem.isActive ? 'Active' : 'Ended'}
                      </span>
                    </div>
                    
                    <hr />
                    
                    <h6>Demo Features</h6>
                    <ul className="list-unstyled">
                      <li><i className="bi bi-check text-success me-2"></i>Real-time bid updates</li>
                      <li><i className="bi bi-check text-success me-2"></i>Live connection status</li>
                      <li><i className="bi bi-check text-success me-2"></i>Automatic reconnection</li>
                      <li><i className="bi bi-check text-success me-2"></i>Bid validation</li>
                      <li><i className="bi bi-check text-success me-2"></i>History tracking</li>
                      <li><i className="bi bi-check text-success me-2"></i>Error handling</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Components Demo */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="bi bi-puzzle me-2"></i>
                      Individual Components Showcase
                    </h5>
                  </div>
                  <div className="card-body">
                    <ComponentDemo />
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Information */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="bi bi-gear me-2"></i>
                      Technical Information
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <h6>WebSocket Configuration</h6>
                        <ul>
                          <li><strong>Endpoint:</strong> ws://localhost:8080/ws</li>
                          <li><strong>Protocol:</strong> STOMP over WebSocket</li>
                          <li><strong>Authentication:</strong> JWT Bearer Token</li>
                          <li><strong>Heartbeat:</strong> 4000ms</li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h6>Message Topics</h6>
                        <ul>
                          <li><strong>Bid Updates:</strong> /topic/items/{'{itemId}'}/bids</li>
                          <li><strong>Confirmations:</strong> /user/queue/bid/confirmation</li>
                          <li><strong>Place Bid:</strong> /app/items/{'{itemId}'}/bids</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h6>Features Demonstrated</h6>
                      <div className="row">
                        <div className="col-md-4">
                          <ul>
                            <li>Real-time bidding</li>
                            <li>Live price updates</li>
                            <li>Connection monitoring</li>
                          </ul>
                        </div>
                        <div className="col-md-4">
                          <ul>
                            <li>Bid history tracking</li>
                            <li>Form validation</li>
                            <li>Error handling</li>
                          </ul>
                        </div>
                        <div className="col-md-4">
                          <ul>
                            <li>Auto-reconnection</li>
                            <li>TypeScript integration</li>
                            <li>Responsive design</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default RealtimeBiddingDemo
