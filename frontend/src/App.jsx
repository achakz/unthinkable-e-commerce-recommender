import React, { useState, useEffect } from 'react';

// --- Helper Components ---

const ProductCard = ({ product, onProductClick, onExplainClick, isRecommendation }) => {
    const tagsHtml = product.tags.map(tag => (
        <span key={tag} className="bg-gray-200 text-gray-700 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">{tag}</span>
    ));

    const actionButton = isRecommendation ? (
        <button
            className="w-full mt-4 bg-indigo-100 text-indigo-800 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-200 transition-colors"
            onClick={() => onExplainClick(product.id)}
        >
            Why Recommended?
        </button>
    ) : (
        <button
            className="w-full mt-4 bg-white text-indigo-600 font-semibold py-2 px-4 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            onClick={() => onProductClick(product.id)}
        >
            View Product
        </button>
    );

    return (
        <div className="product-card bg-white rounded-lg shadow-md overflow-hidden p-4 flex flex-col justify-between transition-transform transform hover:-translate-y-1">
            <div>
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600 font-bold mt-1">${product.price.toFixed(2)}</p>
                <div className="mt-2 flex flex-wrap gap-y-2">
                    {tagsHtml}
                </div>
            </div>
            {actionButton}
        </div>
    );
};

const ExplanationModal = ({ isOpen, onClose, explanation, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg transform transition-transform duration-300 scale-100">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-900">Why was this recommended?</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="mt-4 text-gray-600">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            <p className="ml-4 text-gray-500">Generating explanation...</p>
                        </div>
                    ) : (
                        <p>{explanation}</p>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- Main App Component ---

function App() {
    const [products, setProducts] = useState([]);
    const [userHistory, setUserHistory] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [explanation, setExplanation] = useState('');
    const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
    
    const API_URL = 'http://localhost:5001';

    // Fetch all products on initial load
    useEffect(() => {
        fetch(`${API_URL}/api/products`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Error fetching products:", err));
    }, []);

    const handleProductClick = (productId) => {
        if (!userHistory.includes(productId)) {
            setUserHistory(prevHistory => [...prevHistory, productId]);
        }
    };

    const handleGetRecommendations = () => {
        fetch(`${API_URL}/api/recommendations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userHistory })
        })
        .then(res => res.json())
        .then(data => setRecommendations(data))
        .catch(err => console.error("Error fetching recommendations:", err));
    };
    
    const handleGetExplanation = async (recommendedProductId) => {
        setIsModalOpen(true);
        setIsLoadingExplanation(true);

        try {
            const response = await fetch(`${API_URL}/api/explain`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userHistory, recommendedProductId })
            });
            const data = await response.json();
            setExplanation(data.explanation);
        } catch (err) {
            console.error("Error fetching explanation:", err);
            setExplanation("We ran into an issue generating this explanation. Please try again later.");
        } finally {
            setIsLoadingExplanation(false);
        }
    };

    const historyProducts = userHistory.map(id => products.find(p => p.id === id)).filter(Boolean);

    return (
        <div className="bg-gray-50 text-gray-800 font-sans">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <header className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">AI Product Recommender</h1>
                    <p className="mt-2 text-md text-gray-600">Click on products you like, then ask for recommendations!</p>
                </header>

                <main>
                    {/* User History Section */}
                    <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Browsing History</h2>
                        <div className="flex flex-wrap gap-4 items-center">
                            {historyProducts.length > 0 ? (
                                historyProducts.map(product => (
                                    <div key={product.id} className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                                        <img src={product.image} className="w-10 h-10 rounded-md object-cover" alt={product.name}/>
                                        <span className="text-sm font-medium">{product.name}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">You haven't viewed any products yet.</p>
                            )}
                        </div>
                        <button 
                            onClick={handleGetRecommendations}
                            disabled={userHistory.length === 0}
                            className="mt-4 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Get Recommendations
                        </button>
                    </section>
                    
                    {/* Recommendations Section */}
                    {recommendations.length > 0 && (
                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Products You Might Like</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                               {recommendations.map(product => (
                                   <ProductCard 
                                      key={product.id}
                                      product={product}
                                      onExplainClick={handleGetExplanation}
                                      isRecommendation={true}
                                   />
                               ))}
                            </div>
                        </section>
                    )}

                    {/* Product Catalog Section */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Product Catalog</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map(product => (
                                <ProductCard 
                                    key={product.id}
                                    product={product}
                                    onProductClick={handleProductClick}
                                    isRecommendation={false}
                                />
                            ))}
                        </div>
                    </section>
                </main>
            </div>
            
            <ExplanationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                explanation={explanation}
                isLoading={isLoadingExplanation}
            />
        </div>
    );
}

export default App;
