# Model Building Instructions

This README provides detailed instructions on how to build model files using a Python script. Follow these steps to setup your environment and run the build script successfully.

## Prerequisites

- Python 3.10 installed on your system (tested with `pyenv`)
- Poetry installed
- Command line access (Terminal on macOS and Linux, CMD or PowerShell on Windows)

## Setup

```bash
cd models
poetry install
```

## Building the Models

1. **Run the Build Script**:
   Execute the `build.py` script located in the models directory to start the model building process:

   ```bash
   poetry run python build.py
   ```

   This script will download and process model files as necessary in accordance with the [instructions on the MediaPipe website](https://developers.google.com/mediapipe/solutions/genai/llm_inference#models). Ensure that no errors are displayed in the command line output.

   > NOTE: the gemma model requires that you accept the terms and conditions. Go to the
   > [Model Page](https://huggingface.co/google/gemma-2b-it) and accept the agreement, and then grab your API key and put it in `models/.env` as `HF_API_TOKEN` (see `models/.env.example`)

   > NOTE: as of 7/4/2024, I was not able to successfully convert the Gemma model. You can also
   > download the model directly from Kaggle: ([cpu](https://www.kaggle.com/models/google/gemma/tfLite/gemma-2b-it-cpu-int4), [gpu](https://www.kaggle.com/models/google/gemma/tfLite/gemma-2b-it-gpu-int4))

2. **Verify Output**:
   If the script runs successfully, the built or converted models will be located in the `models/converted` directory. Verify that the models exist in this directory.

   ```bash
   ls models/converted
   ```

## Conclusion

You have successfully set up your environment and run the build script to download and convert model files. These models are now ready to be copied to the appropriate asset directories in your target application.
