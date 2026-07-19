const fs = require('fs');

const missing = JSON.parse(fs.readFileSync('missing_translations.json'));

const translations = {
  // Categories & Departments
  "BATH & SHOWER": "BANYO & DUŞ",
  "FRAGRANCE": "PARFÜM",
  "BODY CARE": "VÜCUT BAKIMI",
  "SKINCARE": "CİLT BAKIMI",
  "HAIR CARE": "SAÇ BAKIMI",
  "HOME FRAGRANCE": "EV KOKULARI",
  "GIFTS": "HEDİYELER",

  "Shower Gel": "Duş Jeli",
  "Body Wash": "Vücut Yıkama",
  "Soap": "Sabun",
  "Bath Bombs": "Banyo Bombası",
  "Bath Salts": "Banyo Tuzu",
  "Bubble Bath": "Köpük Banyosu",
  "Body Lotion": "Vücut Losyonu",
  "Body Cream": "Vücut Kremi",
  "Body Butter": "Vücut Yağı",
  "Body Scrub": "Vücut Peelingi",
  "Hand Cream": "El Kremi",
  "Foot Care": "Ayak Bakımı",
  "Cleansers": "Temizleyiciler",
  "Toners": "Tonikler",
  "Serums": "Serumlar",
  "Moisturizers": "Nemlendiriciler",
  "Eye Care": "Göz Bakımı",
  "Face Masks": "Yüz Maskeleri",
  "Sunscreen": "Güneş Kremi",
  "Peeling": "Peeling",
  "Shampoo": "Şampuan",
  "Conditioner": "Saç Kremi",
  "Hair Mask": "Saç Maskesi",
  "Hair Oil": "Saç Yağı",
  "Scalp Care": "Saç Derisi Bakımı",
  "Styling": "Şekillendirme",
  "Candles": "Mumlar",
  "Reed Diffusers": "Çubuklu Oda Kokuları",
  "Room Sprays": "Oda Spreyleri",
  "Essential Oils": "Esansiyel Yağlar",
  "Perfume": "Parfüm",
  "Eau de Parfum": "Eau de Parfum",
  "Eau de Toilette": "Eau de Toilette",
  "Body Mist": "Vücut Spreyi",
  "Hair Mist": "Saç Spreyi",

  // Attributes
  "size": "Boyut",
  "scent": "Koku",
  "rating": "Değerlendirme",
  "skinType": "Cilt Tipi",
  "productType": "Ürün Tipi",
  "bathCollection": "Banyo Koleksiyonu",
  "fragranceFamily": "Koku Ailesi",
  "topNotes": "Üst Notalar",
  "heartNotes": "Orta Notalar",
  "baseNotes": "Alt Notalar",
  "skinConcern": "Cilt Sorunu",
  "hairType": "Saç Tipi",
  "hairConcern": "Saç Sorunu",
  "burnTime": "Yanma Süresi",
  "roomType": "Oda Tipi",
  "giftType": "Hediye Tipi",
  "occasion": "Kullanım Yeri",

  "Standard": "Standart",
  "Travel Size": "Seyahat Boyu",
  "Fresh": "Ferah",
  "4+ Stars": "4+ Yıldız",
  "5 Stars": "5 Yıldız",
  "All Skin Types": "Tüm Cilt Tipleri",
  "Dry Skin": "Kuru Cilt",
  "Oily Skin": "Yağlı Cilt",
  "Combination": "Karma Cilt",
  "Sensitive": "Hassas Cilt",
  "Normal": "Normal Cilt",
  "Floral": "Çiçeksi",
  "Woody": "Odunsu",
  "Citrus": "Narenciye",
  "Oriental": "Oryantal",
  "Fruity": "Meyvemsi",
  "Spicy": "Baharatlı",
  "Sweet": "Tatlı",
  "Hydration": "Nemlendirme",
  "Anti-Aging": "Yaşlanma Karşıtı",
  "Brightening": "Aydınlatıcı",
  "Acne": "Akne",
  "Damaged": "Yıpranmış",
  "Color Treated": "Boyalı",
  "Frizz": "Elektriklenme",
  "Volume": "Hacim",
  "Living Room": "Oturma Odası",
  "Bedroom": "Yatak Odası",
  "Bathroom": "Banyo",
  "Kitchen": "Mutfak",
  "For Her": "Kadınlar İçin",
  "For Him": "Erkekler İçin",
  "Unisex": "Uniseks",
  "Birthday": "Doğum Günü",
  "Anniversary": "Yıl Dönümü",
  "Holiday": "Tatil",

  // Products Names
  "Ocean Breeze Shower Gel": "Okyanus Esintisi Duş Jeli",
  "All-in-1 Micellar Water Makeup Cleanser": "Hepsi Bir Arada Misel Su Makyaj Temizleyici",
  "Stardust Eau de Parfum": "Stardust Eau de Parfum",
  "Rose Petal Bath Bombs Set": "Gül Yaprağı Banyo Bombası Seti",
  "Lavender Dreams Body Lotion": "Lavanta Rüyası Vücut Losyonu",
  "Intense Hydration Face Cream": "Yoğun Nemlendirici Yüz Kremi",
  "Argan Oil Hair Mask": "Argan Yağlı Saç Maskesi",
  "Vanilla Bean Scented Candle": "Vanilya Çekirdeği Kokulu Mum",
  "Luxury Spa Gift Box": "Lüks Spa Hediye Kutusu",
  "Citrus Burst Body Scrub": "Narenciye Patlaması Vücut Peelingi",
  "Anti-Aging Night Serum": "Yaşlanma Karşıtı Gece Serumu",
  "Volumizing Shampoo": "Hacim Veren Şampuan",
  "Sandalwood Room Spray": "Sandal Ağacı Oda Spreyi",
  "Midnight Oud Eau de Toilette": "Midnight Oud Eau de Toilette",
  "Soothing Aloe Vera Gel": "Yatıştırıcı Aloe Vera Jeli",
  "Himalayan Pink Bath Salts": "Himalaya Pembe Banyo Tuzu",
  "Vitamin C Brightening Toner": "C Vitamini Aydınlatıcı Tonik",
  "Keratin Repair Conditioner": "Keratin Onarıcı Saç Kremi",
  "Fresh Linen Reed Diffuser": "Taze Keten Çubuklu Oda Kokusu",
  "Men's Grooming Essentials Kit": "Erkek Bakım Temel Seti",
  "Peppermint Cooling Foot Cream": "Nane Serinletici Ayak Kremi",
  "Charcoal Purifying Face Mask": "Kömür Arındırıcı Yüz Maskesi",
  "Tea Tree Scalp Treatment": "Çay Ağacı Saç Derisi Bakımı",
  "Jasmine & Bergamot Essential Oil Blend": "Yasemin ve Bergamot Esansiyel Yağ Karışımı",
  "Travel Size Perfume Discovery Set": "Seyahat Boyu Parfüm Keşif Seti"
};

// Write output back to db-translations
let fileContent = fs.readFileSync('./src/lib/i18n/db-translations.ts', 'utf-8');

// Insert after `TR: {`
const lines = fileContent.split('\n');
const insertIndex = lines.findIndex(l => l.includes('TR: {')) + 1;

const newLines = [];
for (const [en, tr] of Object.entries(translations)) {
  // Simple check to avoid duplicates
  if (!fileContent.includes(`"${en}"`)) {
    newLines.push(`    "${en}": "${tr}",`);
  }
}

lines.splice(insertIndex, 0, ...newLines);
fs.writeFileSync('./src/lib/i18n/db-translations.ts', lines.join('\n'));
console.log('Added ' + newLines.length + ' basic translations!');
