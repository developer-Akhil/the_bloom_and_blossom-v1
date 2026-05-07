fetch("http://127.0.0.0:3000/api/payment/create-order", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 100,
    phone: "9876543210",
    name: "Test",
    email: "test@test.com"
  })
}).then(async res => {
  console.log("STATUS:", res.status);
  console.log("CONTENT-TYPE:", res.headers.get("content-type"));
  const text = await res.text();
  console.log("BODY:", text.substring(0, 100));
}).catch(console.error);
