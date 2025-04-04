import fetchData from '../../lib/fetchData';

describe('fetchData', () => {
    // Store the original fetch function
    const originalFetch = global.fetch;

    // Clean up after tests
    afterEach(() => {
        global.fetch = originalFetch;
        jest.resetAllMocks();
    });

    it('should successfully fetch and parse JSON data', async () => {
        const mockData = { message: 'success' };
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData)
        });

        const result = await fetchData('https://api.example.com/data');
        expect(result).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/data');
    });

    it('should throw an error for 404 response', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 404
        });

        await expect(fetchData('https://api.example.com/notfound'))
            .rejects
            .toThrow('HTTP error! status: 404');
    });

    it('should throw an error for invalid JSON', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.reject(new Error('Invalid JSON'))
        });

        await expect(fetchData('https://api.example.com/invalid'))
            .rejects
            .toThrow('Failed to parse JSON response: Invalid JSON');
    });
}); 