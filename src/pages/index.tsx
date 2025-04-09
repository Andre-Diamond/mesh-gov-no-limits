import { useData } from '../contexts/DataContext';
import styles from '../styles/Dashboard.module.css';
import { useRouter } from 'next/router';
import PageHeader from '../components/PageHeader';
import StatusCard, { StatusIconType } from '../components/StatusCard';
import SearchFilterBar from '../components/SearchFilterBar';
import { dashboardFilterConfig } from '../config/filterConfig';
import { useState } from 'react';
import Link from 'next/link';

// Simple number formatting function
const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
};

// Format date to a readable format
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
};

// Type definitions
interface ProjectDetails {
    id: number;
    title: string;
    budget: number;
    milestones_qty: number;
    funds_distributed: number;
    project_id: number;
    category: string;
    status: string;
    finished: string;
}

interface Project {
    projectDetails: ProjectDetails;
    milestonesCompleted: number;
}

// Extended project interface with completion percentage
interface ProjectWithCompletion extends Project {
    completionPercentage: number;
}

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

// Component to display compact catalyst proposals overview
const CatalystProposalsCard = ({ projects }: { projects: Project[] }) => {
    const router = useRouter();

    // Extract funding round from category (first 3 letters)
    const getFundingRound = (category: string): string => {
        const match = category.match(/^F(\d+)/);
        return match ? `Fund ${match[1]}` : category.substring(0, 3);
    };

    // Calculate completion percentage for display
    const calculateCompletion = (project: Project): number => {
        if (project.projectDetails.milestones_qty === 0) return 0;
        return Math.round((project.milestonesCompleted / project.projectDetails.milestones_qty) * 100);
    };

    // Get status icon color
    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'Completed': return styles.statusIconGreen;
            case 'In Progress': return styles.statusIconBlue;
            default: return styles.statusIconYellow;
        }
    };

    // Handle row click
    const handleRowClick = (projectId: number) => {
        router.push(`/project-details/${projectId}`);
    };

    return (
        <div className={`${styles.statusItem} ${styles.catalystProposalsCard}`}>
            <div className={styles.statusItemContent}>
                <div className={styles.statusItemTop}>
                    <div className={styles.statusLabel}>
                        <div className={styles.statusTitle}>
                            Catalyst Proposals Overview
                        </div>
                    </div>
                    <div className={`${styles.statusIcon} ${styles.statusIconBlue}`}></div>
                </div>
                <div className={styles.proposalsTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Fund</th>
                                <th>Status</th>
                                <th>Funding</th>
                                <th>Completion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr
                                    key={project.projectDetails.project_id}
                                    onClick={() => handleRowClick(project.projectDetails.project_id)}
                                    className={styles.clickableRow}
                                >
                                    <td className={styles.proposalTitle}>{project.projectDetails.title}</td>
                                    <td>{getFundingRound(project.projectDetails.category)}</td>
                                    <td>
                                        <div className={styles.statusWithIcon}>
                                            <div className={`${styles.statusIcon} ${getStatusColor(project.projectDetails.status)}`}></div>
                                            <span>{project.projectDetails.status}</span>
                                        </div>
                                    </td>
                                    <td>₳{formatNumber(project.projectDetails.budget)}</td>
                                    <td>
                                        <div className={styles.completionWrapper}>
                                            <div
                                                className={styles.completionBar}
                                                style={{ width: `${calculateCompletion(project)}%` }}
                                            />
                                            <span>{calculateCompletion(project)}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={styles.statusItemBottom}>
                    <div className={styles.statusSubtext}>
                        Showing all {projects.length} proposals
                    </div>
                    <Link href="/catalyst-proposals" className={styles.viewMore}>
                        View details
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Component to display voting table
const VotingTableCard = ({ votes }: { votes: VoteData[] }) => {
    const router = useRouter();

    // Get vote icon color
    const getVoteIconColor = (vote: string): string => {
        switch (vote) {
            case 'Yes': return styles.statusIconGreen;
            case 'No': return styles.statusIconRed;
            case 'Abstain': return styles.statusIconYellow;
            default: return styles.statusIconBlue;
        }
    };

    // Handle row click
    const handleRowClick = (proposalId: string) => {
        router.push(`/vote-details/${proposalId}`);
    };

    return (
        <div className={`${styles.statusItem} ${styles.catalystProposalsCard}`}>
            <div className={styles.statusItemContent}>
                <div className={styles.statusItemTop}>
                    <div className={styles.statusLabel}>
                        <div className={styles.statusTitle}>
                            Voting Activity
                        </div>
                    </div>
                    <div className={`${styles.statusIcon} ${styles.statusIconGreen}`}></div>
                </div>
                <div className={`${styles.proposalsTable} ${styles.votingTable}`}>
                    <table>
                        <thead>
                            <tr>
                                <th>Proposal</th>
                                <th>Type</th>
                                <th>Vote</th>
                                <th>Date</th>
                                <th>Epochs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {votes.map((vote) => (
                                <tr
                                    key={vote.proposalId}
                                    onClick={() => handleRowClick(vote.proposalId)}
                                    className={styles.clickableRow}
                                >
                                    <td className={styles.proposalTitle}>{vote.proposalTitle}</td>
                                    <td>{vote.proposalType}</td>
                                    <td>
                                        <div className={styles.statusWithIcon}>
                                            <div className={`${styles.statusIcon} ${getVoteIconColor(vote.vote)}`}></div>
                                            <span>{vote.vote}</span>
                                        </div>
                                    </td>
                                    <td>{formatDate(vote.blockTime)}</td>
                                    <td>{vote.proposedEpoch} - {vote.expirationEpoch}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={styles.statusItemBottom}>
                    <div className={styles.statusSubtext}>
                        Showing all {votes.length} votes
                    </div>
                    <Link href="/drep-voting" className={styles.viewMore}>
                        View details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default function Home() {
    const { meshData, catalystData, isLoading, error, refetchData } = useData();
    const router = useRouter();
    const [filteredVotes, setFilteredVotes] = useState(meshData?.votes || []);
    const [filteredProjects, setFilteredProjects] = useState(catalystData?.catalystData?.projects || []);
    const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>Error: {error}</div>
            </div>
        );
    }

    // Calculate totals
    const totalProposals = catalystData?.catalystData?.projects?.length || 0;
    const completedProposals = catalystData?.catalystData?.projects?.filter(
        (p: Project) => p.projectDetails.status === 'Completed'
    ).length || 0;
    const totalVotes = meshData?.votes?.length || 0;
    const allVotes = meshData?.votes || [];

    // SDK download stats
    const downloads = meshData?.currentStats?.npm?.downloads;
    const githubUsage = meshData?.currentStats?.github?.core_in_package_json || 0;

    // Calculate project categories
    const categories: Record<string, number> = {};
    catalystData?.catalystData?.projects?.forEach((project: Project) => {
        const category = project.projectDetails.category;
        categories[category] = (categories[category] || 0) + 1;
    });

    // Get projects closest to completion (but not completed)
    const projectsNearCompletion = catalystData?.catalystData?.projects
        ?.filter((project: Project) =>
            project.projectDetails.status !== 'Completed' &&
            project.projectDetails.milestones_qty > 0 &&
            project.milestonesCompleted > 0
        )
        .map((project: Project): ProjectWithCompletion => ({
            ...project,
            completionPercentage: Math.round((project.milestonesCompleted / project.projectDetails.milestones_qty) * 100)
        }))
        .sort((a: ProjectWithCompletion, b: ProjectWithCompletion) => b.completionPercentage - a.completionPercentage)
        .slice(0, 3) || [];

    // All catalyst projects for the overview card
    const allProjects = catalystData?.catalystData?.projects || [];

    // Search functionality
    const handleSearch = (searchTerm: string, filters: Record<string, string>) => {
        // Clear filters if empty search
        if (!searchTerm && Object.keys(filters).length === 0) {
            setFilteredVotes(meshData?.votes || []);
            setFilteredProjects(catalystData?.catalystData?.projects || []);
            setIsSearchActive(false);
            return;
        }

        setIsSearchActive(true);
        const searchType = filters.type || '';

        // Filter votes
        if (!searchType || searchType === 'vote') {
            const matchingVotes = meshData?.votes?.filter(vote => {
                return vote.proposalTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    vote.proposalType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    vote.rationale.toLowerCase().includes(searchTerm.toLowerCase());
            }) || [];
            setFilteredVotes(matchingVotes);
        } else {
            setFilteredVotes([]);
        }

        // Filter catalyst proposals
        if (!searchType || searchType === 'proposal') {
            const matchingProjects = catalystData?.catalystData?.projects?.filter((project: Project) => {
                return project.projectDetails.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    project.projectDetails.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    project.projectDetails.status.toLowerCase().includes(searchTerm.toLowerCase());
            }) || [];
            setFilteredProjects(matchingProjects);
        } else {
            setFilteredProjects([]);
        }
    };

    return (
        <div className={styles.container}>
            <PageHeader
                title={<>Mesh Governance <span>Dashboard</span></>}
                subtitle="Comprehensive overview of all MeshJS ecosystem activities"
            />

            <SearchFilterBar
                config={dashboardFilterConfig}
                onSearch={handleSearch}
            />

            {/* Top metrics */}
            <div className={styles.statusList}>
                <h2>Key Metrics</h2>

                {/* Voting Card */}
                <StatusCard
                    title="Total Votes"
                    value={totalVotes}
                    iconType="green"
                    subtitle={`Latest vote: ${allVotes[0] ? formatDate(allVotes[0].blockTime) : 'N/A'}`}
                    href="/drep-voting"
                />

                {/* Proposals Card */}
                <StatusCard
                    title="Catalyst Proposals"
                    value={totalProposals}
                    iconType="blue"
                    subtitle={`${completedProposals} completed (${Math.round((completedProposals / totalProposals) * 100)}%)`}
                    href="/catalyst-proposals"
                />

                {/* SDK Downloads Card */}
                <StatusCard
                    title="SDK Downloads"
                    value={downloads ? formatNumber(downloads.last_month) : 'N/A'}
                    iconType="yellow"
                    subtitle={`This month • ${githubUsage} projects using Mesh`}
                    href="/mesh-stats"
                />
            </div>

            {/* Voting Table Card */}
            {filteredVotes.length > 0 && (
                <div className={styles.statusList}>
                    <h2>Voting Activity</h2>
                    <VotingTableCard votes={filteredVotes} />
                </div>
            )}

            {/* Catalyst Proposals Overview Card */}
            {filteredProjects.length > 0 && (
                <div className={styles.statusList}>
                    <h2>Catalyst Proposals Overview</h2>
                    <CatalystProposalsCard projects={filteredProjects} />
                </div>
            )}
        </div>
    );
} 