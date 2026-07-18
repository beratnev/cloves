const fs = require('fs');
const path = 'C:/Users/berat/cloves/src/app/categories/[slug]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace constants
content = content.replace(
  /const categories = \[\s*[\s\S]*?\]\nconst brands = \[.*?\]\nconst colors = \[.*?\]\nconst materials = \[.*?\]\nconst styles = \[.*?\]\nconst occasions = \[.*?\]\nconst fits = \[.*?\]\nconst seasons = \[.*?\]/,
  `const categories = [
  "All",
  "NEW",
  "FRAGRANCE",
  "BODY CARE",
  "BATH & SHOWER",
  "SKINCARE",
  "HAIR CARE",
  "HOME FRAGRANCE",
  "GIFTS",
  "MEN",
  "SALE",
  "AI BEAUTY"
]
const brands = ["All", "Aura Skincare", "Glow Botanica", "Velvet Petals", "Pure Essence", "Lumin & Co."]
const colors = ["All", "Black", "White", "Pink", "Gold", "Silver"]
const skinTypes = ["All", "Normal", "Dry", "Oily", "Combination", "Sensitive"]
const fragranceFamilies = ["All", "Floral", "Woody", "Fresh", "Oriental", "Fruity", "Citrus"]`
);

// Replace state variables
content = content.replace(
  /const \[selectedMaterials, setSelectedMaterials\] = useState<string\[\]>\(\[\]\)\s*const \[selectedStyle, setSelectedStyle\] = useState\("All"\)\s*const \[selectedOccasion, setSelectedOccasion\] = useState\("All"\)\s*const \[selectedFit, setSelectedFit\] = useState\("All"\)\s*const \[selectedSeason, setSelectedSeason\] = useState\("All"\)/,
  `const [selectedSkinType, setSelectedSkinType] = useState("All")
  const [selectedFragranceFamily, setSelectedFragranceFamily] = useState("All")`
);

// Replace mock fields
content = content.replace(
  /material: "Cotton",\s*style: "Classic",\s*occasion: "Casual",\s*fit: "Regular",\s*season: "All Season",/,
  `skinType: "Normal",
      fragranceFamily: "Fresh",`
);

// Replace matches logic
content = content.replace(
  /const matchesMaterial = selectedMaterials.length === 0 \|\| selectedMaterials.includes\(product.material \|\| ""\)\s*const matchesStyle = selectedStyle === "All" \|\| product.style === selectedStyle\s*const matchesOccasion = selectedOccasion === "All" \|\| product.occasion === selectedOccasion\s*const matchesFit = selectedFit === "All" \|\| product.fit === selectedFit\s*const matchesSeason = selectedSeason === "All" \|\| product.season === selectedSeason/,
  `const matchesSkinType = selectedSkinType === "All" || product.skinType === selectedSkinType
    const matchesFragranceFamily = selectedFragranceFamily === "All" || product.fragranceFamily === selectedFragranceFamily`
);

content = content.replace(
  /matchesColor && matchesMaterial && matchesStyle && matchesOccasion && \s*matchesFit && matchesSeason && matchesPrice/,
  `matchesColor && matchesSkinType && matchesFragranceFamily && matchesPrice`
);

// Replace clearAllFilters
content = content.replace(
  /setSelectedMaterials\(\[\]\)\s*setSelectedStyle\("All"\)\s*setSelectedOccasion\("All"\)\s*setSelectedFit\("All"\)\s*setSelectedSeason\("All"\)/,
  `setSelectedSkinType("All")
    setSelectedFragranceFamily("All")`
);

// Replace hasActiveFilters
content = content.replace(
  /selectedBrand !== "All" \|\| selectedColors\.length > 0 \|\| selectedMaterials\.length > 0 \|\|\s*selectedStyle !== "All" \|\| selectedOccasion !== "All" \|\| selectedFit !== "All" \|\|\s*selectedSeason !== "All"/,
  `selectedBrand !== "All" || selectedColors.length > 0 ||
    selectedSkinType !== "All" || selectedFragranceFamily !== "All"`
);

