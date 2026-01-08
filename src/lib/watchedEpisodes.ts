import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface WatchedEpisode {
    odcinekId: string;
    tmdbId: number;
    seasonNumber: number;
    episodeNumber: number;
    watchedAt: Date;
}

class WatchedEpisodesService {
    private getEpisodeId(tmdbId: number, seasonNumber: number, episodeNumber: number): string {
        return `${tmdbId}_s${seasonNumber}_e${episodeNumber}`;
    }

    async markAsWatched(
        userId: string,
        tmdbId: number,
        seasonNumber: number,
        episodeNumber: number
    ): Promise<void> {
        const episodeId = this.getEpisodeId(tmdbId, seasonNumber, episodeNumber);
        const episodeRef = doc(db, 'users', userId, 'watchedEpisodes', episodeId);

        await setDoc(episodeRef, {
            tmdbId,
            seasonNumber,
            episodeNumber,
            watchedAt: Timestamp.now()
        });
    }

    async markAsUnwatched(
        userId: string,
        tmdbId: number,
        seasonNumber: number,
        episodeNumber: number
    ): Promise<void> {
        const episodeId = this.getEpisodeId(tmdbId, seasonNumber, episodeNumber);
        const episodeRef = doc(db, 'users', userId, 'watchedEpisodes', episodeId);

        await deleteDoc(episodeRef);
    }

    async getWatchedEpisodesForShow(userId: string, tmdbId: number): Promise<WatchedEpisode[]> {
        const watchedRef = collection(db, 'users', userId, 'watchedEpisodes');
        const q = query(watchedRef, where('tmdbId', '==', tmdbId));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            odcinekId: doc.id,
            tmdbId: doc.data().tmdbId,
            seasonNumber: doc.data().seasonNumber,
            episodeNumber: doc.data().episodeNumber,
            watchedAt: doc.data().watchedAt.toDate()
        }));
    }

    async getMostRecentWatchedEpisodes(userId: string, limitCount: number = 50): Promise<WatchedEpisode[]> {
        const watchedRef = collection(db, 'users', userId, 'watchedEpisodes');
        const q = query(watchedRef, orderBy('watchedAt', 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            odcinekId: doc.id,
            tmdbId: doc.data().tmdbId,
            seasonNumber: doc.data().seasonNumber,
            episodeNumber: doc.data().episodeNumber,
            watchedAt: doc.data().watchedAt.toDate()
        }));
    }

    async isEpisodeWatched(
        userId: string,
        tmdbId: number,
        seasonNumber: number,
        episodeNumber: number
    ): Promise<boolean> {
        const episodeId = this.getEpisodeId(tmdbId, seasonNumber, episodeNumber);
        const episodeRef = doc(db, 'users', userId, 'watchedEpisodes', episodeId);
        const snapshot = await getDocs(query(collection(db, 'users', userId, 'watchedEpisodes'), where('__name__', '==', episodeId)));

        return !snapshot.empty;
    }
}

export const watchedEpisodesService = new WatchedEpisodesService();
