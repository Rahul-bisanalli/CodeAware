import httpx

class GitHubService:
    async def find_related_issues(self, query: str):
        if not query:
            return []
            
        # Basic keyword extraction to make the query more relevant
        keywords = query.replace(" ", "+")
        if "error" not in query.lower():
            keywords += "+error"
            
        url = f"https://api.github.com/search/issues?q={keywords}+is:issue+is:open"
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, timeout=10.0)
                if response.status_code == 200:
                    items = response.json().get("items", [])[:5]
                    return [
                        {
                            "title": item["title"],
                            "url": item["html_url"],
                            "repo": item["repository_url"].split("/")[-1]
                        }
                        for item in items
                    ]
            except Exception:
                return []
        return []

github_service = GitHubService()
