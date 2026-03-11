import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            self.model = None
        else:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-flash-latest')

    async def get_debugging_suggestion(self, code: str, error: str = "", model_name: str = "gemini-flash-latest"):
        if not self.model:
            return "Gemini API Key not configured. Please add GEMINI_API_KEY to your environment."
        
        # If a different model is requested, use it, otherwise fallback to default
        try:
            active_model = genai.GenerativeModel(model_name)
        except Exception:
            active_model = self.model

        prompt = f"""
        You are 'CodeAware AI', a premium pedagogical coding assistant. 
        Your goal is to help students learn through real-time project development using a blend of direct help and Socratic questioning.
        
        CODE:
        {code}
        
        ERROR/CONTEXT:
        {error}
        
        Please provide your response in the following structured Markdown format:
        
        ### 🔍 Analysis
        Explain what's happening in the code and what the specific issue is. Use a supportive, encouraging tone.
        
        ### 💡 Socratic Hint
        Instead of just giving the answer, ask 1-2 leading questions that help the student realize the solution themselves.
        
        ### 🛠️ The Fix
        Provide the corrected code snippet with comments explaining the changes.
        
        ### 🎓 Learning Moment
        Explain the underlying computer science or programming concept (e.g., scoping, closure, async/await event loop) in 2-3 sentences to provide lasting value.
        """
        
        try:
            response = await active_model.generate_content_async(prompt)
            
            if not response.candidates or not response.candidates[0].content.parts:
                return "The AI response was empty or blocked by safety filters. Try rephrasing your code."
            
            return response.text
        except Exception as e:
            error_msg = str(e)
            if "finish_reason" in error_msg:
                return "AI response was blocked due to safety content filters. Please check your code for potentially sensitive content."
            return f"Error from CodeAware AI: {error_msg}"

gemini_service = GeminiService()
