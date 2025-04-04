import { render, screen } from '@testing-library/react';
import Home from '../../pages/index';
import fetchData from '../../lib/fetchData';

jest.mock('../../lib/fetchData');
const mockFetchData = fetchData as jest.MockedFunction<typeof fetchData>;

describe('Home Page', () => {
    const mockData = {
        summary: {
            totalProposals: 10,
            activeVotes: 5,
            monthlyDownloads: 50000
        }
    };

    beforeEach(() => {
        mockFetchData.mockClear();
    });

    it('renders the welcome message', async () => {
        // Arrange
        const { getStaticProps } = require('../../pages/index');
        mockFetchData.mockResolvedValueOnce(mockData);

        // Act
        const { props } = await getStaticProps();
        render(<Home {...props} />);

        // Assert
        expect(screen.getByText('Hello from Mesh Governance')).toBeInTheDocument();
    });

    it('renders placeholder components', async () => {
        // Arrange
        const { getStaticProps } = require('../../pages/index');
        mockFetchData.mockResolvedValueOnce(mockData);

        // Act
        const { props } = await getStaticProps();
        render(<Home {...props} />);

        // Assert
        expect(screen.getByText('Chart goes here')).toBeInTheDocument();
        expect(screen.getByText('Table goes here')).toBeInTheDocument();
    });

    it('renders the data section', async () => {
        // Arrange
        const { getStaticProps } = require('../../pages/index');
        mockFetchData.mockResolvedValueOnce(mockData);

        // Act
        const { props } = await getStaticProps();
        render(<Home {...props} />);

        // Assert
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
        expect(screen.getByText('Latest Data')).toBeInTheDocument();
        // Check if the JSON data is rendered
        expect(screen.getByText((content) => {
            return content.includes('"totalProposals": 10') &&
                content.includes('"activeVotes": 5') &&
                content.includes('"monthlyDownloads": 50000');
        })).toBeInTheDocument();
    });
}); 