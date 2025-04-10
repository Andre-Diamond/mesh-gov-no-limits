import DRepVotingList from '../components/DRepVotingList';
import { useData } from '../contexts/DataContext';
import styles from '../styles/Voting.module.css';
import PageHeader from '../components/PageHeader';
import SearchFilterBar, { SearchFilterConfig } from '../components/SearchFilterBar';
import { filterVotes, generateDrepVotingFilterConfig } from '../config/filterConfig';
import { useState, useMemo, useEffect, useCallback } from 'react';
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
    const [lastNavigationTime, setLastNavigationTime] = useState(0);

    const votes = drepVotingData?.votes || [];

    // Generate dynamic filter config based on available votes data
    const dynamicFilterConfig = useMemo(() => {
        if (!drepVotingData?.votes) return {
            placeholder: "Search votes...",
            filters: [],
        } as SearchFilterConfig;
        return generateDrepVotingFilterConfig(drepVotingData.votes);
    }, [drepVotingData]);

    // Stats calculated from the complete dataset
    const voteStats = useMemo(() => ({
        total: votes.length,
        yes: votes.filter(v => v.vote === 'Yes').length,
        no: votes.filter(v => v.vote === 'No').length,
        abstain: votes.filter(v => v.vote === 'Abstain').length,
    }), [votes]);

    const typeStats = useMemo(() => votes.reduce((acc, vote) => {
        acc[vote.proposalType] = (acc[vote.proposalType] || 0) + 1;
        return acc;
    }, {} as Record<string, number>), [votes]);

    // Debounced URL update
    const updateUrl = useCallback((searchTerm: string) => {
        const now = Date.now();
        if (now - lastNavigationTime < 1000) return; // Prevent updates within 1 second

        if (searchTerm) {
            router.push(`/drep-voting?search=${searchTerm}`, undefined, { shallow: true });
        } else {
            router.push('/drep-voting', undefined, { shallow: true });
        }
        setLastNavigationTime(now);
    }, [router, lastNavigationTime]);

    // Handle search and filter
    const handleSearch = useCallback((searchTerm: string, activeFilters: Record<string, string>) => {
        if (!searchTerm && Object.keys(activeFilters).length === 0) {
            setFilteredVotes([]);
            setIsSearching(false);
            updateUrl('');
            return;
        }

        setIsSearching(true);
        const filtered = filterVotes(votes, searchTerm, activeFilters);
        setFilteredVotes(filtered);
        updateUrl(searchTerm);
    }, [votes, updateUrl]);

    // Handle row click
    const handleRowClick = useCallback((proposalId: string) => {
        const now = Date.now();
        if (now - lastNavigationTime < 1000) return; // Prevent clicks within 1 second

        router.push(`/drep-voting?search=${proposalId}`);
        setLastNavigationTime(now);
    }, [router, lastNavigationTime]);

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
                        {Object.entries(typeStats).map(([type, count]) => (
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

            <DRepVotingList votes={displayVotes} onRowClick={handleRowClick} />
        </div>
    );
} 