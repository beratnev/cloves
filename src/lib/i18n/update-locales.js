const fs = require('fs');

function updateEn() {
  const path = 'C:/Users/berat/cloves/src/lib/i18n/dictionaries/en.ts';
  let content = fs.readFileSync(path, 'utf8');

  content = content.replace(
    'aiWelcome: "Hi! I\'m your AI shopping assistant. I can help you find products, give style advice, and answer any questions about our collection. How can I help you today?",',
    'aiWelcome: "Hi! I\'m your AI shopping assistant. I can help you find skincare routines, recommend fragrances, and answer any questions about our beauty collection. How can I help you today?",'
  );
  content = content.replace('aiSuggestWishlist: "Suggest items for my wishlist",', 'aiSuggestWishlist: "Suggest beauty items for my wishlist",');
  content = content.replace('aiSuggestOutfit: "Find a complete outfit for an evening event",', 'aiSuggestOutfit: "Find a complete skincare routine for dry skin",');
  content = content.replace('findSimilarProducts: "Find similar products",', 'findSimilarProducts: "Find products with similar ingredients",');
  content = content.replace('showSimilarQuery: "Show me products similar to this",', 'showSimilarQuery: "Show me products with similar ingredients",');
  content = content.replace('styleAdviceAction: "Style advice",', 'styleAdviceAction: "Skincare advice",');
  content = content.replace('styleAdviceQuery: "What should I wear for a casual dinner?",', 'styleAdviceQuery: "What skincare routine is best for dry skin?",');
  content = content.replace('wishlistAction: "Wishlist suggestions",', 'wishlistAction: "Wishlist suggestions",');
  content = content.replace('sizeHelpAction: "Size help",', 'sizeHelpAction: "Skin type help",');
  content = content.replace('sizeHelpQuery: "What size should I get?",', 'sizeHelpQuery: "Which moisturizer is best for my skin type?",');
  content = content.replace('aiTitle: "AI Shopping Assistant",', 'aiTitle: "AI Beauty Assistant",');
  content = content.replace('aiSubtitle: "Get personalized recommendations and style advice powered by AI",', 'aiSubtitle: "Get personalized beauty recommendations and skincare advice powered by AI",');

  fs.writeFileSync(path, content, 'utf8');
}

function updateTr() {
  const path = 'C:/Users/berat/cloves/src/lib/i18n/dictionaries/tr.ts';
  let content = fs.readFileSync(path, 'utf8');

  content = content.replace(
    'aiWelcome: "Merhaba! Ben yapay zeka alışveriş asistanınızım. Size ürün bulmada, stil tavsiyeleri vermede ve koleksiyonumuzla ilgili sorularınızı yanıtlamada yardımcı olabilirim. Bugün size nasıl yardımcı olabilirim?",',
    'aiWelcome: "Merhaba! Ben yapay zeka alışveriş asistanınızım. Cilt bakım rutini oluşturmada, parfüm önermede ve güzellik koleksiyonumuzla ilgili sorularınızı yanıtlamada yardımcı olabilirim. Bugün size nasıl yardımcı olabilirim?",'
  );
  content = content.replace('aiSuggestWishlist: "İstek listem için ürün öner",', 'aiSuggestWishlist: "İstek listem için güzellik ürünleri öner",');
  content = content.replace('aiSuggestOutfit: "Akşam etkinliği için eksiksiz bir kombin bul",', 'aiSuggestOutfit: "Kuru ciltler için eksiksiz bir cilt bakım rutini bul",');
  content = content.replace('findSimilarProducts: "Benzer ürünleri bul",', 'findSimilarProducts: "Benzer içerikli ürünleri bul",');
  content = content.replace('showSimilarQuery: "Buna benzer ürünleri göster",', 'showSimilarQuery: "Benzer içeriklere sahip ürünler göster",');
  content = content.replace('styleAdviceAction: "Stil tavsiyesi",', 'styleAdviceAction: "Cilt bakım tavsiyesi",');
  content = content.replace('styleAdviceQuery: "Gündelik bir akşam yemeği için ne giymeliyim?",', 'styleAdviceQuery: "Kuru ciltler için en iyi cilt bakım rutini nedir?",');
  content = content.replace('wishlistAction: "İstek listesi önerileri",', 'wishlistAction: "İstek listesi önerileri",');
  content = content.replace('sizeHelpAction: "Beden yardımı",', 'sizeHelpAction: "Cilt tipi yardımı",');
  content = content.replace('sizeHelpQuery: "Hangi bedeni almalıyım?",', 'sizeHelpQuery: "Cilt tipime uygun nemlendirici hangisi?",');
  content = content.replace('aiTitle: "Yapay Zeka Alışveriş Asistanı",', 'aiTitle: "Yapay Zeka Güzellik Asistanı",');
  content = content.replace('aiSubtitle: "Yapay zeka destekli kişiselleştirilmiş öneriler ve stil tavsiyeleri alın",', 'aiSubtitle: "Yapay zeka destekli kişiselleştirilmiş güzellik önerileri ve cilt bakım tavsiyeleri alın",');

  fs.writeFileSync(path, content, 'utf8');
}

updateEn();
updateTr();
console.log("Locales updated!");
