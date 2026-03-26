"""
Real Product File Generator
Generates actual, sellable digital products with complete content
"""
import asyncio
from typing import Dict, Any, List
import json
from datetime import datetime, timezone
import os
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv()

class RealProductGenerator:
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
        
    async def generate_complete_ebook(self, niche: str, keywords: List[str], 
                                     target_audience: str = "general") -> Dict[str, Any]:
        """
        Generate a COMPLETE, sellable eBook with full content
        Minimum 10,000 words, professional quality
        """
        
        print(f"📚 Generating complete eBook for niche: {niche}")
        
        # Initialize AI chat
        chat = LlmChat(
            api_key=self.api_key,
            session_id=f"ebook-gen-{datetime.now().timestamp()}",
            system_message="You are a professional author and content strategist. Create comprehensive, valuable, and well-structured eBooks that customers love."
        ).with_model("openai", "gpt-5.2")
        
        # Step 1: Create detailed outline
        outline_prompt = f"""
Create a comprehensive outline for a professional eBook:

Niche: {niche}
Keywords: {', '.join(keywords)}
Target Audience: {target_audience}
Goal: Minimum 10,000 words, 8-12 chapters

Provide:
1. Compelling book title
2. Benefit-driven subtitle
3. 10 chapter titles with detailed descriptions
4. Key takeaways
5. Target reader pain points this solves

Return as JSON:
{{
  "title": "Book Title",
  "subtitle": "Benefit-driven subtitle",
  "chapters": [
    {{"number": 1, "title": "Chapter Title", "description": "What this covers", "key_points": ["point1", "point2"]}}
  ],
  "target_pain_points": ["pain1", "pain2"],
  "key_benefits": ["benefit1", "benefit2"]
}}
"""
        
        outline_msg = UserMessage(text=outline_prompt)
        outline_response = await chat.send_message(outline_msg)
        
        # Parse outline
        import json
        outline_text = outline_response.strip()
        if "```json" in outline_text:
            outline_text = outline_text.split("```json")[1].split("```")[0].strip()
        elif "```" in outline_text:
            outline_text = outline_text.split("```")[1].split("```")[0].strip()
        
        outline = json.loads(outline_text)
        
        print(f"✓ Outline created: {outline['title']}")
        
        # Step 2: Generate full chapters
        chapters_content = []
        
        for chapter in outline['chapters'][:10]:  # Generate up to 10 chapters
            print(f"  Writing Chapter {chapter['number']}: {chapter['title']}...")
            
            chapter_prompt = f"""
Write a complete, professional chapter for this eBook:

Book: {outline['title']}
Chapter {chapter['number']}: {chapter['title']}
Description: {chapter['description']}
Key Points to Cover: {', '.join(chapter.get('key_points', []))}

Requirements:
- Minimum 1,000 words
- Professional, engaging writing
- Practical examples and actionable advice
- Clear structure with subheadings
- No placeholder text

Write the complete chapter now:
"""
            
            chapter_msg = UserMessage(text=chapter_prompt)
            chapter_content = await chat.send_message(chapter_msg)
            
            chapters_content.append({
                "number": chapter['number'],
                "title": chapter['title'],
                "content": chapter_content
            })
            
            print(f"  ✓ Chapter {chapter['number']} complete ({len(chapter_content)} chars)")
        
        # Step 3: Generate introduction and conclusion
        intro_prompt = f"""
Write a compelling introduction for this eBook:

Title: {outline['title']}
Subtitle: {outline['subtitle']}

Introduction should:
- Hook the reader immediately
- Explain the problem this book solves
- Preview the transformation readers will experience
- Build credibility
- 500-800 words

Write the complete introduction:
"""
        
        intro_msg = UserMessage(text=intro_prompt)
        introduction = await chat.send_message(intro_msg)
        print("  ✓ Introduction complete")
        
        conclusion_prompt = f"""
Write a powerful conclusion for this eBook:

Title: {outline['title']}
Key Benefits Delivered: {', '.join(outline.get('key_benefits', []))}

Conclusion should:
- Summarize key takeaways
- Inspire action
- Provide next steps
- Leave reader motivated
- 500-800 words

Write the complete conclusion:
"""
        
        conclusion_msg = UserMessage(text=conclusion_prompt)
        conclusion = await chat.send_message(conclusion_msg)
        print("  ✓ Conclusion complete")
        
        # Step 4: Create sales description
        sales_prompt = f"""
Create a compelling product description for this eBook:

Title: {outline['title']}
Subtitle: {outline['subtitle']}
Target Pain Points: {', '.join(outline.get('target_pain_points', []))}
Key Benefits: {', '.join(outline.get('key_benefits', []))}

Create:
1. Hook (1-2 sentences)
2. Problem statement (2-3 sentences)
3. Solution preview (2-3 sentences)
4. What's inside (bullet points)
5. Who this is for
6. Call to action

Make it compelling and sales-focused. 200-300 words.
"""
        
        sales_msg = UserMessage(text=sales_prompt)
        sales_description = await chat.send_message(sales_msg)
        
        # Calculate total word count
        total_words = (len(introduction.split()) + 
                      sum(len(ch['content'].split()) for ch in chapters_content) + 
                      len(conclusion.split()))
        
        print(f"\n✅ eBook Complete!")
        print(f"   Total Words: {total_words:,}")
        print(f"   Chapters: {len(chapters_content)}")
        
        # Compile complete eBook
        ebook = {
            "product_type": "ebook",
            "title": outline['title'],
            "subtitle": outline.get('subtitle', ''),
            "description": sales_description,
            "content": {
                "introduction": introduction,
                "chapters": chapters_content,
                "conclusion": conclusion,
                "outline": outline
            },
            "metadata": {
                "word_count": total_words,
                "chapter_count": len(chapters_content),
                "niche": niche,
                "keywords": keywords,
                "target_audience": target_audience,
                "generated_at": datetime.now(timezone.utc).isoformat()
            },
            "file_ready": True,
            "quality_score": self._calculate_quality_score(total_words, len(chapters_content))
        }
        
        return ebook
    
    async def generate_complete_course(self, topic: str, 
                                      target_audience: str = "beginners",
                                      duration_hours: int = 3) -> Dict[str, Any]:
        """
        Generate a COMPLETE online course with all content
        Ready for Udemy or similar platforms
        """
        
        print(f"🎓 Generating complete course for topic: {topic}")
        
        chat = LlmChat(
            api_key=self.api_key,
            session_id=f"course-gen-{datetime.now().timestamp()}",
            system_message="You are an expert instructional designer and online course creator. Create comprehensive, engaging courses."
        ).with_model("openai", "gpt-5.2")
        
        # Generate course structure
        structure_prompt = f"""
Create a complete course structure:

Topic: {topic}
Target: {target_audience}
Duration: {duration_hours} hours

Provide:
1. Course title (compelling, SEO-friendly)
2. Tagline
3. Learning objectives (5-7 items)
4. 6-8 modules with 3-5 lessons each
5. Quizzes/assignments

Return as JSON:
{{
  "title": "Course Title",
  "tagline": "Learn X in Y",
  "objectives": ["objective1"],
  "modules": [
    {{
      "number": 1,
      "title": "Module Title",
      "lessons": [
        {{"title": "Lesson Title", "type": "video", "duration_min": 10, "content_outline": "What to teach"}}
      ],
      "quiz": {{"questions": 5, "topics": ["topic1"]}}
    }}
  ]
}}
"""
        
        structure_msg = UserMessage(text=structure_prompt)
        structure_response = await chat.send_message(structure_msg)
        
        structure_text = structure_response.strip()
        if "```json" in structure_text:
            structure_text = structure_text.split("```json")[1].split("```")[0].strip()
        
        course_structure = json.loads(structure_text)
        
        print(f"✓ Course structure created: {course_structure['title']}")
        
        # Generate detailed lesson content
        detailed_modules = []
        
        for module in course_structure['modules'][:8]:  # Up to 8 modules
            print(f"  Creating Module {module['number']}: {module['title']}")
            
            detailed_lessons = []
            for lesson in module['lessons'][:5]:  # Up to 5 lessons per module
                lesson_prompt = f"""
Create complete lesson content:

Module: {module['title']}
Lesson: {lesson['title']}
Duration: {lesson['duration_min']} minutes
Outline: {lesson.get('content_outline', '')}

Provide:
1. Lesson script (what instructor says)
2. Key concepts
3. Practical examples (2-3)
4. Exercises/practice items
5. Resources/links to include

Write comprehensive lesson content (500-800 words):
"""
                
                lesson_msg = UserMessage(text=lesson_prompt)
                lesson_content = await chat.send_message(lesson_msg)
                
                detailed_lessons.append({
                    **lesson,
                    "script": lesson_content,
                    "completed": True
                })
            
            detailed_modules.append({
                **module,
                "lessons": detailed_lessons,
                "completed": True
            })
            
            print(f"  ✓ Module {module['number']} complete")
        
        # Generate sales description
        sales_prompt = f"""
Create compelling course sales page copy:

Title: {course_structure['title']}
Tagline: {course_structure['tagline']}
Objectives: {', '.join(course_structure['objectives'])}

Create:
1. Hook (2-3 sentences)
2. What you'll learn (bullet points)
3. Who this is for
4. Why take this course
5. What's included
6. Call to action

250-350 words, sales-focused:
"""
        
        sales_msg = UserMessage(text=sales_prompt)
        sales_description = await chat.send_message(sales_msg)
        
        total_lessons = sum(len(m['lessons']) for m in detailed_modules)
        
        print(f"\n✅ Course Complete!")
        print(f"   Modules: {len(detailed_modules)}")
        print(f"   Total Lessons: {total_lessons}")
        
        course = {
            "product_type": "course",
            "title": course_structure['title'],
            "tagline": course_structure['tagline'],
            "description": sales_description,
            "content": {
                "objectives": course_structure['objectives'],
                "modules": detailed_modules,
                "structure": course_structure
            },
            "metadata": {
                "module_count": len(detailed_modules),
                "lesson_count": total_lessons,
                "duration_hours": duration_hours,
                "topic": topic,
                "target_audience": target_audience,
                "generated_at": datetime.now(timezone.utc).isoformat()
            },
            "file_ready": True,
            "quality_score": self._calculate_quality_score(total_lessons * 500, len(detailed_modules))
        }
        
        return course
    
    def _calculate_quality_score(self, word_count: int, sections: int) -> int:
        """Calculate quality score 0-100"""
        # Word count score (max at 10,000+ words)
        word_score = min(word_count / 100, 100) * 0.6
        
        # Structure score (max at 10+ sections)
        structure_score = min(sections * 10, 100) * 0.4
        
        return int(word_score + structure_score)
    
    async def export_to_file(self, product: Dict[str, Any], format: str = "json") -> str:
        """
        Export product to file format
        Returns file path
        """
        import os
        import json
        
        # Create exports directory
        export_dir = "/app/exports"
        os.makedirs(export_dir, exist_ok=True)
        
        product_id = product.get('id', datetime.now().strftime('%Y%m%d%H%M%S'))
        
        if format == "json":
            file_path = f"{export_dir}/{product_id}.json"
            with open(file_path, 'w') as f:
                json.dump(product, f, indent=2, default=str)
        
        elif format == "markdown":
            file_path = f"{export_dir}/{product_id}.md"
            markdown = self._convert_to_markdown(product)
            with open(file_path, 'w') as f:
                f.write(markdown)
        
        return file_path
    
    def _convert_to_markdown(self, product: Dict[str, Any]) -> str:
        """Convert product to markdown format"""
        md = f"# {product['title']}\n\n"
        
        if product.get('subtitle'):
            md += f"## {product['subtitle']}\n\n"
        
        md += f"**Description:**\n{product['description']}\n\n"
        md += "---\n\n"
        
        if product['product_type'] == 'ebook':
            content = product['content']
            md += "## Introduction\n\n"
            md += content['introduction'] + "\n\n"
            
            for chapter in content['chapters']:
                md += f"## Chapter {chapter['number']}: {chapter['title']}\n\n"
                md += chapter['content'] + "\n\n"
            
            md += "## Conclusion\n\n"
            md += content['conclusion'] + "\n\n"
        
        return md
