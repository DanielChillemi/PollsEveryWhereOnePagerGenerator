import asyncio
from backend.services.pdf_generator import PDFGenerator
from datetime import datetime

async def main():
    print("Testing Playwright PDF Generator...")
    html = '<html><body><h1 style="color: blue;">Hello from Playwright!</h1><p>This is a test PDF.</p></body></html>'
    generator = PDFGenerator()
    pdf_bytes = await generator.generate_pdf(html, page_format='letter', print_background=True)
    
    with open('playwright_test.pdf', 'wb') as f:
        f.write(pdf_bytes)
    
    print(f"Success! Generated {len(pdf_bytes) / 1024:.1f} KB PDF")
    print("File: playwright_test.pdf")

if __name__ == '__main__':
    asyncio.run(main())
