import { render, screen, within } from '@testing-library/react';
import CatalystProposals from '../../pages/catalyst-proposals';
import fetchData from '../../lib/fetchData';

// Mock the fetchData utility
jest.mock('../../lib/fetchData');
const mockFetchData = fetchData as jest.MockedFunction<typeof fetchData>;

describe('CatalystProposals Page', () => {
    const mockData = {
        timestamp: "2025-04-03T09:57:53.190Z",
        projects: [
            {
                projectDetails: {
                    id: 173,
                    title: "MeshJS SDK Operations",
                    budget: 169413,
                    milestones_qty: 5,
                    funds_distributed: 135528,
                    project_id: 1000107,
                    category: "F10: OSDE: Open Source Dev Ecosystem",
                    status: "In Progress",
                    finished: "September, 2024"
                },
                milestonesCompleted: 4
            },
            {
                projectDetails: {
                    id: 529,
                    title: "Sustain & Maintain MeshJS",
                    budget: 150000,
                    milestones_qty: 5,
                    funds_distributed: 150000,
                    project_id: 1100271,
                    category: "F11: Cardano Open: Developers",
                    status: "Completed",
                    finished: "September 15, 2024"
                },
                milestonesCompleted: 5
            }
        ]
    };

    beforeEach(() => {
        mockFetchData.mockClear();
    });

    it('renders page title and description', async () => {
        const { getStaticProps } = require('../../pages/catalyst-proposals');
        mockFetchData.mockResolvedValueOnce(mockData);

        const { props } = await getStaticProps();
        render(<CatalystProposals {...props} />);

        expect(screen.getByText('Catalyst Proposals')).toBeInTheDocument();
        expect(screen.getByText('View and analyze Catalyst proposals here.')).toBeInTheDocument();
    });

    it('renders statistics section with correct calculations', async () => {
        const { getStaticProps } = require('../../pages/catalyst-proposals');
        mockFetchData.mockResolvedValueOnce(mockData);

        const { props } = await getStaticProps();
        render(<CatalystProposals {...props} />);

        // Find stats container and check values within it
        const statsSection = screen.getByRole('region', { name: /statistics/i }) || screen.getByLabelText('statistics');
        expect(within(statsSection).getByText('2')).toBeInTheDocument(); // Total Projects
        expect(within(statsSection).getByText('₳319,413')).toBeInTheDocument(); // Total Budget
        expect(within(statsSection).getByText('1')).toBeInTheDocument(); // Completed Projects
    });

    it('renders proposals table with correct data', async () => {
        const { getStaticProps } = require('../../pages/catalyst-proposals');
        mockFetchData.mockResolvedValueOnce(mockData);

        const { props } = await getStaticProps();
        render(<CatalystProposals {...props} />);

        // Check headers
        expect(screen.getByRole('columnheader', { name: 'Title' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Budget (ADA)' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Progress' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Category' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Funds Distributed (ADA)' })).toBeInTheDocument();

        // Check project data
        expect(screen.getByText('MeshJS SDK Operations')).toBeInTheDocument();
        expect(screen.getByText('₳169,413')).toBeInTheDocument();
        expect(screen.getByText('In Progress')).toBeInTheDocument();
        expect(screen.getByText('80%')).toBeInTheDocument();
        expect(screen.getByText('F10: OSDE: Open Source Dev Ecosystem')).toBeInTheDocument();
        expect(screen.getByText('₳135,528')).toBeInTheDocument();

        // Check timestamp
        expect(screen.getByText((content) => content.startsWith('Last updated:'))).toBeInTheDocument();
    });

    it('handles empty projects array', async () => {
        const { getStaticProps } = require('../../pages/catalyst-proposals');
        const emptyData = {
            timestamp: "2025-04-03T09:57:53.190Z",
            projects: []
        };
        mockFetchData.mockResolvedValueOnce(emptyData);

        const { props } = await getStaticProps();
        render(<CatalystProposals {...props} />);

        // Find stats container and check values within it
        const statsSection = screen.getByRole('region', { name: /statistics/i }) || screen.getByLabelText('statistics');
        const totalProjects = within(statsSection).getByLabelText('Total Projects');
        const totalBudget = within(statsSection).getByLabelText('Total Budget');
        const completedProjects = within(statsSection).getByLabelText('Completed Projects');

        expect(within(totalProjects).getByText('0')).toBeInTheDocument();
        expect(within(totalBudget).getByText('₳0')).toBeInTheDocument();
        expect(within(completedProjects).getByText('0')).toBeInTheDocument();

        // Headers should still be present
        expect(screen.getByRole('columnheader', { name: 'Title' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Budget (ADA)' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Progress' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Category' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Funds Distributed (ADA)' })).toBeInTheDocument();

        // Timestamp should still be present
        expect(screen.getByText((content) => content.startsWith('Last updated:'))).toBeInTheDocument();
    });

    it('handles fetch error gracefully', async () => {
        const { getStaticProps } = require('../../pages/catalyst-proposals');
        mockFetchData.mockRejectedValueOnce(new Error('Failed to fetch'));

        const { props, revalidate } = await getStaticProps();

        expect(props.data.projects).toEqual([]);
        expect(revalidate).toBe(3600); // 1 hour in seconds

        render(<CatalystProposals {...props} />);

        // Find stats container and check values within it
        const statsSection = screen.getByRole('region', { name: /statistics/i }) || screen.getByLabelText('statistics');
        const totalProjects = within(statsSection).getByLabelText('Total Projects');
        const totalBudget = within(statsSection).getByLabelText('Total Budget');

        expect(within(totalProjects).getByText('0')).toBeInTheDocument();
        expect(within(totalBudget).getByText('₳0')).toBeInTheDocument();
    });
});