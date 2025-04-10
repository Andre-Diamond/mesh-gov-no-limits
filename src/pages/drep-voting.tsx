import DRepVotingList from '../components/DRepVotingList';
import { useData } from '../contexts/DataContext';
import styles from '../styles/Voting.module.css';
import PageHeader from '../components/PageHeader';
import SearchFilterBar, { SearchFilterConfig } from '../components/SearchFilterBar';
import { filterVotes, generateDrepVotingFilterConfig } from '../config/filterConfig';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';

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
    const { drepVotingData, isLoading, error } = useData();
    const [filteredVotes, setFilteredVotes] = useState<VoteData[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const router = useRouter();

    // Generate dynamic filter config based on available votes data
    const dynamicFilterConfig = useMemo(() => {
        if (!drepVotingData?.votes) return {
            placeholder: "Search votes...",
            filters: [],
        } as SearchFilterConfig;
        return generateDrepVotingFilterConfig(drepVotingData.votes);
    }, [drepVotingData]);

    // Handle URL search parameter
    useEffect(() => {
        if (router.isReady && router.query.search && drepVotingData?.votes) {
            const searchTerm = router.query.search as string;
            const filtered = filterVotes(drepVotingData.votes, searchTerm, {});
            setFilteredVotes(filtered);
            setIsSearching(true);
        }
    }, [router.isReady, router.query.search, drepVotingData]);

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

    const votes = drepVotingData?.votes || [];

    // Stats calculated from the complete dataset
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

    // Handle search and filter
    const handleSearch = (searchTerm: string, activeFilters: Record<string, string>) => {
        if (!searchTerm && Object.keys(activeFilters).length === 0) {
            setFilteredVotes([]);
            setIsSearching(false);
            // Clear the search parameter from URL
            router.push('/drep-voting', undefined, { shallow: true });
            return;
        }

        setIsSearching(true);
        const filtered = filterVotes(votes, searchTerm, activeFilters);
        setFilteredVotes(filtered);
        // Update URL with search term
        if (searchTerm) {
            router.push(`/drep-voting?search=${searchTerm}`, undefined, { shallow: true });
        }
    };

    // Decide which votes to display
    const displayVotes = isSearching ? filteredVotes : votes;

    return (
        <div className={styles.container}>
            <PageHeader
                title={<>DRep Voting <span>Dashboard</span></>}
                subtitle="Track and analyze DRep voting patterns here."
            />

            <SearchFilterBar
                config={dynamicFilterConfig}
                onSearch={handleSearch}
                initialSearchTerm={router.query.search as string}
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

            {!isSearching && (
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
            )}

            {isSearching && (
                <div className={styles.searchResults}>
                    <h2>Search Results ({filteredVotes.length} votes found)</h2>
                </div>
            )}

            <DRepVotingList votes={displayVotes} />
        </div>
    );
} 