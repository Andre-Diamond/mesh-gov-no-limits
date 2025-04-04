import { render, screen } from '@testing-library/react';
import DRepVotingList from '../../components/DRepVotingList';

describe('DRepVotingList', () => {
    const mockVotes = [
        {
            proposalId: '123',
            proposalTxHash: 'abc123',
            proposalIndex: 1,
            voteTxHash: 'def456',
            blockTime: '2024-04-04T10:00:00Z',
            vote: 'Yes' as const,
            metaUrl: null,
            metaHash: null,
            proposalTitle: 'Test Proposal',
            proposalType: 'Motion',
            proposedEpoch: 100,
            expirationEpoch: 110,
            rationale: 'Test rationale'
        }
    ];

    it('renders empty state when no votes are provided', () => {
        render(<DRepVotingList votes={[]} />);
        expect(screen.getByText('No voting data available')).toBeInTheDocument();
    });

    it('renders vote information correctly', () => {
        render(<DRepVotingList votes={mockVotes} />);

        // Check if main elements are rendered
        expect(screen.getByText('Test Proposal')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('Type: Motion')).toBeInTheDocument();
        expect(screen.getByText('Test rationale')).toBeInTheDocument();

        // Check meta information
        expect(screen.getByText('Proposed Epoch: 100')).toBeInTheDocument();
        expect(screen.getByText('Expiration Epoch: 110')).toBeInTheDocument();
        expect(screen.getByText('Block Time: 2024/04/04')).toBeInTheDocument();
    });

    it('generates correct CardanoScan links', () => {
        render(<DRepVotingList votes={mockVotes} />);

        const proposalLink = screen.getByText('View Proposal');
        const voteLink = screen.getByText('View Vote');

        expect(proposalLink).toHaveAttribute(
            'href',
            'https://cardanoscan.io/transaction/abc123'
        );
        expect(voteLink).toHaveAttribute(
            'href',
            'https://cardanoscan.io/transaction/def456'
        );
    });

    it('applies correct CSS classes for different vote types', () => {
        const votesWithDifferentTypes = [
            { ...mockVotes[0], vote: 'Yes' as const },
            { ...mockVotes[0], proposalId: '456', vote: 'No' as const },
            { ...mockVotes[0], proposalId: '789', vote: 'Abstain' as const }
        ];

        render(<DRepVotingList votes={votesWithDifferentTypes} />);

        const yesVote = screen.getByText('Yes');
        const noVote = screen.getByText('No');
        const abstainVote = screen.getByText('Abstain');

        expect(yesVote).toHaveClass('yes');
        expect(noVote).toHaveClass('no');
        expect(abstainVote).toHaveClass('abstain');
    });
}); 