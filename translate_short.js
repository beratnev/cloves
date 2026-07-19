const fs = require('fs');

const translations = {
  // Products
  "Olive Oil Liquid Soap": "Zeytinyağlı Sıvı Sabun",
  "Elevate your daily cleansing ritual with our luxurious Olive Oil Liquid Soap, a sophisticated blend designed to purify while providing deep, lasting hydration. Infused with pure, extra virgin olive oil and soothing aloe vera, this soap creates a rich, velvety lather that gently lifts away impurities without stripping your skin of its essential natural oils. The antioxidant-rich formula works harmoniously to soothe irritation and soften the skin, leaving your hands and body feeling refreshed, supple, and delicately nourished after every wash.\\n\\nCrafted for those who prioritize both efficacy and gentle care, this liquid soap is perfect for all skin types, including those with sensitive skin. The subtle, clean scent evokes the freshness of an Mediterranean olive grove, turning a simple hand-washing routine or shower into a spa-like experience. Free from harsh chemicals and enriched with natural botanical extracts, it provides the perfect balance of deep cleansing and intensive moisture, ensuring your skin remains healthy, radiant, and perfectly conditioned throughout the day.": "Günlük temizlik ritüelinizi, derin ve kalıcı nemlendirme sağlarken arındırmak için tasarlanmış sofistike bir karışım olan lüks Zeytinyağlı Sıvı Sabunumuzla bir üst seviyeye taşıyın. Saf, sızma zeytinyağı ve yatıştırıcı aloe vera ile zenginleştirilmiş bu sabun, cildinizi temel doğal yağlarından arındırmadan kirleri nazikçe kaldıran zengin, kadifemsi bir köpük oluşturur. Antioksidan açısından zengin formül, tahrişi yatıştırmak ve cildi yumuşatmak için uyumlu bir şekilde çalışarak, her yıkamadan sonra ellerinizin ve vücudunuzun ferah, esnek ve hassas bir şekilde beslenmiş hissetmesini sağlar.\\n\\nHem etkinliği hem de nazik bakımı ön planda tutanlar için özenle hazırlanan bu sıvı sabun, hassas ciltler de dahil olmak üzere tüm cilt tipleri için mükemmeldir. İnce, temiz koku, bir Akdeniz zeytinliğinin tazeliğini çağrıştırarak basit bir el yıkama rutinini veya duşu spa benzeri bir deneyime dönüştürür. Sert kimyasallardan arındırılmış ve doğal bitkisel özlerle zenginleştirilmiş bu ürün, derinlemesine temizlik ile yoğun nemin mükemmel dengesini sağlayarak cildinizin gün boyunca sağlıklı, parlak ve mükemmel şekilde yumuşak kalmasını sağlar.",
  
  // AI Advice for Olive Oil
  "Deeply moisturizes with extra virgin olive oil": "Sızma zeytinyağı ile derinlemesine nemlendirir",
  "Soothes and calms skin with natural aloe vera": "Doğal aloe vera ile cildi yatıştırır ve sakinleştirir",
  
  // Other Short Missing Strings
  "Daily Refresh": "Günlük Ferahlık",
  "Cleanser": "Temizleyici",
  "gender": "Cinsiyet",
  "Women": "Kadın",
  "Men": "Erkek",
  "longevity": "Kalıcılık",
  "Long Lasting": "Uzun Süre Kalıcı",
  "bestSeller": "Çok Satan",
  "Yes": "Evet",
  "No": "Hayır",
  "newArrival": "Yeni Gelen",
  "Aloe Vera Mask": "Aloe Vera Maskesi",
  "vegan": "Vegan",
  "crueltyFree": "Hayvanlar Üzerinde Test Edilmemiş",
  "Mask": "Maske",
  "Day Cream for Oily & Combination Skin SPF 15": "Yağlı ve Karma Ciltler İçin Gündüz Kremi SPF 15",
  "spf": "SPF",
  "SPF 15+": "SPF 15+",
  "SPF 50+": "SPF 50+",
  "Oily": "Yağlı Cilt",
  "Moisturizer": "Nemlendirici",
  "Womanizer Men's Eau de Parfum": "Womanizer Erkek Eau de Parfum",
  "Day Cream for Dry Skin SPF 15": "Kuru Ciltler İçin Gündüz Kremi SPF 15",
  "Dry": "Kuru Cilt",
  "Nourish & Repair Hair Mask": "Besleyici & Onarıcı Saç Maskesi",
  "Damage": "Yıpranmış Saçlar",
  "sulfateFree": "Sülfatsız",
  "Coffee & Vitamin E Invigorating Shower Gel": "Kahve & E Vitamini Canlandırıcı Duş Jeli",
  "Citrus Refresh Shower Gel": "Narenciye Ferahlığı Duş Jeli",
  "Vitamin E enrichment for deep skin nourishment": "Derinlemesine cilt beslenmesi için E vitamini zenginleştirmesi",
  "Chamomile Liquid Soap": "Papatya Sıvı Sabun",
  "Non-stripping, moisturizing cleanse for daily use": "Günlük kullanım için nemlendirici temizlik",
  "Calms and soothes sensitive skin": "Hassas cildi sakinleştirir ve yatıştırır",
  "Nourishing Shampoo with Argan Oil & Keratin": "Argan Yağı ve Keratin İçeren Besleyici Şampuan",
  "Fine": "İnce Telli",
  "Deeply nourishes and moisturizes dry hair strands": "Kuru saç tellerini derinlemesine besler ve nemlendirir",
  "Strengthens hair structure from root to tip": "Saç yapısını kökten uca güçlendirir",
  "Shampoo for Curly Hair": "Kıvırcık Saçlar İçin Şampuan",
  "Curly": "Kıvırcık",
  "Enhances natural curl definition and bounce": "Doğal bukle belirginliğini ve esnekliğini artırır",
  "Deeply hydrates with shea butter and coconut oil": "Shea yağı ve hindistancevizi yağı ile derinlemesine nemlendirir",
  "Reduces frizz for a smooth, manageable finish": "Pürüzsüz ve şekil alabilen bir bitiş için elektriklenmeyi azaltır",
  "Mood Ring Eau de Parfum": "Mood Ring Eau de Parfum",
  "Rose Reed Diffuser": "Gül Çubuklu Oda Kokusu",
  "roomSize": "Oda Boyutu",
  "Medium": "Orta",
  "Sophisticated glass design enhances home decor": "Sofistike cam tasarımı ev dekorunu zenginleştirir",
  "Rice Peeling Exfoliant": "Pirinç Peelingi",
  "Avoid the delicate eye area": "Hassas göz çevresinden kaçının",
  "Use 1-2 times per week for optimal radiance": "Optimum parlaklık için haftada 1-2 kez kullanın",
  "Brightens and evens out complexion": "Cilt tonunu aydınlatır ve eşitler",
  "Promotes skin renewal and cellular turnover": "Cilt yenilenmesini teşvik eder",
  "Tropical Reed Diffuser": "Tropikal Çubuklu Oda Kokusu",
  "Lavender Infusion Shower Gel": "Lavanta Özlü Duş Jeli",
  "Curly Hair Styling Cream": "Kıvırcık Saç Şekillendirici Krem",
  "siliconeFree": "Silikonsuz",
  "Repair & Color Care Shampoo": "Onarıcı ve Renk Koruyucu Şampuan",
  "Sugar Peeling Exfoliating & Smoothing Scrub": "Şeker Peelingi & Pürüzsüzleştirici Vücut Ovması",
  "scentFamily": "Koku Ailesi",
  "Pores": "Gözenekler",
  "Gently removes dead skin cells for a radiant glow": "Parlak bir görünüm için ölü deri hücrelerini nazikçe temizler",
  "Deeply hydrates with nourishing botanical oils": "Besleyici bitkisel yağlar ile derinlemesine nemlendirir",
  "Golden Amber & Vanilla Shower Gel": "Altın Amber & Vanilya Duş Jeli",
  "Spa Day": "Spa Günü",
  "Use with a loofah for maximum lather": "Maksimum köpük için lif ile kullanın",
  "Rinse thoroughly with warm water": "Ilık su ile iyice durulayın",
  "Infused with Vitamin E for skin nourishment": "Cildi beslemek için E vitamini ile zenginleştirilmiştir",
  "Deeply hydrating and softening formula": "Derinlemesine nemlendirici ve yumuşatıcı formül",
  "Clay Mask": "Kil Maskesi",
  "Nourishing Hair Oil": "Besleyici Saç Yağı",
  "Wavy": "Dalgalı",
  "Dryness": "Kuruluk",
  "Deeply nourishes and hydrates hair follicles": "Saç köklerini derinlemesine besler ve nemlendirir",
  "Topaz Eau de Parfum": "Topaz Eau de Parfum",
  "Body Peeling Exfoliating Scrub": "Vücut Peelingi",
  "Warm & Spicy": "Sıcak & Baharatlı",
  "Uneven Texture": "Pürüzlü Cilt Dokusu"
};

let fileContent = fs.readFileSync('./src/lib/i18n/db-translations.ts', 'utf-8');
const lines = fileContent.split('\n');
const insertIndex = lines.findIndex(l => l.includes('TR: {')) + 1;

const newLines = [];
for (const [en, tr] of Object.entries(translations)) {
  // Simple check to avoid duplicates, replacing \n back to literal so string match works
  const enSafe = en.replace(/\\n/g, '\n');
  if (!fileContent.includes(`"${enSafe}"`) && !fileContent.includes(`"${en}"`)) {
    newLines.push(`    ${JSON.stringify(en)}: ${JSON.stringify(tr)},`);
  }
}

lines.splice(insertIndex, 0, ...newLines);
fs.writeFileSync('./src/lib/i18n/db-translations.ts', lines.join('\n'));
console.log('Added ' + newLines.length + ' additional translations!');
