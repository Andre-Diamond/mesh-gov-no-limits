import { render, screen } from '@testing-library/react';
import CatalystProposalsList from '../../components/CatalystProposalsList';

describe('CatalystProposalsList', () => {
    const mockData = {
        timestamp: "2025-04-03T10:18:35.123Z",
        projects: [
            {
                projectDetails: {
                    id: 1,
                    title: "Test Project",
                    budget: 150000,
                    milestones_qty: 4,
                    funds_distributed: 75000,
                    project_id: 101,
                    category: "DApps",
                    status: "In Progress",
                    finished: "false"
                },
                milestonesCompleted: 2
            },
            {
                projectDetails: {
                    id: 2,
                    title: "Large Budget Project",
                    budget: 2018429,
                    milestones_qty: 3,
                    funds_distributed: 1009214,
                    project_id: 102,
                    category: "Development",
                    status: "Active",
                    finished: "false"
                },
                milestonesCompleted: 1
            }
        ]
    };

    it('renders the table headers correctly', () => {
        render(<CatalystProposalsList data={mockData} />);

        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Budget (ADA)')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Progress')).toBeInTheDocument();
        expect(screen.getByText('Category')).toBeInTheDocument();
        expect(screen.getByText('Funds Distributed (ADA)')).toBeInTheDocument();
    });

    it('formats ADA amounts correctly with symbol and commas', () => {
        render(<CatalystProposalsList data={mockData} />);

        // Check budget formatting
        expect(screen.getByText('₳150,000')).toBeInTheDocument();
        expect(screen.getByText('₳2,018,429')).toBeInTheDocument();

        // Check funds distributed formatting
        expect(screen.getByText('₳75,000')).toBeInTheDocument();
        expect(screen.getByText('₳1,009,214')).toBeInTheDocument();
    });

    it('calculates and displays progress percentage correctly', () => {
        render(<CatalystProposalsList data={mockData} />);

        // First project: 2/4 milestones = 50%
        expect(screen.getByText('50%')).toBeInTheDocument();
        // Second project: 1/3 milestones ≈ 33%
        expect(screen.getByText('33%')).toBeInTheDocument();
    });

    it('displays project details correctly', () => {
        render(<CatalystProposalsList data={mockData} />);

        expect(screen.getByText('Test Project')).toBeInTheDocument();
        expect(screen.getByText('Large Budget Project')).toBeInTheDocument();
        expect(screen.getByText('DApps')).toBeInTheDocument();
        expect(screen.getByText('Development')).toBeInTheDocument();
        expect(screen.getByText('In Progress')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('formats the timestamp correctly in UTC', () => {
        render(<CatalystProposalsList data={mockData} />);

        const timestamp = screen.getByText(/Last updated:/);
        expect(timestamp).toBeInTheDocument();
        expect(timestamp.textContent).toMatch(/04\/03\/2025, 10:18 AM UTC/);
    });

    it('handles empty projects array', () => {
        const emptyData = {
            timestamp: "2025-04-03T10:18:35.123Z",
            projects: []
        };

        render(<CatalystProposalsList data={emptyData} />);

        // Headers should still be present
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Budget (ADA)')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Progress')).toBeInTheDocument();
        expect(screen.getByText('Category')).toBeInTheDocument();
        expect(screen.getByText('Funds Distributed (ADA)')).toBeInTheDocument();

        // Table should be empty but present
        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();
        expect(table.getElementsByTagName('tbody')[0].children.length).toBe(0);
    });

    it('handles projects with zero milestones correctly', () => {
        const dataWithZeroMilestones = {
            timestamp: "2025-04-03T10:18:35.123Z",
            projects: [{
                projectDetails: {
                    id: 3,
                    title: "Zero Milestone Project",
                    budget: 100000,
                    milestones_qty: 0,
                    funds_distributed: 0,
                    project_id: 103,
                    category: "Testing",
                    status: "New",
                    finished: "false"
                },
                milestonesCompleted: 0
            }]
        };

        render(<CatalystProposalsList data={dataWithZeroMilestones} />);
        expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('handles projects with completed milestones equal to total milestones', () => {
        const dataWithCompletedProject = {
            timestamp: "2025-04-03T10:18:35.123Z",
            projects: [{
                projectDetails: {
                    id: 4,
                    title: "Completed Project",
                    budget: 100000,
                    milestones_qty: 5,
                    funds_distributed: 100000,
                    project_id: 104,
                    category: "Testing",
                    status: "Completed",
                    finished: "true"
                },
                milestonesCompleted: 5
            }]
        };

        render(<CatalystProposalsList data={dataWithCompletedProject} />);
        expect(screen.getByText('100%')).toBeInTheDocument();
    });
}); 