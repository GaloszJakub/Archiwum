import { Calendar, Star, Clock, Film, Tv } from "lucide-react";
import { InfoBadge } from "./InfoBadge";

/**
 * Example usage of the InfoBadge component.
 * Demonstrates different variants, sizes, and configurations.
 */
export function InfoBadgeExample() {
  return (
    <div className="space-y-8 p-8">
      {/* Year Badges */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">Year Badges</h3>
        <div className="flex flex-wrap gap-2">
          <InfoBadge icon={Calendar} value="2024" variant="year" />
          <InfoBadge icon={Calendar} label="Year" value="2023" variant="year" />
          <InfoBadge value="2022" variant="year" size="sm" />
          <InfoBadge icon={Calendar} value="2021" variant="year" size="lg" />
        </div>
      </section>

      {/* Rating Badges */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">Rating Badges</h3>
        <div className="flex flex-wrap gap-2">
          <InfoBadge icon={Star} value="8.5" variant="rating" />
          <InfoBadge icon={Star} label="Rating" value="9.2" variant="rating" />
          <InfoBadge icon={Star} value="7.8" variant="rating" size="sm" />
          <InfoBadge icon={Star} value="6.5" variant="rating" size="lg" />
        </div>
      </section>

      {/* Genre Badges */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">Genre Badges</h3>
        <div className="flex flex-wrap gap-2">
          <InfoBadge value="Action" variant="genre" />
          <InfoBadge value="Drama" variant="genre" />
          <InfoBadge value="Comedy" variant="genre" />
          <InfoBadge value="Sci-Fi" variant="genre" size="sm" />
          <InfoBadge value="Thriller" variant="genre" size="lg" />
        </div>
      </section>

      {/* Duration Badges */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">Duration Badges</h3>
        <div className="flex flex-wrap gap-2">
          <InfoBadge icon={Clock} value="2h 30m" variant="duration" />
          <InfoBadge icon={Clock} label="Runtime" value="1h 45m" variant="duration" />
          <InfoBadge icon={Clock} value="3h 15m" variant="duration" size="sm" />
          <InfoBadge icon={Clock} value="90 min" variant="duration" size="lg" />
        </div>
      </section>

      {/* Status Badges */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">Status Badges</h3>
        <div className="flex flex-wrap gap-2">
          <InfoBadge icon={Tv} value="Ongoing" variant="status" />
          <InfoBadge icon={Film} value="Released" variant="status" />
          <InfoBadge value="Completed" variant="status" size="sm" />
          <InfoBadge value="Upcoming" variant="status" size="lg" />
        </div>
      </section>

      {/* Default Badges */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">Default Badges</h3>
        <div className="flex flex-wrap gap-2">
          <InfoBadge value="HD" variant="default" />
          <InfoBadge label="Quality" value="4K" variant="default" />
          <InfoBadge value="Subtitled" variant="default" size="sm" />
          <InfoBadge value="Original Audio" variant="default" size="lg" />
        </div>
      </section>

      {/* Mixed Usage Example */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">Movie Card Example</h3>
        <div className="rounded-lg border bg-card p-4">
          <h4 className="mb-2 text-base font-semibold">The Matrix</h4>
          <div className="flex flex-wrap gap-2">
            <InfoBadge icon={Calendar} value="1999" variant="year" />
            <InfoBadge icon={Star} value="8.7" variant="rating" />
            <InfoBadge icon={Clock} value="2h 16m" variant="duration" />
            <InfoBadge value="Sci-Fi" variant="genre" />
            <InfoBadge value="Action" variant="genre" />
          </div>
        </div>
      </section>

      {/* TV Show Example */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">TV Show Example</h3>
        <div className="rounded-lg border bg-card p-4">
          <h4 className="mb-2 text-base font-semibold">Breaking Bad</h4>
          <div className="flex flex-wrap gap-2">
            <InfoBadge icon={Calendar} value="2008-2013" variant="year" />
            <InfoBadge icon={Star} value="9.5" variant="rating" />
            <InfoBadge icon={Tv} value="5 Seasons" variant="status" />
            <InfoBadge value="Drama" variant="genre" />
            <InfoBadge value="Crime" variant="genre" />
          </div>
        </div>
      </section>

      {/* Custom Styling Example */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">Custom Styling</h3>
        <div className="flex flex-wrap gap-2">
          <InfoBadge
            icon={Star}
            value="Featured"
            variant="rating"
            className="border-2 border-yellow-500"
          />
          <InfoBadge
            value="New Release"
            variant="year"
            className="animate-pulse"
          />
          <InfoBadge
            icon={Film}
            value="Premium"
            variant="default"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          />
        </div>
      </section>
    </div>
  );
}
