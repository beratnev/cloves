export interface FilterDefinition {
  id: string
  label: string
  type: 'select' | 'checkbox'
  options?: string[]
  categories?: string[]
}

export const departmentFilters: Record<string, FilterDefinition[]> = {
  FRAGRANCE: [
    { id: "fragranceFamily", label: "Fragrance Family", type: "select", options: ["All", "Floral", "Fruity", "Citrus", "Fresh", "Woody", "Oriental", "Vanilla", "Gourmand", "Musk"] },
    { id: "productType", label: "Product Type", type: "select", options: ["All", "Perfume", "Eau de Parfum", "Eau de Toilette", "Body Mist", "Hair Mist"] },
    { id: "gender", label: "Gender", type: "select", options: ["All", "Women", "Men", "Unisex"] },
    { id: "size", label: "Size", type: "select", options: ["All", "Travel", "Standard", "Value"] },
    { id: "longevity", label: "Longevity", type: "select", options: ["All", "Light", "Moderate", "Long Lasting"], categories: ["Perfume", "Eau de Parfum", "Eau de Toilette", "Body Mist"] },
    { id: "bestSeller", label: "Best Seller", type: "select", options: ["All", "Yes", "No"] },
    { id: "newArrival", label: "New Arrival", type: "select", options: ["All", "Yes", "No"] },
    { id: "rating", label: "Rating", type: "select", options: ["All", "4+ Stars", "3+ Stars"] }
  ],
  "BODY CARE": [
    { id: "productType", label: "Product Type", type: "select", options: ["All", "Body Lotion", "Body Cream", "Body Butter", "Body Oil", "Body Scrub"] },
    { id: "skinType", label: "Skin Type", type: "select", options: ["All", "Normal", "Dry", "Oily", "Combination", "Sensitive"] },
    { id: "skinConcern", label: "Skin Concern", type: "select", options: ["All", "Dryness", "Dullness", "Uneven Texture", "Loss of Firmness"] },
    { id: "scentFamily", label: "Scent Family", type: "select", options: ["All", "Floral", "Fruity", "Fresh", "Warm & Spicy", "Woody"] },
    { id: "texture", label: "Texture", type: "select", options: ["All", "Cream", "Lotion", "Oil", "Balm", "Gel"], categories: ["Body Lotion", "Body Cream", "Body Butter", "Body Oil", "Hand Cream", "Foot Care"] },
    { id: "size", label: "Size", type: "select", options: ["All", "Travel", "Standard", "Value"] },
    { id: "vegan", label: "Vegan", type: "select", options: ["All", "Yes", "No"] },
    { id: "crueltyFree", label: "Cruelty Free", type: "select", options: ["All", "Yes", "No"] },
    { id: "rating", label: "Rating", type: "select", options: ["All", "4+ Stars", "3+ Stars"] }
  ],
  "BATH & SHOWER": [
    { id: "productType", label: "Product Type", type: "select", options: ["All", "Shower Gel", "Body Wash", "Soap", "Bath Bombs", "Bath Salts", "Bubble Bath"] },
    { id: "scent", label: "Scent", type: "select", options: ["All", "Floral", "Fruity", "Fresh", "Citrus", "Herbal"] },
    { id: "skinType", label: "Skin Type", type: "select", options: ["All", "Normal", "Dry", "Oily", "Combination", "Sensitive"], categories: ["Shower Gel", "Body Wash", "Soap"] },
    { id: "size", label: "Size", type: "select", options: ["All", "Travel", "Standard", "Value"] },
    { id: "bathCollection", label: "Bath Collection", type: "select", options: ["All", "Aromatherapy", "Spa Day", "Daily Refresh"] },
    { id: "vegan", label: "Vegan", type: "select", options: ["All", "Yes", "No"] },
    { id: "rating", label: "Rating", type: "select", options: ["All", "4+ Stars", "3+ Stars"] }
  ],
  "SKINCARE": [
    { id: "skinType", label: "Skin Type", type: "select", options: ["All", "Dry", "Oily", "Combination", "Sensitive", "Normal"] },
    { id: "skinConcern", label: "Skin Concern", type: "select", options: ["All", "Acne", "Redness", "Anti Aging", "Hydration", "Dark Spots", "Pores", "Brightening"] },
    { id: "productType", label: "Product Type", type: "select", options: ["All", "Cleanser", "Moisturizer", "Serum", "Toner", "Eye Cream", "Mask", "Peeling"] },
    { id: "spf", label: "SPF", type: "select", options: ["All", "SPF 15+", "SPF 30+", "SPF 50+"], categories: ["Moisturizers", "Sunscreen"] },
    { id: "vegan", label: "Vegan", type: "select", options: ["All", "Yes", "No"] },
    { id: "crueltyFree", label: "Cruelty Free", type: "select", options: ["All", "Yes", "No"] },
    { id: "rating", label: "Rating", type: "select", options: ["All", "4+ Stars", "3+ Stars"] }
  ],
  "HAIR CARE": [
    { id: "hairType", label: "Hair Type", type: "select", options: ["All", "Straight", "Wavy", "Curly", "Coily", "Fine", "Thick", "Color Treated"] },
    { id: "hairConcern", label: "Hair Concern", type: "select", options: ["All", "Damage", "Dryness", "Frizz", "Volume", "Color Care", "Scalp Care"] },
    { id: "productType", label: "Product Type", type: "select", options: ["All", "Shampoo", "Conditioner", "Hair Mask", "Leave-In", "Hair Oil", "Styling"] },
    { id: "sulfateFree", label: "Sulfate Free", type: "select", options: ["All", "Yes", "No"], categories: ["Shampoo", "Conditioner", "Hair Mask"] },
    { id: "siliconeFree", label: "Silicone Free", type: "select", options: ["All", "Yes", "No"] },
    { id: "vegan", label: "Vegan", type: "select", options: ["All", "Yes", "No"] },
    { id: "rating", label: "Rating", type: "select", options: ["All", "4+ Stars", "3+ Stars"] }
  ],
  "HOME FRAGRANCE": [
    { id: "productType", label: "Product Type", type: "select", options: ["All", "Candles", "Reed Diffusers", "Room Sprays", "Essential Oils"] },
    { id: "fragranceFamily", label: "Fragrance Family", type: "select", options: ["All", "Floral", "Fruity", "Fresh", "Woody", "Warm & Spicy"] },
    { id: "burnTime", label: "Burn Time", type: "select", options: ["All", "Under 20 Hours", "20-40 Hours", "40+ Hours"], categories: ["Candles"] },
    { id: "roomSize", label: "Room Size", type: "select", options: ["All", "Small", "Medium", "Large"] },
    { id: "collection", label: "Collection", type: "select", options: ["All", "Holiday", "Spring Awakening", "Cozy Cabin"] },
    { id: "rating", label: "Rating", type: "select", options: ["All", "4+ Stars", "3+ Stars"] }
  ],

  "SALE": [
    { id: "discountPercentage", label: "Discount Percentage", type: "select", options: ["All", "20% Off or More", "30% Off or More", "50% Off or More"] },
    { id: "productType", label: "Product Type", type: "select", options: ["All", "Skincare", "Fragrance", "Body Care", "Hair Care", "Bath & Shower"] },
    { id: "rating", label: "Rating", type: "select", options: ["All", "4+ Stars", "3+ Stars"] },
    { id: "inStock", label: "In Stock", type: "select", options: ["All", "Yes", "No"] }
  ]
}
