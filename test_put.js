async function testPut() {
  const res = await fetch('http://localhost:3000/api/admin/products/cmrqo4iqc001quq7obdryangz');
  const data = await res.json();
  const product = data.product;

  const putRes = await fetch('http://localhost:3000/api/admin/products/cmrqo4iqc001quq7obdryangz', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Cookie': 'next-auth.session-token=mock' },
    body: JSON.stringify({ ...product, featured: !product.featured })
  });

  const putData = await putRes.text();
  console.log("Status:", putRes.status);
  console.log("Response:", putData);
}

testPut();
