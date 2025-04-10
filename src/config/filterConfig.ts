import { SearchFilterConfig } from '../components/SearchFilterBar';

// Helper functions to generate filter options dynamically from data
export const getUniqueValues = <T, K extends keyof T>(items: T[], key: K): T[K][] => {
    const values = items.map(item => item[key]);
    return [...new Set(values)];
};

export const extractFundingRounds = (projects: any[]): string[] => {
    const fundingRounds = projects.map(project =>
        project.projectDetails.category.substring(0, 3)
    );
    return [...new Set(fundingRounds)];
};

export const getProposalTypes = (votes: any[]): string[] => {
    return [...new Set(votes.map(vote => vote.proposalType))];
};

export const getPackageNames = (packageData: any[]): string[] => {
    return [...new Set(packageData.map(pkg => pkg.name))];
};

// Dashboard page - search across all data (this one is static by nature)
export const dashboardFilterConfig: SearchFilterConfig = {
    placeholder: 'Search across votes, proposals, and stats...',
    filters: [
        {
            id: 'type',
            label: 'Result Type',
            options: [
                { label: 'DRep Votes', value: 'vote' },
                { label: 'Catalyst Proposals', value: 'proposal' }
            ]
        }
    ]
};

// Dynamic filter configuration generators
export const generateDrepVotingFilterConfig = (votes: any[]): SearchFilterConfig => {
    // Get unique proposal types from votes data
    const proposalTypes = getProposalTypes(votes);

    return {
        placeholder: 'Search votes by title, proposal ID, rationale, or type...',
        filters: [
            {
                id: 'vote',
                label: 'Vote Decision',
                options: [
                    { label: 'Yes', value: 'Yes' },
                    { label: 'No', value: 'No' },
                    { label: 'Abstain', value: 'Abstain' }
                ]
            },
            {
                id: 'proposalType',
                label: 'Proposal Type',
                options: proposalTypes.map(type => ({
                    label: type,
                    value: type
                }))
            }
        ]
    };
};

export const generateCatalystProposalsFilterConfig = (projects: any[]): SearchFilterConfig => {
    // Extract unique statuses and funding rounds from projects data
    const statuses = [...new Set(projects.map(project => project.projectDetails.status))];
    const fundingRounds = extractFundingRounds(projects);

    return {
        placeholder: 'Search proposals by title, project ID, funding round, or status...',
        filters: [
            {
                id: 'status',
                label: 'Status',
                options: statuses.map(status => ({
                    label: status,
                    value: status
                }))
            },
            {
                id: 'fundingRound',
                label: 'Funding Round',
                options: fundingRounds.map(round => ({
                    label: round,
                    value: round
                }))
            }
        ]
    };
};

export const generateMeshStatsFilterConfig = (packageData: any[]): SearchFilterConfig => {
    // Extract unique package names from stats data
    const packageNames = getPackageNames(packageData);

    return {
        placeholder: 'Search statistics by package name or trend...',
        filters: [
            {
                id: 'package',
                label: 'Package',
                options: packageNames.map(name => ({
                    label: name,
                    value: name
                }))
            },
            {
                id: 'trend',
                label: 'Trend',
                options: [
                    { label: 'Increasing', value: 'up' },
                    { label: 'Decreasing', value: 'down' },
                    { label: 'Stable', value: 'stable' }
                ]
            }
        ]
    };
};

// Search helper functions for each data type
export const filterVotes = (votes: any[], searchTerm: string, filters: Record<string, string>): any[] => {
    // Don't filter if no search term and no filters
    if (!searchTerm && Object.keys(filters).length === 0) return votes;

    return votes.filter(vote => {
        // Search term filter - check across multiple fields
        const searchMatch = !searchTerm ||
            vote.proposalTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vote.proposalType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vote.rationale.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vote.proposalId.toLowerCase().includes(searchTerm.toLowerCase());

        // Apply individual filters
        const voteMatch = !filters.vote || vote.vote === filters.vote;
        const typeMatch = !filters.proposalType || vote.proposalType === filters.proposalType;

        return searchMatch && voteMatch && typeMatch;
    });
};

export const filterProposals = (projects: any[], searchTerm: string, filters: Record<string, string>): any[] => {
    // Don't filter if no search term and no filters
    if (!searchTerm && Object.keys(filters).length === 0) return projects;

    return projects.filter(project => {
        // Search term filter - check across multiple fields
        const searchMatch = !searchTerm ||
            project.projectDetails.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.projectDetails.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.projectDetails.project_id.toString().includes(searchTerm);

        // Extract funding round from category (first 3 characters)
        const fundingRound = project.projectDetails.category.substring(0, 3);

        // Apply individual filters
        const statusMatch = !filters.status || project.projectDetails.status === filters.status;
        const fundingRoundMatch = !filters.fundingRound || fundingRound === filters.fundingRound;

        return searchMatch && statusMatch && fundingRoundMatch;
    });
};

export const filterStats = (packageData: any[], searchTerm: string, filters: Record<string, string>): any[] => {
    // Don't filter if no search term and no filters
    if (!searchTerm && Object.keys(filters).length === 0) return packageData;

    return packageData.filter(pkg => {
        // Search term filter - check package name
        const searchMatch = !searchTerm ||
            pkg.name.toLowerCase().includes(searchTerm.toLowerCase());

        // Apply package filter
        const packageMatch = !filters.package || pkg.name === filters.package;
        // Note: trend filtering would need additional data that might not be available in packageData

        return searchMatch && packageMatch;
    });
}; 