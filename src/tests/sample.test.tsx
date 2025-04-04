import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Simple test component
const Greeting = ({ name }: { name: string }) => {
    return <h1>Hello, {name}!</h1>
}

describe('Greeting component', () => {
    it('renders a greeting', () => {
        render(<Greeting name="Mesh Governance" />)

        const heading = screen.getByRole('heading', {
            name: /hello, mesh governance!/i,
        })

        expect(heading).toBeInTheDocument()
    })
}) 