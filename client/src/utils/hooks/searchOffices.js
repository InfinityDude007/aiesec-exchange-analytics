import { useState, useEffect, useRef } from "react";
import { api } from "./api";

export function useOfficeSearch({ minLength = 2, delay = 300 } = {}) {
    const [officeQuery, setOfficeQuery] = useState("");
    const [officeOptions, setOfficeOptions] = useState([]);
    const [officeLoading, setOfficeLoading] = useState(false);
    const [error, setError] = useState(null);

    const debounceRef = useRef(null);
    const abortRef = useRef(null);

    useEffect(() => {
        if (officeQuery.trim().length < minLength) {
            setOfficeOptions([]);
            return;
        }

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
            if (abortRef.current) {
                abortRef.current.abort();
            }

            const controller = new AbortController();
            abortRef.current = controller;

            try {
                setOfficeLoading(true);
                setError(null);

                const data = await api.get(`/office?q=${encodeURIComponent(officeQuery)}`,);
                setOfficeOptions(data.offices || []);
            } catch (err) {
                if (err.name === "AbortError") return;

                console.error("Office search failed:", err);

                const statusFromMessage = (() => {
                    const msg = String(err?.message || "").match(/Error\s+(\d{3})\s*:/);
                    return msg ? Number(msg[1]) : undefined;
                })();

                if (statusFromMessage === 406) {
                    setError("Invalid account type, please use an EXPA account with correct permissions.");
                } else {
                    setError("Office search failed, please logout and retry.")
                }
            } finally {
                setOfficeLoading(false);
            }
        }, delay);

        return () => clearTimeout(debounceRef.current);
    }, [officeQuery, delay, minLength]);

    const clearOffices = () => {
        setOfficeQuery("");
        setOfficeOptions([]);
    };

    return {
        officeQuery,
        setOfficeQuery,
        officeOptions,
        officeLoading,
        clearOffices,
        error,
    };
}
