import { GoogleGenAI, Type } from "@google/genai";
import type { Question, RelationshipProfile, UserMode } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const questionSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: {
          type: Type.STRING,
          description: 'The question text.'
        },
        options: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          },
          description: 'An array of 4 distinct string options for the question.'
        }
      },
      required: ['question', 'options'],
    },
};

const profileSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "The specific name of the relationship type (e.g., 'Polyamory', 'Open Relationship', 'Modern Monogamy'). This must be in Spanish."
        },
        description: {
            type: Type.STRING,
            description: "A detailed, empathetic, and constructive description of this relationship type and why it fits the user's answers. This should be at least 3 sentences long and in Spanish."
        },
        compatibilityTips: {
            type: Type.STRING,
            description: "Actionable tips and advice for the user(s) to thrive in or find this specific type of relationship. This must be in Spanish."
        }
    },
    required: ['title', 'description', 'compatibilityTips'],
};


const getQuestionPrompt = (mode: UserMode) => {
    if (mode === 'individual') {
        return `Eres un experto en relaciones compasivo y moderno. Tu tarea es generar un conjunto de 8 preguntas de opción múltiple, completamente nuevas y diferentes cada vez, para una persona soltera que intenta comprender su relación ideal. Las preguntas deben ser introspectivas, profundas y evitar los clichés para revelar sus valores fundamentales sobre autonomía, compromiso, honestidad y conexión. Devuelve la respuesta como un objeto JSON que siga estrictamente el esquema proporcionado. Las preguntas y opciones deben estar en español.`;
    }
    return `Eres un sabio consejero de relaciones. Tu tarea es generar un conjunto de 8 preguntas de opción múltiple, completamente nuevas y diferentes cada vez, para que una pareja las responda junta. Las preguntas deben generar debate y ayudarles a comprender su dinámica de relación compartida, enfocándose en comunicación, manejo de celos, metas futuras y límites. Devuelve la respuesta como un objeto JSON que siga estrictamente el esquema proporcionado. Las preguntas y opciones deben estar en español.`;
};

const getAnalysisPrompt = (mode: UserMode, answers: string[]) => {
    const formattedAnswers = answers.map((a, i) => `Pregunta ${i+1}: ${a}`).join('\n');
    if (mode === 'individual') {
        return `Eres un psicólogo de relaciones moderno y experto en diversas estructuras relacionales. Una persona ha respondido un cuestionario para descubrir su tipo de relación ideal. Sus respuestas son:\n${formattedAnswers}\n\nTu tarea es analizar profundamente estas respuestas para identificar la estructura de relación que mejor se alinea con sus valores. Considera un amplio espectro de posibilidades: monogamia, poliamor (jerárquico o no), relaciones abiertas, anarquía relacional, etc. Basado en tu análisis, genera un perfil de relación que siga estrictamente el esquema JSON.\n\n- En 'title', pon el nombre específico del tipo de relación (ej. "Poliamor Jerárquico", "Relación Abierta", "Monogamia Moderna").\n- En 'description', explica qué es este tipo de relación y por qué encaja con las respuestas del usuario, citando sus preferencias de autonomía, conexión y honestidad.\n- En 'compatibilityTips', ofrece consejos prácticos sobre cómo prosperar en este tipo de relación o cómo encontrar parejas que compartan esta visión.\n\nLa respuesta debe ser en español, con un tono empoderador.`;
    }
    return `Eres un terapeuta de parejas vanguardista, especializado en dinámicas relacionales diversas. Una pareja ha respondido un cuestionario sobre su relación. Sus respuestas combinadas son:\n${formattedAnswers}\n\nAnaliza sus respuestas para identificar la estructura de relación que mejor describe su dinámica actual o hacia la que parecen estar evolucionando (ej. monogamia, poliamor, relaciones abiertas, anarquía relacional, etc.). Genera un perfil que siga estrictamente el esquema JSON.\n\n- En 'title', nombra la estructura de relación que identificas (ej. "Monogamia con Flexibilidad", "Explorando la No Monogamia Ética").\n- En 'description', describe cómo sus respuestas reflejan esta dinámica, señalando sus fortalezas y áreas de crecimiento.\n- En 'compatibilityTips', proporciona consejos concretos para fortalecer su vínculo dentro de esa estructura, enfocándote en la comunicación y el establecimiento de acuerdos.\n\nLa respuesta debe ser en español, con un tono constructivo.`;
};


export const fetchQuestions = async (mode: UserMode): Promise<Question[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: getQuestionPrompt(mode),
            config: {
                responseMimeType: "application/json",
                responseSchema: questionSchema,
            },
        });
        const jsonText = response.text.trim();
        const questions = JSON.parse(jsonText);
        return questions as Question[];
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw new Error("No pudimos generar las preguntas. Inténtalo de nuevo.");
    }
};

export const analyzeAnswers = async (mode: UserMode, answers: string[]): Promise<RelationshipProfile> => {
     try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: getAnalysisPrompt(mode, answers),
            config: {
                responseMimeType: "application/json",
                responseSchema: profileSchema,
            },
        });
        const jsonText = response.text.trim();
        const profile = JSON.parse(jsonText);
        return profile as RelationshipProfile;
    } catch (error) {
        console.error("Error analyzing answers:", error);
        throw new Error("No pudimos analizar tus respuestas. Inténtalo de nuevo.");
    }
};