// Remove old JSX filters
const regexStyleFilter = /\{\/\* Style Filter \*\/\}\s*<div>\s*<h3 className="font-semibold mb-3">\{t\("styleLabel"\)\}<\/h3>[\s\S]*?<\/Select>\s*<\/div>/g;
const regexOccasionFilter = /\{\/\* Occasion Filter \*\/\}\s*<div>\s*<h3 className="font-semibold mb-3">\{t\("occasionLabel"\)\}<\/h3>[\s\S]*?<\/Select>\s*<\/div>/g;
const regexFitFilter = /\{\/\* Fit Filter \*\/\}\s*<div>\s*<h3 className="font-semibold mb-3">\{t\("fitLabel"\)\}<\/h3>[\s\S]*?<\/Select>\s*<\/div>/g;
const regexSeasonFilter = /\{\/\* Season Filter \*\/\}\s*<div>\s*<h3 className="font-semibold mb-3">\{t\("seasonLabel"\)\}<\/h3>[\s\S]*?<\/Select>\s*<\/div>/g;
const regexMaterialFilter = /\{\/\* Material Filter \*\/\}\s*<div>\s*<h3 className="font-semibold mb-3">\{t\("material"\)\}<\/h3>[\s\S]*?<\/div>\s*<\/div>/g;

content = content.replace(regexStyleFilter, '');
content = content.replace(regexOccasionFilter, '');
content = content.replace(regexFitFilter, '');
content = content.replace(regexSeasonFilter, '');
content = content.replace(regexMaterialFilter, '');

// Clean active badges
content = content.replace(/\{selectedStyle !== "All" && \([\s\S]*?<\/Badge>\s*\)\}\s*/g, '');
content = content.replace(/\{selectedOccasion !== "All" && \([\s\S]*?<\/Badge>\s*\)\}\s*/g, '');
content = content.replace(/\{selectedFit !== "All" && \([\s\S]*?<\/Badge>\s*\)\}\s*/g, '');
content = content.replace(/\{selectedSeason !== "All" && \([\s\S]*?<\/Badge>\s*\)\}\s*/g, '');
content = content.replace(/\{selectedMaterials\.map\(\(material\) => \([\s\S]*?<\/Badge>\s*\)\)\}\s*/g, '');


const newFiltersJSX = `
              {/* Skin Type Filter */}
              <div>
                <h3 className="font-semibold mb-3">{t("skinTypeLabel") || "Skin Type"}</h3>
                <Select value={t("filter_" + selectedSkinType.replace(/\\s+/g, "")) || selectedSkinType} onValueChange={setSelectedSkinType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {skinTypes.map((skinType) => (
                      <SelectItem key={skinType} value={skinType}>{t("filter_" + skinType.replace(/\\s+/g, "")) || skinType}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fragrance Family Filter */}
              <div>
                <h3 className="font-semibold mb-3">{t("fragranceFamilyLabel") || "Fragrance Family"}</h3>
                <Select value={t("filter_" + selectedFragranceFamily.replace(/\\s+/g, "")) || selectedFragranceFamily} onValueChange={setSelectedFragranceFamily}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fragranceFamilies.map((family) => (
                      <SelectItem key={family} value={family}>{t("filter_" + family.replace(/\\s+/g, "")) || family}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
`;

// Insert the new filters after Price Range block in both desktop and mobile views
content = content.replace(/(<div>\s*<h3 className="font-semibold mb-3">\{t\("priceRange"\)\}<\/h3>[\s\S]*?<\/div>\s*<\/div>)/g, '$1\n' + newFiltersJSX);

const newActiveBadgesJSX = `
                    {selectedSkinType !== "All" && (
                      <Badge variant="secondary" className="gap-1">
                        {t("filter_" + selectedSkinType.replace(/\\s+/g, "")) || selectedSkinType}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedSkinType("All")} />
                      </Badge>
                    )}
                    {selectedFragranceFamily !== "All" && (
                      <Badge variant="secondary" className="gap-1">
                        {t("filter_" + selectedFragranceFamily.replace(/\\s+/g, "")) || selectedFragranceFamily}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedFragranceFamily("All")} />
                      </Badge>
                    )}
`;

content = content.replace(/(\{selectedBrand !== "All" && \([\s\S]*?<\/Badge>\s*\)\}\s*)/g, '$1\n' + newActiveBadgesJSX);


fs.writeFileSync(path, content, 'utf8');
console.log("Categories page updated successfully!");
