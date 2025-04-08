import { useData } from '../contexts/DataContext';
import styles from '../styles/Dashboard.module.css';
import { useRouter } from 'next/router';
import PageHeader from '../components/PageHeader';
import StatusCard, { StatusIconType } from '../components/StatusCard';

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

    return (
        <div className={styles.container}>
            <PageHeader
                title={<>Mesh Governance <span>Dashboard</span></>}
                subtitle="Comprehensive overview of all MeshJS ecosystem activities"
            />

            {/* Top metrics */}
            <div className={styles.statusList}>
                <h2>Key Metrics</h2>

                {/* Voting Card */}
                <StatusCard
                    title={`TOTAL VOTES: ${totalVotes}`}
                    iconType="green"
                    subtitle={`Latest vote: ${recentVotes[0] ? formatDate(recentVotes[0].blockTime) : 'N/A'}`}
                    actionLabel="View details →"
                    onActionClick={() => router.push('/drep-voting')}
                />

                {/* Proposals Card */}
                <StatusCard
                    title={`CATALYST PROPOSALS: ${totalProposals}`}
                    iconType="blue"
                    subtitle={`${completedProposals} completed (${Math.round((completedProposals / totalProposals) * 100)}%)`}
                    actionLabel="View details →"
                    onActionClick={() => router.push('/catalyst-proposals')}
                />

                {/* SDK Downloads Card */}
                <StatusCard
                    title={`SDK DOWNLOADS: ${downloads ? formatNumber(downloads.last_month) : 'N/A'}`}
                    iconType="yellow"
                    subtitle={`This month • ${githubUsage} projects using Mesh`}
                    actionLabel="View details →"
                    onActionClick={() => router.push('/mesh-stats')}
                />
            </div>

            {/* Recent Votes */}
            <div className={styles.statusList}>
                <h2>Recent Votes</h2>
                {recentVotes.map((vote: VoteData) => (
                    <StatusCard
                        key={vote.proposalId}
                        title={vote.proposalTitle}
                        iconType={vote.vote === 'Yes' ? 'green' : vote.vote === 'No' ? 'red' : 'yellow'}
                        subtitle={`Vote: ${vote.vote} • ${formatDate(vote.blockTime)}`}
                    />
                ))}
                {recentVotes.length === 0 && (
                    <div className={styles.empty}>No voting data available</div>
                )}
            </div>

            {/* Projects Near Completion */}
            <div className={styles.statusList}>
                <h2>Projects Near Completion</h2>
                {projectsNearCompletion.map((project: ProjectWithCompletion) => (
                    <StatusCard
                        key={project.projectDetails.id}
                        title={project.projectDetails.title}
                        iconType={project.projectDetails.status === 'In Progress' ? 'blue' : 'yellow'}
                        subtitle={`${project.completionPercentage}% complete • ${project.projectDetails.category} • ₳${formatNumber(project.projectDetails.budget)}`}
                    />
                ))}
                {projectsNearCompletion.length === 0 && (
                    <div className={styles.empty}>No projects near completion</div>
                )}
            </div>
        </div>
    );
} 