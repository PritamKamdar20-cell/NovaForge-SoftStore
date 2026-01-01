import { Layout } from "@/components/Layout";
import { Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const newsItems = [
  {
    id: 1,
    title: "Welcome to NovaForge SoftStore!",
    excerpt: "We're excited to launch our software marketplace. Discover, download, and share amazing software across 7 platforms.",
    date: "December 2025",
    author: "NovaForge Team",
    category: "Announcement",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=300&fit=crop",
  },
  {
    id: 2,
    title: "How to Upload Your Software",
    excerpt: "Learn how to share your creations with the world. Our simple upload process supports multiple platforms and pricing options.",
    date: "December 2025",
    author: "Admin",
    category: "Guide",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Razorpay Integration Now Live",
    excerpt: "Authors can now set prices for their software using our secure Razorpay payment gateway integration.",
    date: "December 2025",
    author: "NovaForge Team",
    category: "Feature",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=300&fit=crop",
  },
];

const News = () => {
  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="container px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Latest <span className="gradient-text">News</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay updated with announcements, features, and guides from NovaForge SoftStore.
            </p>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {newsItems.map((news, index) => (
              <article
                key={news.id}
                className="software-card overflow-hidden animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-primary/80 text-primary-foreground">
                    {news.category}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {news.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {news.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {news.date}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Empty State Info */}
          <div className="text-center mt-12 p-8 glass-card max-w-md mx-auto">
            <p className="text-muted-foreground">
              More news coming soon! Check back regularly for updates from the NovaForge team.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default News;
