"use client";

import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiClock, FiUsers, FiExternalLink } from 'react-icons/fi';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  interface Recipe {
    title: string;
    image: string;
    usedIngredientCount: number;
    missedIngredientCount: number;
    details?: {
      instructions?: string;
      readyInMinutes: number;
      servings: number;
      sourceUrl: string;
    };
  }

  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const handleSpoonacular = async () => {
    if (!ingredients.trim()) {
      setError('Please enter at least one ingredient');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      const res = await axios.get('/api/getRecipes', {
        params: { ingredients },
      });
      setRecipes(res.data.recipes);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Smart Recipe Generator 🍽️
          </h1>
          <p className="text-gray-400">
            Enter ingredients you have and discover delicious recipes!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Enter ingredients (e.g., chicken, potatoes, garlic)..."
              value={ingredients}
              onChange={(e) => {
                setIngredients(e.target.value);
                setError('');
              }}
              className="p-4 w-full bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSpoonacular()}
            />
            <button
              onClick={handleSpoonacular}
              disabled={isLoading}
              className={`absolute right-2 top-2 px-4 py-2 rounded-lg flex items-center gap-2 ${
                isLoading
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700'
              } text-white font-medium transition-all`}
            >
              {isLoading ? (
                'Searching...'
              ) : (
                <>
                  <FiSearch /> Find Recipes
                </>
              )}
            </button>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-red-400"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        <AnimatePresence>
          {recipes.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                Discovered Recipes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-48">
                      <img
                        src={r.image}
                        alt={r.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h3 className="text-xl font-bold text-white">{r.title}</h3>
                        <div className="flex gap-4 mt-2">
                          <span className="flex items-center text-sm text-green-400">
                            <FiUsers className="mr-1" /> {r.usedIngredientCount} used
                          </span>
                          <span className="flex items-center text-sm text-red-400">
                            {r.missedIngredientCount} missing
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      {r.details && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center text-gray-400">
                              <FiClock className="mr-1" /> {r.details.readyInMinutes} mins
                            </span>
                            <span className="flex items-center text-gray-400">
                              <FiUsers className="mr-1" /> {r.details.servings} servings
                            </span>
                          </div>
                          {r.details.instructions && (
                            <div>
                              <h4 className="font-semibold mb-1">Instructions</h4>
                              <p className="text-gray-300 text-sm line-clamp-3">
                                {r.details.instructions}
                              </p>
                            </div>
                          )}
                          <a
                            href={r.details.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors"
                          >
                            View full recipe <FiExternalLink className="ml-1" />
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {recipes.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500"
          >
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="text-xl mb-2">No recipes yet</h3>
            <p>Enter some ingredients to find delicious recipes!</p>
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-12"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </motion.div>
        )}
      </div>
    </main>
  );
}