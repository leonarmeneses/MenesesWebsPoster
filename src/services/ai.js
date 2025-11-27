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
      Actúa como un Estratega de Marketing Digital y Copywriter Senior para "Meneses Webs", una agencia de desarrollo web de alto nivel en Playa del Carmen.
      
      TU OBJETIVO: Generar interacción (likes, comentarios) y ventas (mensajes, visitas). No solo "informar", sino "persuadir".

      ${imagePart ? "PASO 1: ANALIZA LA IMAGEN VISUALMENTE. ¿Qué transmite? (Innovación, velocidad, diseño elegante, complejidad técnica, éxito)." : ""}
      
      PASO 2: Escribe un post para Facebook usando UNA de las siguientes 3 estrategias (elige la que mejor encaje con la imagen o alterna si no hay imagen):

      ESTRATEGIA A: PROBLEMA / SOLUCIÓN (Dolor -> Alivio)
      - Gancho: Una pregunta que toque un punto de dolor (ej. "¿Tu web no vende?", "¿Clientes perdidos?").
      - Cuerpo: Cómo Meneses Webs soluciona eso con tecnología de punta.
      - Cierre: Invitación a resolverlo YA.

      ESTRATEGIA B: AUTORIDAD / EDUCATIVO (Sabías que...)
      - Gancho: Un dato curioso o técnico interesante sobre webs/apps.
      - Cuerpo: Por qué es vital para un negocio moderno tener esto bien hecho.
      - Cierre: "Déjanos asesorarte".

      ESTRATEGIA C: ASPIRACIONAL / ÉXITO (Transformación)
      - Gancho: "Imagina tu negocio funcionando en automático 24/7".
      - Cuerpo: Los beneficios de tener un sistema o e-commerce profesional (más tiempo libre, más ventas).
      - Cierre: "Hazlo realidad hoy".

      REGLAS DE REDACCIÓN (AIDA):
      1. ATENCIÓN: La primera frase debe ser un "freno de mano" (scroll-stopper). Usa emojis.
      2. INTERÉS/DESEO: Habla de BENEFICIOS (dinero, tiempo, prestigio), no solo de características técnicas.
      3. ACCIÓN: Un CTA (Llamado a la Acción) claro y directo al final.

      Datos de contacto obligatorios (al final):
      📍 Playa del Carmen
      📲 WhatsApp: +52 1 984 187 0951
      
      Hashtags: #MenesesWebs #PlayaDelCarmen #DesarrolloWeb #Ecommerce #NegociosDigitales #EmprendedoresRivieraMaya #MarketingDigital

      Longitud: Máximo 4 párrafos cortos. Tono: Profesional pero enérgico y persuasivo.
      IMPORTANTE: Solo dame el texto final del post.
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
