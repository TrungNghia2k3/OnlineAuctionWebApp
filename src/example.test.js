// Simple example test to get you started
import { render, screen } from '@testing-library/react'

// Mock a simple component for testing
const TestComponent = () => {
  return <h1>Hello World</h1>
}

describe('Example Test', () => {
  test('renders hello world', () => {
    render(<TestComponent />)
    const heading = screen.getByText(/hello world/i)
    expect(heading).toBeInTheDocument()
  })

  test('basic math works', () => {
    expect(2 + 2).toBe(4)
  })
})
