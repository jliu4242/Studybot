from openai import OpenAI
from pdf2image import convert_from_path
import os
from dotenv import load_dotenv
import base64

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def saveImages():
    images = convert_from_path('200_2006WT2.pdf', dpi=200)
    print("images converted")
    for i in range(len(images)):
        images[i].save('pages/page' + str(i) + '.jpg', 'JPEG')

def test():
    with open("pages/page1.jpg", "rb") as f:
        image_b64 = base64.b64encode(f.read()).decode('utf-8')
    
    response = client.chat.completions.create(
        model = 'gpt-4o',
        messages = [
            {"role": "system", "content": "Extract all exam questions from the images"},
            {"role": "user", "content": [
                                {"type": "input_image", "image_url": f"data:image/jpef;base64,{image_b64}"},                            
            ],
            },
        ]
    )
    
    print (response.choices[0].message.content.strip())
            
        
            
        
if __name__ == "__main__":
    test()