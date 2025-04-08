import { useData } from '../contexts/DataContext';
import styles from '../styles/Home.module.css';
import dashboardStyles from '../styles/Dashboard.module.css';
import { useRouter } from 'next/router';
import PageHeader from '../components/PageHeader';

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

export default function Home() {
    const { meshData, catalystData, isLoading, error, refetchData } = useData();
    const router = useRouter();

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
    const recentVotes = meshData?.votes?.slice(0, 3) || [];

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

    // Header actions - refresh button
    const headerActions = (
        <button
            className={dashboardStyles.refresh}
            onClick={() => refetchData()}
            title="Refresh data"
        >
            ↺
        </button>
    );

    return (
        <div className={styles.container}>
            <PageHeader
                title={<>Mesh Governance <span>Dashboard</span></>}
                subtitle="Real-time metrics and insights for the Cardano ecosystem"
                actions={
                    <>
                        <div className={dashboardStyles.liveIndicator}>LIVE DATA</div>
                        {headerActions}
                    </>
                }
            />

            {/* Top metrics */}
            <div className={dashboardStyles.grid}>
                {/* Proposals Card */}
                <div className={dashboardStyles.card}>
                    <div className={dashboardStyles.cardHeader}>
                        <div className={dashboardStyles.cardTitle}>CATALYST PROPOSALS</div>
                        <div className={dashboardStyles.cardIcon}>📊</div>
                    </div>
                    <div className={dashboardStyles.value}>{totalProposals}</div>
                    <div className={dashboardStyles.subValue}>
                        {completedProposals} completed ({Math.round((completedProposals / totalProposals) * 100)}%)
                    </div>
                    <button
                        className={styles.viewMore}
                        onClick={() => router.push('/catalyst-proposals')}
                    >
                        View details →
                    </button>
                </div>

                {/* Voting Card */}
                <div className={dashboardStyles.card}>
                    <div className={dashboardStyles.cardHeader}>
                        <div className={dashboardStyles.cardTitle}>TOTAL VOTES</div>
                        <div className={dashboardStyles.cardIcon}>🗳️</div>
                    </div>
                    <div className={dashboardStyles.value}>{totalVotes}</div>
                    <div className={dashboardStyles.subValue}>
                        Latest vote: {recentVotes[0] ? formatDate(recentVotes[0].blockTime) : 'N/A'}
                    </div>
                    <button
                        className={styles.viewMore}
                        onClick={() => router.push('/drep-voting')}
                    >
                        View details →
                    </button>
                </div>

                {/* SDK Downloads Card */}
                <div className={dashboardStyles.card}>
                    <div className={dashboardStyles.cardHeader}>
                        <div className={dashboardStyles.cardTitle}>SDK DOWNLOADS</div>
                        <div className={dashboardStyles.cardIcon}>📦</div>
                    </div>
                    <div className={dashboardStyles.value}>
                        {downloads ? formatNumber(downloads.last_month) : 'N/A'}
                    </div>
                    <div className={dashboardStyles.subValue}>
                        This month • {githubUsage} projects using Mesh
                    </div>
                    <button
                        className={styles.viewMore}
                        onClick={() => router.push('/mesh-stats')}
                    >
                        View details →
                    </button>
                </div>
            </div>

            {/* Recent Votes */}
            <div className={dashboardStyles.statusList}>
                <h2>Recent Votes</h2>
                {recentVotes.map((vote: VoteData) => (
                    <div key={vote.proposalId} className={dashboardStyles.statusItem}>
                        <div className={dashboardStyles.statusLabel}>
                            <div className={`${dashboardStyles.statusIcon} ${vote.vote === 'Yes'
                                ? dashboardStyles.statusIconGreen
                                : vote.vote === 'No'
                                    ? dashboardStyles.statusIconRed
                                    : dashboardStyles.statusIconYellow
                                }`}></div>
                            <div className={dashboardStyles.statusText}>
                                {vote.proposalTitle} - <strong>{vote.vote}</strong>
                            </div>
                        </div>
                        <div className={dashboardStyles.statusTime}>
                            {formatDate(vote.blockTime)}
                        </div>
                    </div>
                ))}
                {recentVotes.length === 0 && (
                    <div className={styles.empty}>No voting data available</div>
                )}
            </div>

            {/* Projects Near Completion */}
            <div className={dashboardStyles.statusList}>
                <h2>Projects Near Completion</h2>
                {projectsNearCompletion.map((project: ProjectWithCompletion) => (
                    <div key={project.projectDetails.id} className={dashboardStyles.statusItem}>
                        <div className={dashboardStyles.statusLabel}>
                            <div className={`${dashboardStyles.statusIcon} ${project.projectDetails.status === 'In Progress'
                                ? dashboardStyles.statusIconBlue
                                : dashboardStyles.statusIconYellow
                                }`}></div>
                            <div className={dashboardStyles.statusText}>
                                {project.projectDetails.title}
                            </div>
                        </div>
                        <div className={dashboardStyles.statusTime}>
                            {project.completionPercentage}% complete • {project.projectDetails.category} • ₳{formatNumber(project.projectDetails.budget)}
                        </div>
                    </div>
                ))}
                {projectsNearCompletion.length === 0 && (
                    <div className={styles.empty}>No projects near completion</div>
                )}
            </div>
        </div>
    );
} 