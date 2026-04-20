import { TIMEOUT_SEC } from './config';

/**
 * Creates a timeout promise that rejects after a given number of seconds
 * Used to prevent hanging network requests
 */
const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(
                new Error(`Request took too long! Timeout after ${s} seconds`)
            );
        }, s * 1000);
    });
};

/**
 * Generic AJAX function (GET + POST)
 * Handles:
 * - Fetch request
 * - Timeout control
 * - JSON parsing
 * - Error handling
 */
export const AJAX = async function (url, uploadData = undefined) {
    try {
        // Decide request type: GET or POST
        const fetchPromise = uploadData
            ? fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(uploadData),
            })
            : fetch(url);

        // Race between fetch and timeout
        const res = await Promise.race([
            fetchPromise,
            timeout(TIMEOUT_SEC),
        ]);

        // Convert response to JSON
        const data = await res.json();

        // Handle HTTP errors (4xx / 5xx)
        if (!res.ok)
            throw new Error(
                `${data.message} (Status: ${res.status})`
            );

        return data;
    } catch (err) {
        // Re-throw error so controller can handle it
        throw err;
    }
};