import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Users, } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsFeedItem {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  type: 'recipe_feature' | 'cooking_tip' | 'event_announcement' | 'general_news';
  date: string;
}

interface CookingEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  maxParticipants: number;
  currentParticipants: number;
}

export default function HomePage() {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  // Sample data - replace with API calls
  const newsFeedItems: NewsFeedItem[] = [
    {
      id: 1,
      title: "New Seasonal Recipes for Spring",
      content: "Discover fresh ingredients and vibrant flavors with our latest spring recipe collection.",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      type: "recipe_feature",
      date: "2025-01-15"
    },
    {
      id: 2,
      title: "Master the Art of Sourdough Bread",
      content: "Learn the secrets of perfect sourdough from our community experts.",
      imageUrl: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=300&fit=crop",
      type: "cooking_tip",
      date: "2025-01-14"
    },
    {
      id: 3,
      title: "Upcoming Cooking Workshop: Asian Cuisine",
      content: "Join us for an exciting workshop on traditional Asian cooking techniques.",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      type: "event_announcement",
      date: "2025-01-13"
    }
  ];

  const cookingEvents: CookingEvent[] = [
    {
      id: 1,
      title: "Italian Pasta Making Workshop",
      description: "Learn to make authentic Italian pasta from scratch with Chef Maria Rossi",
      date: "2025-02-15",
      location: "FoodFusion Kitchen Studio",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      maxParticipants: 20,
      currentParticipants: 15
    },
    {
      id: 2,
      title: "Sushi Rolling Masterclass",
      description: "Master the art of sushi making with traditional techniques",
      date: "2025-02-22",
      location: "FoodFusion Kitchen Studio",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      maxParticipants: 15,
      currentParticipants: 8
    },
    {
      id: 3,
      title: "Baking Fundamentals",
      description: "Learn essential baking techniques and create delicious pastries",
      date: "2025-03-01",
      location: "FoodFusion Kitchen Studio",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      maxParticipants: 25,
      currentParticipants: 22
    }
  ];

  const nextEvent = () => {
    setCurrentEventIndex((prev) => (prev + 1) % cookingEvents.length);
  };

  const prevEvent = () => {
    setCurrentEventIndex((prev) => (prev - 1 + cookingEvents.length) % cookingEvents.length);
  };

  useEffect(() => {
    const interval = setInterval(nextEvent, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-100 to-Teal-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-600">
              FoodFusion
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A culinary platform dedicated to promoting home cooking and culinary 
            creativity among food enthusiasts. Share recipes, learn techniques, 
            and connect with fellow cooking enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4">
              Explore Recipes
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Join Community
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              At FoodFusion, we believe that cooking is more than just preparing food—it's an art, 
              a science, and a way to bring people together. Our mission is to inspire and empower 
              home cooks of all skill levels to explore new flavors, master cooking techniques, and 
              create memorable meals that nourish both body and soul.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#78C841]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍳</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Learn & Grow</h3>
              <p className="text-gray-600">
                Access comprehensive cooking tutorials, tips, and techniques from culinary experts
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#B4E50D]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect & Share</h3>
              <p className="text-gray-600">
                Join a vibrant community of food lovers and share your culinary creations
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF9B2F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Discover & Inspire</h3>
              <p className="text-gray-600">
                Explore diverse cuisines and recipes from around the world
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* News Feed Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Latest News & Updates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsFeedItems.map((item) => (
              <article key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.type === 'recipe_feature' ? 'bg-[#78C841]/20 text-[#78C841]' :
                      item.type === 'cooking_tip' ? 'bg-[#B4E50D]/20 text-[#B4E50D]' :
                      item.type === 'event_announcement' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-sm text-gray-500 ml-auto">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.content}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Cooking Events Carousel */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Upcoming Cooking Events
          </h2>
          
          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              <div className="flex transition-transform duration-500 ease-in-out">
                {cookingEvents.map((event, index) => (
                  <div 
                    key={event.id}
                    className={`w-full flex-shrink-0 ${index === currentEventIndex ? 'block' : 'hidden'}`}
                  >
                    <div className="bg-gray-50 rounded-lg p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                          <img 
                            src={event.imageUrl} 
                            alt={event.title}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h3>
                          <p className="text-gray-600 mb-6">{event.description}</p>
                          
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center text-gray-700">
                              <Calendar className="w-5 h-5 mr-3 text-[#78C841]" />
                              <span>{new Date(event.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <MapPin className="w-5 h-5 mr-3 text-[#B4E50D]" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Users className="w-5 h-5 mr-3 text-[#FF9B2F]" />
                              <span>{event.currentParticipants}/{event.maxParticipants} participants</span>
                            </div>
                          </div>
                          
                          <Button className="w-full sm:w-auto">
                            Register Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Arrows */}
            <button
              onClick={prevEvent}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextEvent}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
            
            {/* Dots Indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {cookingEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentEventIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentEventIndex ? 'bg-[#78C841]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
