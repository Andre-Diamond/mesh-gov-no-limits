import { GetStaticProps } from 'next';
import fetchData from '../lib/fetchData';
import DRepVotingList from '../components/DRepVotingList';
import styles from '../styles/pages/DRepVoting.module.css';

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

interface Props {
    votes: VoteData[];
    error?: string;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
    try {
        const [votes2024, votes2025] = await Promise.all([
            fetchData('https://raw.githubusercontent.com/Signius/mesh-automations/main/mesh-gov-updates/drep-voting/2024_voting.json'),
            fetchData('https://raw.githubusercontent.com/Signius/mesh-automations/main/mesh-gov-updates/drep-voting/2025_voting.json')
        ]);

        // Combine and sort by blockTime in descending order (newest first)
        const allVotes = [...votes2024, ...votes2025].sort((a, b) =>
            new Date(b.blockTime).getTime() - new Date(a.blockTime).getTime()
        );

        return {
            props: { votes: allVotes },
            revalidate: 60 * 60 * 24 // Revalidate once per day
        };
    } catch (error) {
        console.error('Failed to fetch voting data:', error);
        return {
            props: {
                votes: [],
                error: 'Failed to load voting data'
            },
            revalidate: 60 * 60 // Retry every hour if there was an error
        };
    }
};

export default function DRepVoting({ votes, error }: Props) {
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
            <h1 className={styles.title}>DRep Voting Dashboard</h1>
            <p className={styles.description}>Track and analyze DRep voting patterns here.</p>

            {error ? (
                <div className={styles.error}>{error}</div>
            ) : (
                <>
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
                            {Object.entries(typeStats).map(([type, count]) => (
                                <div key={type} className={styles.typeStat}>
                                    <h4>{type}</h4>
                                    <p>{count}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DRepVotingList votes={votes} />
                </>
            )}
        </div>
    );
} 