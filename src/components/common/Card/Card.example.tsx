/**
 * Example usage of the Card component
 * This file demonstrates various ways to use the generic Card component
 */

import { Card } from "./Card";

// Example 1: Simple movie card
interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  posterUrl: string;
}

export function MovieCardExample() {
  const movie: Movie = {
    id: 1,
    title: "The Shawshank Redemption",
    year: 1994,
    rating: 9.3,
    posterUrl: "/poster.jpg",
  };

  return (
    <Card<Movie>
      data={movie}
      variant="elevated"
      padding="lg"
      enableHoverEffect
      renderContent={(movie) => (
        <div className="space-y-2">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full rounded-md"
          />
          <h3 className="text-lg font-semibold">{movie.title}</h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{movie.year}</span>
            <span>⭐ {movie.rating}</span>
          </div>
        </div>
      )}
      renderActions={(movie) => (
        <>
          <button className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground">
            Watch
          </button>
          <button className="rounded-md border px-3 py-1 text-sm">
            Add to List
          </button>
        </>
      )}
      onClick={(movie) => console.log("Clicked movie:", movie.id)}
    />
  );
}

// Example 2: User profile card with 3D effect
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export function UserCardExample() {
  const user: User = {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatar.jpg",
    role: "Developer",
  };

  return (
    <Card<User>
      data={user}
      variant="outlined"
      padding="md"
      enable3DEffect
      enableHoverEffect
      renderContent={(user) => (
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-16 w-16 rounded-full"
          />
          <div>
            <h4 className="font-semibold">{user.name}</h4>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <span className="text-xs text-muted-foreground">{user.role}</span>
          </div>
        </div>
      )}
    />
  );
}

// Example 3: Generic data card (works with any type)
interface Product {
  sku: string;
  name: string;
  price: number;
  inStock: boolean;
}

export function ProductCardExample() {
  const product: Product = {
    sku: "PROD-001",
    name: "Wireless Headphones",
    price: 99.99,
    inStock: true,
  };

  return (
    <Card<Product>
      data={product}
      variant="default"
      padding="sm"
      className="max-w-sm"
      renderContent={(product) => (
        <div>
          <h5 className="font-medium">{product.name}</h5>
          <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-bold">${product.price}</span>
            <span
              className={`text-xs ${
                product.inStock ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      )}
      onClick={(product) => console.log("View product:", product.sku)}
    />
  );
}

// Example 4: Minimal card without actions
interface Notification {
  id: string;
  message: string;
  timestamp: Date;
}

export function NotificationCardExample() {
  const notification: Notification = {
    id: "notif-1",
    message: "Your order has been shipped",
    timestamp: new Date(),
  };

  return (
    <Card<Notification>
      data={notification}
      variant="ghost"
      padding="sm"
      renderContent={(notif) => (
        <div className="flex items-start gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
          <div className="flex-1">
            <p className="text-sm">{notif.message}</p>
            <span className="text-xs text-muted-foreground">
              {notif.timestamp.toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    />
  );
}
