import { useEffect, useRef, useState, useCallback } from "react";
import { api } from "./api";

export function useServerHealth({ auto = true, delay = 3000 } = {}) {
    const [status, setStatus] = useState("offline");
    const [loading, setLoading] = useState(true);
    const [timestamp, setTimestamp] = useState(null);

    const timeoutRef = useRef(null);
    const abortRef = useRef(null);

    const fetchHealth = useCallback(async () => {
        try {
            setLoading(true);
            if (abortRef.current) {
                abortRef.current.abort();
            }

            const controller = new AbortController();
            abortRef.current = controller;

            const data = await api.get("/health", {
                signal: controller.signal,
            });

            setStatus(data.status === "ok" ? "online" : "offline");
            setTimestamp(data.timestamp ?? null);

            console.info("serverHealth: Online");
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error("Failed to reach server:", err);
                setStatus("offline");
            }
        } finally {
            timeoutRef.current = setTimeout(() => {
                setLoading(false);
            }, delay);
        }
    }, [delay]);

    useEffect(() => {
        if (auto) {
            fetchHealth();
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (abortRef.current) abortRef.current.abort();
        };
    }, [auto, fetchHealth]);

    return {
        status,
        loading,
        timestamp,
        refresh: fetchHealth,
    };
}
