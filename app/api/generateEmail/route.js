import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-1.5-flash",
  maxOutputTokens: 2048,
});

const emailPrompt = `
        You are a professional email writer. Create a business email using the following information:
        Recipient Name: {recipientName}
        Email Purpose: {emailPurpose}
        Key Points: {keyPoints}

        Please provide the response in the following format : 
        SUBJECT: [Write a concise, relevant subject line here]

        BODY: [Write the email body here]
        
        Guidelines for the body:
        - Start with an appropriate greeting using the recipient's name and end with a professional closing
        - Write in a clear, professional tone
        - Include all key points naturally in the email
        - Use appropriate transitions between paragraphs
        - Keep the email concise but complete
        - Format with proper spacing between paragraphs
        
        Email Type Specific Instructions:

        if emailPurpose === "meeting"
        - Include specific proposed times/duration
        - Clearly state the agenda items
        - Request confirmation of availability

        if emailPurpose === "follow_up"
        - Reference the previous meeting/interaction
        - Summarize key action items
        - Indicate next steps clearly
       
        if emailPurpose === "thank_you"
        - Be specific about what you're thanking them for
        - Express genuine appreciation
        - Mention any relevant next steps

        if emailPurpose === 'other'
        - Include any additional instructions or context relevant to the email purpose according to the key points provided.
        `;

export async function POST(req, res) {
  try {
    const formData = await req.json();

    if (
      !formData.recipientName ||
      !formData.emailPurpose ||
      !formData.keyPoints
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailPromptTemplate = PromptTemplate.fromTemplate(emailPrompt);

    const promptValue = await emailPromptTemplate.invoke({
      recipientName: formData.recipientName,
      emailPurpose: formData.emailPurpose,
      keyPoints: formData.keyPoints,
    });

    const response = await model.invoke(promptValue);
    const responseText = response.content;

    const subjectMatch = responseText.match(/SUBJECT:(.*?)(?=\n\nBODY:)/s);
    const bodyMatch = responseText.match(/BODY:(.*?)$/s);

    if (!subjectMatch || !bodyMatch) {
      return NextResponse.json(
        { error: "Failed to generate email" },
        { status: 500 }
      );
    }

    const emailData = {
      subject: subjectMatch[1].trim(),
      body: bodyMatch[1].trim(),
    };

    return NextResponse.json(emailData, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
