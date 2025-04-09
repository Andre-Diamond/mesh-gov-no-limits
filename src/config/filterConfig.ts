import { SearchFilterConfig } from '../components/SearchFilterBar';

// Dashboard page - search across all data
export const dashboardFilterConfig: SearchFilterConfig = {
    placeholder: 'Search across votes, proposals, and stats...',
    filters: [
        {
            id: 'type',
            label: 'Result Type',
            options: [
                { label: 'DRep Votes', value: 'vote' },
                { label: 'Catalyst Proposals', value: 'proposal' },
                { label: 'Mesh Stats', value: 'stat' }
            ]
        }
    ]
};

// DRep Voting page - search and filter votes
export const drepVotingFilterConfig: SearchFilterConfig = {
    placeholder: 'Search votes by title, rationale, or type...',
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
            options: [
                { label: 'Parameter Change', value: 'ParameterChange' },
                { label: 'Treasury Withdrawal', value: 'TreasuryWithdrawal' },
                { label: 'InfoAction', value: 'InfoAction' },
                { label: 'Hard Fork', value: 'HardFork' },
                { label: 'New Constitution', value: 'NewConstitution' },
                { label: 'Update Committee', value: 'UpdateCommittee' }
            ]
        }
    ]
};

// Catalyst Proposals page - search and filter proposals
export const catalystProposalsFilterConfig: SearchFilterConfig = {
    placeholder: 'Search proposals by title, category, or status...',
    filters: [
        {
            id: 'status',
            label: 'Status',
            options: [
                { label: 'Completed', value: 'Completed' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'On Hold', value: 'On Hold' }
            ]
        },
        {
            id: 'category',
            label: 'Category',
            options: [
                { label: 'DApp', value: 'DApp' },
                { label: 'Developer Ecosystem', value: 'Developer Ecosystem' },
                { label: 'Governance', value: 'Governance' },
                { label: 'Identity', value: 'Identity' },
                { label: 'Infrastructure', value: 'Infrastructure' }
            ]
        }
    ]
};

// Mesh Stats page - search and filter stats
export const meshStatsFilterConfig: SearchFilterConfig = {
    placeholder: 'Search statistics by package name or trend...',
    filters: [
        {
            id: 'package',
            label: 'Package',
            options: [
                { label: 'Core', value: 'Core' },
                { label: 'React', value: 'React' },
                { label: 'Transaction', value: 'Transaction' },
                { label: 'Wallet', value: 'Wallet' },
                { label: 'Provider', value: 'Provider' },
                { label: 'Core CSL', value: 'Core CSL' },
                { label: 'Core CST', value: 'Core CST' }
            ]
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

// Search helper functions for each data type
export const filterVotes = (votes: any[], searchTerm: string, filters: Record<string, string>): any[] => {
    // Don't filter if no search term and no filters
    if (!searchTerm && Object.keys(filters).length === 0) return votes;

    return votes.filter(vote => {
        // Search term filter - check across multiple fields
        const searchMatch = !searchTerm ||
            vote.proposalTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vote.proposalType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vote.rationale.toLowerCase().includes(searchTerm.toLowerCase());

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
            project.projectDetails.category.toLowerCase().includes(searchTerm.toLowerCase());

        // Apply individual filters
        const statusMatch = !filters.status || project.projectDetails.status === filters.status;
        const categoryMatch = !filters.category || project.projectDetails.category === filters.category;

        return searchMatch && statusMatch && categoryMatch;
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