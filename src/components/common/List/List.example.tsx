import { useState } from 'react';
import { List } from './List';
import { Loader2 } from 'lucide-react';

// Example 1: Simple list with basic items
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export function SimpleListExample() {
  const tasks: Task[] = [
    { id: 1, title: 'Complete project documentation', completed: false },
    { id: 2, title: 'Review pull requests', completed: true },
    { id: 3, title: 'Update dependencies', completed: false },
  ];

  return (
    <List
      items={tasks}
      renderItem={(task) => (
        <div className="flex items-center gap-3 p-3 border rounded-lg">
          <input
            type="checkbox"
            checked={task.completed}
            readOnly
            className="h-4 w-4"
          />
          <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
            {task.title}
          </span>
        </div>
      )}
      keyExtractor={(task) => task.id}
    />
  );
}

// Example 2: List with infinite scroll
interface Post {
  id: number;
  title: string;
  excerpt: string;
  author: string;
}

export function InfiniteScrollListExample() {
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, title: 'First Post', excerpt: 'This is the first post...', author: 'John' },
    { id: 2, title: 'Second Post', excerpt: 'This is the second post...', author: 'Jane' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const loadMorePosts = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newPosts: Post[] = [
      {
        id: posts.length + 1,
        title: `Post ${posts.length + 1}`,
        excerpt: `This is post number ${posts.length + 1}...`,
        author: 'User',
      },
      {
        id: posts.length + 2,
        title: `Post ${posts.length + 2}`,
        excerpt: `This is post number ${posts.length + 2}...`,
        author: 'User',
      },
    ];
    
    setPosts((prev) => [...prev, ...newPosts]);
    setIsLoading(false);
  };

  return (
    <List
      items={posts}
      renderItem={(post) => (
        <article className="p-4 border rounded-lg hover:bg-accent transition-colors">
          <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
          <p className="text-muted-foreground mb-2">{post.excerpt}</p>
          <p className="text-sm text-muted-foreground">By {post.author}</p>
        </article>
      )}
      keyExtractor={(post) => post.id}
      isLoading={isLoading}
      onEndReached={loadMorePosts}
      onEndReachedThreshold={300}
    />
  );
}

// Example 3: List with custom empty and loading states
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export function CustomStatesListExample() {
  const [users] = useState<User[]>([]);
  const [isLoading] = useState(false);

  return (
    <List
      items={users}
      renderItem={(user) => (
        <div className="flex items-center gap-4 p-4 border rounded-lg">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-semibold">{user.name[0]}</span>
          </div>
          <div className="flex-1">
            <h4 className="font-medium">{user.name}</h4>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      )}
      keyExtractor={(user) => user.id}
      isLoading={isLoading}
      emptyState={
        <div className="flex flex-col items-center justify-center py-16">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="text-2xl">👥</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">No users found</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            There are no users to display. Try adjusting your search filters or add new users.
          </p>
        </div>
      }
      loadingState={
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      }
    />
  );
}

// Example 4: List with complex items and interactions
interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  genres: string[];
  posterUrl: string;
}

export function ComplexListExample() {
  const movies: Movie[] = [
    {
      id: 1,
      title: 'The Shawshank Redemption',
      year: 1994,
      rating: 9.3,
      genres: ['Drama'],
      posterUrl: '/placeholder.jpg',
    },
    {
      id: 2,
      title: 'The Godfather',
      year: 1972,
      rating: 9.2,
      genres: ['Crime', 'Drama'],
      posterUrl: '/placeholder.jpg',
    },
    {
      id: 3,
      title: 'The Dark Knight',
      year: 2008,
      rating: 9.0,
      genres: ['Action', 'Crime', 'Drama'],
      posterUrl: '/placeholder.jpg',
    },
  ];

  const handleMovieClick = (movie: Movie) => {
    console.log('Selected movie:', movie.title);
  };

  return (
    <List
      items={movies}
      renderItem={(movie) => (
        <div
          className="flex gap-4 p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
          onClick={() => handleMovieClick(movie)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleMovieClick(movie);
            }
          }}
        >
          <div className="flex-shrink-0">
            <div className="h-24 w-16 bg-muted rounded flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Poster</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-lg truncate">{movie.title}</h3>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-yellow-500">⭐</span>
                <span className="font-medium">{movie.rating}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{movie.year}</p>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      keyExtractor={(movie) => movie.id}
      className="max-w-3xl mx-auto"
    />
  );
}

// Example 5: List with index-based rendering
interface Message {
  id: string;
  text: string;
  timestamp: Date;
  sender: string;
}

export function IndexBasedListExample() {
  const messages: Message[] = [
    { id: '1', text: 'Hello!', timestamp: new Date(), sender: 'Alice' },
    { id: '2', text: 'Hi there!', timestamp: new Date(), sender: 'Bob' },
    { id: '3', text: 'How are you?', timestamp: new Date(), sender: 'Alice' },
  ];

  return (
    <List
      items={messages}
      renderItem={(message, index) => (
        <div className="flex flex-col gap-1 p-3 border-b last:border-b-0">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">{message.sender}</span>
            <span className="text-xs text-muted-foreground">
              Message #{index + 1}
            </span>
          </div>
          <p className="text-sm">{message.text}</p>
        </div>
      )}
      keyExtractor={(message) => message.id}
    />
  );
}
