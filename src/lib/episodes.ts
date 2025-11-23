import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';

export interface StreamingLink {
  provider: string; // np. "doodstream", "voe.sx"
  url: string;
  quality?: string; // np. "1080p", "720p"
  version?: string; // np. "Lektor", "Napisy", "Dubbing"
  dateAdded?: string;
}

export interface Episode {
  id: string;
  tmdbId: number; // ID serialu/filmu z TMDB
  type: 'movie' | 'tv'; // Typ: film lub serial
  seasonNumber?: number; // Tylko dla seriali
  episodeNumber?: number; // Tylko dla seriali
  title?: string;
  link: string; // DEPRECATED - użyj links
  links?: StreamingLink[]; // Nowe: wiele linków streamingowych
  quality?: string; // DEPRECATED
  language?: string; // DEPRECATED
  addedBy: string; // UID użytkownika który dodał
  addedAt: Date;
  updatedAt: Date;
}

class EpisodesService {
  // Add or update movie/episode link
  async addLink(
    tmdbId: number,
    type: 'movie' | 'tv',
    link: string,
    userId: string,
    options?: {
      seasonNumber?: number;
      episodeNumber?: number;
      title?: string;
      quality?: string;
      language?: string;
    }
  ): Promise<void> {
    let episodeId: string;
    
    if (type === 'movie') {
      episodeId = `${tmdbId}_movie`;
    } else {
      episodeId = `${tmdbId}_s${options?.seasonNumber}_e${options?.episodeNumber}`;
    }
    
    const episodeRef = doc(db, 'episodes', episodeId);

    await setDoc(
      episodeRef,
      {
        tmdbId,
        type,
        seasonNumber: options?.seasonNumber || null,
        episodeNumber: options?.episodeNumber || null,
        title: options?.title || '',
        link,
        quality: options?.quality || '',
        language: options?.language || 'PL',
        addedBy: userId,
        addedAt: new Date(),
        updatedAt: new Date(),
      },
      { merge: true }
    );
  }

  // Legacy method for backward compatibility
  async addEpisodeLink(
    tmdbId: number,
    seasonNumber: number,
    episodeNumber: number,
    link: string,
    userId: string,
    options?: {
      title?: string;
      quality?: string;
      language?: string;
    }
  ): Promise<void> {
    return this.addLink(tmdbId, 'tv', link, userId, {
      seasonNumber,
      episodeNumber,
      ...options,
    });
  }

  // Get episode link
  async getEpisodeLink(
    tmdbId: number,
    seasonNumber: number,
    episodeNumber: number
  ): Promise<Episode | null> {
    const episodeId = `${tmdbId}_s${seasonNumber}_e${episodeNumber}`;
    const episodeRef = doc(db, 'episodes', episodeId);
    const episodeDoc = await getDoc(episodeRef);

    if (!episodeDoc.exists()) {
      return null;
    }

    const data = episodeDoc.data();
    return {
      id: episodeDoc.id,
      tmdbId: data.tmdbId,
      type: data.type || 'tv',
      seasonNumber: data.seasonNumber,
      episodeNumber: data.episodeNumber,
      title: data.title,
      link: data.link,
      links: data.links || [], // Dodaj array linków
      quality: data.quality,
      language: data.language,
      addedBy: data.addedBy,
      addedAt: data.addedAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }

  // Get all episodes for a season
  async getSeasonEpisodes(tmdbId: number, seasonNumber: number): Promise<Episode[]> {
    const episodesRef = collection(db, 'episodes');
    const q = query(
      episodesRef,
      where('tmdbId', '==', tmdbId),
      where('seasonNumber', '==', seasonNumber),
      orderBy('episodeNumber', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        tmdbId: data.tmdbId,
        type: data.type || 'tv',
        seasonNumber: data.seasonNumber,
        episodeNumber: data.episodeNumber,
        title: data.title,
        link: data.link,
        links: data.links || [], // Dodaj array linków
        quality: data.quality,
        language: data.language,
        addedBy: data.addedBy,
        addedAt: data.addedAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    });
  }

  // Get all episodes for a series
  async getSeriesEpisodes(tmdbId: number): Promise<Episode[]> {
    const episodesRef = collection(db, 'episodes');
    const q = query(
      episodesRef,
      where('tmdbId', '==', tmdbId),
      orderBy('seasonNumber', 'asc'),
      orderBy('episodeNumber', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        tmdbId: data.tmdbId,
        type: data.type || 'tv',
        seasonNumber: data.seasonNumber,
        episodeNumber: data.episodeNumber,
        title: data.title,
        link: data.link,
        links: data.links || [], // Dodaj array linków
        quality: data.quality,
        language: data.language,
        addedBy: data.addedBy,
        addedAt: data.addedAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    });
  }

  // Delete episode link
  async deleteEpisodeLink(
    tmdbId: number,
    seasonNumber: number,
    episodeNumber: number
  ): Promise<void> {
    const episodeId = `${tmdbId}_s${seasonNumber}_e${episodeNumber}`;
    const episodeRef = doc(db, 'episodes', episodeId);
    await deleteDoc(episodeRef);
  }

  // Check if episode has link
  async hasEpisodeLink(
    tmdbId: number,
    seasonNumber: number,
    episodeNumber: number
  ): Promise<boolean> {
    const episode = await this.getEpisodeLink(tmdbId, seasonNumber, episodeNumber);
    return episode !== null;
  }

  // Get movie links
  async getMovieLinks(tmdbId: number): Promise<Episode[]> {
    const episodesRef = collection(db, 'episodes');
    const q = query(
      episodesRef,
      where('tmdbId', '==', tmdbId),
      where('type', '==', 'movie')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        tmdbId: data.tmdbId,
        type: data.type,
        seasonNumber: data.seasonNumber,
        episodeNumber: data.episodeNumber,
        title: data.title,
        link: data.link,
        links: data.links || [], // Dodaj array linków
        quality: data.quality,
        language: data.language,
        addedBy: data.addedBy,
        addedAt: data.addedAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    });
  }

  // Delete movie link
  async deleteMovieLink(tmdbId: number, linkId: string): Promise<void> {
    const episodeRef = doc(db, 'episodes', linkId);
    await deleteDoc(episodeRef);
  }
}

export const episodesService = new EpisodesService();
