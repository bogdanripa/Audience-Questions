import { GenezioDeploy } from "@genezio/types";
import { OpenAI } from "openai";
import { json } from "stream/consumers";

export class QuestionValidator {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI();
    }
    
    async isOffensive(text: string): Promise<boolean> {
        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{
                    "role": "system",
                    "content": "You are helping a speaker at a conference with audience questions, assessing if the questions that come from the audience are offensive or not. The questions might come in English or Romanian. Please responde with a simple JSON of the following format: {offensive: true|false}"
                  }, {
                    "role": "user",
                    "content": "The question is: " + text
                  }],
                response_format: { type: "json_object" }
            });
            if (completion.choices[0].message.content) {
                const jsonResponse = JSON.parse(completion.choices[0].message.content);
                return jsonResponse.offensive;
            } else {
                console.error("Error: ", JSON.stringify(completion));
                return true;
            }
        } catch (error) {
            console.error("Failed to fetch JSON formatted response:", error);
            return true;
        }
    }
}
