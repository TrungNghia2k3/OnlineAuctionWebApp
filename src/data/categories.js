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
        id: 6, name: "Jewelry", icon: "bi-gem", color: "#AABAC7", sub: [
            { name: "Jewelry", image: "" },
            { name: "Diamonds", image: "" },
            { name: "Gemstones", image: "" }
        ]
    },
    {
        id: 7, name: "Watches", icon: "bi-watch", color: "#86A7A8", sub: [
            { name: "Watches", image: "" },
            { name: "Pens & Lighters", image: "" }
        ]
    },
    {
        id: 8, name: "Fashion", icon: "bi-bag", color: "#F3CDDB", sub: [
            { name: "Bags", image: "" },
            { name: "Clothing", image: "" },
            { name: "Fashion Accessories", image: "" },
            { name: "Shoes", image: "" }
        ]
    },
    {
        id: 9, name: "Coins & Stamps", icon: "bi-coin", color: "#D5D3E1", sub: [
            { name: "Ancient Coins", image: "" },
            { name: "Banknotes", image: "" },
            { name: "Bullion", image: "" },
            { name: "Euro Coins", image: "" },
            { name: "Modern Coins", image: "" },
            { name: "Postcards", image: "" },
            { name: "Stamps", image: "" },
            { name: "World Coins", image: "" }
        ]
    },
    {
        id: 10, name: "Comics", icon: "bi-book", color: "#B0EADF", sub: [
            { name: "Animation", image: "" },
            { name: "Comic Art", image: "" },
            { name: "Comic Books", image: "" },
            { name: "Comic Figurines & Merchandise", image: "" },
            { name: "Disney", image: "" },
            { name: "Hergé / Tintin", image: "" }
        ]
    },
    {
        id: 11, name: "Cars & Bikes", icon: "bi-car-front", color: "#A2938F", sub: [
            { name: "Classic Cars", image: "" },
            { name: "Classic Motorcycles & Scooters", image: "" },
            { name: "Automobilia & Motobilia", image: "" }
        ]
    },
    {
        id: 12, name: "Wine, Whisky & Spirits", icon: "bi-cup", color: "#AF6663", sub: [
            { name: "Wine", image: "" },
            { name: "Whisky", image: "" },
            { name: "Rum, Cognac & Fine Spirits", image: "" },
            { name: "Champagne", image: "" },
            { name: "Port & Sweet Wines", image: "" },
            { name: "Beer", image: "" },
            { name: "Oil & Vinegar", image: "" }
        ]
    },
    {
        id: 13, name: "Asian & Tribal", icon: "bi-globe-asia-australia", color: "#639AC6", sub: [
            { name: "African & Tribal Art", image: "" },
            { name: "Chinese Art", image: "" },
            { name: "Indian & Islamic Art", image: "" },
            { name: "Japanese Art", image: "" },
            { name: "Southeast Asian, Oceanic & American Art", image: "" }
        ]
    },
    {
        id: 14, name: "Trading Cards", icon: "bi-collection", color: "#FBB763", sub: [
            { name: "Panini & Sports Cards", image: "" },
            { name: "Pokemon", image: "" },
            { name: "Trading Cards", image: "" }
        ]
    },
    {
        id: 15, name: "Toys & Models", icon: "bi-puzzle", color: "#20c997", sub: [
            { name: "Lego", image: "" },
            { name: "Model Cars", image: "" },
            { name: "Model Trains", image: "" },
            { name: "Toys", image: "" },
            { name: "Video Games & Computers", image: "" }
        ]
    },
    {
        id: 16, name: "Archaeology", icon: "bi-hourglass-split", color: "#C7A881", sub: [
            { name: "Archeology", image: "" },
            { name: "Fossils", image: "" },
            { name: "Minerals & Meteorites", image: "" },
            { name: "Natural History & Taxidermy", image: "" }
        ]
    },
    {
        id: 17, name: "Sports", icon: "bi-trophy", color: "#F8DE7A", sub: [
            { name: "Bicycles & Sports Equipment", image: "" },
            { name: "Football Memorabilia", image: "" },
            { name: "Motorsports Memorabilia", image: "" },
            { name: "Sports Memorabilia", image: "" }
        ]
    },
    {
        id: 18, name: "Music, Movie & Cameras", icon: "bi-camera-video", color: "#DF6957", sub: [
            { name: "Audio Equipment", image: "" },
            { name: "Cameras & Optical Equipment", image: "" },
            { name: "Movies & TV", image: "" },
            { name: "Music Memorabilia", image: "" },
            { name: "Musical Instruments", image: "" },
            { name: "Vinyl Records", image: "" }
        ]
    },
    {
        id: 19, name: "Books & History", icon: "bi-journal-bookmark", color: "#A4AF8B", sub: [
            { name: "Art & Photography Books", image: "" },
            { name: "Books", image: "" },
            { name: "Historical Memorabilia", image: "" },
            { name: "Maps", image: "" }
        ]
    }
];

export default categories;
