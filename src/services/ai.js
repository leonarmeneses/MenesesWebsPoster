import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generatePostContent(imageBuffer = null, mimeType = null) {
  try {
    // Use gemini-2.0-flash which is available in your account
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let imagePart = null;
    if (imageBuffer) {
      imagePart = {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: mimeType || "image/jpeg",
        },
      };
    }

    const prompt = `
      Actúa como el Community Manager experto de "Meneses Webs", una agencia líder en desarrollo web y soluciones digitales en Playa del Carmen con +8 años de experiencia y 27 proyectos exitosos.
      
      ${imagePart ? "ANALIZA LA IMAGEN PROPORCIONADA. Es un proyecto web, diseño, captura de pantalla de sistema, o concepto digital." : ""}
      
      Genera una publicación para Facebook atractiva, profesional y corta (máximo 3 oraciones) ${imagePart ? "basada en lo que ves en la imagen" : "sobre nuestros servicios digitales"}.
      
      Temas posibles (si no hay imagen o para complementar):
      - Desarrollo de páginas web profesionales y optimizadas para SEO.
      - Tiendas virtuales (e-commerce) con WooCommerce y plataformas avanzadas.
      - Sistemas empresariales personalizados (CRM, ERP, APIs).
      - Aplicaciones móviles nativas e híbridas.
      - Marketing digital, SEO y posicionamiento.
      - Tips sobre transformación digital para negocios.
      - Casos de éxito y testimonios.

      Datos obligatorios a incluir sutilmente o al final:
      - Ubicación: Playa del Carmen, Quintana Roo
      - WhatsApp: +52 1 984 187 0951
      - Email: Meneseswebs@gmail.com (opcional)
      
      Estilo:
      - Usa emojis tecnológicos 💻🚀📱🌐✨.
      - Tono: Profesional, innovador, cercano y orientado a resultados.
      - Hashtags: #MenesesWebs #DesarrolloWeb #PlayaDelCarmen #TransformaciónDigital #PáginasWeb #Ecommerce #AppsMoviles
      
      IMPORTANTE: Solo dame el texto de la publicación, nada más.
    `;

    const parts = imagePart ? [prompt, imagePart] : [prompt];
    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error("Error generating AI content:", error);
    return null;
  }
}
