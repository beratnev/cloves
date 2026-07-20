async function testCreate() {
  const payload = {
    name: "AI Test Product",
    description: "Test description",
    sku: "AITEST12",
    category: "Perfume",
    department: "FRAGRANCE",
    price: 50,
    comparePrice: 70,
    stock: 10,
    status: "active",
    featured: true,
    images: [{
      publicId: "test_123",
      secureUrl: "https://example.com/test.jpg",
      width: 500,
      height: 500,
      format: "jpg",
      bytes: 12345
    }],
    attributes: { "fragranceFamily": "Floral" },
    aiAdvice: { keyBenefits: ["Test"], usageTips: ["Test"] }
  };

  const res = await fetch('http://localhost:3000/api/admin/products', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      // We need to bypass requireAdmin if possible, or use a valid session token.
      // Or I can just check the backend logs.
    },
    body: JSON.stringify(payload)
  });

  const data = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", data);
}

testCreate();
