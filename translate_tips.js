const fs = require('fs');

const translations = {
  // AI Advice sentences
  "Apply a generous layer to clean, dry skin, avoiding the eye area.": "Temiz ve kuru cilde, göz çevresinden kaçınarak bolca uygulayın.",
  "Leave on for 10-15 minutes, then gently rinse off with lukewarm water.": "10-15 dakika bekletin, ardından ılık suyla nazikçe durulayın.",
  "For an extra refreshing effect, store the jar in the refrigerator before use.": "Ekstra ferahlatıcı bir etki için kullanmadan önce kavanozu buzdolabında saklayın.",
  "Instantly soothes and calms irritated or sun-exposed skin.": "Tahriş olmuş veya güneşe maruz kalmış cildi anında yatıştırır ve sakinleştirir.",
  "Delivers deep, long-lasting hydration with hyaluronic acid.": "Hyaluronik asit ile derin, uzun süreli nemlendirme sağlar.",
  "Revitalizes and refreshes tired-looking complexions.": "Yorgun görünen cildi canlandırır ve tazeler.",
  
  "Apply to a loofah or washcloth to create a rich, dense lather": "Zengin ve yoğun bir köpük oluşturmak için bir life veya banyo süngerine uygulayın.",
  "Massage in circular motions over damp skin, focusing on areas needing extra freshness": "Daha fazla ferahlığa ihtiyaç duyan bölgelere odaklanarak nemli cilt üzerinde dairesel hareketlerle masaj yapın.",
  "Rinse thoroughly with warm water and follow with a moisturizing body lotion for optimal softness": "Ilık suyla iyice durulayın ve optimum yumuşaklık için nemlendirici bir vücut losyonu ile devam edin.",
  "Energizing coffee aroma for a refreshing morning wake-up call": "Ferahlatıcı bir sabah uyanışı için enerji verici kahve aroması.",
  "Vitamin E enriched to nourish and protect skin elasticity": "Cilt elastikiyetini beslemek ve korumak için E vitamini ile zenginleştirilmiştir.",
  "Gently cleanses while maintaining natural moisture balance": "Doğal nem dengesini korurken nazikçe temizler.",
  
  "Apply a generous amount to a loofah or sponge for a richer, more luxurious lather.": "Daha zengin ve lüks bir köpük için life veya süngere bol miktarda uygulayın.",
  "Massage in circular motions over damp skin, focusing on areas needing extra freshness.": "Daha fazla ferahlığa ihtiyaç duyan bölgelere odaklanarak nemli cilt üzerinde dairesel hareketlerle masaj yapın.",
  "Rinse thoroughly with warm water and follow with a moisturizer to lock in hydration.": "Ilık suyla iyice durulayın ve nemi hapsetmek için bir nemlendirici uygulayın.",
  "Invigorating citrus scent to boost energy and mood": "Enerjiyi ve ruh halini canlandıran ferah narenciye kokusu.",
  "Gentle formula that cleanses without stripping natural oils": "Doğal yağları arındırmadan temizleyen nazik formül.",
  
  "Dispense one pump into wet hands and massage into a rich lather.": "Islak ellere bir pompa sıkın ve masaj yaparak köpürtün.",
  "Rinse thoroughly with warm water for soft, clean skin.": "Yumuşak ve temiz bir cilt için ılık suyla iyice durulayın.",
  "Use as a soothing body wash in the shower for an aromatherapy-inspired experience.": "Aromaterapiden ilham alan bir deneyim için duşta yatıştırıcı bir vücut yıkama jeli olarak kullanın.",
  "Gentle botanical formula with chamomile and aloe vera": "Papatya ve aloe vera içeren nazik bitkisel formül.",
  
  "Apply a generous amount to wet hair and massage into the scalp until a rich lather forms.": "Islak saça bolca uygulayın ve zengin bir köpük oluşana kadar saç derisine masaj yapın.",
  "Focus on massaging the roots to remove build-up before rinsing thoroughly.": "İyice durulamadan önce birikintileri gidermek için köklere masaj yapmaya odaklanın.",
  "For best results, follow with a smoothing conditioner or hair mask to seal in moisture.": "En iyi sonuçlar için nemi hapsetmek üzere pürüzsüzleştirici bir saç kremi veya maske kullanın.",
  "Enhances natural shine and smoothness with Biotin and Vitamin E": "Biotin ve E Vitamini ile doğal parlaklığı ve pürüzsüzlüğü artırır.",
  
  "Apply to wet hair and massage gently into the scalp, working through to the ends.": "Islak saça uygulayın, saç derisine nazikçe masaj yapın ve uçlara kadar yedirin.",
  "Rinse thoroughly with lukewarm water to lock in shine.": "Parlaklığı hapsetmek için ılık suyla iyice durulayın.",
  "Follow with a moisturizing conditioner to maintain optimal hydration.": "Optimum nemi korumak için nemlendirici bir saç kremi uygulayın.",
  
  "Place in a high-traffic area to help circulate the scent throughout the room": "Kokunun odaya yayılmasına yardımcı olmak için hava sirkülasyonunun olduğu bir alana yerleştirin.",
  "Flip the reeds every week to refresh the fragrance intensity": "Koku yoğunluğunu yenilemek için çubukları her hafta ters çevirin.",
  "Keep away from direct sunlight and heat sources to extend the life of the oil": "Yağın ömrünü uzatmak için doğrudan güneş ışığından ve ısı kaynaklarından uzak tutun.",
  "Provides continuous, flameless fragrance for your home": "Eviniz için alevsiz, sürekli bir koku sağlar.",
  "Delicate rose scent helps create a calming and romantic environment": "Narin gül kokusu sakinleştirici ve romantik bir ortam yaratmaya yardımcı olur.",
  
  "Apply to clean, damp skin and massage gently in circular motions": "Temiz ve nemli cilde dairesel hareketlerle nazikçe masaj yaparak uygulayın.",
  "Gently removes dead skin cells for smoother texture": "Daha pürüzsüz bir doku için ölü deri hücrelerini nazikçe uzaklaştırır.",
  
  "Place the reeds into the glass bottle, allowing them to soak up the fragrance for about an hour, then flip them to saturate the ends.": "Çubukları cam şişeye yerleştirin, yaklaşık bir saat kokuyu emmelerini bekleyin, ardından uçlarını doyurmak için ters çevirin.",
  "Flip the reeds every week to refresh the scent throw.": "Kokuyu tazelemek için çubukları her hafta ters çevirin.",
  "For a stronger fragrance experience, use all provided reeds; use fewer reeds for a more subtle, delicate aroma.": "Daha güçlü bir koku deneyimi için tüm çubukları kullanın; daha hafif bir aroma için daha az çubuk kullanın.",
  "Provides long-lasting, continuous fragrance without the need for an open flame.": "Açık ateşe ihtiyaç duymadan uzun ömürlü, sürekli bir koku sağlar.",
  "Beautifully designed packaging enhances your home decor.": "Güzel tasarımlı ambalajı ev dekorunuzu zenginleştirir.",
  "Creates a calming and invigorating atmosphere perfect for relaxation or entertaining.": "Rahatlamak veya keyifli vakit geçirmek için mükemmel, sakinleştirici ve canlandırıcı bir atmosfer yaratır.",
  
  "Apply evenly to clean, damp hair, working from roots to ends for maximum definition.": "Maksimum belirginlik için köklerden uçlara doğru çalışarak temiz, nemli saça eşit miktarda uygulayın.",
  "Scrunch hair upwards to encourage curl formation and pattern enhancement.": "Bukle oluşumunu ve dokuyu desteklemek için saçınızı aşağıdan yukarıya doğru avuçlayarak sıkın.",
  "Let hair air dry or use a diffuser for added volume and bounce.": "Saçın kendi kendine kurumasına izin verin veya ekstra hacim ve esneklik için bir vigo kullanın.",
  "Deeply hydrates and nourishes with Shea Butter and Coconut Oil": "Shea Yağı ve Hindistan Cevizi Yağı ile derinlemesine nemlendirir ve besler.",
  "Defines curls and waves while effectively fighting frizz": "Elektriklenmeyle etkili bir şekilde savaşırken bukleleri ve dalgaları belirginleştirir.",
  "Provides a soft, long-lasting hold that maintains natural movement": "Doğal hareketi koruyan yumuşak, uzun süreli tutuş sağlar.",
  
  "Apply to wet hair and massage into the scalp to create a rich, gentle lather.": "Islak saça uygulayın ve zengin, nazik bir köpük oluşturmak için saç derisine masaj yapın.",
  "Leave on for 1-2 minutes to allow the keratin and argan oil to penetrate the hair shaft.": "Keratin ve argan yağının saç teline nüfuz etmesi için 1-2 dakika bekletin.",
  "Rinse thoroughly with lukewarm water and follow with a color-safe conditioner for best results.": "Ilık suyla iyice durulayın ve en iyi sonuçlar için boyalı saçlara uygun bir saç kremi kullanın.",
  "Protects and preserves hair color vibrancy with UV filters": "UV filtreleri ile saç renginin canlılığını korur ve muhafaza eder.",
  "Deeply repairs and strengthens damaged strands with keratin": "Keratin ile yıpranmış saç tellerini derinlemesine onarır ve güçlendirir.",
  "Infuses essential moisture and shine with argan oil": "Argan yağı ile temel nemi ve parlaklığı kazandırır.",
  
  "Apply a small amount to damp hands or a sponge to create a rich lather": "Zengin bir köpük oluşturmak için nemli ellere veya bir süngere az miktarda uygulayın.",
  "Massage gently over skin and rinse thoroughly with warm water": "Cilde nazikçe masaj yapın ve ılık suyla iyice durulayın.",
  "Follow with a matching body lotion to lock in extra hydration": "Ekstra nemi hapsetmek için uyumlu bir vücut losyonu ile devam edin.",
  "Gentle, non-stripping formula suitable for daily use": "Günlük kullanım için uygun nazik, kurutmayan formül.",
  
  "Apply to damp skin in circular motions, focusing on rough areas like elbows and knees": "Dirsekler ve dizler gibi pürüzlü bölgelere odaklanarak dairesel hareketlerle nemli cilde uygulayın.",
  "Rinse thoroughly with warm water to reveal soft, moisturized skin": "Yumuşak, nemlenmiş bir cilt ortaya çıkarmak için ılık suyla iyice durulayın.",
  "Use 1-2 times per week for optimal results and lasting smoothness": "Optimum sonuçlar ve kalıcı pürüzsüzlük için haftada 1-2 kez kullanın.",
  "Softens and refines skin texture for a smooth finish": "Pürüzsüz bir bitiş için cilt dokusunu yumuşatır ve arındırır.",
  
  "Apply to damp skin and massage in circular motions": "Nemli cilde dairesel hareketlerle masaj yaparak uygulayın.",
  "Sophisticated, long-lasting amber and vanilla fragrance": "Sofistike, uzun süre kalıcı amber ve vanilya kokusu.",
  
  "Apply an even layer to clean, dry skin, avoiding the delicate eye area.": "Hassas göz çevresinden kaçınarak temiz ve kuru cilde eşit bir tabaka uygulayın.",
  "Leave on for 10-15 minutes until the mask is nearly dry, then rinse thoroughly with warm water.": "Maske neredeyse kuruyana kadar 10-15 dakika bekletin, ardından ılık suyla iyice durulayın.",
  "Use 1-2 times per week to maintain a clear, balanced, and revitalized complexion.": "Temiz, dengeli ve canlanmış bir cilt görünümünü korumak için haftada 1-2 kez kullanın.",
  "Deeply cleanses pores by drawing out toxins and impurities": "Toksinleri ve kirleri dışarı çekerek gözenekleri derinlemesine temizler.",
  "Soothes and protects skin with antioxidant-rich green tea extract": "Antioksidan açısından zengin yeşil çay özü ile cildi yatıştırır ve korur.",
  "Refines texture and minimizes pore appearance for a smoother complexion": "Daha pürüzsüz bir görünüm için dokuyu arındırır ve gözenek görünümünü en aza indirir.",
  
  "Apply 2-3 drops to damp hair before blow-drying for heat protection and smoothness.": "Isı koruması ve pürüzsüzlük için fön çekmeden önce nemli saça 2-3 damla uygulayın.",
  "Use as a finishing touch on dry hair to tame flyaways and boost shine.": "Elektriklenmeyi yatıştırmak ve parlaklığı artırmak için kuru saça son dokunuş olarak uygulayın.",
  "Apply to the mid-lengths and ends of your hair, avoiding the scalp to prevent oiliness.": "Yağlanmayı önlemek için saç derisinden kaçınarak saçınızın orta kısımlarına ve uçlarına uygulayın.",
  "Strengthens hair to prevent breakage and split ends": "Kırılmayı ve saç uçlarının çatallanmasını önlemek için saçı güçlendirir.",
  "Adds a healthy, non-greasy shine to all hair types": "Tüm saç tiplerine sağlıklı, yağsız bir parlaklık katar."
};

let fileContent = fs.readFileSync('./src/lib/i18n/db-translations.ts', 'utf-8');
const lines = fileContent.split('\n');
const insertIndex = lines.findIndex(l => l.includes('TR: {')) + 1;

const newLines = [];
for (const [en, tr] of Object.entries(translations)) {
  const enSafe = en.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  if (!fileContent.includes(`"${enSafe}"`)) {
    newLines.push(`    ${JSON.stringify(en)}: ${JSON.stringify(tr)},`);
  }
}

lines.splice(insertIndex, 0, ...newLines);
fs.writeFileSync('./src/lib/i18n/db-translations.ts', lines.join('\n'));
console.log('Added ' + newLines.length + ' tip translations!');
