import { useEffect, useState, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';

export function useFullList(collection, { filter, sort = '-created', expand, requestKey } = {}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const deps = `${collection}|${filter || ''}|${sort}|${expand || ''}|${requestKey || ''}`;

    useEffect(() => {
        let active = true;
        setLoading(true);
        pb.collection(collection)
            .getFullList({ filter, sort, expand, requestKey })
            .then((rows) => {
                if (active) {
                    setData(rows);
                    setError(null);
                }
            })
            .catch((err) => {
                if (active) setError(err);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deps]);

    const refresh = useCallback(() => {
        setLoading(true);
        pb.collection(collection)
            .getFullList({ filter, sort, expand, requestKey })
            .then((rows) => setData(rows))
            .catch((err) => setError(err))
            .finally(() => setLoading(false));
    }, [collection, filter, sort, expand, requestKey]);

    return { data, loading, error, refresh };
}

export async function fetchOneByFilter(collection, filter) {
    const rows = await pb.collection(collection).getList(1, 1, { filter });
    return rows.items[0] || null;
}

export function useOneByFilter(collection, filter, deps = '') {
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;
        setLoading(true);
        fetchOneByFilter(collection, filter)
            .then((r) => {
                if (active) setRecord(r);
            })
            .catch((err) => {
                if (active) setError(err);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collection, deps]);

    return { record, loading, error };
}

export function owner() {
    return pb.authStore.record?.id || '';
}
