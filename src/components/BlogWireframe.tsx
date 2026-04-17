import React, { useState, useEffect } from 'react';

// Define Article Type based on NewsAPI structure
interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

const API_KEY = '3a363c8bef804c53acf63fae8ef7b24d';

const categories = [
  { id: 'general', label: 'World News', category: 'general' },
  { id: 'business', label: 'Finance & Business', category: 'business' },
  { id: 'technology', label: 'Technology', category: 'technology' },
  { id: 'science', label: 'Science', category: 'science' },
  { id: 'health', label: 'Health', category: 'health' },
  { id: 'sports', label: 'Sports', category: 'sports' },
  { id: 'entertainment', label: 'Entertainment', category: 'entertainment' },
];

const BlogWireframe = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        // Using NewsAPI top-headlines endpoint
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=${activeTab}&language=en&apiKey=${API_KEY}`
        );
        const data = await response.json();
        
        if (data.status === 'ok') {
          // Filter out articles that are removed or missing essential info
          const validArticles = data.articles.filter((a: Article) => a.title && a.title !== '[Removed]');
          setArticles(validArticles);
        } else {
          console.error("NewsAPI Error:", data.message);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white font-serif text-gray-900 w-full">
      {/* --- Top Navigation --- */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between font-sans">
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold tracking-tighter">NewsFlow</div>
            <div className="hidden md:flex items-center bg-gray-50 rounded-full px-4 py-2 ml-4 border border-transparent focus-within:border-gray-200">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search news" 
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-40 outline-none" 
              />
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <a href="#" className="hidden sm:block hover:text-black transition-colors">Write</a>
            <button className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
              Sign in
            </button>
          </div>
        </div>
      </header>

      {/* --- Category Bar --- */}
      <div className="border-b border-gray-100 sticky top-16 bg-white/95 backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto px-6 flex items-center space-x-8 h-12 font-sans text-sm text-gray-500 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => setActiveTab(cat.id)}
              className={`flex-shrink-0 pb-3 mt-3 border-b-2 transition-all duration-300 ${
                activeTab === cat.id ? 'border-black text-black' : 'border-transparent hover:text-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* --- Main Feed --- */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="space-y-12 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-16 bg-gray-100 rounded w-full"></div>
                  </div>
                  <div className="w-full md:w-48 h-32 bg-gray-100 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {articles.length > 0 ? (
                articles.map((article, index) => (
                  <article key={article.url + index} className="flex flex-col md:flex-row gap-8 group cursor-pointer text-left">
                    <div className="flex-1 flex flex-col justify-between order-2 md:order-1">
                      <div>
                        <div className="flex items-center space-x-2 text-xs font-sans mb-3">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                            {article.source.name.charAt(0)}
                          </div>
                          <span className="font-medium text-black">{article.source.name}</span>
                          {article.author && (
                            <>
                              <span className="text-gray-400">by</span>
                              <span className="font-medium text-black line-clamp-1">{article.author}</span>
                            </>
                          )}
                        </div>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                          <h2 className="text-xl md:text-2xl font-bold leading-tight mb-2 group-hover:text-gray-600 transition-colors">
                            {article.title}
                          </h2>
                          <p className="text-gray-500 font-sans text-sm line-clamp-3 mb-4 leading-relaxed">
                            {article.description}
                          </p>
                        </a>
                      </div>
                      <div className="flex items-center justify-between font-sans text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          <span>·</span>
                          <span className="bg-gray-100 px-2 py-1 rounded-full">{activeTab}</span>
                        </div>
                        <button className="hover:text-black">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {article.urlToImage && (
                      <div className="w-full md:w-48 h-32 md:h-40 overflow-hidden rounded order-1 md:order-2 bg-gray-50">
                        <img 
                          src={article.urlToImage} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          alt={article.title}
                          onError={(e) => (e.currentTarget.style.display = 'none')} 
                        />
                      </div>
                    )}
                  </article>
                )
              )) : (
                <div className="text-center py-20 font-sans text-gray-500">
                  No articles found for this category.
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- Sidebar --- */}
        <aside className="lg:col-span-4 space-y-12 hidden lg:block text-left border-l border-gray-100 pl-8">
          <div>
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider mb-6">Trending on NewsFlow</h3>
            <div className="space-y-6">
              {articles.slice(0, 4).map((article, i) => (
                <div key={`pick-${article.url + i}`} className="flex space-x-4">
                  <span className="text-2xl font-black text-gray-100">0{i+1}</span>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs font-sans">
                      <span className="font-bold text-black">{article.source.name}</span>
                    </div>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      <h4 className="font-bold leading-tight text-sm hover:text-gray-600 transition-colors line-clamp-2">{article.title}</h4>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky top-40 space-y-12">
            <div>
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider mb-4">Recommended topics</h3>
              <div className="flex flex-wrap gap-2 font-sans">
                {['Global Economy', 'AI Revolution', 'Market Shifts', 'Space Tech', 'Sustainability'].map(topic => (
                  <button 
                    key={topic} 
                    className="bg-gray-100 px-4 py-2 rounded-full text-xs hover:bg-gray-200 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
            
            <footer className="font-sans text-xs text-gray-400 flex flex-wrap gap-x-4 gap-y-2 pt-8 border-t border-gray-100">
              <a href="#" className="hover:text-black">Help</a>
              <a href="#" className="hover:text-black">Status</a>
              <a href="#" className="hover:text-black">About</a>
              <a href="#" className="hover:text-black">Careers</a>
              <a href="#" className="hover:text-black">Blog</a>
              <a href="#" className="hover:text-black">Privacy</a>
              <a href="#" className="hover:text-black">Terms</a>
            </footer>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default BlogWireframe;
