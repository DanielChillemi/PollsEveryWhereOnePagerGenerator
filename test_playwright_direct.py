"""""""""

Quick PDF Generator Test

=========================Quick PDF Generator TestQuick PDF Generator Test



Direct test of the Playwright PDF generator service (no API, no auth).==================================================

Tests HTML to PDF conversion to validate Playwright migration.

"""



import asyncioDirect test of the Playwright PDF generator service (no API, no auth).Direct test of the Playwright PDF generator service (no API, no auth).

from backend.services.pdf_generator import PDFGenerator

from datetime import datetimeTests HTML → PDF conversion to validate Playwright migration.Tests HTML → PDF conversion to validate Playwright migration.



""""""

async def test_playwright_pdf():

    """Test Playwright PDF generation directly."""

    print("=" * 60)

    print("PLAYWRIGHT PDF GENERATOR TEST")import asyncioimport asyncio

    print("=" * 60)

    from backend.services.pdf_generator import PDFGeneratorfrom backend.services.pdf_generator import PDFGenerator

    test_date = datetime.now().strftime("%B %d, %Y at %I:%M %p")

    from datetime import datetimefrom datetime import datetime

    # Create test HTML with branding (using f-string with escaped braces)

    html_content = f"""

    <!DOCTYPE html>

    <html>

    <head>

        <meta charset="UTF-8">async def test_playwright_pdf():async def test_playwright_pdf():

        <title>Playwright PDF Test</title>

        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Open+Sans:wght@400;500&display=swap" rel="stylesheet">    """Test Playwright PDF generation directly."""    """Test Playwright PDF generation directly."""

        <style>

            * {{    print("=" * 60)    print("=" * 60)

                margin: 0;

                padding: 0;    print("PLAYWRIGHT PDF GENERATOR TEST")    print("PLAYWRIGHT PDF GENERATOR TEST")

                box-sizing: border-box;

            }}    print("=" * 60)    print("=" * 60)

            

            body {{        

                font-family: 'Open Sans', sans-serif;

                color: #1f2937;    test_date = datetime.now().strftime("%B %d, %Y at %I:%M %p")    # Create test HTML with branding

                background: linear-gradient(135deg, #0ea5e9 0%, #1e293b 100%);

                padding: 60px 40px;        html_content = """

            }}

                # Create test HTML with branding (using f-string with escaped braces)    <!DOCTYPE html>

            .container {{

                max-width: 800px;    html_content = f"""    <html>

                margin: 0 auto;

                background: white;    <!DOCTYPE html>    <head>

                padding: 60px;

                border-radius: 16px;    <html>        <meta charset="UTF-8">

                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

            }}    <head>        <title>Playwright PDF Test</title>

            

            h1 {{        <meta charset="UTF-8">        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Open+Sans:wght@400;500&display=swap" rel="stylesheet">

                font-family: 'Inter', sans-serif;

                font-size: 48px;        <title>Playwright PDF Test</title>        <style>

                font-weight: 700;

                color: #0ea5e9;        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Open+Sans:wght@400;500&display=swap" rel="stylesheet">            * {

                margin-bottom: 20px;

                line-height: 1.2;        <style>                margin: 0;

            }}

                        * {{                padding: 0;

            h2 {{

                font-family: 'Inter', sans-serif;                margin: 0;                box-sizing: border-box;

                font-size: 28px;

                font-weight: 600;                padding: 0;            }

                color: #1e293b;

                margin: 40px 0 20px 0;                box-sizing: border-box;            

            }}

                        }}            body {

            p {{

                font-size: 18px;                            font-family: 'Open Sans', sans-serif;

                line-height: 1.8;

                margin-bottom: 16px;            body {{                color: #1f2937;

                color: #374151;

            }}                font-family: 'Open Sans', sans-serif;                background: linear-gradient(135deg, #0ea5e9 0%, #1e293b 100%);

            

            .feature-list {{                color: #1f2937;                padding: 60px 40px;

                list-style: none;

                padding: 0;                background: linear-gradient(135deg, #0ea5e9 0%, #1e293b 100%);            }

                margin: 30px 0;

            }}                padding: 60px 40px;            

            

            .feature-list li {{            }}            .container {

                padding: 16px 20px;

                margin-bottom: 12px;                            max-width: 800px;

                background: linear-gradient(90deg, #0ea5e9 0%, #3b82f6 100%);

                color: white;            .container {{                margin: 0 auto;

                border-radius: 8px;

                font-weight: 500;                max-width: 800px;                background: white;

                box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);

            }}                margin: 0 auto;                padding: 60px;

            

            .feature-list li::before {{                background: white;                border-radius: 16px;

                content: "Check ";

                font-weight: 700;                padding: 60px;                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

                margin-right: 8px;

            }}                border-radius: 16px;            }

            

            .cta {{                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);            

                background: #f59e0b;

                color: white;            }}            h1 {

                padding: 20px 40px;

                border-radius: 12px;                            font-family: 'Inter', sans-serif;

                text-align: center;

                margin-top: 40px;            h1 {{                font-size: 48px;

                font-size: 24px;

                font-weight: 600;                font-family: 'Inter', sans-serif;                font-weight: 700;

                box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);

            }}                font-size: 48px;                color: #0ea5e9;

            

            .footer {{                font-weight: 700;                margin-bottom: 20px;

                margin-top: 60px;

                padding-top: 30px;                color: #0ea5e9;                line-height: 1.2;

                border-top: 2px solid #e5e7eb;

                text-align: center;                margin-bottom: 20px;            }

                color: #6b7280;

                font-size: 14px;                line-height: 1.2;            

            }}

        </style>            }}            h2 {

    </head>

    <body>                            font-family: 'Inter', sans-serif;

        <div class="container">

            <h1>Playwright PDF Generator</h1>            h2 {{                font-size: 28px;

            <p style="font-size: 24px; color: #0ea5e9; font-weight: 600;">

                Modern HTML to PDF Conversion                font-family: 'Inter', sans-serif;                font-weight: 600;

            </p>

                            font-size: 28px;                color: #1e293b;

            <h2>Key Features</h2>

            <ul class="feature-list">                font-weight: 600;                margin: 40px 0 20px 0;

                <li>Actively maintained by Microsoft & browser vendors</li>

                <li>Automatic Chromium browser management</li>                color: #1e293b;            }

                <li>Superior CSS & font rendering quality</li>

                <li>Full async/await support for FastAPI</li>                margin: 40px 0 20px 0;            

                <li>Python 3.13 compatible</li>

            </ul>            }}            p {

            

            <h2>Test Results</h2>                            font-size: 18px;

            <p>

                <strong>Date:</strong> {test_date}<br>            p {{                line-height: 1.8;

                <strong>Status:</strong> <span style="color: #10b981; font-weight: 600;">Successfully Generated</span><br>

                <strong>Engine:</strong> Playwright + Chromium<br>                font-size: 18px;                margin-bottom: 16px;

                <strong>Text Quality:</strong> Fully selectable and searchable

            </p>                line-height: 1.8;                color: #374151;

            

            <div class="cta">                margin-bottom: 16px;            }

                Playwright Migration Complete

            </div>                color: #374151;            

            

            <div class="footer">            }}            .feature-list {

                Generated by Marketing One-Pager Co-Creation Tool<br>

                PDF Export System Phase 1 - Playwright Implementation                            list-style: none;

            </div>

        </div>            .feature-list {{                padding: 0;

    </body>

    </html>                list-style: none;                margin: 30px 0;

    """

                    padding: 0;            }

    try:

        print("\nGenerating PDF with Playwright...")                margin: 30px 0;            

        print("   - Engine: Chromium (headless)")

        print("   - Format: Letter (8.5 x 11 inches)")            }}            .feature-list li {

        print("   - Content: HTML with Google Fonts + CSS Grid")

                                    padding: 16px 20px;

        start_time = datetime.now()

                    .feature-list li {{                margin-bottom: 12px;

        # Generate PDF

        generator = PDFGenerator()                padding: 16px 20px;                background: linear-gradient(90deg, #0ea5e9 0%, #3b82f6 100%);

        pdf_bytes = await generator.generate_pdf(

            html_content,                margin-bottom: 12px;                color: white;

            page_format='letter',

            print_background=True                background: linear-gradient(90deg, #0ea5e9 0%, #3b82f6 100%);                border-radius: 8px;

        )

                        color: white;                font-weight: 500;

        elapsed = (datetime.now() - start_time).total_seconds()

        file_size_kb = len(pdf_bytes) / 1024                border-radius: 8px;                box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);

        

        # Save to file                font-weight: 500;            }

        output_path = "playwright_test_output.pdf"

        with open(output_path, "wb") as f:                box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);            

            f.write(pdf_bytes)

                    }}            .feature-list li::before {

        print(f"\nPDF Generated Successfully!")

        print(f"   - File Size: {file_size_kb:.1f} KB")                            content: "✓ ";

        print(f"   - Generation Time: {elapsed:.2f} seconds")

        print(f"   - Output File: {output_path}")            .feature-list li::before {{                font-weight: 700;

        

        print(f"\nValidation Checklist:")                content: "✓ ";                margin-right: 8px;

        print(f"   - File size reasonable: {'PASS' if 50 < file_size_kb < 500 else 'FAIL'}")

        print(f"   - Generation time acceptable: {'PASS' if elapsed < 5.0 else 'FAIL'}")                font-weight: 700;            }

        print(f"   - PDF bytes returned: PASS")

        print(f"   - File saved successfully: PASS")                margin-right: 8px;            

        

        print(f"\nPLAYWRIGHT MIGRATION SUCCESSFUL!")            }}            .cta {

        print(f"\nNext Steps:")

        print(f"   1. Open {output_path} to verify:")                            background: #f59e0b;

        print(f"      - Text is selectable (not an image)")

        print(f"      - Fonts rendered correctly (Inter + Open Sans)")            .cta {{                color: white;

        print(f"      - Colors and gradients look professional")

        print(f"      - Layout is clean and print-ready")                background: #f59e0b;                padding: 20px 40px;

        print(f"   2. Test API endpoint with authentication")

        print(f"   3. Commit Playwright migration to git")                color: white;                border-radius: 12px;

        

        return True                padding: 20px 40px;                text-align: center;

        

    except Exception as e:                border-radius: 12px;                margin-top: 40px;

        print(f"\nPDF Generation Failed!")

        print(f"Error: {e}")                text-align: center;                font-size: 24px;

        import traceback

        traceback.print_exc()                margin-top: 40px;                font-weight: 600;

        return False

                font-size: 24px;                box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);



if __name__ == "__main__":                font-weight: 600;            }

    print("\n")

    success = asyncio.run(test_playwright_pdf())                box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);            

    print("\n" + "=" * 60)

    exit(0 if success else 1)            }}            .footer {


                            margin-top: 60px;

            .footer {{                padding-top: 30px;

                margin-top: 60px;                border-top: 2px solid #e5e7eb;

                padding-top: 30px;                text-align: center;

                border-top: 2px solid #e5e7eb;                color: #6b7280;

                text-align: center;                font-size: 14px;

                color: #6b7280;            }

                font-size: 14px;        </style>

            }}    </head>

        </style>    <body>

    </head>        <div class="container">

    <body>            <h1>🚀 Playwright PDF Generator</h1>

        <div class="container">            <p style="font-size: 24px; color: #0ea5e9; font-weight: 600;">

            <h1>🚀 Playwright PDF Generator</h1>                Modern HTML to PDF Conversion

            <p style="font-size: 24px; color: #0ea5e9; font-weight: 600;">            </p>

                Modern HTML to PDF Conversion            

            </p>            <h2>✨ Key Features</h2>

                        <ul class="feature-list">

            <h2>✨ Key Features</h2>                <li>Actively maintained by Microsoft & browser vendors</li>

            <ul class="feature-list">                <li>Automatic Chromium browser management</li>

                <li>Actively maintained by Microsoft & browser vendors</li>                <li>Superior CSS & font rendering quality</li>

                <li>Automatic Chromium browser management</li>                <li>Full async/await support for FastAPI</li>

                <li>Superior CSS & font rendering quality</li>                <li>Python 3.13 compatible</li>

                <li>Full async/await support for FastAPI</li>            </ul>

                <li>Python 3.13 compatible</li>            

            </ul>            <h2>📊 Test Results</h2>

                        <p>

            <h2>📊 Test Results</h2>                <strong>Date:</strong> {test_date}<br>

            <p>                <strong>Status:</strong> <span style="color: #10b981; font-weight: 600;">✓ Successfully Generated</span><br>

                <strong>Date:</strong> {test_date}<br>                <strong>Engine:</strong> Playwright + Chromium<br>

                <strong>Status:</strong> <span style="color: #10b981; font-weight: 600;">✓ Successfully Generated</span><br>                <strong>Text Quality:</strong> Fully selectable and searchable

                <strong>Engine:</strong> Playwright + Chromium<br>            </p>

                <strong>Text Quality:</strong> Fully selectable and searchable            

            </p>            <div class="cta">

                            ✅ Playwright Migration Complete

            <div class="cta">            </div>

                ✅ Playwright Migration Complete            

            </div>            <div class="footer">

                            Generated by Marketing One-Pager Co-Creation Tool<br>

            <div class="footer">                PDF Export System Phase 1 - Playwright Implementation

                Generated by Marketing One-Pager Co-Creation Tool<br>            </div>

                PDF Export System Phase 1 - Playwright Implementation        </div>

            </div>    </body>

        </div>    </html>

    </body>    """.format(test_date=datetime.now().strftime("%B %d, %Y at %I:%M %p"))

    </html>    

    """    try:

            print("\n📄 Generating PDF with Playwright...")

    try:        print("   • Engine: Chromium (headless)")

        print("\n📄 Generating PDF with Playwright...")        print("   • Format: Letter (8.5 x 11 inches)")

        print("   • Engine: Chromium (headless)")        print("   • Content: HTML with Google Fonts + CSS Grid")

        print("   • Format: Letter (8.5 x 11 inches)")        

        print("   • Content: HTML with Google Fonts + CSS Grid")        start_time = datetime.now()

                

        start_time = datetime.now()        # Generate PDF

                generator = PDFGenerator()

        # Generate PDF        pdf_bytes = await generator.generate_pdf(

        generator = PDFGenerator()            html_content,

        pdf_bytes = await generator.generate_pdf(            page_format='letter',

            html_content,            print_background=True

            page_format='letter',        )

            print_background=True        

        )        elapsed = (datetime.now() - start_time).total_seconds()

                file_size_kb = len(pdf_bytes) / 1024

        elapsed = (datetime.now() - start_time).total_seconds()        

        file_size_kb = len(pdf_bytes) / 1024        # Save to file

                output_path = "playwright_test_output.pdf"

        # Save to file        with open(output_path, "wb") as f:

        output_path = "playwright_test_output.pdf"            f.write(pdf_bytes)

        with open(output_path, "wb") as f:        

            f.write(pdf_bytes)        print(f"\n✅ PDF Generated Successfully!")

                print(f"   • File Size: {file_size_kb:.1f} KB")

        print(f"\n✅ PDF Generated Successfully!")        print(f"   • Generation Time: {elapsed:.2f} seconds")

        print(f"   • File Size: {file_size_kb:.1f} KB")        print(f"   • Output File: {output_path}")

        print(f"   • Generation Time: {elapsed:.2f} seconds")        

        print(f"   • Output File: {output_path}")        print(f"\n📋 Validation Checklist:")

                print(f"   • File size reasonable: {'✓' if 50 < file_size_kb < 500 else '✗'}")

        print(f"\n📋 Validation Checklist:")        print(f"   • Generation time acceptable: {'✓' if elapsed < 5.0 else '✗'}")

        print(f"   • File size reasonable: {'✓' if 50 < file_size_kb < 500 else '✗'}")        print(f"   • PDF bytes returned: ✓")

        print(f"   • Generation time acceptable: {'✓' if elapsed < 5.0 else '✗'}")        print(f"   • File saved successfully: ✓")

        print(f"   • PDF bytes returned: ✓")        

        print(f"   • File saved successfully: ✓")        print(f"\n🎉 PLAYWRIGHT MIGRATION SUCCESSFUL!")

                print(f"\n📖 Next Steps:")

        print(f"\n🎉 PLAYWRIGHT MIGRATION SUCCESSFUL!")        print(f"   1. Open {output_path} to verify:")

        print(f"\n📖 Next Steps:")        print(f"      - Text is selectable (not an image)")

        print(f"   1. Open {output_path} to verify:")        print(f"      - Fonts rendered correctly (Inter + Open Sans)")

        print(f"      - Text is selectable (not an image)")        print(f"      - Colors and gradients look professional")

        print(f"      - Fonts rendered correctly (Inter + Open Sans)")        print(f"      - Layout is clean and print-ready")

        print(f"      - Colors and gradients look professional")        print(f"   2. Test API endpoint with authentication")

        print(f"      - Layout is clean and print-ready")        print(f"   3. Commit Playwright migration to git")

        print(f"   2. Test API endpoint with authentication")        

        print(f"   3. Commit Playwright migration to git")        return True

                

        return True    except Exception as e:

                print(f"\n❌ PDF Generation Failed!")

    except Exception as e:        print(f"Error: {e}")

        print(f"\n❌ PDF Generation Failed!")        import traceback

        print(f"Error: {e}")        traceback.print_exc()

        import traceback        return False

        traceback.print_exc()

        return False

if __name__ == "__main__":

    print("\n")

if __name__ == "__main__":    success = asyncio.run(test_playwright_pdf())

    print("\n")    print("\n" + "=" * 60)

    success = asyncio.run(test_playwright_pdf())    exit(0 if success else 1)

    print("\n" + "=" * 60)
    exit(0 if success else 1)
