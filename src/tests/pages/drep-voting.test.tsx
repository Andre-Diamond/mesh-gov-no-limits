import { render, screen, within } from '@testing-library/react';
import DRepVoting from '../../pages/drep-voting';
import fetchData from '../../lib/fetchData';

jest.mock('../../lib/fetchData');
const mockFetchData = fetchData as jest.MockedFunction<typeof fetchData>;

describe('DRepVoting Page', () => {
    const mockVotes = [
        {
            proposalId: '1',
            proposalTxHash: 'hash1',
            proposalIndex: 1,
            voteTxHash: 'vhash1',
            blockTime: '2024-03-15T10:00:00Z',
            vote: 'Yes' as const,
            metaUrl: null,
            metaHash: null,
            proposalTitle: 'Governance Proposal A',
            proposalType: 'Parameter Change',
            proposedEpoch: 123,
            expirationEpoch: 456,
            rationale: 'Strong technical foundation and clear milestones'
        },
        {
            proposalId: '2',
            proposalTxHash: 'hash2',
            proposalIndex: 2,
            voteTxHash: 'vhash2',
            blockTime: '2024-03-14T10:00:00Z',
            vote: 'No' as const,
            metaUrl: null,
            metaHash: null,
            proposalTitle: 'Governance Proposal B',
            proposalType: 'Treasury Withdrawal',
            proposedEpoch: 123,
            expirationEpoch: 456,
            rationale: 'Insufficient detail in implementation plan'
        },
        {
            proposalId: '3',
            proposalTxHash: 'hash3',
            proposalIndex: 3,
            voteTxHash: 'vhash3',
            blockTime: '2024-03-13T10:00:00Z',
            vote: 'Abstain' as const,
            metaUrl: null,
            metaHash: null,
            proposalTitle: 'Governance Proposal C',
            proposalType: 'Constitutional Committee',
            proposedEpoch: 123,
            expirationEpoch: 456,
            rationale: 'Conflict of interest'
        }
    ];

    beforeEach(() => {
        mockFetchData.mockClear();
    });

    it('renders page title and description', async () => {
        const { getStaticProps } = require('../../pages/drep-voting');
        mockFetchData.mockResolvedValueOnce([mockVotes[0]]).mockResolvedValueOnce([mockVotes[1], mockVotes[2]]);

        const { props } = await getStaticProps();
        render(<DRepVoting {...props} />);

        expect(screen.getByText('DRep Voting Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Track and analyze DRep voting patterns here.')).toBeInTheDocument();
    });

    it('renders voting statistics correctly', async () => {
        const { getStaticProps } = require('../../pages/drep-voting');
        mockFetchData.mockResolvedValueOnce([mockVotes[0]]).mockResolvedValueOnce([mockVotes[1], mockVotes[2]]);

        const { props } = await getStaticProps();
        render(<DRepVoting {...props} />);

        // Get the stats container
        const statsSection = screen.getByTestId('voting-stats');

        // Check total votes
        const totalVotesSection = within(statsSection).getByRole('heading', { name: 'Total Votes' }).parentElement;
        expect(within(totalVotesSection!).getByText('3')).toBeInTheDocument();

        // Check yes votes
        const yesVotesSection = within(statsSection).getByRole('heading', { name: 'Yes Votes' }).parentElement;
        const yesVoteCount = within(yesVotesSection!).getByText('1');
        expect(yesVoteCount).toHaveClass('yes');

        // Check no votes
        const noVotesSection = within(statsSection).getByRole('heading', { name: 'No Votes' }).parentElement;
        const noVoteCount = within(noVotesSection!).getByText('1');
        expect(noVoteCount).toHaveClass('no');

        // Check abstained votes
        const abstainedSection = within(statsSection).getByRole('heading', { name: 'Abstained' }).parentElement;
        const abstainVoteCount = within(abstainedSection!).getByText('1');
        expect(abstainVoteCount).toHaveClass('abstain');
    });

    it('renders proposal types correctly', async () => {
        const { getStaticProps } = require('../../pages/drep-voting');
        mockFetchData.mockResolvedValueOnce([mockVotes[0]]).mockResolvedValueOnce([mockVotes[1], mockVotes[2]]);

        const { props } = await getStaticProps();
        render(<DRepVoting {...props} />);

        expect(screen.getByText('Proposal Types')).toBeInTheDocument();
        expect(screen.getByText('Parameter Change')).toBeInTheDocument();
        expect(screen.getByText('Treasury Withdrawal')).toBeInTheDocument();
        expect(screen.getByText('Constitutional Committee')).toBeInTheDocument();
    });

    it('formats dates correctly', async () => {
        const { getStaticProps } = require('../../pages/drep-voting');
        mockFetchData.mockResolvedValueOnce([mockVotes[0]]).mockResolvedValueOnce([]);

        const { props } = await getStaticProps();
        render(<DRepVoting {...props} />);

        expect(screen.getByText('Block Time: 2024/03/15')).toBeInTheDocument();
    });

    it('handles error state correctly', async () => {
        const { getStaticProps } = require('../../pages/drep-voting');
        mockFetchData.mockRejectedValueOnce(new Error('Failed to fetch'));

        const { props } = await getStaticProps();
        render(<DRepVoting {...props} />);

        expect(screen.getByText('Failed to load voting data')).toBeInTheDocument();
    });

    it('handles empty voting data', async () => {
        const { getStaticProps } = require('../../pages/drep-voting');
        mockFetchData.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

        const { props } = await getStaticProps();
        render(<DRepVoting {...props} />);

        expect(screen.getByText('No voting data available')).toBeInTheDocument();
    });
}); 