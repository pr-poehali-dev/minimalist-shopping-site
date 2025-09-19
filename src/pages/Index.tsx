import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ClothingItem {
  id: string;
  name: string;
  price: number;
  category: 'top' | 'bottom' | 'shoes' | 'accessories';
  image: string;
}

interface MannequinOutfit {
  top?: ClothingItem;
  bottom?: ClothingItem;
  shoes?: ClothingItem;
  accessories?: ClothingItem;
}

const sampleClothing: ClothingItem[] = [
  {
    id: '1',
    name: 'Классическая белая рубашка',
    price: 3500,
    category: 'top',
    image: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Темные джинсы',
    price: 4200,
    category: 'bottom',
    image: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Кожаные ботинки',
    price: 8500,
    category: 'shoes',
    image: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Минималистичная сумка',
    price: 5200,
    category: 'accessories',
    image: '/placeholder.svg'
  },
  {
    id: '5',
    name: 'Серый свитер',
    price: 2800,
    category: 'top',
    image: '/placeholder.svg'
  },
  {
    id: '6',
    name: 'Черные брюки',
    price: 3800,
    category: 'bottom',
    image: '/placeholder.svg'
  }
];

export default function Index() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'cart'>('home');
  const [hoveredItem, setHoveredItem] = useState<ClothingItem | null>(null);
  const [mannequinOutfit, setMannequinOutfit] = useState<MannequinOutfit>({});
  const [cartItems, setCartItems] = useState<ClothingItem[]>([]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addToMannequin = (item: ClothingItem) => {
    setMannequinOutfit(prev => ({
      ...prev,
      [item.category]: item
    }));
  };

  const addToCart = (item: ClothingItem) => {
    setCartItems(prev => [...prev, item]);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const MannequinDisplay = () => {    
    return (
      <div className="flex flex-col items-center">
        <div className="w-48 h-80 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col items-center justify-center p-4 relative">
          <Icon name="User" size={100} className="text-gray-300 dark:text-gray-500" />
          
          {/* Outfit display */}
          {mannequinOutfit.top && (
            <div className="absolute top-12 w-16 h-12 bg-black/10 rounded flex items-center justify-center">
              <span className="text-xs text-center">{mannequinOutfit.top.name.slice(0, 10)}...</span>
            </div>
          )}
          {mannequinOutfit.bottom && (
            <div className="absolute top-28 w-12 h-16 bg-black/10 rounded flex items-center justify-center">
              <span className="text-xs text-center">{mannequinOutfit.bottom.name.slice(0, 8)}...</span>
            </div>
          )}
          {mannequinOutfit.shoes && (
            <div className="absolute bottom-12 w-10 h-6 bg-black/10 rounded flex items-center justify-center">
              <span className="text-xs text-center">{mannequinOutfit.shoes.name.slice(0, 6)}...</span>
            </div>
          )}

          {/* Hover preview */}
          {hoveredItem && (
            <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center">
              <div className="text-center p-2">
                <p className="text-sm font-medium">{hoveredItem.name}</p>
                <p className="text-xs text-muted-foreground">Примерка</p>
              </div>
            </div>
          )}
        </div>
        
        <Button 
          className="mt-4 w-48"
          onClick={() => {
            const allItems = Object.values(mannequinOutfit).filter(Boolean);
            allItems.forEach(item => addToCart(item!));
          }}
          disabled={Object.keys(mannequinOutfit).length === 0}
        >
          Добавить образ в корзину
        </Button>
      </div>
    );
  };

  const ProductCard = ({ item }: { item: ClothingItem }) => (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
      onMouseEnter={() => setHoveredItem(item)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <CardContent className="p-4">
        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded mb-3 flex items-center justify-center">
          <Icon name="Shirt" size={48} className="text-gray-400" />
        </div>
        <h3 className="font-medium text-sm mb-2">{item.name}</h3>
        <p className="text-lg font-light mb-3">{item.price.toLocaleString()} ₽</p>
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={() => addToMannequin(item)}
        >
          <Icon name="Plus" size={16} className="mr-1" />
          На маникен
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Icon name="Shirt" size={24} />
            <span className="text-xl font-light">CLOTHING STORE</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView('home')}
              className={`text-sm transition-colors ${currentView === 'home' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Главная
            </button>
            <button
              onClick={() => setCurrentView('cart')}
              className={`text-sm transition-colors relative ${currentView === 'cart' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Корзина
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isDarkMode ? '☀️' : '🌙'} Детонация
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 px-6">
        {currentView === 'home' ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-6xl grid grid-cols-3 gap-8 items-start">
              {/* Left Product Grid */}
              <div className="grid grid-cols-2 gap-4">
                {sampleClothing.slice(0, 3).map(item => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
              
              {/* Center Mannequin */}
              <div className="flex justify-center">
                <MannequinDisplay />
              </div>
              
              {/* Right Product Grid */}
              <div className="grid grid-cols-2 gap-4">
                {sampleClothing.slice(3).map(item => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-light mb-8">Корзина</h1>
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="ShoppingBag" size={64} className="mx-auto text-gray-400 mb-4" />
                <p className="text-muted-foreground">Корзина пуста</p>
                <Button 
                  className="mt-4"
                  onClick={() => setCurrentView('home')}
                >
                  Продолжить покупки
                </Button>
              </div>
            ) : (
              <div>
                <div className="space-y-4 mb-8">
                  {cartItems.map((item, index) => (
                    <Card key={`${item.id}-${index}`}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-muted-foreground">{item.price.toLocaleString()} ₽</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Icon name="X" size={16} />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium">Итого:</span>
                    <span className="text-xl font-light">{totalPrice.toLocaleString()} ₽</span>
                  </div>
                  <Button className="w-full" size="lg">
                    Оформить заказ
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h3 className="font-medium mb-4">Контакты</h3>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span>📧 info@clothingstore.ru</span>
              <span>📱 +7 (999) 123-45-67</span>
              <span>📍 Москва, ул. Модная, 1</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}