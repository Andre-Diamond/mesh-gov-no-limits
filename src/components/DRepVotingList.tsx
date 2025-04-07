import { FC } from 'react';
import styles from '../styles/Voting.module.css';

// Format date to a readable format
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

interface VoteData {
    proposalId: string;
    proposalTxHash: string;
    proposalIndex: number;
    voteTxHash: string;
    blockTime: string;
    vote: 'Yes' | 'No' | 'Abstain';
    metaUrl: string | null;
    metaHash: string | null;
    proposalTitle: string;
    proposalType: string;
    proposedEpoch: number;
    expirationEpoch: number;
    rationale: string;
}

interface DRepVotingListProps {
    votes: VoteData[];
}

const DRepVotingList: FC<DRepVotingListProps> = ({ votes }) => {
    if (!votes || votes.length === 0) {
        return <div className={styles.empty}>No voting data available</div>;
    }

    return (
        <div className={styles.container} data-testid="voting-list">
            <ul className={styles.list}>
                {votes.map((vote) => (
                    <li key={vote.proposalId} className={styles.item} data-testid="vote-item">
                        <div className={styles.header}>
                            <h3 className={styles.title}>{vote.proposalTitle}</h3>
                            <span className={`${styles.vote} ${styles[vote.vote.toLowerCase()]}`}>
                                {vote.vote}
                            </span>
                        </div>
                        <div className={styles.type}>
                            Type: {vote.proposalType}
                        </div>
                        <p className={styles.rationale}>{vote.rationale}</p>
                        <div className={styles.meta}>
                            <div>Proposed Epoch: {vote.proposedEpoch}</div>
                            <div>Expiration Epoch: {vote.expirationEpoch}</div>
                            <div>Block Time: {formatDate(vote.blockTime)}</div>
                        </div>
                        <div className={styles.links}>
                            <a href={`https://cardanoscan.io/transaction/${vote.proposalTxHash}`} target="_blank" rel="noopener noreferrer" className={styles.link}>
                                View Proposal
                            </a>
                            <a href={`https://cardanoscan.io/transaction/${vote.voteTxHash}`} target="_blank" rel="noopener noreferrer" className={styles.link}>
                                View Vote
                            </a>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DRepVotingList; 