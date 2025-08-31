const categories = [
    { id: 1, name: "This week", icon: "bi-calendar-week", color: "#007bff", sub: [] },
    { id: 2, name: "For you", icon: "bi-heart", color: "#e83e8c", sub: [] },
    { id: 3, name: "Trending", icon: "bi-graph-up-arrow", color: "#fd7e14", sub: [] },
    {
        id: 4, name: "Art", icon: "bi-palette", color: "#A3CC86", sub: [
            { name: "Classical Art", image: "sub/classical-art.jpg" },
            { name: "Modern & Contemporary Art", image: "sub/modern-and-contemporary-art.jpg" },
            { name: "Photography", image: "sub/photography.jpg" },
            { name: "Prints & Multiples", image: "sub/prints-and-multiples.jpg" }
        ]
    },
    {
        id: 5, name: "Interiors", icon: "bi-house", color: "#CCECFF", sub: [
            { name: "Antiques & Classic Furniture", image: "sub/antiques-and-classic-furniture.jpg" },
            { name: "Ceramics & Glass", image: "sub/ceramics-and-glass.jpg" },
            { name: "Cooking & Dining", image: "sub/cooking-and-dining.jpg" },
            { name: "Design & Contemporary Furniture", image: "sub/design-and-contemporary-furniture.jpg" },
            { name: "Home & Garden Decor", image: "sub/home-and-garden-decor.jpg" },
            { name: "Home Inspiration & Trends", image: "sub/home-inspiration-and-trends.jpg" },
            { name: "Lighting", image: "sub/lighting.jpg" },
            { name: "Posters & Wall Decor", image: "sub/posters-and-wall-decor.jpg" },
            { name: "Rugs & Home Textiles", image: "sub/rugs-and-home-textiles.jpg" },
            { name: "Sculptures & Figurines", image: "sub/sculptures-and-figurines.jpg" },
            { name: "Silver & Gold Decor", image: "sub/silver-and-gold-decor.jpg" },
            { name: "Vintage & Industrial Furniture", image: "sub/vintage-and-industrial-furniture.jpg" }
        ]
    },
    {
        id: 6, name: "Jewellry", icon: "bi-gem", color: "#AABAC7", sub: [
            { name: "Jewellry", image: "sub/jewellry.jpg" },
            { name: "Diamonds", image: "sub/diamonds.jpg" },
            { name: "Gemstones", image: "sub/gemstones.jpg" }
        ]
    },
    {
        id: 7, name: "Watches", icon: "bi-watch", color: "#86A7A8", sub: [
            { name: "Watches", image: "sub/watches.jpg" },
            { name: "Pens & Lighters", image: "sub/pens-and-lighters.jpg" }
        ]
    },
    {
        id: 8, name: "Fashion", icon: "bi-bag", color: "#F3CDDB", sub: [
            { name: "Bags", image: "sub/bags.jpg" },
            { name: "Clothing", image: "sub/clothing.jpg" },
            { name: "Fashion Accessories", image: "sub/fashion-accessories.jpg" },
            { name: "Shoes", image: "sub/shoes.jpg" }
        ]
    },
    {
        id: 9, name: "Coins & Stamps", icon: "bi-coin", color: "#D5D3E1", sub: [
            { name: "Ancient Coins", image: "sub/ancient-coins.jpg" },
            { name: "Banknotes", image: "sub/banknotes.jpg" },
            { name: "Bullion", image: "sub/bullion.jpg" },
            { name: "Euro Coins", image: "sub/euro-coins.jpg" },
            { name: "Modern Coins", image: "sub/modern-coins.jpg" },
            { name: "Postcards", image: "sub/postcards.jpg" },
            { name: "Stamps", image: "sub/stamps.jpg" },
            { name: "World Coins", image: "sub/world-coins.jpg" }
        ]
    },
    {
        id: 10, name: "Comics", icon: "bi-book", color: "#B0EADF", sub: [
            { name: "Animation", image: "sub/animation.jpg" },
            { name: "Comic Art", image: "sub/comic-art.jpg" },
            { name: "Comic Books", image: "sub/comic-books.jpg" },
            { name: "Comic Figurines & Merchandise", image: "sub/comic-figurines-and-merchandise.jpg" },
            { name: "Disney", image: "sub/disney.jpg" },
            { name: "Hergé / Tintin", image: "sub/herge-or-tintin.jpg" }
        ]
    },
    {
        id: 11, name: "Cars & Bikes", icon: "bi-car-front", color: "#A2938F", sub: [
            { name: "Classic Cars", image: "sub/classic-cars.jpg" },
            { name: "Classic Motorcycles & Scooters", image: "sub/classic-motorcycles-and-scooters.jpg" },
            { name: "Automobilia & Motobilia", image: "sub/automobilia-and-motobilia.jpg" }
        ]
    },
    {
        id: 12, name: "Wine, Whisky & Spirits", icon: "bi-cup", color: "#AF6663", sub: [
            { name: "Wine", image: "sub/wine.jpg" },
            { name: "Whisky", image: "sub/whisky.jpg" },
            { name: "Rum, Cognac & Fine Spirits", image: "sub/rum-cognac-and-fine-spirits.jpg" },
            { name: "Champagne", image: "sub/champagne.jpg" },
            { name: "Port & Sweet Wines", image: "sub/port-and-sweet-wines.jpg" },
            { name: "Beer", image: "sub/beer.jpg" },
            { name: "Oil & Vinegar", image: "sub/oil-and-vinegar.jpg" }
        ]
    },
    {
        id: 13, name: "Asian & Tribal", icon: "bi-globe-asia-australia", color: "#639AC6", sub: [
            { name: "African & Tribal Art", image: "sub/african-and-tribal-art.jpg" },
            { name: "Chinese Art", image: "sub/chinese-art.jpg" },
            { name: "Indian & Islamic Art", image: "sub/indian-and-islamic-art.jpg" },
            { name: "Japanese Art", image: "sub/japanese-art.jpg" },
            { name: "Southeast Asian, Oceanic & American Art", image: "sub/southeast-asian-oceanic-and-american-art.jpg" }
        ]
    },
    {
        id: 14, name: "Trading Cards", icon: "bi-collection", color: "#FBB763", sub: [
            { name: "Panini & Sports Cards", image: "sub/panini-and-sports-cards.jpg" },
            { name: "Pokemon", image: "sub/pokemon.jpg" },
            { name: "Trading Cards", image: "sub/trading-cards.jpg" }
        ]
    },
    {
        id: 15, name: "Toys & Models", icon: "bi-puzzle", color: "#20c997", sub: [
            { name: "Lego", image: "sub/lego.jpg" },
            { name: "Model Cars", image: "sub/model-cars.jpg" },
            { name: "Model Trains", image: "sub/model-trains.jpg" },
            { name: "Toys", image: "sub/toys.jpg" },
            { name: "Video Games & Computers", image: "sub/video-games-and-computers.jpg" }
        ]
    },
    {
        id: 16, name: "Archaeology", icon: "bi-hourglass-split", color: "#C7A881", sub: [
            { name: "Archeology", image: "sub/archeology.jpg" },
            { name: "Fossils", image: "sub/fossils.jpg" },
            { name: "Minerals & Meteorites", image: "sub/minerals-and-meteorites.jpg" },
            { name: "Natural History & Taxidermy", image: "sub/natural-history-and-taxidermy.jpg" }
        ]
    },
    {
        id: 17, name: "Sports", icon: "bi-trophy", color: "#F8DE7A", sub: [
            { name: "Bicycles & Sports Equipment", image: "sub/bicycles-and-sports-equipment.jpg" },
            { name: "Football Memorabilia", image: "sub/football-memorabilia.jpg" },
            { name: "Motorsports Memorabilia", image: "sub/motorsports-memorabilia.jpg" },
            { name: "Sports Memorabilia", image: "sub/sports-memorabilia.jpg" }
        ]
    },
    {
        id: 18, name: "Music, Movie & Cameras", icon: "bi-camera-video", color: "#DF6957", sub: [
            { name: "Audio Equipment", image: "sub/audio-equipment.jpg" },
            { name: "Cameras & Optical Equipment", image: "sub/cameras-and-optical-equipment.jpg" },
            { name: "Movies & TV", image: "sub/movies-and-tv.jpg" },
            { name: "Music Memorabilia", image: "sub/music-memorabilia.jpg" },
            { name: "Musical Instruments", image: "sub/musical-instruments.jpg" },
            { name: "Vinyl Records", image: "sub/vinyl-records.jpg" }
        ]
    },
    {
        id: 19, name: "Books & History", icon: "bi-journal-bookmark", color: "#A4AF8B", sub: [
            { name: "Art & Photography Books", image: "sub/art-and-photography-books.jpg" },
            { name: "Books", image: "sub/books.jpg" },
            { name: "Historical Memorabilia", image: "sub/historical-memorabilia.jpg" },
            { name: "Maps", image: "sub/maps.jpg" }
        ]
    }
];

export default categories;
