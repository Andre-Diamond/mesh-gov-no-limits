import CatalystProposalsList from '../components/CatalystProposalsList';
import { useData } from '../contexts/DataContext';
import styles from '../styles/Proposals.module.css';
import PageHeader from '../components/PageHeader';
import SearchFilterBar, { SearchFilterConfig } from '../components/SearchFilterBar';
import { filterProposals, generateCatalystProposalsFilterConfig } from '../config/filterConfig';
import { useState, useMemo } from 'react';
import { CatalystData, CatalystProject } from '../types';

// Simple number formatting function that doesn't rely on locale settings
const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
};

// Format ADA amount with symbol
const formatAda = (amount: number): string => {
    return `₳${formatNumber(amount)}`;
};

export default function CatalystProposals() {
    const { catalystData, isLoading, error } = useData();
    const [filteredProjects, setFilteredProjects] = useState<CatalystProject[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // Generate dynamic filter config based on available data
    const dynamicFilterConfig = useMemo(() => {
        if (!catalystData?.catalystData) return {
            placeholder: "Search proposals...",
            filters: [],
        } as SearchFilterConfig;
        return generateCatalystProposalsFilterConfig(catalystData.catalystData.projects);
    }, [catalystData]);

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading catalyst data...</div>
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

    if (!catalystData?.catalystData) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>No catalyst data available</div>
            </div>
        );
    }

    const data = catalystData.catalystData;

    // Handle search and filtering
    const handleSearch = (searchTerm: string, activeFilters: Record<string, string>) => {
        if (!searchTerm && Object.keys(activeFilters).length === 0) {
            setFilteredProjects([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const filtered = filterProposals(data.projects, searchTerm, activeFilters);
        setFilteredProjects(filtered);
    };

    // Calculate stats based on all projects, not just filtered ones
    const allProjects = data.projects;
    const totalBudget = allProjects.reduce((sum: number, p: CatalystProject) => sum + p.projectDetails.budget, 0);
    const completedProjects = allProjects.filter((p: CatalystProject) => p.projectDetails.status === 'Completed').length;

    // Determine which data to display
    const displayData = {
        ...data,
        projects: isSearching ? filteredProjects : data.projects
    };

    return (
        <div className={styles.container}>
            <PageHeader
                title={<>Catalyst Proposal <span>Dashboard</span></>}
                subtitle="View and analyze Catalyst proposals here."
            />

            <SearchFilterBar
                config={dynamicFilterConfig}
                onSearch={handleSearch}
            />

            <div className={styles.stats} role="region" aria-label="statistics">
                <div className={styles.stat}>
                    <h3>Total Projects</h3>
                    <p aria-label="Total Projects">{allProjects.length}</p>
                </div>
                <div className={styles.stat}>
                    <h3>Total Budget</h3>
                    <p aria-label="Total Budget">{formatAda(totalBudget)}</p>
                </div>
                <div className={styles.stat}>
                    <h3>Completed Projects</h3>
                    <p aria-label="Completed Projects">{completedProjects}</p>
                </div>
            </div>

            {isSearching && (
                <div className={styles.searchResults}>
                    <h2>Search Results ({filteredProjects.length} projects found)</h2>
                </div>
            )}

            <CatalystProposalsList data={displayData} />
        </div>
    );
} 