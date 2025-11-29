/**
 * Grid Component Usage Examples
 * 
 * This file demonstrates various ways to use the Grid component.
 */

import { Grid } from './Grid';
import { LoadingState } from '../LoadingState';

// Example 1: Basic usage with simple data
interface Product {
  id: number;
  name: string;
  price: number;
}

export function BasicGridExample() {
  const products: Product[] = [
    { id: 1, name: 'Product 1', price: 29.99 },
    { id: 2, name: 'Product 2', price: 39.99 },
    { id: 3, name: 'Product 3', price: 49.99 },
  ];

  return (
    <Grid
      items={products}
      renderItem={(product) => (
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-gray-600">${product.price}</p>
        </div>
      )}
      keyExtractor={(product) => product.id}
      columns={{ default: 1, sm: 2, md: 3 }}
      gap={4}
    />
  );
}

// Example 2: With loading state
export function GridWithLoadingExample() {
  const isLoading = true;
  const items: Product[] = [];

  return (
    <Grid
      items={items}
      renderItem={(product) => (
        <div className="p-4 border rounded-lg">
          <h3>{product.name}</h3>
        </div>
      )}
      keyExtractor={(product) => product.id}
      columns={{ default: 2, md: 4 }}
      isLoading={isLoading}
      loadingState={<LoadingState message="Loading products..." />}
    />
  );
}

// Example 3: With empty state
export function GridWithEmptyStateExample() {
  const items: Product[] = [];

  return (
    <Grid
      items={items}
      renderItem={(product) => (
        <div className="p-4 border rounded-lg">
          <h3>{product.name}</h3>
        </div>
      )}
      keyExtractor={(product) => product.id}
      columns={{ default: 2, md: 4 }}
      emptyState={
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded">
            Add Product
          </button>
        </div>
      }
    />
  );
}

// Example 4: Responsive grid with many breakpoints
interface Movie {
  id: number;
  title: string;
  posterPath: string;
  year: number;
}

export function ResponsiveMovieGridExample() {
  const movies: Movie[] = [
    { id: 1, title: 'Movie 1', posterPath: '/poster1.jpg', year: 2023 },
    { id: 2, title: 'Movie 2', posterPath: '/poster2.jpg', year: 2023 },
    { id: 3, title: 'Movie 3', posterPath: '/poster3.jpg', year: 2024 },
  ];

  return (
    <Grid
      items={movies}
      renderItem={(movie) => (
        <div className="group cursor-pointer">
          <div className="aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={movie.posterPath}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <h3 className="mt-2 font-medium truncate">{movie.title}</h3>
          <p className="text-sm text-gray-500">{movie.year}</p>
        </div>
      )}
      keyExtractor={(movie) => movie.id}
      columns={{
        default: 2,
        sm: 3,
        md: 4,
        lg: 5,
        xl: 6,
        '2xl': 7,
      }}
      gap={4}
      className="max-w-7xl mx-auto px-4"
    />
  );
}

// Example 5: Grid with custom gap
export function CustomGapGridExample() {
  const items = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    value: `Item ${i + 1}`,
  }));

  return (
    <Grid
      items={items}
      renderItem={(item) => (
        <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
          {item.value}
        </div>
      )}
      keyExtractor={(item) => item.id}
      columns={{ default: 3, md: 4, lg: 6 }}
      gap={8}
    />
  );
}

// Example 6: Grid with complex items
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export function UserGridExample() {
  const users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/avatar1.jpg',
      role: 'Admin',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: '/avatar2.jpg',
      role: 'User',
    },
  ];

  return (
    <Grid
      items={users}
      renderItem={(user) => (
        <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
              {user.role}
            </span>
          </div>
        </div>
      )}
      keyExtractor={(user) => user.id}
      columns={{ default: 1, md: 2, lg: 3 }}
      gap={6}
    />
  );
}
