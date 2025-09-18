from transformers import AutoProcessor, VisionEncoderDecoderModel
from PIL import IMAGE
import torch, os
import fitz

model_id = "facebook/nougat-base"

print("loading nougat")
processor = AutoProcessor.from_pretrained(mode_id)
model = VisionEncoderDecoderModel.from_pretrained(model_id).to("cpu").eval()

def pdf_to_images(pdf_path, out_dir="pages"):
    os.makedirs(out_dir, exist_ok=True)
    doc = fitz.open(pdf_path)
    paths = []
    for i, page in enumerate(doc):
        pix = page.get_pixmap(dpi=200)
        path = os.path.join(out_dir, f"page_{i:03}.png")
        pix.save(path)
        paths.append(path)
    return paths

def transcribe(image_path):
    image = Image.open(image_path).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")
    outputs = model.generate(**inputs, max_new_tokens=2048)
    return processor.batch_decode(outputs, skip_special_tokens=True)[0]

if __name__ == "__main__":
    pdf_file = "sample_exam.pdf"  # replace with your exam
    pages = pdf_to_images(pdf_file)
    for p in pages:
        text = transcribe(p)
        print(f"--- {p} ---\n{text[:500]}...\n")