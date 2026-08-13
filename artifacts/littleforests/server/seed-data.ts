import { storage } from "./supabase-storage";

async function seedSampleData() {
  try {
    console.log('Starting data seeding...');
    
    // Sample products
    const sampleProducts = [
      {
        name: "Mango Tree Seedling",
        category: "Fruit Trees",
        price: "KSH 450",
        description: "Premium mango tree seedling, grafted variety for better fruit production. Grows well in tropical climates.",
        status: "Available",
        featured: true,
        stock_quantity: 25
      },
      {
        name: "Baobab Tree Seedling",
        category: "Indigenous Trees",
        price: "KSH 600",
        description: "Native African baobab tree seedling. Drought-resistant and culturally significant species.",
        status: "Available", 
        featured: false,
        stock_quantity: 15
      },
      {
        name: "Jacaranda Tree Seedling",
        category: "Ornamental Trees",
        price: "KSH 350",
        description: "Beautiful flowering jacaranda tree with purple blooms. Perfect for landscaping.",
        status: "Available",
        featured: true,
        stock_quantity: 30
      },
      {
        name: "Avocado Tree Seedling",
        category: "Fruit Trees", 
        price: "KSH 500",
        description: "Hass avocado variety seedling. High-yielding and disease-resistant.",
        status: "Available",
        featured: false,
        stock_quantity: 20
      },
      {
        name: "Mukau Tree Seedling",
        category: "Indigenous Trees",
        price: "KSH 400",
        description: "Fast-growing indigenous tree excellent for timber and soil conservation.",
        status: "Available",
        featured: false,
        stock_quantity: 18
      },
      {
        name: "Flame Tree Seedling",
        category: "Ornamental Trees",
        price: "KSH 380",
        description: "Striking flame tree with brilliant red-orange flowers. Ideal for gardens.",
        status: "Available",
        featured: true,
        stock_quantity: 22
      }
    ];

    // Sample content
    const sampleContent = [
      {
        type: "hero",
        title: "Welcome to LittleForest",
        content: "Nurturing Kenya's green future, one seedling at a time. Discover our premium collection of indigenous, ornamental, and fruit tree seedlings.",
        status: "published"
      },
      {
        type: "about",
        title: "About LittleForest",
        content: "LittleForest is Kenya's premier tree nursery, specializing in indigenous and fruit tree seedlings. We're committed to reforestation and sustainable farming practices.",
        status: "published"
      },
      {
        type: "services",
        title: "Our Services",
        content: "We provide high-quality tree seedlings, planting guidance, and ongoing support for farmers and conservation organizations across Kenya.",
        status: "published"
      }
    ];

    // Sample testimonials (using Supabase schema)
    const sampleTestimonials = [
      {
        name: "John Kamau",
        content: "The mango seedlings I bought from LittleForest have grown beautifully. Excellent quality and great service!",
        rating: 5
      },
      {
        name: "Mary Wanjiku", 
        content: "LittleForest helped me start my tree nursery. Their indigenous seedlings are top quality.",
        rating: 5
      },
      {
        name: "Peter Ochieng",
        content: "Professional service and healthy seedlings. My avocado farm is thriving thanks to LittleForest.",
        rating: 5
      }
    ];

    // Create products
    for (const product of sampleProducts) {
      await storage.createProduct(product);
      console.log(`Created product: ${product.name}`);
    }

    // Create content
    for (const content of sampleContent) {
      await storage.createContent(content);
      console.log(`Created content: ${content.type}`);
    }

    // Create testimonials
    for (const testimonial of sampleTestimonials) {
      await storage.createTestimonial(testimonial);
      console.log(`Created testimonial: ${testimonial.name}`);
    }

    console.log('Data seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSampleData().catch(console.error);
}

export { seedSampleData };