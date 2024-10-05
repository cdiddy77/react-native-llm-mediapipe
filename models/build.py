import requests
import os
import sys
import mediapipe as mp
from mediapipe.tasks.python.genai import converter
import dotenv

dotenv.load_dotenv()


def download_files(
    url_path_pairs, chunk_size=1024 * 1024, force=False
):  # Default chunk size: 1 MB
    for url, path in url_path_pairs:
        # Ensure the directory exists
        os.makedirs(os.path.dirname(path), exist_ok=True)

        if not force and os.path.exists(path):
            print(f"File '{path}' already exists. Skipping download.")
            continue

        headers = (
            {"Authorization": f"Bearer {os.getenv('HF_API_TOKEN')}"}
            if os.getenv("HF_API_TOKEN")
            else {}
        )

        try:
            # Stream the download to handle large files
            with requests.get(url, stream=True, headers=headers) as response:
                response.raise_for_status()  # Raise an exception for HTTP errors

                # Write the content of the response to a file in chunks
                with open(path, "wb") as file:
                    for chunk in response.iter_content(chunk_size=chunk_size):
                        # filter out keep-alive new chunks
                        if chunk:
                            file.write(chunk)
                            file.flush()
            print(f"Downloaded '{url}' to '{path}'")

        except requests.RequestException as e:
            print(f"Failed to download {url}. Error: {str(e)}")


def convert_models(convert_jobs):
    for job in convert_jobs:
        # Convert the model
        print(f"Converting model: {job['title']}")
        config = converter.ConversionConfig(
            input_ckpt=job["input_ckpt"],
            ckpt_format=job["ckpt_format"],
            model_type=job["model_type"],
            backend=job["backend"],
            output_dir=job["output_dir"],
            combine_file_only=False,
            vocab_model_file=job["vocab_model_file"],
            output_tflite_file=job["output_tflite_file"],
        )

        converter.convert_checkpoint(config)
        print(f"Model converted successfully: {job['title']}")


# Example usage
url_path_pairs = [
    (
        "https://huggingface.co/tiiuae/falcon-rw-1b/resolve/main/tokenizer.json?download=true",
        "download/falcon-rw-1b/tokenizer.json",
    ),
    (
        "https://huggingface.co/tiiuae/falcon-rw-1b/resolve/main/tokenizer_config.json?download=true",
        "download/falcon-rw-1b/tokenizer_config.json",
    ),
    (
        "https://huggingface.co/tiiuae/falcon-rw-1b/resolve/main/pytorch_model.bin?download=true",
        "download/falcon-rw-1b/pytorch_model.bin",
    ),
    (
        "https://huggingface.co/google/gemma-2b-it/resolve/main/model-00001-of-00002.safetensors?download=true",
        "download/gemma-2b-it/model-00001-of-00002.safetensors",
    ),
    (
        "https://huggingface.co/google/gemma-2b-it/resolve/main/model-00002-of-00002.safetensors?download=true",
        "download/gemma-2b-it/model-00002-of-00002.safetensors.safetensors",
    ),
    (
        "https://huggingface.co/google/gemma-2b-it/resolve/main/tokenizer.json?download=true",
        "download/gemma-2b-it/tokenizer.json",
    ),
    (
        "https://huggingface.co/google/gemma-2b-it/resolve/main/tokenizer_config.json?download=true",
        "download/gemma-2b-it/tokenizer_config.json",
    ),
    (
        "https://huggingface.co/stabilityai/stablelm-3b-4e1t/resolve/main/tokenizer.json?download=true",
        "download/stablelm-3b-4e1t/tokenizer.json",
    ),
    (
        "https://huggingface.co/stabilityai/stablelm-3b-4e1t/resolve/main/tokenizer_config.json?download=true",
        "download/stablelm-3b-4e1t/tokenizer_config.json",
    ),
    (
        "https://huggingface.co/stabilityai/stablelm-3b-4e1t/resolve/main/model.safetensors?download=true",
        "download/stablelm-3b-4e1t/model.safetensors",
    ),
    (
        "https://huggingface.co/microsoft/phi-2/resolve/main/tokenizer.json?download=true",
        "download/phi-2/tokenizer.json",
    ),
    (
        "https://huggingface.co/microsoft/phi-2/resolve/main/tokenizer_config.json?download=true",
        "download/phi-2/tokenizer_config.json",
    ),
    (
        "https://huggingface.co/microsoft/phi-2/resolve/main/model-00001-of-00002.safetensors?download=true",
        "download/phi-2/model-00001-of-00002.safetensors",
    ),
    (
        "https://huggingface.co/microsoft/phi-2/resolve/main/model-00002-of-00002.safetensors?download=true",
        "download/phi-2/model-00002-of-00002.safetensors",
    ),
]


def create_convert_params(name, backend, model_type, ckpt, ckpt_format):
    return {
        "title": name + "-" + backend,
        "input_ckpt": f"download/{name}/{ckpt}",
        "ckpt_format": ckpt_format,
        "model_type": model_type,
        "backend": backend,
        "output_dir": f"converted/{name}/per-layer-info-{backend}",
        "output_tflite_file": f"converted/{name}-{backend}.bin",
        "vocab_model_file": (
            f"download/{name}/tokenizer.model"
            if model_type == "GEMMA_2B"
            else f"download/{name}"
        ),
    }


convert_jobs = [
    create_convert_params(
        "falcon-rw-1b", "gpu", "FALCON_RW_1B", "pytorch_model.bin", "pytorch"
    ),
    create_convert_params(
        "falcon-rw-1b", "cpu", "FALCON_RW_1B", "pytorch_model.bin", "pytorch"
    ),
    # create_convert_params(
    #     "gemma-2b-it", "gpu", "GEMMA_2B", "model-*.safetensors", "safetensors"
    # ),
    # create_convert_params(
    #     "gemma-2b-it", "cpu", "GEMMA_2B", "model-*.safetensors", "safetensors"
    # ),
    create_convert_params(
        "stablelm-3b-4e1t",
        "gpu",
        "STABLELM_4E1T_3B",
        "model.safetensors",
        "safetensors",
    ),
    create_convert_params(
        "stablelm-3b-4e1t",
        "cpu",
        "STABLELM_4E1T_3B",
        "model.safetensors",
        "safetensors",
    ),
    create_convert_params(
        "phi-2", "gpu", "PHI_2", "model-*.safetensors", "safetensors"
    ),
    create_convert_params(
        "phi-2", "cpu", "PHI_2", "model-*.safetensors", "safetensors"
    ),
]

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Download and convert models.")
    parser.add_argument("--download", action="store_true", help="Download files")
    parser.add_argument("--convert", action="store_true", help="Convert models")
    parser.add_argument(
        "--force",
        action="store_true",
        help="Force download even if files already exist",
    )

    args = parser.parse_args()

    if args.download:
        download_files(url_path_pairs, force=args.force)
    if args.convert:
        convert_models(convert_jobs)

    if not args.download and not args.convert:
        download_files(url_path_pairs, force=args.force)
        convert_models(convert_jobs)
