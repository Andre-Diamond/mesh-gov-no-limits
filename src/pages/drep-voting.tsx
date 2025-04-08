import DRepVotingList from '../components/DRepVotingList';
import { useData } from '../contexts/DataContext';
import styles from '../styles/Voting.module.css';
import PageHeader from '../components/PageHeader';

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

export default function DRepVoting() {
    const { meshData, isLoading, error } = useData();

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading voting data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>{error}</div>
            </div>
        );
    }

    const votes = meshData?.votes || [];

    const voteStats = {
        total: votes.length,
        yes: votes.filter(v => v.vote === 'Yes').length,
        no: votes.filter(v => v.vote === 'No').length,
        abstain: votes.filter(v => v.vote === 'Abstain').length,
    };

    const typeStats = votes.reduce((acc, vote) => {
        acc[vote.proposalType] = (acc[vote.proposalType] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className={styles.container}>
            <PageHeader
                title={<>DRep Voting <span>Dashboard</span></>}
                subtitle="Track and analyze DRep voting patterns here."
            />

            <div className={styles.stats} data-testid="voting-stats">
                <div className={styles.stat}>
                    <h3>Total Votes</h3>
                    <p>{voteStats.total}</p>
                </div>
                <div className={styles.stat}>
                    <h3>Yes Votes</h3>
                    <p className={styles.yes}>{voteStats.yes}</p>
                </div>
                <div className={styles.stat}>
                    <h3>No Votes</h3>
                    <p className={styles.no}>{voteStats.no}</p>
                </div>
                <div className={styles.stat}>
                    <h3>Abstained</h3>
                    <p className={styles.abstain}>{voteStats.abstain}</p>
                </div>
            </div>

            <div className={styles.typeStats}>
                <h2>Proposal Types</h2>
                <div className={styles.typeGrid}>
                    {(Object.entries(typeStats) as Array<[string, number]>).map(([type, count]) => (
                        <div key={type} className={styles.typeStat}>
                            <h4>{type}</h4>
                            <p>{count}</p>
                        </div>
                    ))}
                </div>
            </div>

            <DRepVotingList votes={votes} />
        </div>
    );
} 