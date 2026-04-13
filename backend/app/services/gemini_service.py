import os

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()


class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        self.model = None

        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel("gemini-flash-latest")

    async def get_debugging_suggestion(
        self,
        code: str,
        error: str = "",
        model_name: str = "gemini-flash-latest",
        instruction: str = "",
    ):
        if not self.model:
            return "Gemini API key is not configured. Add GEMINI_API_KEY to your environment."

        try:
            active_model = genai.GenerativeModel(model_name)
        except Exception:
            active_model = self.model

        prompt = f"""
You are CodeAware AI, a focused coding assistant for debugging and learning.
Help the user understand the issue, fix it, and learn the concept behind it.

Code:
{code}

Error or context:
{error or "No runtime error was provided."}

Extra request:
{instruction or "Debug and explain the code clearly."}

Respond in Markdown using this structure:

### Analysis
Explain what is happening and identify the likely issue.

### Socratic Hint
Ask 1-2 guiding questions that help the user reason toward the fix.

### The Fix
Provide corrected code when useful, with short comments for meaningful changes.

### Learning Moment
Explain the underlying programming concept in 2-3 sentences.
"""

        try:
            response = await active_model.generate_content_async(prompt)

            if not response.candidates or not response.candidates[0].content.parts:
                return "The AI response was empty or blocked by safety filters. Try rephrasing your code."

            return response.text
        except Exception as error:
            error_message = str(error)
            if "finish_reason" in error_message:
                return "AI response was blocked by safety filters. Please check the code or prompt and try again."
            return f"Error from CodeAware AI: {error_message}"


gemini_service = GeminiService()
