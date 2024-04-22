# Model Building Instructions

This README provides detailed instructions on how to build model files using a Python script. Follow these steps to setup your environment and run the build script successfully.

## Prerequisites

- Python 3.10 installed on your system (prefer `pyenv`)
- Command line access (Terminal on macOS and Linux, CMD or PowerShell on Windows)

## Setup

1. **Navigate to the Models Directory**:
   Open your command line interface and navigate to the models directory where the model files and scripts are located.

   ```bash
   cd models
   ```

2. **Create and Activate a Python Virtual Environment**:
   Create a new virtual environment in the models directory by running:

   ```bash
   python -m venv venv
   ```

   Activate the virtual environment:

   - On Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```bash
     source venv/bin/activate
     ```

3. **Install Required Packages**:
   Ensure that the virtual environment is activated. Install all required Python packages using the requirements file provided:

   ```bash
   pip install -r requirements.txt
   ```

## Building the Models

1. **Run the Build Script**:
   Execute the `build.py` script located in the models directory to start the model building process:

   ```bash
   python build.py
   ```

   This script will download and process model files as necessary in accordance with the [instructions on the MediaPipe website](https://developers.google.com/mediapipe/solutions/genai/llm_inference#models). Ensure that no errors are displayed in the command line output.

2. **Verify Output**:
   If the script runs successfully, the built or converted models will be located in the `models/converted` directory. Verify that the models exist in this directory.

   ```bash
   ls models/converted
   ```

## Troubleshooting

If you encounter any errors during the setup or build process, please ensure that:

- Python 3.10 is properly installed and the path is correctly configured (we prefer to use `pyenv`)
- All commands are executed in the virtual environment.

## Conclusion

You have successfully set up your environment and run the build script to download and convert model files. These models are now ready to be copied to the appropriate asset directories in your target application.
