/**
 * Domain types barrel export
 * 
 * This module exports all domain model types used throughout the application.
 * Domain types represent the core business entities and are independent of
 * external API structures or UI concerns.
 */

// Media types
export type { MediaItem, Movie, TVShow } from './media';

// Season and Episode types
export type { Season, Episode } from './season';

// Collection types
export type { Collection, CollectionItem } from './collection';

// Genre types
export type { Genre } from './genre';
