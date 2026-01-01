import { useState, useEffect, useRef } from "react";
import { api } from "./api";

export function useOfficeSearch({ minLength = 2, delay = 300 } = {}) {
    const [officeQuery, setOfficeQuery] = useState("");
    const [officeOptions, setOfficeOptions] = useState([]);
    const [officeLoading, setOfficeLoading] = useState(false);

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

                const data = await api.get(`/office?q=${encodeURIComponent(officeQuery)}`,);
                setOfficeOptions(data.offices || []);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Office search failed:", err);
                    setOfficeOptions([]);
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
    };
}
