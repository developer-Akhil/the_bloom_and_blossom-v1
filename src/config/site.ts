export const siteConfig = {
  name: "The Bloom & Blossom",
  description: "Hand-crafted hair accessories designed to bring out the blooming beauty in every person. Delicate, elegant, and uniquely yours.",
  contact: {
    email: "info@bloomandblossom.in",
    phone: "+91 8076323737",
    phoneDisplay: "+91 8076323737", // If we want to format it differently
    address: {
      line1: "Shivlok Colony Haridwar",
      line2: "Uttarakhand 249403",
    }
  },
  social: {
    instagram: "https://www.instagram.com/bows_scrunchies.love/",
    instagramHandle: "@bloomandblossom.official",
    youtube: "https://www.youtube.com/@thebloomandblossom",
    facebook: "https://www.facebook.com/share/1GMNfXQki9/",
    whatsapp: "https://wa.me/message/6IMAWM55WUTII1"
  },
  api: {
    payment: {
      pay: "/api/payment/pay",
      status: (orderId: string) => `/api/payment/status/${orderId}`,
      refund: "/api/payment/refund"
    },
    phonepe: {
      baseUrl: "https://api.phonepe.com/apis/pg",
      tokenUrl: "https://api.phonepe.com/apis/identity-manager/v1/oauth/token",
      logoUrl: "https://phonepe.com/webapp-assets/images/logo.svg"
    }
  }
};
