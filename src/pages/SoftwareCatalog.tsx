
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { 
  Search, 
  ShoppingCart, 
  Star, 
  Filter, 
  ArrowDownUp, 
  X,
  Check 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

// Mock data for software catalog
const softwareList = [
  {
    id: 1,
    name: "SolidWorks 2023",
    category: "CAD",
    manufacturer: "Dassault Systèmes",
    price: 12800,
    subscription: 3600,
    description: "Software CAD 3D profissional para modelagem de peças e montagens",
    image: "https://images.unsplash.com/photo-1588186939549-9611b74916b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    rating: 4.8,
    isBestSeller: true,
    requirements: "Windows 10 64-bit, 16GB RAM, 20GB HD",
    software_version: "2023"
  },
  {
    id: 2,
    name: "Mastercam 2023",
    category: "CAM",
    manufacturer: "CNC Software",
    price: 15900,
    subscription: 4200,
    description: "Solução CAM completa para usinagem CNC avançada",
    image: "https://images.unsplash.com/photo-1574241298674-b3e4159e4a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    rating: 4.7,
    isBestSeller: false,
    requirements: "Windows 10 64-bit, 8GB RAM, 20GB HD",
    software_version: "2023"
  },
  {
    id: 3,
    name: "Fusion 360",
    category: "CAD/CAM",
    manufacturer: "Autodesk",
    price: 8400,
    subscription: 2800,
    description: "Plataforma integrada para design, engenharia e fabricação",
    image: "https://images.unsplash.com/photo-1551503766-ac63dfa6401c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    rating: 4.5,
    isBestSeller: true,
    requirements: "Windows 10, macOS, 4GB RAM, 3GB HD",
    software_version: "2023"
  },
  {
    id: 4,
    name: "SolidCAM 2023",
    category: "CAM",
    manufacturer: "SolidCAM",
    price: 14500,
    subscription: 3900,
    description: "Software CAM potente integrado ao SolidWorks",
    image: "https://images.unsplash.com/photo-1517582082532-16a092d47074?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    rating: 4.6,
    isBestSeller: false,
    requirements: "Windows 10 64-bit, 8GB RAM, 10GB HD",
    software_version: "2023"
  },
  {
    id: 5,
    name: "AutoCAD 2023",
    category: "CAD",
    manufacturer: "Autodesk",
    price: 9200,
    subscription: 2500,
    description: "Software de desenho 2D e 3D para projetos técnicos",
    image: "https://images.unsplash.com/photo-1557383955-b43f9f008b77?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    rating: 4.3,
    isBestSeller: false,
    requirements: "Windows 10, macOS, 8GB RAM, 6GB HD",
    software_version: "2023"
  },
  {
    id: 6,
    name: "CATIA V5",
    category: "CAD",
    manufacturer: "Dassault Systèmes",
    price: 22000,
    subscription: 5800,
    description: "Solução avançada para design de produtos e engenharia",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    rating: 4.7,
    isBestSeller: false,
    requirements: "Windows 10 64-bit, 16GB RAM, 20GB HD",
    software_version: "V5"
  }
];

// Filter categories
const categories = ["CAD", "CAM", "CNC", "CAD/CAM"];
const manufacturers = ["Autodesk", "Dassault Systèmes", "CNC Software", "SolidCAM"];

const SoftwareCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState("featured");
  const { addToCart, isInCart } = useCart();

  // Filter and sort logic
  const filteredSoftware = softwareList.filter(software => {
    const matchesSearch = software.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          software.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || 
                            selectedCategories.some(cat => software.category.includes(cat));
    
    const matchesManufacturer = selectedManufacturers.length === 0 || 
                               selectedManufacturers.includes(software.manufacturer);
    
    const matchesPrice = software.price >= priceRange[0] && software.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesManufacturer && matchesPrice;
  });

  // Sort logic
  const sortedSoftware = [...filteredSoftware].sort((a, b) => {
    switch(sortOption) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "rating-desc":
        return b.rating - a.rating;
      default: // featured or any other value
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    }
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const handleManufacturerChange = (manufacturer: string) => {
    setSelectedManufacturers(prev => 
      prev.includes(manufacturer) 
        ? prev.filter(m => m !== manufacturer) 
        : [...prev, manufacturer]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedManufacturers([]);
    setPriceRange([0, 25000]);
    setSortOption("featured");
  };

  return (
    <Layout>
      <div className="aia-container py-8">
        <div className="mb-8">
          <h1 className="aia-heading mb-2">Catálogo de Softwares</h1>
          <p className="text-gray-600">
            Encontre a solução ideal para suas necessidades de engenharia e manufatura
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Buscar softwares..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 aia-input"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="flex items-center"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtros {selectedCategories.length > 0 || selectedManufacturers.length > 0 ? 
                  `(${selectedCategories.length + selectedManufacturers.length})` : ''}
              </Button>
              <div className="relative">
                <select
                  className="aia-input appearance-none pr-10 bg-white"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="featured">Em Destaque</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="name-asc">Nome (A-Z)</option>
                  <option value="rating-desc">Melhor Avaliação</option>
                </select>
                <ArrowDownUp className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-aiaGray-dark">Filtros</h2>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500">
                <X className="mr-1 h-4 w-4" />
                Limpar Filtros
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-medium mb-2">Categoria</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category} className="flex items-center">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <label 
                        htmlFor={`category-${category}`}
                        className="ml-2 text-sm text-gray-700 cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Manufacturer Filter */}
              <div>
                <h3 className="font-medium mb-2">Fabricante</h3>
                <div className="space-y-2">
                  {manufacturers.map(manufacturer => (
                    <div key={manufacturer} className="flex items-center">
                      <Checkbox
                        id={`manufacturer-${manufacturer}`}
                        checked={selectedManufacturers.includes(manufacturer)}
                        onCheckedChange={() => handleManufacturerChange(manufacturer)}
                      />
                      <label 
                        htmlFor={`manufacturer-${manufacturer}`}
                        className="ml-2 text-sm text-gray-700 cursor-pointer"
                      >
                        {manufacturer}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div>
                <h3 className="font-medium mb-2">Faixa de Preço</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 25000]}
                    min={0}
                    max={25000}
                    step={1000}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="my-6"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 text-gray-600">
          Exibindo {sortedSoftware.length} de {softwareList.length} softwares
        </div>

        {/* Software Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSoftware.map((software) => {
            const productInCart = isInCart(software.id.toString());
            
            return (
              <Card key={software.id} className="aia-card overflow-hidden flex flex-col h-full">
                <div className="relative">
                  <img
                    src={software.image}
                    alt={software.name}
                    className="w-full h-44 object-cover"
                  />
                  {software.isBestSeller && (
                    <Badge className="absolute top-2 right-2 bg-aiaOrange">Mais Vendido</Badge>
                  )}
                  <Badge className="absolute top-2 left-2 bg-aiaGray">{software.category}</Badge>
                </div>
                
                <div className="p-4 flex-grow flex flex-col">
                  <Link to={`/softwares/${software.id}`}>
                    <h3 className="text-lg font-bold text-aiaBlue mb-1 hover:text-aiaTechBlue transition-colors">
                      {software.name}
                    </h3>
                  </Link>
                  
                  <div className="text-sm text-gray-600 mb-1">
                    {software.manufacturer}
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-500 mr-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < Math.floor(software.rating) ? "currentColor" : "none"}
                          className={i < Math.floor(software.rating) ? "" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{software.rating}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 flex-grow">{software.description}</p>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between items-baseline mb-2">
                      <div className="text-aiaGray font-semibold">
                        <div className="text-lg">{formatPrice(software.price)}</div>
                        <div className="text-sm text-gray-600">ou {formatPrice(software.subscription)}/ano</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        className={`flex-1 ${productInCart ? 'bg-green-600 hover:bg-green-700' : 'aia-button-primary'} text-sm`}
                        onClick={() => addToCart({
                          id: software.id.toString(),
                          name: software.name,
                          category: software.category,
                          manufacturer: software.manufacturer,
                          description: software.description,
                          price: software.price,
                          image_url: software.image,
                          requirements: software.requirements,
                          software_version: software.software_version || "N/A", // Add missing property
                          created_at: new Date().toISOString(),
                          updated_at: new Date().toISOString()
                        })}
                        disabled={productInCart}
                      >
                        {productInCart ? (
                          <>
                            <Check className="mr-1 h-4 w-4" /> No Carrinho
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-1 h-4 w-4" /> Comprar
                          </>
                        )}
                      </Button>
                      <Link to={`/softwares/${software.id}`} className="flex-1">
                        <Button variant="outline" className="w-full text-sm">Detalhes</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* No Results Message */}
        {sortedSoftware.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-aiaGray-dark mb-2">Nenhum software encontrado</h3>
            <p className="text-gray-600 mb-4">Tente ajustar seus filtros ou termos de busca.</p>
            <Button onClick={clearFilters}>Limpar Filtros</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SoftwareCatalog;
