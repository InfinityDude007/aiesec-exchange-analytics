import { useState, useCallback } from "react";
import { api } from "./api";

export function useAnalytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAnalytics = useCallback(async (filters) => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.get("/analytics", filters);
            setData(res.analytics);
        } catch (err) {
            console.error(err);
            setError("Failed to load analytics");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        data,
        loading,
        error,
        fetchAnalytics,
    };
}
