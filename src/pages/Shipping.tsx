import React from 'react';

export function Shipping() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col pt-32 pb-20">
      <div className="container max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-[2.5rem] p-10 md:p-16 border border-gray-100 shadow-sm space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900">Shipping Policy</h1>
            <p className="text-gray-500 text-lg">Everything you need to know about our shipping and delivery processes.</p>
          </div>

          <div className="prose prose-gray max-w-none text-gray-600 space-y-6 leading-relaxed">
             <h3>1. Processing Time</h3>
             <p>All our products are made with love and care. We typically process and dispatch orders within 2-3 business days after the payment is confirmed.</p>
             
             <h3>2. Shipping Times</h3>
             <p>Once dispatched, standard shipping usually takes 5-7 business days depending on your location. Please note that during holidays or peak seasons, delivery times might be slightly longer.</p>
             
             <h3>3. Shipping Costs</h3>
             <p>Shipping costs are calculated at checkout based on your location and the total weight of your order. We offer free shipping on orders over a certain amount as occasionally advertised on the site.</p>
             
             <h3>4. Tracking Your Order</h3>
             <p>Once your order has shipped, you will receive a confirmation email with a tracking link so you can monitor your package's delivery progress.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
