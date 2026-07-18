const fs = require('fs');
const path = require('path');

const enKeys = `
  // Admin Sidebar
  adminDashboard: "Dashboard",
  adminProducts: "Products",
  adminOrders: "Orders",
  adminCategories: "Categories",
  adminInventory: "Inventory",
  adminCustomers: "Customers",
  adminAnalytics: "Analytics",
  adminMarketing: "Marketing",
  adminCoupons: "Coupons",
  adminBrands: "Brands",
  adminCollections: "Collections",
  adminReviews: "Reviews",
  adminMedia: "Media Library",
  adminSettings: "Settings",
  adminStoreView: "Store View",
  adminAiTools: "AI Tools",

  // Admin Dashboard
  adminTotalRevenue: "Total Revenue",
  adminTotalOrders: "Total Orders",
  adminTotalCustomers: "Total Customers",
  adminTotalProducts: "Total Products",
  adminActiveDiscounts: "Active Discounts",
  adminLowStockAlerts: "Low Stock Alerts",
  adminRecentOrders: "Recent Orders",
  adminTopProducts: "Top Products",
  adminTopCategories: "Top Categories",
  adminQuickActions: "Quick Actions",
  adminAddNewProduct: "Add New Product",
  adminViewOrders: "View Orders",
  adminManageCategories: "Manage Categories",
  adminAnalyticsReport: "Analytics Report",

  // Common Admin Terms
  adminAdd: "Add",
  adminEdit: "Edit",
  adminDelete: "Delete",
  adminSave: "Save",
  adminCancel: "Cancel",
  adminSearch: "Search...",
  adminStatus: "Status",
  adminActions: "Actions",
  adminFilter: "Filter",
  adminExport: "Export",
  adminImport: "Import",
`;

const trKeys = `
  // Admin Sidebar
  adminDashboard: "Kontrol Paneli",
  adminProducts: "Ürünler",
  adminOrders: "Siparişler",
  adminCategories: "Kategoriler",
  adminInventory: "Envanter",
  adminCustomers: "Müşteriler",
  adminAnalytics: "Analizler",
  adminMarketing: "Pazarlama",
  adminCoupons: "Kuponlar",
  adminBrands: "Markalar",
  adminCollections: "Koleksiyonlar",
  adminReviews: "Değerlendirmeler",
  adminMedia: "Medya Kütüphanesi",
  adminSettings: "Ayarlar",
  adminStoreView: "Mağaza Görünümü",
  adminAiTools: "Yapay Zeka Araçları",

  // Admin Dashboard
  adminTotalRevenue: "Toplam Gelir",
  adminTotalOrders: "Toplam Sipariş",
  adminTotalCustomers: "Toplam Müşteri",
  adminTotalProducts: "Toplam Ürün",
  adminActiveDiscounts: "Aktif İndirimler",
  adminLowStockAlerts: "Düşük Stok Uyarıları",
  adminRecentOrders: "Son Siparişler",
  adminTopProducts: "En Çok Satan Ürünler",
  adminTopCategories: "Popüler Kategoriler",
  adminQuickActions: "Hızlı İşlemler",
  adminAddNewProduct: "Yeni Ürün Ekle",
  adminViewOrders: "Siparişleri Görüntüle",
  adminManageCategories: "Kategorileri Yönet",
  adminAnalyticsReport: "Analiz Raporu",

  // Common Admin Terms
  adminAdd: "Ekle",
  adminEdit: "Düzenle",
  adminDelete: "Sil",
  adminSave: "Kaydet",
  adminCancel: "İptal",
  adminSearch: "Ara...",
  adminStatus: "Durum",
  adminActions: "İşlemler",
  adminFilter: "Filtrele",
  adminExport: "Dışa Aktar",
  adminImport: "İçe Aktar",
`;

function injectKeys(langPath, keysStr) {
  const fullPath = path.join(__dirname, langPath);
  let content = fs.readFileSync(fullPath, 'utf8');
  const lastBraceIndex = content.lastIndexOf('}');
  if (lastBraceIndex !== -1) {
    const before = content.substring(0, lastBraceIndex);
    const after = content.substring(lastBraceIndex);
    let newContent = before;
    if (!before.trim().endsWith(',')) {
      newContent += ',';
    }
    newContent += '\n' + keysStr + '\n' + after;
    fs.writeFileSync(fullPath, newContent);
    console.log('Injected keys into ' + langPath);
  }
}

injectKeys('src/lib/i18n/dictionaries/en.ts', enKeys);
injectKeys('src/lib/i18n/dictionaries/tr.ts', trKeys);
