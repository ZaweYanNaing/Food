import { Users, Heart, Target, Award, ChefHat, Globe, BookOpen, Users2 } from 'lucide-react';

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Chef Sarah Johnson",
      role: "Head Chef & Culinary Director",
      bio: "With over 15 years of experience in fine dining and culinary education, Sarah leads our culinary vision and recipe development.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      specialties: ["French Cuisine", "Pastry Arts", "Culinary Education"]
    },
    {
      name: "Marco Rodriguez",
      role: "Community Manager",
      bio: "Marco fosters our vibrant community of food enthusiasts, organizing events and ensuring everyone feels welcome.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      specialties: ["Community Building", "Event Planning", "Social Media"]
    },
    {
      name: "Dr. Emily Chen",
      role: "Nutrition & Wellness Expert",
      bio: "Emily brings scientific expertise to our platform, ensuring our recipes are both delicious and nutritionally balanced.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      specialties: ["Nutrition Science", "Dietary Restrictions", "Healthy Cooking"]
    },
    {
      name: "James Wilson",
      role: "Technology Lead",
      bio: "James ensures our platform is user-friendly and accessible, making cooking resources available to everyone.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      specialties: ["Web Development", "User Experience", "Accessibility"]
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Food",
      description: "We believe that cooking should be a joyful, creative experience that brings people together."
    },
    {
      icon: Target,
      title: "Quality & Excellence",
      description: "Every recipe, tutorial, and resource is crafted with care to ensure the best possible learning experience."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Our platform thrives on the connections and knowledge sharing between food enthusiasts worldwide."
    },
    {
      icon: Globe,
      title: "Cultural Diversity",
      description: "We celebrate and promote cuisines from around the world, fostering cultural understanding through food."
    },
    {
      icon: BookOpen,
      title: "Continuous Learning",
      description: "We're committed to providing ongoing education and resources for cooks at every skill level."
    },
    {
      icon: Award,
      title: "Innovation",
      description: "We embrace new techniques, ingredients, and approaches to keep cooking exciting and relevant."
    }
  ];

  const milestones = [
    {
      year: "2020",
      title: "FoodFusion Founded",
      description: "Started with a simple mission: make cooking accessible to everyone"
    },
    {
      year: "2021",
      title: "First 1000 Members",
      description: "Our community began to grow, sharing recipes and cooking tips"
    },
    {
      year: "2022",
      title: "Mobile App Launch",
      description: "Brought FoodFusion to mobile devices for cooking on the go"
    },
    {
      year: "2023",
      title: "International Expansion",
      description: "Added support for multiple languages and global cuisines"
    },
    {
      year: "2024",
      title: "100,000+ Recipes",
      description: "Our community cookbook reached a major milestone"
    },
    {
      year: "2025",
      title: "Future Vision",
      description: "Continuing to innovate and inspire the next generation of home cooks"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About FoodFusion
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Discover the story behind our mission to revolutionize home cooking and 
            build a global community of culinary enthusiasts.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                FoodFusion was born from a simple observation: while the internet was full of recipes, 
                there was no central place where home cooks could learn, share, and grow together. 
                We envisioned a platform that would not only provide recipes but also foster a community 
                of passionate food lovers.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                What started as a small group of friends sharing family recipes has grown into a 
                global community of over 100,000 members, each contributing their unique culinary 
                heritage and expertise to our shared cookbook.
              </p>
              <p className="text-lg text-gray-600">
                Today, FoodFusion stands as a testament to the power of community and the universal 
                language of food. We're proud to have created a space where beginners and experts 
                alike can explore, learn, and celebrate the art of cooking.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop"
                alt="Cooking together"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-orange-600 text-white p-4 rounded-lg">
                <p className="text-sm font-semibold">Since 2020</p>
                <p className="text-xs">Building community through food</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do at FoodFusion, from recipe development 
              to community building and platform design.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind FoodFusion who work tirelessly to make our 
              platform the best it can be for our community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-orange-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  <div className="space-y-1">
                    {member.specialties.map((specialty, idx) => (
                      <span 
                        key={idx}
                        className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mr-2 mb-1"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From humble beginnings to a thriving global community, here's how FoodFusion 
              has grown over the years.
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px w-0.5 h-full bg-orange-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}>
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-600 rounded-full border-4 border-white shadow-lg"></div>
                  
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="text-2xl font-bold text-orange-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Be part of the FoodFusion family and help us continue building the world's 
            most vibrant culinary community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started Today
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
