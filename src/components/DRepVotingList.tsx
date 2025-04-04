import { FC } from 'react';
import styles from '../styles/DRepVotingList.module.css';

// Format date consistently without relying on locale settings
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
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
        <div className={styles.container}>
            <ul className={styles.list}>
                {votes.map((vote) => (
                    <li key={vote.proposalId} className={styles.item}>
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