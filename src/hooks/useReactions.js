import { useCallback } from 'react';
import api from '../api/client';
import { getVisitorId } from '../utils/visitor';

/**
 * Returns stable like/dislike handlers that call the API and merge the
 * returned picture back into whichever state setter you pass in.
 */
export function useReactions(setPictures) {
  const like = useCallback(
    async (id) => {
      const visitorId = getVisitorId();
      const { data } = await api.post(`/pictures/${id}/like`, { visitorId });
      setPictures((prev) => prev.map((p) => (p._id === id ? { ...p, ...data } : p)));
    },
    [setPictures]
  );

  const dislike = useCallback(
    async (id) => {
      const visitorId = getVisitorId();
      const { data } = await api.post(`/pictures/${id}/dislike`, { visitorId });
      setPictures((prev) => prev.map((p) => (p._id === id ? { ...p, ...data } : p)));
    },
    [setPictures]
  );

  return { like, dislike };
}
